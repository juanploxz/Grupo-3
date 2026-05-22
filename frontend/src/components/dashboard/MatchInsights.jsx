export default function MatchInsights({ matches }) {
  const topMatch = matches[0];

  if (!topMatch) {
    return (
      <section className="card panel panel--insights">
        <div className="panel__header">
          <div>
            <span className="eyebrow">Compatibilidad</span>
            <h2>Recomendación principal</h2>
          </div>
        </div>
        <p className="empty-state">
          Aún no hay recomendaciones disponibles. Completa tu perfil para mejorar la compatibilidad con vacantes.
        </p>
      </section>
    );
  }

  const matchedSkills = topMatch.explanation?.matched_skills || [];
  const missingSkills = topMatch.explanation?.missing_skills || [];

  return (
    <section className="card panel panel--insights">
      <div className="panel__header">
        <div>
          <span className="eyebrow">Compatibilidad</span>
          <h2>Recomendación principal</h2>
        </div>
        <span className="badge">Mejor coincidencia</span>
      </div>
      <h3>{topMatch.title}</h3>
      <p>
        Esta vacante de {topMatch.company} destaca porque tu perfil coincide con habilidades clave y mantiene una
        brecha baja en conocimientos complementarios.
      </p>
      <div className="insights-grid">
        <div>
          <h4>Skills que ya cumples</h4>
          <ul>
            {matchedSkills.length ? matchedSkills.map((skill) => <li key={skill}>{skill}</li>) : <li>Por definir</li>}
          </ul>
        </div>
        <div>
          <h4>Skills por fortalecer</h4>
          <ul>
            {missingSkills.length
              ? missingSkills.map((skill) => <li key={skill}>{skill}</li>)
              : [<li key="none">No hay brechas críticas</li>]}
          </ul>
        </div>
      </div>
    </section>
  );
}
