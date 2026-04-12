# Backend

API de TheFinder construida con FastAPI. Expone endpoints para autenticacion basica,
perfil de candidato, recomendaciones explicables y postulaciones.

## Ejecutar en local

```bash
python -m venv .venv
. .venv/Scripts/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
