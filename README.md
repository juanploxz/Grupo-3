# TheFinder

TheFinder es una plataforma web para cargar CV, estructurar un perfil profesional y recomendar vacantes con un motor de matching explicable. El repositorio ahora esta organizado por dominios claros para facilitar trabajo en sprints, evidencia tecnica y crecimiento del MVP.

## Estructura del repositorio

```text
Grupo-3/
  backend/        FastAPI, capas de api, servicios, repositorios y esquemas
  frontend/       React + Vite, componentes, paginas, hooks y estilos
  database/       muestras y scripts de Neo4j
  docs/           arquitectura, requisitos y entregas
  infra/          Dockerfiles, compose y utilidades de entorno
```

## Historias soportadas por la base actual

- HU-01 / HU-02: autenticacion basica
- HU-04 / HU-05: carga y procesamiento inicial de CV
- HU-06 / HU-08: edicion de perfil y preferencias
- HU-09 / HU-10: recomendaciones y explicacion del matching
- HU-11: postulacion a vacantes

## Backend

```bash
cd backend
python -m venv .venv
. .venv/Scripts/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

## Docker

```bash
docker compose up --build
```

## Notas de arquitectura

- La logica de matching actual esta implementada en Python para tener una base demostrable.
- La capa `repositories/graph_repo.py` preserva la frontera para integrar Neo4j real en el siguiente sprint.
- La interfaz usa datos del backend cuando esta disponible y hace fallback a datos demo cuando no lo esta.
