from fastapi import APIRouter, Depends

from app.api.deps import get_application_service
from app.schemas.application import ApplicationCreateRequest, ApplicationRecord
from app.services.application_service import ApplicationService

router = APIRouter(prefix="/applications", tags=["applications"])


@router.get("/{candidate_id}", response_model=list[ApplicationRecord])
def list_applications(candidate_id: str, service: ApplicationService = Depends(get_application_service)) -> list[ApplicationRecord]:
    return service.list_applications(candidate_id)


@router.post("", response_model=ApplicationRecord)
def create_application(payload: ApplicationCreateRequest, service: ApplicationService = Depends(get_application_service)) -> ApplicationRecord:
    return service.create_application(payload)
