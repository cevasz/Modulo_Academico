# Digitalización Institucional — Contextualización del Proyecto

## Descripción general

El proyecto de **Digitalización Institucional** es una plataforma educativa modular diseñada para transformar los procesos administrativos y académicos de instituciones de educación básica y media en Colombia. La solución se comercializa en cuatro planes escalonados, desde la gestión digital esencial hasta un ecosistema autónomo con inteligencia artificial integrada.

---

## Objetivo

Centralizar y automatizar los procesos institucionales educativos —matrículas, calificaciones, asistencia, comunicación con familias y analítica directiva— en una plataforma digital accesible desde web y dispositivo móvil, reduciendo la carga administrativa y mejorando la toma de decisiones con datos en tiempo real.

---

## Planes y alcance

### Plan Esencial — Digitalización Institucional

Precio base de referencia. Cubre los procesos fundamentales de operación diaria.

**Módulo de matrículas**
- Inscripción, renovación y actualización de matrículas en línea
- Almacenamiento y gestión de documentos institucionales
- Perfil integral del estudiante (datos académicos, familiares y administrativos)

**Módulo académico**
- Registro de calificaciones por período y materia
- Historial académico completo por estudiante
- Generación automática de boletines
- Seguimiento de recuperaciones y nivelaciones

**Módulo de asistencia**
- Control diario de asistencia por grupo
- Registro de llegadas tarde
- Alertas automáticas por inasistencia acumulada

**Módulo de comunicación**
- Comunicados institucionales segmentados
- Correo interno entre actores del sistema
- Notificaciones push a dispositivos móviles

**Biblioteca digital**
- Repositorio de recursos académicos por grado y materia
- Sistema de descargas con control de acceso

**Aplicación móvil**
- Vista de estudiante: horarios, boletines, tareas y eventos
- Vista de docente: notas, asistencia y observaciones
- Vista de directivo: indicadores institucionales en tiempo real

---

### Plan Smart — Campus Conectado

**Precio:** $4.000.000/mes. Incluye todo el Plan Esencial más:

- Encuestas institucionales con resultados gráficos
- Gobierno escolar digital (candidatos, votación, resultados)
- Reconocimientos digitales para estudiantes (insignias por categorías)
- Gestión de eventos e inscripciones con confirmación QR
- Sistema PQRS con seguimiento en tiempo real
- Chatbot institucional de preguntas frecuentes

---

### Plan Campus IA — Inteligencia Institucional

**Precio:** $5.500.000/mes. Incluye todo el Plan Smart más:

- IA entrenada con documentos institucionales propios (RAG)
- Asistente con IA para estudiantes, padres y docentes
- OVAs inteligentes generadas por IA según materia, grado y estilo de aprendizaje
- Analítica avanzada con visualizaciones interactivas
- Informes narrativos automáticos generados por IA
- Comunicados institucionales redactados automáticamente

---

### Plan Campus Inteligente Enterprise — Ecosistema Educativo Autónomo

**Precio:** $7.000.000/mes. Incluye todo el Plan Campus IA más:

- Agente de WhatsApp con IA para atención a familias
- Agente de voz para consultas por teléfono
- Correo inteligente con respuestas sugeridas
- Analítica predictiva de rendimiento académico
- Modelo de riesgo de deserción y alerta temprana
- Automatización de flujos institucionales
- Gestión documental inteligente con clasificación automática
- Firma digital para documentos oficiales
- API institucional abierta para integraciones externas
- Integraciones con plataformas educativas (Moodle, Google Classroom, etc.)
- Desarrollo personalizado según necesidades de la institución

---

## Arquitectura tecnológica recomendada

### Frontend
- **Web:** React + Tailwind CSS
- **Móvil:** React Native
- **Gráficas:** Recharts / Chart.js

### Backend
- **API principal:** Python con FastAPI (REST + JWT)
- **Servicios de automatización:** Node.js + node-cron
- **ORM:** SQLAlchemy 2.0 con Alembic para migraciones

### Base de datos
- **Relacional:** PostgreSQL
- **Vectorial (plan IA):** ChromaDB para búsqueda semántica (RAG)

### Inteligencia artificial
- **Modelo base:** Claude API (claude-sonnet-4-6) de Anthropic
- **Orquestación IA:** LangChain
- **Voz:** Web Speech API + Speech Synthesis API

### Comunicaciones
- **WhatsApp:** Twilio API / WhatsApp Business API
- **Correo:** Nodemailer / SMTP institucional
- **Push notifications:** Firebase Cloud Messaging (FCM)

---

## Estructura de roles del sistema

| Rol | Acceso principal |
|---|---|
| Administrador | Gestión global, configuración, reportes, PQRS |
| Docente | Notas, asistencia, comunicados, OVAs, observaciones |
| Estudiante | Boletines, horario, tareas, reconocimientos, biblioteca |
| Padre/acudiente | Seguimiento del estudiante, comunicados, PQRS, alertas |
| Directivo | Dashboard analítico, informes, alertas tempranas, gestión de eventos |

---

## Modelo de datos principal

El sistema se estructura en torno a las siguientes entidades relacionales:

- `usuarios` — base común para todos los roles (auth + perfil)
- `estudiantes` — vinculados a usuarios, con datos académicos y acudiente
- `matriculas` — estado y tipo de vinculación por año lectivo
- `calificaciones` — notas por materia, período, docente y tipo (regular / recuperación)
- `asistencia` — registro diario por estudiante con estado y justificación
- `comunicados` — mensajes institucionales con segmentación de destinatarios
- `pqrs` — radicados con flujo de estados y respuesta oficial
- `alertas` — generadas automáticamente por reglas configurables
- `reconocimientos` — insignias otorgadas por docentes con categoría y descripción

---

## Consideraciones de implementación

1. **Despliegue progresivo:** Se recomienda iniciar con el Plan Esencial, validar la adopción institucional y escalar hacia planes superiores por módulos.
2. **Privacidad de datos:** Todos los datos de menores deben tratarse bajo la Ley 1581 de 2012 (habeas data) y las políticas del MEN para sistemas de información educativa en Colombia.
3. **Accesibilidad:** La interfaz debe cumplir estándares básicos de accesibilidad (contraste, navegación por teclado, compatibilidad con lectores de pantalla).
4. **Roles y permisos:** Implementar control de acceso basado en roles (RBAC) desde el inicio, ya que escalar el modelo de permisos en fases avanzadas es costoso.
5. **Integraciones externas:** Para el plan Enterprise, diseñar la API institucional como contrato primero (API-first) antes de implementar integraciones.

---

*Documento generado como referencia de contexto para el desarrollo del sistema de digitalización institucional.*
