from pydantic import BaseModel, Field


class Vacancy(BaseModel):
    id: str
    title: str
    company: str
    location: str
    salary: int
    description: str
    required_skills: list[str] = Field(default_factory=list)
    nice_to_have: list[str] = Field(default_factory=list)
