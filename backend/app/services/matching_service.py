from __future__ import annotations

from neo4j.exceptions import Neo4jError, ServiceUnavailable

from app.repositories.candidate_repo import CandidateRepository
from app.repositories.graph_repo import GraphRepository
from app.repositories.vacancy_repo import VacancyRepository
from app.schemas.match import MatchExplanation, MatchResult


class MatchingService:
    def __init__(self) -> None:
        self.candidate_repository = CandidateRepository()
        self.vacancy_repository = VacancyRepository()
        self.graph_repository = GraphRepository()

    def list_recommendations(self, candidate_id: str) -> list[MatchResult]:
        candidate = self.candidate_repository.get_by_id(candidate_id)
        if not candidate:
            return []
        try:
            self.graph_repository.upsert_candidate(candidate)
            for vacancy in self.vacancy_repository.list_all():
                self.graph_repository.upsert_vacancy(vacancy)

            results: list[MatchResult] = []
            for row in self.graph_repository.list_matches(candidate_id):
                strengths = [
                    "Coincidencia directa con habilidades obligatorias" if row["matched_skills"] else "Perfil en construccion para esta vacante",
                    f"Disponibilidad alineada con {row['location']}",
                ]
                results.append(
                    MatchResult(
                        vacancy_id=row["vacancy_id"],
                        title=row["title"],
                        company=row["company"],
                        location=row["location"],
                        score=row["score"],
                        explanation=MatchExplanation(
                            matched_skills=row["matched_skills"],
                            missing_skills=row["missing_skills"],
                            strengths=strengths,
                        ),
                    )
                )
            return results
        except (Neo4jError, ServiceUnavailable) as error:
            raise RuntimeError(
                "No fue posible obtener recomendaciones desde Neo4j. "
                "Verifica que el servicio este arriba y que las credenciales sean correctas."
            ) from error
