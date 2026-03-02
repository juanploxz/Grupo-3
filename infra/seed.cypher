UNWIND ["Python","SQL","Django","React","Docker","Git","Java","Spring"] AS s
MERGE (:Skill {name:s});

MERGE (v1:Vacancy {id:"V1", title:"Backend Django", company:"ACME"})
MERGE (v2:Vacancy {id:"V2", title:"Data Analyst", company:"DataCo"})
MERGE (v3:Vacancy {id:"V3", title:"Backend Java Spring", company:"EnterpriseX"});

MATCH (py:Skill {name:"Python"}), (sql:Skill {name:"SQL"}), (dj:Skill {name:"Django"}),
      (do:Skill {name:"Docker"}), (ja:Skill {name:"Java"}), (sp:Skill {name:"Spring"})
MATCH (v1:Vacancy {id:"V1"}), (v2:Vacancy {id:"V2"}), (v3:Vacancy {id:"V3"})
MERGE (v1)-[:REQUIRES {weight:3}]->(dj)
MERGE (v1)-[:REQUIRES {weight:2}]->(py)
MERGE (v1)-[:REQUIRES {weight:1}]->(do)
MERGE (v2)-[:REQUIRES {weight:3}]->(sql)
MERGE (v2)-[:REQUIRES {weight:2}]->(py)
MERGE (v2)-[:REQUIRES {weight:1}]->(do)
MERGE (v3)-[:REQUIRES {weight:3}]->(sp)
MERGE (v3)-[:REQUIRES {weight:2}]->(ja)
MERGE (v3)-[:REQUIRES {weight:1}]->(do);

MERGE (c:Candidate {id:"C1", name:"Juan"})
WITH c
MATCH (py:Skill {name:"Python"}), (sql:Skill {name:"SQL"}), (do:Skill {name:"Docker"}), (git:Skill {name:"Git"})
MERGE (c)-[:HAS_SKILL]->(py)
MERGE (c)-[:HAS_SKILL]->(sql)
MERGE (c)-[:HAS_SKILL]->(do)
MERGE (c)-[:HAS_SKILL]->(git);
