from dataclasses import dataclass, field


@dataclass
class VacancyModel:
    id: str
    title: str
    company: str
    required_skills: list[str] = field(default_factory=list)
