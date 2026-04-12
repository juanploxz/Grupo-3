class GraphRepository:
    """Placeholder for future Neo4j integration.

    The current MVP keeps recommendation logic in Python while preserving
    a repository boundary aligned with the planned graph architecture.
    """

    def health(self) -> dict:
        return {"provider": "neo4j-planned", "status": "abstracted"}
