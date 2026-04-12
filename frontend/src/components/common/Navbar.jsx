export default function Navbar({ profile }) {
  return (
    <header className="topbar">
      <div>
        <span className="eyebrow">TheFinder</span>
        <h1>Matching explicable para candidatos</h1>
      </div>
      <div className="topbar__user">
        <strong>{profile?.full_name || "Candidato"}</strong>
        <span>{profile?.location || "Ubicacion pendiente"}</span>
      </div>
    </header>
  );
}
