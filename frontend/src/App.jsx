import { useState } from "react";
import LoginForm from "./components/auth/LoginForm";
import DashboardPage from "./pages/DashboardPage";
import { login } from "./services/api";

export default function App() {
  const [session, setSession] = useState(null);

  async function handleLogin(credentials) {
    const response = await login(credentials);
    setSession(response);
  }

  if (!session) {
    return (
      <div className="login-shell">
        <div className="login-copy">
          <span className="eyebrow">Entrega 2</span>
          <h1>TheFinder</h1>
          <p>
            Plataforma web para cargar CV, estructurar perfil profesional y priorizar vacantes con matching explicable.
          </p>
        </div>
        <LoginForm onSubmit={handleLogin} />
      </div>
    );
  }

  return <DashboardPage candidateId={session.candidate_id} />;
}
