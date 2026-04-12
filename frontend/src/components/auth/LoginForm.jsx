import { useState } from "react";
import Button from "../common/Button";

const initialForm = {
  email: "juan@example.com",
  password: "password123",
};

export default function LoginForm({ onSubmit }) {
  const [form, setForm] = useState(initialForm);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(form);
  }

  return (
    <form className="card login-card" onSubmit={handleSubmit}>
      <span className="eyebrow">Acceso de demo</span>
      <h2>Ingresa para revisar recomendaciones</h2>
      <label>
        Email
        <input name="email" value={form.email} onChange={handleChange} />
      </label>
      <label>
        Contrasena
        <input name="password" type="password" value={form.password} onChange={handleChange} />
      </label>
      <Button type="submit">Entrar al dashboard</Button>
    </form>
  );
}
