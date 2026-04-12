from __future__ import annotations

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
        candidate_skills = set(candidate.get("skills", []))
        results: list[MatchResult] = []
        for vacancy in self.vacancy_repository.list_all():
            required = set(vacancy.get("required_skills", []))
            nice = set(vacancy.get("nice_to_have", []))
            matched = sorted(candidate_skills.intersection(required.union(nice)))
            missing = sorted(required.difference(candidate_skills))
            score = len(candidate_skills.intersection(required)) * 25 + len(candidate_skills.intersection(nice)) * 10
            strengths = [
                "Coincidencia directa con habilidades obligatorias" if candidate_skills.intersection(required) else "Perfil en construccion para esta vacante",
                f"Disponibilidad alineada con {vacancy['location']}",
            ]
            results.append(
                MatchResult(
                    vacancy_id=vacancy["id"],
                    title=vacancy["title"],
                    company=vacancy["company"],
                    location=vacancy["location"],
                    score=score,
                    explanation=MatchExplanation(
                        matched_skills=matched,
                        missing_skills=missing,
                        strengths=strengths,
                    ),
                )
            )
        return sorted(results, key=lambda item: item.score, reverse=True)
