export default function ApplicationPanel({ applications }) {
  return (
    <section className="card panel">
      <div className="panel__header">
        <div>
          <span className="eyebrow">Seguimiento</span>
          <h2>Postulaciones registradas</h2>
        </div>
        <span className="badge badge--soft">{applications.length} registros</span>
      </div>
      <div className="application-list">
        {applications.map((application) => (
          <div className="application-item" key={application.id}>
            <strong>{application.vacancy_id}</strong>
            <span>{application.status}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
