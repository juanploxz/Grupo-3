from pydantic import BaseModel


class ApplicationCreateRequest(BaseModel):
    candidate_id: str
    vacancy_id: str
    cover_letter: str = ""
    availability: str = ""
    expected_salary: int = 0
    status: str = "submitted"


class ApplicationUpdateRequest(BaseModel):
    cover_letter: str | None = None
    availability: str | None = None
    expected_salary: int | None = None
    status: str | None = None


class ApplicationRecord(BaseModel):
    id: str
    candidate_id: str
    vacancy_id: str
    cover_letter: str = ""
    availability: str = ""
    expected_salary: int = 0
    status: str


class ApplicationDeleteResponse(BaseModel):
    id: str
    deleted: bool = True
