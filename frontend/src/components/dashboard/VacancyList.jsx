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

  function openApplicationForm(vacancyId) {
    setActiveVacancyId(vacancyId);
    setForm(initialForm);
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
    await onApply({
      vacancy_id: vacancyId,
      cover_letter: form.cover_letter,
      availability: form.availability,
      expected_salary: Number(form.expected_salary || 0),
    });
    closeApplicationForm();
  }

  return (
    <section className="card panel">
      <div className="panel__header">
        <div>
          <span className="eyebrow">Vacantes recomendadas</span>
          <h2>Oportunidades disponibles</h2>
        </div>
        <span className="badge badge--soft">{matches.length} recomendaciones</span>
      </div>
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
              <strong>{match.score}</strong>
              <span>score</span>
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
                  Mensaje para la postulacion
                  <textarea
                    name="cover_letter"
                    value={form.cover_letter}
                    onChange={handleChange}
                    placeholder="Explica por que tu perfil encaja con la vacante"
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
                    Aspiracion salarial
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
                  <Button type="submit">Enviar postulacion</Button>
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
