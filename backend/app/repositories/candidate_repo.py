from __future__ import annotations

from app.core.database import read_json, write_json

FILENAME = "candidates.json"


class CandidateRepository:
    def list_all(self) -> list[dict]:
        return read_json(FILENAME, [])

    def get_by_id(self, candidate_id: str) -> dict | None:
        return next((candidate for candidate in self.list_all() if candidate["id"] == candidate_id), None)

    def get_by_email(self, email: str) -> dict | None:
        return next((candidate for candidate in self.list_all() if candidate["email"].lower() == email.lower()), None)

    def save_all(self, candidates: list[dict]) -> None:
        write_json(FILENAME, candidates)

    def create(self, candidate: dict) -> dict:
        candidates = self.list_all()
        candidates.append(candidate)
        self.save_all(candidates)
        return candidate

    def update(self, candidate_id: str, updates: dict) -> dict | None:
        candidates = self.list_all()
        for index, candidate in enumerate(candidates):
            if candidate["id"] == candidate_id:
                candidates[index] = {**candidate, **updates}
                self.save_all(candidates)
                return candidates[index]
        return None
