import Button from "../common/Button";

export default function ProfileSummary({ profile, onRefreshProfile }) {
  function handleImproveProfile() {
    onRefreshProfile({
      preferred_roles: ["Backend Developer", "Platform Engineer"],
      preferred_locations: ["Remote", "Medellin", "Bogota"],
      summary:
        "Perfil actualizado desde la interfaz para mejorar trazabilidad y recomendaciones explicables.",
    });
  }

  return (
    <section className="card panel panel--profile">
      <div className="panel__header">
        <div>
          <span className="eyebrow">HU-06 / HU-08</span>
          <h2>Perfil del candidato</h2>
        </div>
        <span className="badge">{profile.profile_completion}% completo</span>
      </div>
      <p className="muted">{profile.headline}</p>
      <p>{profile.summary}</p>
      <div className="chip-grid">
        {profile.skills.map((skill) => (
          <span className="chip" key={skill}>
            {skill}
          </span>
        ))}
      </div>
      <div className="stats-row">
        <div>
          <strong>{profile.experience_years}</strong>
          <span>anos de experiencia</span>
        </div>
        <div>
          <strong>{profile.preferred_roles.join(", ")}</strong>
          <span>roles objetivo</span>
        </div>
        <div>
          <strong>{profile.preferred_locations.join(", ")}</strong>
          <span>ubicaciones</span>
        </div>
      </div>
      <Button variant="secondary" onClick={handleImproveProfile}>
        Mejorar perfil demo
      </Button>
    </section>
  );
}
