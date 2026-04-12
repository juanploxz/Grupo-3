# Decisiones arquitectonicas

## 1. Arquitectura por capas en backend
Se separo la API, los servicios, los repositorios y los esquemas para evitar logica mezclada y facilitar pruebas.

## 2. Componentizacion en frontend
La interfaz se dividio en componentes reutilizables y paginas para mantener trazabilidad entre historias de usuario y pantallas del MVP.

## 3. Persistencia desacoplada con integracion real a Neo4j
Los datos maestros del MVP siguen estando versionados en archivos JSON para facilitar pruebas y arranque del proyecto, pero el calculo de recomendaciones se ejecuta en Neo4j. La frontera de grafo en `graph_repo.py` sincroniza candidatos y vacantes al grafo y ejecuta la consulta de score basada en skills y pesos `REQUIRES`.

## 4. Repo organizado por dominios
La raiz del proyecto conserva carpetas separadas para `backend`, `frontend`, `database`, `docs` e `infra`, lo que reduce friccion entre desarrollo, despliegue y documentacion.
