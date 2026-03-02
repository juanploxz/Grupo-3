MATCH (c:Candidate {id:"C1"})-[:HAS_SKILL]->(s:Skill)<-[r:REQUIRES]-(v:Vacancy)
WITH v, sum(coalesce(r.weight,1)) AS score, collect(s.name) AS matchedSkills
RETURN v.id AS id, v.title AS title, v.company AS company, score, matchedSkills
ORDER BY score DESC
LIMIT 10;
