import { useState } from "react";
import Button from "../common/Button";

const initialForm = {
  cover_letter: "",
  availability: "",
  expected_salary: "",
};

export default function VacancyList({ matches, onApply }) {
  const [activeVacancyId, setActiveVacancyId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [feedback, setFeedback] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function openApplicationForm(vacancyId) {
    setActiveVacancyId(vacancyId);
    setForm(initialForm);
    setFeedback(null);
  }

  function closeApplicationForm() {
    setActiveVacancyId(null);
    setForm(initialForm);
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event, vacancyId) {
    event.preventDefault();
    setSubmitting(true);
    setFeedback(null);
    try {
      await onApply({
        vacancy_id: vacancyId,
        cover_letter: form.cover_letter,
        availability: form.availability,
        expected_salary: Number(form.expected_salary || 0),
      });
      closeApplicationForm();
      setFeedback({ type: "success", text: "Postulación creada y lista actualizada." });
    } catch (error) {
      setFeedback({ type: "error", text: error.message || "No fue posible crear la postulación." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="card panel">
      <div className="panel__header">
        <div>
          <span className="eyebrow">Recomendaciones</span>
          <h2>Oportunidades para ti</h2>
        </div>
        <span className="badge badge--soft">{matches.length} vacantes</span>
      </div>
      {feedback ? <p className={`form-feedback form-feedback--${feedback.type}`}>{feedback.text}</p> : null}
      {!matches.length ? (
        <p className="empty-state">
          Aún no hay vacantes recomendadas. Completa tu perfil para recibir oportunidades más precisas.
        </p>
      ) : null}
      <div className="vacancy-list">
        {matches.map((match) => (
          <article className="vacancy-item" key={match.vacancy_id}>
            <div>
              <h3>{match.title}</h3>
              <p>
                {match.company} · {match.location}
              </p>
            </div>
            <div className="vacancy-item__meta">
              <strong>{match.score}%</strong>
              <span>Compatibilidad</span>
            </div>
            <div className="chip-grid">
              {match.explanation.matched_skills.map((skill) => (
                <span className="chip chip--accent" key={skill}>
                  {skill}
                </span>
              ))}
            </div>
            <Button onClick={() => openApplicationForm(match.vacancy_id)}>Postularme</Button>

            {activeVacancyId === match.vacancy_id ? (
              <form className="application-form" onSubmit={(event) => handleSubmit(event, match.vacancy_id)}>
                <label>
                  Mensaje para la postulación
                  <textarea
                    name="cover_letter"
                    value={form.cover_letter}
                    onChange={handleChange}
                    placeholder="Explica por qué tu perfil encaja con la vacante"
                    required
                  />
                </label>
                <div className="application-form__grid">
                  <label>
                    Disponibilidad
                    <input
                      name="availability"
                      value={form.availability}
                      onChange={handleChange}
                      placeholder="Ej. Inmediata"
                      required
                    />
                  </label>
                  <label>
                    Aspiración salarial
                    <input
                      name="expected_salary"
                      type="number"
                      min="0"
                      value={form.expected_salary}
                      onChange={handleChange}
                      placeholder="Ej. 6500000"
                      required
                    />
                  </label>
                </div>
                <div className="application-form__actions">
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Enviando..." : "Enviar postulación"}
                  </Button>
                  <Button type="button" variant="secondary" onClick={closeApplicationForm}>
                    Cancelar
                  </Button>
                </div>
              </form>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
