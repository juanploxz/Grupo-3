import Button from "../common/Button";

export default function ProfileSummary({ profile, onRefreshProfile }) {
  const skills = profile.skills || [];

  function formatList(items, fallback = "Por definir") {
    return items?.length ? items.join(", ") : fallback;
  }

  function handleImproveProfile() {
    onRefreshProfile({
      preferred_roles: ["Backend Developer", "Platform Engineer"],
      preferred_locations: ["Remote", "Medellín", "Bogotá"],
      summary:
        "Perfil actualizado con tus preferencias y experiencia para mejorar las recomendaciones.",
    });
  }

  return (
    <section className="card panel panel--profile">
      <div className="panel__header">
        <div>
          <span className="eyebrow">Perfil</span>
          <h2>Perfil profesional</h2>
        </div>
        <span className="badge">{profile.profile_completion}% completo</span>
      </div>
      <p className="muted">{profile.headline}</p>
      <p>{profile.summary}</p>
      <div className="chip-grid">
        {skills.length ? (
          skills.map((skill) => (
            <span className="chip" key={skill}>
              {skill}
            </span>
          ))
        ) : (
          <span className="chip">Agrega tus habilidades</span>
        )}
      </div>
      <div className="stats-row">
        <div>
          <strong>{profile.experience_years}</strong>
          <span>Años de experiencia</span>
        </div>
        <div>
          <strong>{formatList(profile.preferred_roles)}</strong>
          <span>Roles de interés</span>
        </div>
        <div>
          <strong>{formatList(profile.preferred_locations)}</strong>
          <span>Ubicaciones preferidas</span>
        </div>
      </div>
      <Button variant="secondary" onClick={handleImproveProfile}>
        Mejorar perfil
      </Button>
    </section>
  );
}
