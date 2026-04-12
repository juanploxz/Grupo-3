# TheFinder

TheFinder es una plataforma web para cargar CV, estructurar un perfil profesional y recomendar vacantes con un motor de matching explicable basado en skills y Neo4j.

## Estructura del repositorio

```text
Grupo-3/
  backend/        API FastAPI, servicios, repositorios, esquemas y datos del MVP
  frontend/       Interfaz React + Vite, componentes, paginas, hooks y estilos
  database/       Seeds y archivos de apoyo para Neo4j
  docs/           Requisitos, arquitectura y entregas
  infra/          Dockerfiles, scripts y configuracion de entorno
```

## Requisitos

- Python 3.11 o superior
- Node.js 18 o superior
- Docker Desktop
- Neo4j Browser accesible en `http://localhost:7474`

## Variables y puertos

Puertos esperados:

- Frontend: `5173`
- Backend: `8000`
- Neo4j Browser: `7474`
- Neo4j Bolt: `7687`

Configuracion esperada:

- Frontend: `frontend/.env.example`
- Backend: `backend/.env.example`

## Como correr todo

### 1. Levantar Neo4j

Si ya tienes un contenedor Neo4j corriendo en `7474` y `7687`, puedes reutilizarlo. Si no:

```bash
docker compose up -d neo4j
```

Verifica que este arriba:

```bash
docker ps
```

Abre Neo4j Browser:

- URL: `http://localhost:7474`
- Usuario: `neo4j`
- Contrasena: `password123`

### 2. Levantar el backend

```bash
cd backend
python -m venv .venv
. .venv/Scripts/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Verifica que este disponible:

- API root: `http://127.0.0.1:8000/`
- Swagger: `http://127.0.0.1:8000/docs`

### 3. Levantar el frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

Abre:

- `http://localhost:5173`

## Como probar el sistema

### Cuentas demo existentes

- `juan@example.com` / `password123`
- `mateo@example.com` / `password123`
- `juandiego@example.com` / `password123`

### Flujo sugerido de prueba

1. Inicia sesion con una de las cuentas demo.
2. Revisa el perfil y las recomendaciones.
3. Abre una vacante desde la lista con `Postularme`.
4. Completa el formulario de postulacion.
5. Verifica que la postulacion aparezca en el panel de `Postulaciones`.
6. Cierra sesion y entra con otro candidato para comparar scores y matches.

## Como verificar Neo4j

Despues de consultar recomendaciones desde la app o desde el backend, puedes validar el grafo con estas consultas en Neo4j Browser.

### Grafo principal

```cypher
MATCH (c:Candidate)-[hs:HAS_SKILL]->(s:Skill)<-[r:REQUIRES]-(v:Vacancy)
RETURN c, hs, s, r, v;
```

### Score por candidato y vacante

```cypher
MATCH (c:Candidate)-[:HAS_SKILL]->(s:Skill)<-[r:REQUIRES]-(v:Vacancy)
WITH c, v, sum(coalesce(r.weight,1)) AS score, collect(s.name) AS matchedSkills
RETURN c.name AS candidato, v.title AS vacante, score, matchedSkills
ORDER BY candidato, score DESC;
```

### Vacantes y pesos

```cypher
MATCH (v:Vacancy)-[r:REQUIRES]->(s:Skill)
RETURN v, r, s;
```

## Endpoints principales

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/profiles/{candidate_id}`
- `PUT /api/v1/profiles/{candidate_id}`
- `POST /api/v1/profiles/{candidate_id}/upload-cv`
- `GET /api/v1/matching/{candidate_id}`
- `GET /api/v1/applications/{candidate_id}`
- `POST /api/v1/applications`

## Arquitectura implementada

- Frontend en React organizado por componentes, paginas, hooks y servicios.
- Backend en FastAPI organizado por endpoints, servicios, repositorios y esquemas.
- Matching real calculado en Neo4j a partir de relaciones entre `Candidate`, `Skill` y `Vacancy`.
- Persistencia del MVP apoyada en datos de backend y sincronizacion al grafo.

## Notas

- Si el frontend no logra hablar con el backend, tiene algunos fallbacks de demo para no romper la interfaz.
- Para la sustentacion y la entrega 2, se recomienda correr backend y Neo4j activos para que el score y el matching salgan del flujo real.
