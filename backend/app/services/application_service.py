from __future__ import annotations

import uuid

from fastapi import HTTPException, status

from app.repositories.application_repo import ApplicationRepository
from app.schemas.application import (
    ApplicationCreateRequest,
    ApplicationDeleteResponse,
    ApplicationRecord,
    ApplicationUpdateRequest,
)


class ApplicationService:
    def __init__(self) -> None:
        self.repository = ApplicationRepository()

    def list_applications(self, candidate_id: str) -> list[ApplicationRecord]:
        return [ApplicationRecord(**record) for record in self.repository.list_by_candidate(candidate_id)]

    def create_application(self, payload: ApplicationCreateRequest) -> ApplicationRecord:
        application = {
            "id": f"application-{uuid.uuid4().hex[:8]}",
            "candidate_id": payload.candidate_id,
            "vacancy_id": payload.vacancy_id,
            "cover_letter": payload.cover_letter,
            "availability": payload.availability,
            "expected_salary": payload.expected_salary,
            "status": payload.status,
        }
        return ApplicationRecord(**self.repository.create(application))

    def update_application(self, application_id: str, payload: ApplicationUpdateRequest) -> ApplicationRecord:
        updates = payload.model_dump(exclude_none=True)
        application = self.repository.update(application_id, updates)
        if not application:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Postulacion no encontrada")
        return ApplicationRecord(**application)

    def delete_application(self, application_id: str) -> ApplicationDeleteResponse:
        deleted = self.repository.delete(application_id)
        if not deleted:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Postulacion no encontrada")
        return ApplicationDeleteResponse(id=application_id)
