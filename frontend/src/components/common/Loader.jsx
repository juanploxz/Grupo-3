export default function Loader({ label = "Cargando informacion del dashboard..." }) {
  return (
    <div className="loader-shell">
      <div className="loader-ring" />
      <p>{label}</p>
    </div>
  );
}
