from __future__ import annotations

from app.repositories.vacancy_repo import VacancyRepository
from app.schemas.vacancy import Vacancy


class VacancyService:
    def __init__(self) -> None:
        self.repository = VacancyRepository()

    def list_vacancies(self) -> list[Vacancy]:
        return [Vacancy(**vacancy) for vacancy in self.repository.list_all()]
