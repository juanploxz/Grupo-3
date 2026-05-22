# Entrega final - TheFinder

## Resumen del sistema

TheFinder es una plataforma web académica para cargar o estructurar un perfil profesional, consultar vacantes recomendadas y registrar postulaciones. El problema que resuelve es ayudar a un candidato a entender qué oportunidades laborales encajan mejor con sus habilidades, mostrando un matching explicable basado en skills, vacantes y relaciones en Neo4j.

El flujo evaluable se centra en un candidato demo que entra al dashboard, ve recomendaciones, crea una postulación desde la lista de vacantes y luego consulta, actualiza o elimina postulaciones ya registradas.

## Arquitectura implementada

La solución mantiene una arquitectura por capas:

- **Frontend React + Vite:** capa de presentación en `frontend/src`. Renderiza el dashboard, las listas, formularios y mensajes de resultado. Usa componentes en `components/`, páginas en `pages/`, hooks en `hooks/` y servicios de API en `services/`.
- **Backend FastAPI:** capa de API/controladores en `backend/app/api/v1/endpoints`. Expone rutas REST para autenticación de apoyo, perfiles, vacantes, matching y postulaciones.
- **Servicios backend:** capa de lógica de negocio en `backend/app/services`. Orquesta reglas como creación de postulaciones, actualización de perfil y cálculo de recomendaciones.
- **Repositorios backend:** capa de acceso a datos en `backend/app/repositories`. Lee y escribe datos persistidos del MVP en `backend/app/data/*.json`, y usa `GraphRepository` para sincronizar candidatos/vacantes y consultar matches en Neo4j.
- **Neo4j:** base de datos orientada a grafos para representar `Candidate`, `Skill` y `Vacancy`, con relaciones `HAS_SKILL` y `REQUIRES`. El matching usa Neo4j cuando el servicio está disponible; si Neo4j no está levantado, el backend conserva un fallback académico calculado desde los seeds JSON para no bloquear la demostración.
- **Docker/infra:** `docker-compose.yml`, `infra/docker/` e `infra/scripts/` apoyan el montaje de backend, frontend y Neo4j.

## Árbol de directorios de la solución

```text
Grupo-3/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/endpoints/
│   │   ├── core/
│   │   ├── data/
│   │   ├── integrations/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── tests/
│   │   └── utils/
│   └── requirements.txt
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── context/
│       ├── data/
│       ├── hooks/
│       ├── pages/
│       ├── services/
│       └── styles/
├── database/
│   ├── neo4j/
│   └── samples/
├── docs/
│   ├── api/
│   ├── arquitectura/
│   ├── entregas/
│   └── requisitos/
├── infra/
│   ├── docker/
│   └── scripts/
└── docker-compose.yml
```

## Código de ejemplo por capa

### Componente React que lista registros y lanza acciones

Archivo: `frontend/src/components/dashboard/ApplicationPanel.jsx`

```jsx
{applications.map((application) => {
  const vacancy = vacanciesById.get(application.vacancy_id);

  return (
    <div className="application-item" key={application.id}>
      <strong>{vacancy?.title || "Vacante registrada"}</strong>
      <span>Estado: {statusLabels[application.status] || application.status}</span>
      <div className="record-actions">
        <Button type="button" variant="secondary" onClick={() => openEditForm(application)}>
          Editar postulación
        </Button>
        <Button type="button" variant="secondary" onClick={() => handleDelete(application.id)}>
          Eliminar
        </Button>
      </div>
    </div>
  );
})}
```

El mismo componente abre un formulario por registro para actualizar mensaje, disponibilidad, aspiración salarial y estado.

### Servicio frontend que llama al backend

Archivo: `frontend/src/services/api.js`

```js
export async function updateApplication(applicationId, updates) {
  try {
    return await request(`/applications/${applicationId}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  } catch (error) {
    const localAccounts = readLocalAccounts();
    const matchedEntry = Object.entries(localAccounts).find(([, account]) =>
      account.applications?.some((application) => application.id === applicationId)
    );

    if (matchedEntry) {
      const [email, account] = matchedEntry;
      const application = account.applications.find((item) => item.id === applicationId);
      const updatedApplication = { ...application, ...updates };
      localAccounts[email] = {
        ...account,
        applications: account.applications.map((item) =>
          item.id === applicationId ? updatedApplication : item
        ),
      };
      writeLocalAccounts(localAccounts);
      return updatedApplication;
    }

    return { id: applicationId, ...updates };
  }
}

export async function deleteApplication(applicationId) {
  try {
    return await request(`/applications/${applicationId}`, {
      method: "DELETE",
    });
  } catch (error) {
    const localAccounts = readLocalAccounts();
    const matchedEntry = Object.entries(localAccounts).find(([, account]) =>
      account.applications?.some((application) => application.id === applicationId)
    );

    if (matchedEntry) {
      const [email, account] = matchedEntry;
      localAccounts[email] = {
        ...account,
        applications: account.applications.filter((application) => application.id !== applicationId),
      };
      writeLocalAccounts(localAccounts);
    }

    return { id: applicationId, deleted: true };
  }
}
```

### Endpoint FastAPI

Archivo: `backend/app/api/v1/endpoints/applications.py`

```python
@router.put("/{application_id}", response_model=ApplicationRecord)
def update_application(
    application_id: str,
    payload: ApplicationUpdateRequest,
    service: ApplicationService = Depends(get_application_service),
) -> ApplicationRecord:
    return service.update_application(application_id, payload)
```

### Servicio backend

Archivo: `backend/app/services/application_service.py`

```python
def update_application(self, application_id: str, payload: ApplicationUpdateRequest) -> ApplicationRecord:
    updates = payload.model_dump(exclude_none=True)
    application = self.repository.update(application_id, updates)
    if not application:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Postulacion no encontrada")
    return ApplicationRecord(**application)
```

### Repositorio backend

Archivo: `backend/app/repositories/application_repo.py`

```python
def update(self, application_id: str, updates: dict) -> dict | None:
    records = self.list_all()
    for index, record in enumerate(records):
        if record["id"] == application_id:
            records[index] = {**record, **updates}
            write_json(FILENAME, records)
            return records[index]
    return None
```

### Consulta o acceso a Neo4j/datos

Archivo: `backend/app/repositories/graph_repo.py`

```python
MATCHING_QUERY = """
MATCH (c:Candidate {id: $candidate_id})-[:HAS_SKILL]->(s:Skill)<-[r:REQUIRES]-(v:Vacancy)
WITH c, v, sum(coalesce(r.weight, 1)) AS score, collect(DISTINCT s.name) AS matchedSkills
OPTIONAL MATCH (v)-[req:REQUIRES]->(required:Skill)
WITH c, v, score, matchedSkills,
     collect(DISTINCT CASE WHEN NOT required.name IN matchedSkills AND coalesce(req.weight, 1) >= 3 THEN required.name END) AS missingSkills
RETURN v.id AS vacancy_id,
       v.title AS title,
       v.company AS company,
       v.location AS location,
       score AS score,
       matchedSkills AS matched_skills,
       [skill IN missingSkills WHERE skill IS NOT NULL] AS missing_skills
ORDER BY score DESC, title ASC
LIMIT 10
"""
```

Para postulaciones, el repositorio usa `backend/app/core/database.py`, que lee y escribe JSON persistido en `backend/app/data/applications.json`.

## Historias de usuario implementadas

### Historia 1

Como candidato, quiero ver recomendaciones de vacantes según mis habilidades, para identificar oportunidades compatibles con mi perfil.

Evidencia implementada:

- Vista/página: `frontend/src/pages/DashboardPage.jsx` y `frontend/src/components/dashboard/VacancyList.jsx`.
- Endpoint: `GET /api/v1/matching/{candidate_id}`.
- Servicio: `backend/app/services/matching_service.py`.
- Repositorio/datos: `backend/app/repositories/graph_repo.py`, `backend/app/repositories/vacancy_repo.py`, `backend/app/data/vacancies.json`.
- Acción del usuario: entrar al dashboard y revisar la lista "Oportunidades para ti" con score, skills coincidentes y explicación.

### Historia 2

Como candidato, quiero postularme a una vacante desde la lista de recomendaciones, para registrar mi interés en una oportunidad.

Evidencia implementada:

- Vista/página: `frontend/src/components/dashboard/VacancyList.jsx`.
- Endpoint: `POST /api/v1/applications`.
- Servicio: `backend/app/services/application_service.py`.
- Repositorio/datos: `backend/app/repositories/application_repo.py`, `backend/app/data/applications.json`.
- Acción del usuario: presionar "Postularme", completar mensaje, disponibilidad y aspiración salarial, y enviar el formulario.

### Historia 3

Como candidato, quiero consultar y gestionar mis postulaciones, para revisar el estado de mis procesos y modificar información si es necesario.

Evidencia implementada:

- Vista/página: `frontend/src/components/dashboard/ApplicationPanel.jsx`.
- Endpoint: `GET /api/v1/applications/{candidate_id}`, `PUT /api/v1/applications/{application_id}`, `DELETE /api/v1/applications/{application_id}`.
- Servicio: `backend/app/services/application_service.py`.
- Repositorio/datos: `backend/app/repositories/application_repo.py`, `backend/app/data/applications.json`.
- Acción del usuario: ver postulaciones persistidas, abrir "Editar postulación", guardar cambios o eliminar un registro.

### Historia 4

Como candidato, quiero editar mi perfil profesional, para mantener actualizadas mis habilidades, preferencias y experiencia.

Evidencia implementada:

- Vista/página: `frontend/src/components/dashboard/ProfileSummary.jsx`.
- Endpoint: `PUT /api/v1/profiles/{candidate_id}`.
- Servicio: `backend/app/services/profile_service.py`.
- Repositorio/datos: `backend/app/repositories/candidate_repo.py`, `backend/app/data/candidates.json`, sincronización opcional a Neo4j.
- Acción del usuario: presionar "Mejorar perfil" para actualizar preferencias y mejorar la información usada por el matching.

## Demostración de interacción y acceso a datos

### Flujo de demostración para el evaluador

1. Levantar Neo4j:

   ```bash
   docker compose up -d neo4j
   ```

2. Levantar backend:

   ```bash
   cd backend
   python -m venv .venv
   . .venv/Scripts/activate
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```

3. Levantar frontend:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. Abrir `http://localhost:5173`.
5. Iniciar sesión con una cuenta demo: `juan@example.com` / `password123`.
6. Ver la lista de recomendaciones en "Oportunidades para ti". Los datos se solicitan a `GET /api/v1/matching/candidate-1`.
7. En una vacante, presionar "Postularme". Se abre un formulario con mensaje, disponibilidad y aspiración salarial.
8. Enviar la postulación. El frontend llama a `POST /api/v1/applications` y el backend inserta en `backend/app/data/applications.json`.
9. Revisar "Postulaciones registradas". La lista proviene de `GET /api/v1/applications/candidate-1`.
10. En una postulación, presionar "Editar postulación", cambiar datos y guardar. El backend ejecuta `PUT /api/v1/applications/{application_id}`.
11. Presionar "Eliminar" en una postulación. El backend ejecuta `DELETE /api/v1/applications/{application_id}` y la lista se actualiza.
12. Validar en Swagger: `http://127.0.0.1:8000/docs`.
13. Validar en Neo4j Browser: `http://localhost:7474`, usuario `neo4j`, contraseña `password123`.

Consulta sugerida en Neo4j Browser:

```cypher
MATCH (c:Candidate)-[:HAS_SKILL]->(s:Skill)<-[r:REQUIRES]-(v:Vacancy)
RETURN c.name AS candidato, v.title AS vacante, collect(s.name) AS skills, sum(coalesce(r.weight, 1)) AS score
ORDER BY candidato, score DESC;
```

## Conclusiones y lecciones aprendidas

- La arquitectura por capas permitió ubicar responsabilidades: React se concentra en interacción, FastAPI en rutas, servicios en reglas y repositorios en datos.
- Separar frontend y backend facilitó demostrar acciones reales: la UI no manipula datos directamente, sino que invoca servicios HTTP y actualiza la vista con la respuesta.
- Neo4j es adecuado para explicar el matching porque las relaciones candidato-skill-vacante se consultan naturalmente como grafo.
- La principal dificultad fue integrar una demo académica estable con infraestructura externa. Por eso se dejó Neo4j como fuente principal del matching y un fallback desde seeds JSON para que la sustentación no dependa de un único servicio.
- El trabajo reforzó la conexión completa entre UI, API y persistencia: una acción del usuario termina como inserción, actualización o borrado en la capa de datos.
- Mejoras futuras: persistir todas las entidades en Neo4j o en una base transaccional complementaria, agregar autenticación más robusta, pruebas end-to-end y una administración de vacantes para reclutadores.
