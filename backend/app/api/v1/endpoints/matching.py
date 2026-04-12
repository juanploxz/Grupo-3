from fastapi import APIRouter, Depends

from app.api.deps import get_matching_service
from app.schemas.match import MatchResult
from app.services.matching_service import MatchingService

router = APIRouter(prefix="/matching", tags=["matching"])


@router.get("/{candidate_id}", response_model=list[MatchResult])
def list_recommendations(candidate_id: str, service: MatchingService = Depends(get_matching_service)) -> list[MatchResult]:
    return service.list_recommendations(candidate_id)
