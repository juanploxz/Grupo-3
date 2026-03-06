# Product Backlog
**Proyecto:** Profile Manager – Matching Explicable  
**Descripción:** Plataforma web donde los usuarios suben su CV y el sistema recomienda vacantes relevantes mediante un motor de matching explicable basado en grafos.

Tecnologías sugeridas:
- Backend: Node.js / Python
- Base de datos de grafos: Neo4j
- Frontend: React / Vue
- Dataset de vacantes simulado

---

# Convenciones

Las historias de usuario siguen el formato:

> Como **[rol]**, quiero **[funcionalidad]** para **[beneficio]**.

Historias de **requisitos no funcionales** están marcadas con:

Estas deben tener una **etiqueta especial en GitHub** (ej: `non-functional`).

---

# MVP – Historias prioritarias

| ID | Historia de Usuario | Prioridad | Labels |
|----|---------------------|----------|--------|
| HU-01 | Como candidato, quiero crear una cuenta con email y contraseña para poder usar la plataforma. | Alta | feature, auth, MVP |
| HU-02 | Como candidato, quiero iniciar sesión en la plataforma para acceder a mi perfil. | Alta | feature, auth, MVP |
| HU-03 | Como candidato, quiero recuperar mi contraseña si la olvido para volver a acceder a mi cuenta. | Media | feature, auth |
| HU-04 | Como candidato, quiero subir mi CV en PDF o DOCX para que el sistema analice mi perfil profesional. | Alta | feature, profile, MVP |
| HU-05 | Como candidato, quiero que el sistema extraiga mis habilidades y experiencia del CV para evitar ingresar toda la información manualmente. | Alta | feature, AI, MVP |
| HU-06 | Como candidato, quiero editar mi perfil profesional para corregir o completar la información extraída del CV. | Alta | feature, profile, MVP |
| HU-07 | Como candidato, quiero ver un indicador de completitud de mi perfil para saber qué información falta. | Media | feature, profile |
| HU-08 | Como candidato, quiero configurar mis preferencias laborales para recibir recomendaciones relevantes. | Alta | feature, profile, MVP |
| HU-09 | Como candidato, quiero ver una lista de vacantes recomendadas para descubrir oportunidades que encajen conmigo. | Alta | feature, recommendation, MVP |
| HU-10 | Como candidato, quiero ver una explicación de por qué una vacante fue recomendada para entender la lógica del sistema. | Alta | feature, recommendation, MVP |
| HU-11 | Como candidato, quiero marcar interés o descartar vacantes para gestionar oportunidades. | Alta | feature, recommendation, MVP |
| HU-12 | Como candidato, quiero ver el historial de mis interacciones con vacantes para hacer seguimiento. | Media | feature, tracking |

---

# Funcionalidades adicionales

| ID | Historia de Usuario | Prioridad | Labels |
|----|---------------------|----------|--------|
| HU-13 | Como candidato, quiero buscar vacantes manualmente para explorar más oportunidades. | Media | feature, search |
| HU-14 | Como candidato, quiero filtrar vacantes por skill, salario o ubicación para encontrar oportunidades relevantes. | Media | feature, search |
| HU-15 | Como candidato, quiero indicar si una recomendación fue útil para mejorar futuras sugerencias. | Media | feature, AI |
| HU-16 | Como candidato, quiero exportar mi perfil como CV para compartirlo con empresas externas. | Baja | feature, profile |
| HU-17 | Como administrador, quiero crear o editar vacantes demo para alimentar el sistema de recomendaciones. | Media | admin, feature |
| HU-18 | Como administrador, quiero ver métricas de uso del sistema para analizar su desempeño. | Baja | admin, analytics |

---

# Historias de Usuario – Requisitos No Funcionales

| ID | Historia | Tipo | Labels |
|----|---------|------|--------|
| HU-NF-01 | El sistema debe implementar autenticación segura para proteger las cuentas de los usuarios. | Seguridad | non-functional, security |
| HU-NF-02 | El sistema debe responder a las consultas de recomendaciones en menos de 2 segundos. | Rendimiento | non-functional, performance |
| HU-NF-03 | El sistema debe proteger los datos personales del usuario mediante cifrado y control de acceso. | Seguridad | non-functional, security |
| HU-NF-04 | El sistema debe garantizar disponibilidad durante las pruebas y la demo del proyecto. | Disponibilidad | non-functional, reliability |
| HU-NF-05 | El sistema debe incluir pruebas unitarias y documentación técnica para facilitar mantenimiento. | Calidad | non-functional, quality |

---

# Labels recomendadas para GitHub

Crear estas etiquetas en el repositorio:

| Label | Color sugerido | Uso |
|------|------|------|
| feature | azul | funcionalidades |
| MVP | verde | historias prioritarias |
| recommendation | amarillo | sistema de matching |
| profile | celeste | perfil de usuario |
| search | naranja | búsqueda de vacantes |
| admin | gris | funcionalidades de administrador |
| non-functional | rojo | requisitos no funcionales |
| security | morado | seguridad |
| performance | rosado | rendimiento |
| quality | verde oscuro | calidad del código |

---

# Organización recomendada del repositorio

