from __future__ import annotations

from app.core.database import read_json

FILENAME = "vacancies.json"


class VacancyRepository:
    def list_all(self) -> list[dict]:
        return read_json(FILENAME, [])

    def get_by_id(self, vacancy_id: str) -> dict | None:
        return next((vacancy for vacancy in self.list_all() if vacancy["id"] == vacancy_id), None)
