import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import ApplicationPanel from "../components/dashboard/ApplicationPanel";
import MatchInsights from "../components/dashboard/MatchInsights";
import ProfileSummary from "../components/dashboard/ProfileSummary";
import VacancyList from "../components/dashboard/VacancyList";
import Loader from "../components/common/Loader";
import { useDashboardData } from "../hooks/useDashboardData";

export default function DashboardPage({ candidateId, onLogout }) {
  const { profile, matches, applications, loading, error, saveProfile, applyToVacancy } = useDashboardData(candidateId);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <p className="error-banner">No fue posible cargar el dashboard: {error}</p>;
  }

  return (
    <div className="shell">
      <Sidebar />
      <main className="content">
        <Navbar profile={profile} onLogout={onLogout} />
        <div className="hero card">
          <span className="eyebrow">Perfil profesional</span>
          <h2>Encuentra vacantes recomendadas segun tus habilidades</h2>
          <p>
            Consulta tu perfil, revisa coincidencias con cada vacante y entiende por que el sistema te recomienda
            determinadas oportunidades.
          </p>
        </div>
        <div className="grid-two">
          <section id="profile-summary" className="section-anchor">
            <ProfileSummary profile={profile} onRefreshProfile={saveProfile} />
          </section>
          <section id="match-insights" className="section-anchor">
            <MatchInsights matches={matches} />
          </section>
        </div>
        <section id="vacancy-list" className="section-anchor">
          <VacancyList matches={matches} onApply={applyToVacancy} />
        </section>
        <section id="applications-panel" className="section-anchor">
          <ApplicationPanel applications={applications} />
        </section>
      </main>
    </div>
  );
}
