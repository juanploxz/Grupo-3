from pydantic import BaseModel


class ApplicationCreateRequest(BaseModel):
    candidate_id: str
    vacancy_id: str
    status: str = "submitted"


class ApplicationRecord(BaseModel):
    id: str
    candidate_id: str
    vacancy_id: str
    status: str
