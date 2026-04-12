from __future__ import annotations


def normalize_skill(skill: str) -> str:
    return skill.strip().title()


def normalize_skills(skills: list[str]) -> list[str]:
    unique: list[str] = []
    for skill in skills:
        normalized = normalize_skill(skill)
        if normalized and normalized not in unique:
            unique.append(normalized)
    return unique
