from fastapi import APIRouter, Depends

from app.api.deps import get_application_service
from app.schemas.application import (
    ApplicationCreateRequest,
    ApplicationDeleteResponse,
    ApplicationRecord,
    ApplicationUpdateRequest,
)
from app.services.application_service import ApplicationService

router = APIRouter(prefix="/applications", tags=["applications"])


@router.get("/{candidate_id}", response_model=list[ApplicationRecord])
def list_applications(candidate_id: str, service: ApplicationService = Depends(get_application_service)) -> list[ApplicationRecord]:
    return service.list_applications(candidate_id)


@router.post("", response_model=ApplicationRecord)
def create_application(payload: ApplicationCreateRequest, service: ApplicationService = Depends(get_application_service)) -> ApplicationRecord:
    return service.create_application(payload)


@router.put("/{application_id}", response_model=ApplicationRecord)
def update_application(
    application_id: str,
    payload: ApplicationUpdateRequest,
    service: ApplicationService = Depends(get_application_service),
) -> ApplicationRecord:
    return service.update_application(application_id, payload)


@router.delete("/{application_id}", response_model=ApplicationDeleteResponse)
def delete_application(
    application_id: str,
    service: ApplicationService = Depends(get_application_service),
) -> ApplicationDeleteResponse:
    return service.delete_application(application_id)
