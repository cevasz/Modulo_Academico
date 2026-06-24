# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Versionado Semántico](https://semver.org/lang/es/).

## [1.0.0] - 2026-06-24

### ✨ Agregado

#### Módulos Principales
- **Matrícula Digital**: Sistema completo de inscripción, renovación y actualización de matrículas
- **Gestión Documental**: Subida, clasificación y gestión de documentos institucionales
- **Perfil Integral del Estudiante**: Vista 360° con edición inline de información

#### Sistema Multiinstitucional
- Soporte para múltiples instituciones con aislamiento de datos
- 4 planes comerciales: Esencial, Smart, Campus IA, Enterprise
- Control de acceso a módulos según plan contratado
- Menú lateral inteligente con módulos bloqueados y opciones de upgrade

#### Base de Datos
- Schema completo de PostgreSQL con Supabase
- Tablas optimizadas con índices y relaciones
- Row Level Security (RLS) configurado
- Vistas SQL para consultas complejas
- Triggers automáticos para auditoría

#### Interfaz de Usuario
- Diseño responsivo con Tailwind CSS
- Menú lateral expandible/colapsable
- Edición inline de campos en perfil de estudiante
- Modales de upgrade con información de planes
- Estados visuales con colores y badges

#### Funcionalidades
- Validación completa de formularios en tiempo real
- Generación automática de números de matrícula
- Cálculo de edad automático
- Filtros avanzados en gestión documental
- Estadísticas en tiempo real
- Alertas de documentos pendientes

#### Documentación
- README principal completo
- Guías específicas por módulo
- Documentación de configuración de Supabase
- Manual del sistema de planes
- Ejemplos de uso y casos de uso

### 🔐 Seguridad
- Variables de entorno para credenciales
- Validación de datos en frontend y backend
- Políticas RLS para aislamiento de datos
- Gitignore para archivos sensibles

### 📊 Configuración
- Archivo de configuración de módulos centralizado
- Sistema de jerarquía de planes
- Funciones helper para verificar permisos
- Configuración de precios por plan

---

## [Próximas Versiones]

### 🚧 En Desarrollo
- Panel de administración de instituciones
- Sistema de facturación automática
- Módulo de asistencia
- Módulo de calificaciones
- Módulo de comunicados
- Dashboard con analítica

### 💡 Planeado
- Aplicación móvil nativa
- Módulos del Plan Smart
- Módulos de IA (Campus IA)
- Módulos Enterprise
- Sistema de notificaciones
- Exportación de reportes a PDF
- Integración con pasarelas de pago

---

## Tipos de Cambios
- `✨ Agregado` para funcionalidades nuevas
- `🔧 Cambiado` para cambios en funcionalidades existentes
- `⚠️ Deprecado` para funcionalidades que serán removidas
- `🗑️ Removido` para funcionalidades removidas
- `🐛 Corregido` para corrección de bugs
- `🔐 Seguridad` para vulnerabilidades de seguridad
