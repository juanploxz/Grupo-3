from __future__ import annotations

import uuid

from app.repositories.application_repo import ApplicationRepository
from app.schemas.application import ApplicationCreateRequest, ApplicationRecord


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
