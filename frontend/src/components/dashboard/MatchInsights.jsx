export default function MatchInsights({ matches }) {
  const topMatch = matches[0];

  if (!topMatch) {
    return null;
  }

  return (
    <section className="card panel panel--insights">
      <div className="panel__header">
        <div>
          <span className="eyebrow">HU-10</span>
          <h2>Explicacion del matching</h2>
        </div>
        <span className="badge">Top match</span>
      </div>
      <h3>{topMatch.title}</h3>
      <p>
        La recomendacion principal viene de {topMatch.company} porque hay coincidencia fuerte con skills obligatorias
        y una brecha pequena en conocimientos complementarios.
      </p>
      <div className="insights-grid">
        <div>
          <h4>Skills que ya cumples</h4>
          <ul>
            {topMatch.explanation.matched_skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Skills por fortalecer</h4>
          <ul>
            {topMatch.explanation.missing_skills.length
              ? topMatch.explanation.missing_skills.map((skill) => <li key={skill}>{skill}</li>)
              : [<li key="none">No hay brechas criticas</li>]}
          </ul>
        </div>
      </div>
    </section>
  );
}
