from pydantic import BaseModel, Field


class MatchExplanation(BaseModel):
    matched_skills: list[str] = Field(default_factory=list)
    missing_skills: list[str] = Field(default_factory=list)
    strengths: list[str] = Field(default_factory=list)


class MatchResult(BaseModel):
    vacancy_id: str
    title: str
    company: str
    location: str
    score: int
    explanation: MatchExplanation
