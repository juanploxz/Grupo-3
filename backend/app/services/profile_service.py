from __future__ import annotations

from fastapi import HTTPException, UploadFile, status

from app.repositories.candidate_repo import CandidateRepository
from app.schemas.profile import CandidateProfile, CvUploadResponse, ProfileUpdateRequest
from app.utils.cv_parser import extract_profile_from_text
from app.utils.file_handler import save_upload
from app.utils.text_normalizer import normalize_skills


class ProfileService:
    def __init__(self) -> None:
        self.repository = CandidateRepository()

    def get_profile(self, candidate_id: str) -> CandidateProfile:
        candidate = self.repository.get_by_id(candidate_id)
        if not candidate:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidato no encontrado")
        sanitized = {key: value for key, value in candidate.items() if key != "password_hash"}
        return CandidateProfile(**sanitized)

    def update_profile(self, candidate_id: str, payload: ProfileUpdateRequest) -> CandidateProfile:
        existing = self.repository.get_by_id(candidate_id)
        if not existing:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidato no encontrado")
        updates = payload.model_dump(exclude_none=True)
        if "skills" in updates:
            updates["skills"] = normalize_skills(updates["skills"])
        if updates:
            completion = 30
            for field in ["headline", "location", "summary", "skills", "preferred_roles", "preferred_locations"]:
                value = updates.get(field, existing.get(field))
                if value:
                    completion += 10
            updates["profile_completion"] = min(completion, 100)
        candidate = self.repository.update(candidate_id, updates)
        sanitized = {key: value for key, value in candidate.items() if key != "password_hash"}
        return CandidateProfile(**sanitized)

    async def upload_cv(self, candidate_id: str, upload: UploadFile) -> CvUploadResponse:
        candidate = self.repository.get_by_id(candidate_id)
        if not candidate:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidato no encontrado")
        content = await upload.read()
        save_upload(upload.filename, content)
        text = content.decode("utf-8", errors="ignore") if content else upload.filename
        extracted = extract_profile_from_text(text, candidate["full_name"])
        updated = self.repository.update(
            candidate_id,
            {
                "cv_filename": upload.filename,
                "headline": extracted["headline"],
                "summary": extracted["summary"],
                "skills": extracted["skills"],
                "profile_completion": extracted["profile_completion"],
            },
        )
        return CvUploadResponse(
            candidate_id=candidate_id,
            filename=upload.filename,
            extracted_skills=updated["skills"],
            extracted_summary=updated["summary"],
            profile_completion=updated["profile_completion"],
        )
