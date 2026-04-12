import Button from "../common/Button";

export default function VacancyList({ matches, onApply }) {
  return (
    <section className="card panel">
      <div className="panel__header">
        <div>
          <span className="eyebrow">HU-09 / HU-11</span>
          <h2>Vacantes recomendadas</h2>
        </div>
        <span className="badge badge--soft">{matches.length} recomendaciones</span>
      </div>
      <div className="vacancy-list">
        {matches.map((match) => (
          <article className="vacancy-item" key={match.vacancy_id}>
            <div>
              <h3>{match.title}</h3>
              <p>
                {match.company} · {match.location}
              </p>
            </div>
            <div className="vacancy-item__meta">
              <strong>{match.score}</strong>
              <span>score</span>
            </div>
            <div className="chip-grid">
              {match.explanation.matched_skills.map((skill) => (
                <span className="chip chip--accent" key={skill}>
                  {skill}
                </span>
              ))}
            </div>
            <Button onClick={() => onApply(match.vacancy_id)}>Postularme</Button>
          </article>
        ))}
      </div>
    </section>
  );
}
