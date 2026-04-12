from pydantic import BaseModel, EmailStr, Field


class CandidateProfile(BaseModel):
    id: str
    email: EmailStr
    full_name: str
    headline: str
    location: str
    summary: str
    skills: list[str] = Field(default_factory=list)
    experience_years: int = 0
    preferred_roles: list[str] = Field(default_factory=list)
    preferred_locations: list[str] = Field(default_factory=list)
    salary_expectation: int = 0
    cv_filename: str | None = None
    profile_completion: int = 0


class ProfileUpdateRequest(BaseModel):
    headline: str | None = None
    location: str | None = None
    summary: str | None = None
    skills: list[str] | None = None
    experience_years: int | None = None
    preferred_roles: list[str] | None = None
    preferred_locations: list[str] | None = None
    salary_expectation: int | None = None


class CvUploadResponse(BaseModel):
    candidate_id: str
    filename: str
    extracted_skills: list[str]
    extracted_summary: str
    profile_completion: int
