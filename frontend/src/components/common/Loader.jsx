export default function Loader({ label = "Cargando tu información..." }) {
  return (
    <div className="loader-shell">
      <div className="loader-ring" />
      <p>{label}</p>
    </div>
  );
}
