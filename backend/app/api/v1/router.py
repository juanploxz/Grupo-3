from fastapi import APIRouter

from app.api.v1.endpoints.applications import router as applications_router
from app.api.v1.endpoints.auth import router as auth_router
from app.api.v1.endpoints.health import router as health_router
from app.api.v1.endpoints.matching import router as matching_router
from app.api.v1.endpoints.profiles import router as profiles_router
from app.api.v1.endpoints.vacancies import router as vacancies_router

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(health_router)
api_router.include_router(auth_router)
api_router.include_router(profiles_router)
api_router.include_router(vacancies_router)
api_router.include_router(matching_router)
api_router.include_router(applications_router)
