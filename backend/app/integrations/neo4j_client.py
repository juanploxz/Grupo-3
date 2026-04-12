class Neo4jClient:
    def ping(self) -> dict:
        return {"driver": "neo4j", "configured": False}
