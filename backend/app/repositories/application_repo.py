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

    def update(self, application_id: str, updates: dict) -> dict | None:
        records = self.list_all()
        for index, record in enumerate(records):
            if record["id"] == application_id:
                records[index] = {**record, **updates}
                write_json(FILENAME, records)
                return records[index]
        return None

    def delete(self, application_id: str) -> dict | None:
        records = self.list_all()
        for index, record in enumerate(records):
            if record["id"] == application_id:
                deleted = records.pop(index)
                write_json(FILENAME, records)
                return deleted
        return None
