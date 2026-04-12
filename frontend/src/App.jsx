import { useState } from "react";
import LoginForm from "./components/auth/LoginForm";
import DashboardPage from "./pages/DashboardPage";
import { login, register } from "./services/api";

export default function App() {
  const [session, setSession] = useState(null);

  async function handleLogin(credentials) {
    const response = await login(credentials);
    setSession(response);
  }

  async function handleRegister(payload) {
    const response = await register(payload);
    setSession(response);
  }

  function handleLogout() {
    setSession(null);
  }

  if (!session) {
    return (
      <div className="login-shell">
        <div className="login-copy">
          <span className="eyebrow">TheFinder</span>
          <h1>TheFinder</h1>
          <p>
            Plataforma web para cargar CV, estructurar perfil profesional y priorizar vacantes con matching explicable.
          </p>
        </div>
        <LoginForm onLogin={handleLogin} onRegister={handleRegister} />
      </div>
    );
  }

  return <DashboardPage candidateId={session.candidate_id} onLogout={handleLogout} />;
}
