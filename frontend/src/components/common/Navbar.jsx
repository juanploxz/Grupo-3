import Button from "./Button";

export default function Navbar({ profile, onLogout }) {
  return (
    <header className="topbar">
      <div>
        <span className="eyebrow">TheFinder</span>
        <h1>Tus recomendaciones laborales</h1>
      </div>
      <div className="topbar__actions">
        <div className="topbar__user">
          <strong>{profile?.full_name || "Candidato"}</strong>
          <span>{profile?.location || "Ubicación pendiente"}</span>
        </div>
        <Button variant="secondary" type="button" onClick={onLogout}>
          Cerrar sesión
        </Button>
      </div>
    </header>
  );
}
