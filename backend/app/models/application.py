from dataclasses import dataclass


@dataclass
class Application:
    id: str
    candidate_id: str
    vacancy_id: str
    status: str
