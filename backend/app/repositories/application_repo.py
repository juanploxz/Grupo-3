from __future__ import annotations

from app.core.database import read_json, write_json

FILENAME = "applications.json"


class ApplicationRepository:
    def list_all(self) -> list[dict]:
        return read_json(FILENAME, [])

    def list_by_candidate(self, candidate_id: str) -> list[dict]:
        return [record for record in self.list_all() if record["candidate_id"] == candidate_id]

    def create(self, application: dict) -> dict:
        records = self.list_all()
        records.append(application)
        write_json(FILENAME, records)
        return application
