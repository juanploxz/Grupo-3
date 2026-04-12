from fastapi import APIRouter, Depends, File, UploadFile

from app.api.deps import get_profile_service
from app.schemas.profile import CandidateProfile, CvUploadResponse, ProfileUpdateRequest
from app.services.profile_service import ProfileService

router = APIRouter(prefix="/profiles", tags=["profiles"])


@router.get("/{candidate_id}", response_model=CandidateProfile)
def get_profile(candidate_id: str, service: ProfileService = Depends(get_profile_service)) -> CandidateProfile:
    return service.get_profile(candidate_id)


@router.put("/{candidate_id}", response_model=CandidateProfile)
def update_profile(candidate_id: str, payload: ProfileUpdateRequest, service: ProfileService = Depends(get_profile_service)) -> CandidateProfile:
    return service.update_profile(candidate_id, payload)


@router.post("/{candidate_id}/upload-cv", response_model=CvUploadResponse)
async def upload_cv(candidate_id: str, file: UploadFile = File(...), service: ProfileService = Depends(get_profile_service)) -> CvUploadResponse:
    return await service.upload_cv(candidate_id, file)
