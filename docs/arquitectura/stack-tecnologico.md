# Stack tecnologico

## Frontend
- React 18
- Vite 5
- CSS modular por capas visuales

## Backend
- FastAPI
- Pydantic
- Pytest

## Datos e infraestructura
- JSON seed para demo del MVP
- Neo4j como base prevista para matching basado en grafos
- Docker Compose para levantar servicios locales

## Justificacion
La combinacion React + FastAPI permite dividir claramente la interfaz y la logica de negocio. La capa de repositorios facilita migrar desde datos seed en JSON hacia Neo4j sin romper contratos de servicios ni endpoints.
