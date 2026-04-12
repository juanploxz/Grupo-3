# Decisiones arquitectonicas

## 1. Arquitectura por capas en backend
Se separo la API, los servicios, los repositorios y los esquemas para evitar logica mezclada y facilitar pruebas.

## 2. Componentizacion en frontend
La interfaz se dividio en componentes reutilizables y paginas para mantener trazabilidad entre historias de usuario y pantallas del MVP.

## 3. Persistencia de demo desacoplada
Durante este sprint se usa persistencia en archivos JSON para demostrar flujo funcional sin bloquear al equipo por integraciones incompletas. La frontera de grafo queda abstraida en `graph_repo.py`.

## 4. Repo organizado por dominios
La raiz del proyecto conserva carpetas separadas para `backend`, `frontend`, `database`, `docs` e `infra`, lo que reduce friccion entre desarrollo, despliegue y documentacion.
