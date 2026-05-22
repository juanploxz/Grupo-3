import { useState } from "react";
import Button from "../common/Button";

const statusLabels = {
  submitted: "Enviada",
  review: "En revisión",
  accepted: "Aceptada",
  rejected: "No seleccionada",
};

const initialForm = {
  cover_letter: "",
  availability: "",
  expected_salary: "",
  status: "submitted",
};

export default function ApplicationPanel({
  applications,
  matches = [],
  onUpdateApplication,
  onDeleteApplication,
}) {
  const vacanciesById = new Map(matches.map((match) => [match.vacancy_id, match]));
  const [editingApplicationId, setEditingApplicationId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [feedback, setFeedback] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  function openEditForm(application) {
    setEditingApplicationId(application.id);
    setForm({
      cover_letter: application.cover_letter || "",
      availability: application.availability || "",
      expected_salary: application.expected_salary || "",
      status: application.status || "submitted",
    });
    setFeedback(null);
  }

  function closeEditForm() {
    setEditingApplicationId(null);
    setForm(initialForm);
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleUpdate(event, applicationId) {
    event.preventDefault();
    setProcessingId(applicationId);
    setFeedback(null);
    try {
      await onUpdateApplication(applicationId, {
        cover_letter: form.cover_letter,
        availability: form.availability,
        expected_salary: Number(form.expected_salary || 0),
        status: form.status,
      });
      closeEditForm();
      setFeedback({ type: "success", text: "Postulación actualizada correctamente." });
    } catch (error) {
      setFeedback({ type: "error", text: error.message || "No fue posible actualizar la postulación." });
    } finally {
      setProcessingId(null);
    }
  }

  async function handleDelete(applicationId) {
    const confirmed = window.confirm("¿Eliminar esta postulación?");
    if (!confirmed) {
      return;
    }

    setProcessingId(applicationId);
    setFeedback(null);
    try {
      await onDeleteApplication(applicationId);
      if (editingApplicationId === applicationId) {
        closeEditForm();
      }
      setFeedback({ type: "success", text: "Postulación eliminada y lista actualizada." });
    } catch (error) {
      setFeedback({ type: "error", text: error.message || "No fue posible eliminar la postulación." });
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <section className="card panel">
      <div className="panel__header">
        <div>
          <span className="eyebrow">Seguimiento</span>
          <h2>Postulaciones registradas</h2>
        </div>
        <span className="badge badge--soft">{applications.length} postulaciones</span>
      </div>
      {feedback ? <p className={`form-feedback form-feedback--${feedback.type}`}>{feedback.text}</p> : null}
      {!applications.length ? (
        <p className="empty-state">Aún no tienes postulaciones registradas.</p>
      ) : null}
      <div className="application-list">
        {applications.map((application) => {
          const vacancy = vacanciesById.get(application.vacancy_id);

          return (
            <div className="application-item" key={application.id}>
              <strong>{vacancy?.title || "Vacante registrada"}</strong>
              {vacancy?.company ? <span>{vacancy.company}</span> : null}
              <span>Estado: {statusLabels[application.status] || application.status}</span>
              {application.availability ? <span>Disponibilidad: {application.availability}</span> : null}
              {application.expected_salary ? (
                <span>Aspiración salarial: ${application.expected_salary.toLocaleString("es-CO")}</span>
              ) : null}
              {application.cover_letter ? <p>{application.cover_letter}</p> : null}
              <div className="record-actions">
                <Button type="button" variant="secondary" onClick={() => openEditForm(application)}>
                  Editar postulación
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => handleDelete(application.id)}
                  disabled={processingId === application.id}
                >
                  Eliminar
                </Button>
              </div>
              {editingApplicationId === application.id ? (
                <form className="application-form" onSubmit={(event) => handleUpdate(event, application.id)}>
                  <label>
                    Mensaje para la empresa
                    <textarea
                      name="cover_letter"
                      value={form.cover_letter}
                      onChange={handleChange}
                      placeholder="Actualiza el mensaje de tu postulación"
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
                        placeholder="Ej. Dos semanas"
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
                  <label>
                    Estado
                    <select name="status" value={form.status} onChange={handleChange}>
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="application-form__actions">
                    <Button type="submit" disabled={processingId === application.id}>
                      {processingId === application.id ? "Guardando..." : "Guardar cambios"}
                    </Button>
                    <Button type="button" variant="secondary" onClick={closeEditForm}>
                      Cancelar
                    </Button>
                  </div>
                </form>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
