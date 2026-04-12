from __future__ import annotations

from neo4j import GraphDatabase

from app.core.config import settings


class Neo4jClient:
    def __init__(self) -> None:
        self._driver = GraphDatabase.driver(
            settings.neo4j_uri,
            auth=(settings.neo4j_username, settings.neo4j_password),
        )

    def run_query(self, query: str, parameters: dict | None = None) -> list[dict]:
        with self._driver.session() as session:
            result = session.run(query, parameters or {})
            return [record.data() for record in result]

    def ping(self) -> dict:
        with self._driver.session() as session:
            session.run("RETURN 1 AS ok").single()
        return {"driver": "neo4j", "configured": True}

    def close(self) -> None:
        self._driver.close()
