const items = [
  { label: "Resumen de perfil", target: "profile-summary" },
  { label: "Recomendaciones", target: "vacancy-list" },
  { label: "Explicacion del matching", target: "match-insights" },
  { label: "Postulaciones", target: "applications-panel" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <p className="sidebar__title">Sprint actual</p>
      <ul>
        {items.map((item) => (
          <li key={item.target}>
            <a className="sidebar__link" href={`#${item.target}`}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
