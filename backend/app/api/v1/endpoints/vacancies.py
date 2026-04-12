from fastapi import APIRouter, Depends

from app.api.deps import get_vacancy_service
from app.schemas.vacancy import Vacancy
from app.services.vacancy_service import VacancyService

router = APIRouter(prefix="/vacancies", tags=["vacancies"])


@router.get("", response_model=list[Vacancy])
def list_vacancies(service: VacancyService = Depends(get_vacancy_service)) -> list[Vacancy]:
    return service.list_vacancies()
