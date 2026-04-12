import Button from "./Button";

export default function Navbar({ profile, onLogout }) {
  return (
    <header className="topbar">
      <div>
        <span className="eyebrow">TheFinder</span>
        <h1>Matching explicable para candidatos</h1>
      </div>
      <div className="topbar__actions">
        <div className="topbar__user">
          <strong>{profile?.full_name || "Candidato"}</strong>
          <span>{profile?.location || "Ubicacion pendiente"}</span>
        </div>
        <Button variant="secondary" type="button" onClick={onLogout}>
          Cerrar sesion
        </Button>
      </div>
    </header>
  );
}
