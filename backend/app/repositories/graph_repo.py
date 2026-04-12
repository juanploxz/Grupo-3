from __future__ import annotations

from app.integrations.neo4j_client import Neo4jClient


UPSERT_VACANCY_QUERY = """
MERGE (v:Vacancy {id: $id})
SET v.title = $title,
    v.company = $company,
    v.location = $location,
    v.salary = $salary,
    v.description = $description
WITH v
OPTIONAL MATCH (v)-[old:REQUIRES]->(:Skill)
DELETE old
WITH v
UNWIND $required_skills AS skill_name
MERGE (s:Skill {name: skill_name})
MERGE (v)-[:REQUIRES {weight: 3}]->(s)
"""

UPSERT_NICE_TO_HAVE_QUERY = """
MATCH (v:Vacancy {id: $vacancy_id})
UNWIND $nice_to_have AS skill_name
MERGE (s:Skill {name: skill_name})
MERGE (v)-[:REQUIRES {weight: 1}]->(s)
"""

UPSERT_CANDIDATE_QUERY = """
MERGE (c:Candidate {id: $id})
SET c.name = $full_name,
    c.email = $email,
    c.location = $location,
    c.headline = $headline,
    c.summary = $summary
WITH c
OPTIONAL MATCH (c)-[old:HAS_SKILL]->(:Skill)
DELETE old
WITH c
UNWIND $skills AS skill_name
MERGE (s:Skill {name: skill_name})
MERGE (c)-[:HAS_SKILL]->(s)
"""

MATCHING_QUERY = """
MATCH (c:Candidate {id: $candidate_id})-[:HAS_SKILL]->(s:Skill)<-[r:REQUIRES]-(v:Vacancy)
WITH c, v, sum(coalesce(r.weight, 1)) AS score, collect(DISTINCT s.name) AS matchedSkills
OPTIONAL MATCH (v)-[req:REQUIRES]->(required:Skill)
WITH c, v, score, matchedSkills,
     collect(DISTINCT CASE WHEN NOT required.name IN matchedSkills AND coalesce(req.weight, 1) >= 3 THEN required.name END) AS missingSkills
RETURN v.id AS vacancy_id,
       v.title AS title,
       v.company AS company,
       v.location AS location,
       score AS score,
       matchedSkills AS matched_skills,
       [skill IN missingSkills WHERE skill IS NOT NULL] AS missing_skills
ORDER BY score DESC, title ASC
LIMIT 10
"""


class GraphRepository:
    def __init__(self) -> None:
        self.client = Neo4jClient()

    def health(self) -> dict:
        return self.client.ping()

    def upsert_candidate(self, candidate: dict) -> None:
        self.client.run_query(UPSERT_CANDIDATE_QUERY, candidate)

    def upsert_vacancy(self, vacancy: dict) -> None:
        params = {
            "id": vacancy["id"],
            "title": vacancy["title"],
            "company": vacancy["company"],
            "location": vacancy["location"],
            "salary": vacancy["salary"],
            "description": vacancy["description"],
            "required_skills": vacancy.get("required_skills", []),
        }
        self.client.run_query(UPSERT_VACANCY_QUERY, params)
        self.client.run_query(
            UPSERT_NICE_TO_HAVE_QUERY,
            {
                "vacancy_id": vacancy["id"],
                "nice_to_have": vacancy.get("nice_to_have", []),
            },
        )

    def list_matches(self, candidate_id: str) -> list[dict]:
        return self.client.run_query(MATCHING_QUERY, {"candidate_id": candidate_id})
