from dataclasses import dataclass, field


@dataclass
class Candidate:
    id: str
    full_name: str
    email: str
    skills: list[str] = field(default_factory=list)
