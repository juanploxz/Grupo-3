<h2 align="center">Grupo-3 — Profile Manager (Idea 5: Neo4j)</h2>

<p align="center">
  <b>Juan Pablo Parra El-Masri</b><br/>
  <b>Mateo Gomez Giraldo</b><br/>
  <b>Juan Esteban Restrepo</b>
</p>

<hr/>

<h3> Descripción</h3>
<p>
  PoC de recomendaciones <b>explicables</b> usando <b>Neo4j</b> (grafos) ejecutado con <b>Docker</b>.
  El ranking devuelve:
  <b>score</b> (compatibilidad) y <b>matchedSkills</b> (explicación).
</p>

<h3>📁 Estructura</h3>

<pre>
Grupo-3/
  infra/
    docker-compose.yml
    seed.cypher
    recommendations.cypher
  backend/        (pendiente)
  frontend/       (pendiente)
  README.md
</pre>

<h3> Requisitos</h3>
<ul>
  <li>Docker Desktop instalado y corriendo</li>
  <li>Navegador web</li>
</ul>

<h3> 1) Levantar Neo4j con Docker</h3>
<p>Desde la raíz del repo:</p>

<pre>
cd infra
docker compose up -d
docker ps
</pre>

<h3> 2) Abrir Neo4j Browser</h3>
<ul>
  <li>URL: <code>http://localhost:7474</code></li>
  <li>Usuario: <code>neo4j</code></li>
  <li>Contraseña: <code>password123</code></li>
</ul>

<h3> 3) Cargar datos (Seed)</h3>
<p>
  En Neo4j Browser (editor de consultas que empieza con <code>$</code>):
</p>
<ol>
  <li>Abrir <code>infra/seed.cypher</code></li>
  <li>Copiar todo su contenido</li>
  <li>Pegar en Neo4j Browser y ejecutar (<b>Run</b> o <b>Ctrl+Enter</b>)</li>
</ol>

<h3> 4) Probar recomendaciones</h3>
<ol>
  <li>Ejecutar el contenido de <code>infra/recommendations.cypher</code></li>
</ol>

<p><b>Salida esperada:</b> ranking de vacantes con <code>score</code> y <code>matchedSkills</code>.</p>

<h3> Apagar (opcional)</h3>
<pre>
cd infra
docker compose down
</pre>
