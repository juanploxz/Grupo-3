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
        vacancies = self.vacancy_repository.list_all()
        try:
            self.graph_repository.upsert_candidate(candidate)
            for vacancy in vacancies:
                self.graph_repository.upsert_vacancy(vacancy)

            results: list[MatchResult] = []
            vacancies_by_id = {vacancy["id"]: vacancy for vacancy in vacancies}
            for row in self.graph_repository.list_matches(candidate_id):
                vacancy = vacancies_by_id.get(row["vacancy_id"])
                score = self._calculate_score(candidate, vacancy) if vacancy else row["score"]
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
                        score=score,
                        explanation=MatchExplanation(
                            matched_skills=row["matched_skills"],
                            missing_skills=row["missing_skills"],
                            strengths=strengths,
                        ),
                    )
                )
            return results
        except (Neo4jError, ServiceUnavailable):
            return self._list_repository_matches(candidate, vacancies)

    def _list_repository_matches(self, candidate: dict, vacancies: list[dict]) -> list[MatchResult]:
        matches = [self._build_match(candidate, vacancy) for vacancy in vacancies]
        return sorted(matches, key=lambda match: (-match.score, match.title))[:10]

    def _build_match(self, candidate: dict, vacancy: dict) -> MatchResult:
        candidate_skills = {skill.lower() for skill in candidate.get("skills", [])}
        required_skills = vacancy.get("required_skills", [])
        nice_to_have = vacancy.get("nice_to_have", [])
        matched_required = [skill for skill in required_skills if skill.lower() in candidate_skills]
        matched_optional = [skill for skill in nice_to_have if skill.lower() in candidate_skills]
        missing_skills = [skill for skill in required_skills if skill.lower() not in candidate_skills]
        matched_skills = matched_required + matched_optional
        strengths = [
            "Coincidencia directa con habilidades obligatorias" if matched_required else "Perfil en construccion para esta vacante",
            f"Disponibilidad alineada con {vacancy['location']}",
        ]
        if missing_skills:
            strengths.append("Brechas tecnicas visibles para orientar el aprendizaje")

        return MatchResult(
            vacancy_id=vacancy["id"],
            title=vacancy["title"],
            company=vacancy["company"],
            location=vacancy["location"],
            score=self._calculate_score(candidate, vacancy),
            explanation=MatchExplanation(
                matched_skills=matched_skills,
                missing_skills=missing_skills,
                strengths=strengths,
            ),
        )

    def _calculate_score(self, candidate: dict, vacancy: dict | None) -> int:
        if not vacancy:
            return 0
        candidate_skills = {skill.lower() for skill in candidate.get("skills", [])}
        required_skills = vacancy.get("required_skills", [])
        nice_to_have = vacancy.get("nice_to_have", [])
        total_weight = len(required_skills) * 3 + len(nice_to_have)
        if not total_weight:
            return 0
        matched_weight = sum(3 for skill in required_skills if skill.lower() in candidate_skills)
        matched_weight += sum(1 for skill in nice_to_have if skill.lower() in candidate_skills)
        return round((matched_weight / total_weight) * 100)
