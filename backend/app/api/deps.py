from app.services.application_service import ApplicationService
from app.services.auth_service import AuthService
from app.services.matching_service import MatchingService
from app.services.profile_service import ProfileService
from app.services.vacancy_service import VacancyService


def get_auth_service() -> AuthService:
    return AuthService()


def get_profile_service() -> ProfileService:
    return ProfileService()


def get_vacancy_service() -> VacancyService:
    return VacancyService()


def get_matching_service() -> MatchingService:
    return MatchingService()


def get_application_service() -> ApplicationService:
    return ApplicationService()
