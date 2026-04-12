import { useState } from "react";
import Button from "../common/Button";

const initialLoginForm = {
  email: "",
  password: "",
};

const initialRegisterForm = {
  full_name: "",
  email: "",
  password: "",
};

export default function LoginForm({ onLogin, onRegister }) {
  const [mode, setMode] = useState("login");
  const [loginForm, setLoginForm] = useState(initialLoginForm);
  const [registerForm, setRegisterForm] = useState(initialRegisterForm);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    if (mode === "login") {
      setLoginForm((current) => ({ ...current, [name]: value }));
      return;
    }
    setRegisterForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      if (mode === "login") {
        await onLogin(loginForm);
        return;
      }
      await onRegister(registerForm);
      setRegisterForm(initialRegisterForm);
    } catch (submissionError) {
      setError(submissionError.message || "No fue posible completar la accion.");
    }
  }

  return (
    <form className="card login-card" onSubmit={handleSubmit}>
      <div className="auth-switch">
        <button
          className={`auth-switch__tab ${mode === "login" ? "auth-switch__tab--active" : ""}`}
          type="button"
          onClick={() => {
            setMode("login");
            setError("");
          }}
        >
          Iniciar sesion
        </button>
        <button
          className={`auth-switch__tab ${mode === "register" ? "auth-switch__tab--active" : ""}`}
          type="button"
          onClick={() => {
            setMode("register");
            setError("");
          }}
        >
          Registrarse
        </button>
      </div>
      <span className="eyebrow">{mode === "login" ? "Acceso" : "Registro"}</span>
      <h2>{mode === "login" ? "Ingresa para revisar recomendaciones" : "Crea una cuenta"}</h2>
      {mode === "register" ? (
        <label>
          Nombre completo
          <input
            name="full_name"
            value={registerForm.full_name}
            onChange={handleChange}
            placeholder="Ingresa tu nombre"
          />
        </label>
      ) : null}
      <label>
        Email
        <input
          name="email"
          value={mode === "login" ? loginForm.email : registerForm.email}
          onChange={handleChange}
          placeholder="correo@ejemplo.com"
        />
      </label>
      <label>
        Contrasena
        <input
          name="password"
          type="password"
          value={mode === "login" ? loginForm.password : registerForm.password}
          onChange={handleChange}
          placeholder="Ingresa tu contrasena"
        />
      </label>
      {error ? <p className="form-error">{error}</p> : null}
      <Button type="submit">{mode === "login" ? "Entrar al dashboard" : "Crear cuenta"}</Button>
    </form>
  );
}
