from pydantic import BaseModel


class ApplicationCreateRequest(BaseModel):
    candidate_id: str
    vacancy_id: str
    cover_letter: str = ""
    availability: str = ""
    expected_salary: int = 0
    status: str = "submitted"


class ApplicationRecord(BaseModel):
    id: str
    candidate_id: str
    vacancy_id: str
    cover_letter: str = ""
    availability: str = ""
    expected_salary: int = 0
    status: str
