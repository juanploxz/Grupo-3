from __future__ import annotations

from app.utils.text_normalizer import normalize_skills

SKILL_KEYWORDS = [
    "python",
    "fastapi",
    "neo4j",
    "docker",
    "react",
    "sql",
    "javascript",
    "css",
    "testing",
]


def extract_profile_from_text(text: str, fallback_name: str) -> dict:
    lowered = text.lower()
    found_skills = [skill for skill in SKILL_KEYWORDS if skill in lowered]
    skills = normalize_skills(found_skills or ["Python", "Docker", "React"])
    summary = (
        "Perfil generado automaticamente a partir del CV cargado. "
        "El sistema detecto habilidades tecnicas y construyo una base para recomendaciones."
    )
    return {
        "full_name": fallback_name,
        "headline": "Candidate profile extracted from CV",
        "summary": summary,
        "skills": skills,
        "profile_completion": min(95, 50 + len(skills) * 7),
    }
