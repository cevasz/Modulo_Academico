# 🎓 Sistema de Digitalización Institucional

[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e.svg)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Plataforma SaaS completa para la digitalización y gestión integral de instituciones educativas en Colombia. Sistema multiinstitucional con 4 planes escalonados y más de 20 módulos especializados.

---

# 📚 Sistema de Matrícula Digital

Sistema completo de matrícula digital para instituciones educativas colombianas, desarrollado con React, Tailwind CSS y Supabase.

## 🌟 Demo en Vivo

🔗 **[Ver Demo](https://github.com/cevasz/Modulo_Academico)**

## 📹 Video Demo

[Próximamente]

---

## 🚀 Características Principales

### 🎯 **3 Módulos Completamente Funcionales**

## 🎯 Características

### ✨ Funcionalidades Principales

#### 📝 Módulo de Matrícula Digital

- **Tres tipos de operación**:
  - 🆕 Inscripción nueva de estudiantes
  - 🔄 Renovación de matrícula
  - ✏️ Actualización de datos

- **Validación completa de formularios**:
  - Nombres con mínimo 3 caracteres
  - Documentos de identidad (7-11 dígitos)
  - Fechas de nacimiento (edad 3-20 años)
  - Teléfonos celulares colombianos (formato 3XXXXXXXXX)
  - Correos electrónicos válidos
  - Feedback visual en tiempo real

- **Gestión automática**:
  - Generación de número de matrícula único (AAAA-XXXX)
  - Almacenamiento en base de datos Supabase
  - Historial de cambios automático
  - Prevención de duplicados

#### 📁 Módulo de Gestión Documental

- **Gestión completa de documentos**:
  - 📤 Subida de archivos (PDF, Word, Imágenes)
  - 🗂️ Clasificación por tipo (admisión, paz y salvo, carnet, certificado, boletín)
  - 👁️ Vista en tabla con información completa
  - 📊 Estadísticas en tiempo real

- **Filtros avanzados**:
  - Por estudiante (nombre o documento)
  - Por tipo de documento
  - Por estado (pendiente, aprobado, rechazado)
  - Por rango de fechas
  - Contador de resultados

- **Acciones sobre documentos**:
  - 👀 Ver documento en nueva pestaña
  - ⬇️ Descargar archivo
  - 🗑️ Eliminar documento
  - ✅ Cambiar estado (pendiente/aprobado/rechazado)

- **Características de seguridad**:
  - Validación de tamaño máximo (10MB)
  - Organización por carpetas de estudiante
  - Almacenamiento seguro en Supabase Storage
  - Control de estados de aprobación

#### 🎨 Interfaz Moderna

- Diseño responsivo (móvil, tablet, escritorio)
- Estilos profesionales con Tailwind CSS
- Navegación entre módulos
- Transiciones suaves y feedback visual
- Estados de carga y errores
- Iconos SVG optimizados

## 🗄️ Estructura de la Base de Datos

### Tablas Principales

- **estudiantes**: Información básica de estudiantes
- **acudientes**: Datos de contacto de acudientes
- **matriculas**: Registro de matrículas por año
- **historial_matriculas**: Auditoría de cambios
- **documentos**: Gestión de archivos institucionales

### Vistas Personalizadas

- **vista_matriculas_completas**: Datos completos de matrículas con relaciones
- **vista_estadisticas_matriculas**: Estadísticas agregadas por año
- **vista_documentos_completos**: Documentos con información del estudiante
- **vista_estadisticas_documentos**: Estadísticas por tipo de documento

### Storage

- **documentos-estudiantes**: Bucket para almacenar archivos PDF, Word e imágenes

### Características de BD

- ✅ Índices optimizados para búsquedas rápidas
- ✅ Triggers automáticos para actualizar timestamps
- ✅ Registro automático en historial
- ✅ Row Level Security (RLS) configurado
- ✅ Validaciones a nivel de base de datos

## 🚀 Instalación

### Requisitos Previos

- Node.js 18+ instalado
- Cuenta en Supabase (gratis)
- Git (opcional)

### Paso 1: Clonar o descargar el proyecto

```bash
# Si tienes git
git clone https://github.com/tu-usuario/matricula-digital.git
cd matricula-digital

# O descarga el ZIP y extráelo
```

### Paso 2: Instalar dependencias

```bash
npm install
```

### Paso 3: Configurar Supabase

Sigue estas guías en orden:

1. **[Guía Completa de Supabase](./GUIA_SUPABASE.md)** - Configuración de base de datos
2. **[Configuración de Storage](./supabase_storage_setup.md)** - Configuración de almacenamiento de archivos

Incluye:
- Crear cuenta y proyecto en Supabase
- Ejecutar el script SQL para crear las tablas
- Configurar el bucket de Storage para documentos
- Obtener las credenciales de API
- Configurar variables de entorno

### Paso 4: Configurar variables de entorno

1. Copia el archivo de ejemplo:
   ```bash
   cp .env.example .env
   ```

2. Edita `.env` y agrega tus credenciales de Supabase:
   ```bash
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-clave-anon-key
   ```

### Paso 5: Iniciar el servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:5173`

## 📂 Estructura del Proyecto

```
matricula-digital/
├── src/
│   ├── components/
│   │   ├── MatriculaForm.jsx       # Componente del formulario de matrícula
│   │   └── GestionDocumental.jsx   # Componente de gestión documental
│   ├── utils/
│   │   └── supabaseClient.js       # Cliente y funciones de Supabase
│   ├── App.jsx                      # Componente raíz con navegación
│   ├── main.jsx                     # Punto de entrada
│   └── index.css                    # Estilos globales con Tailwind
├── supabase_schema.sql              # Script de creación de BD
├── supabase_storage_setup.md        # Guía de configuración de Storage
├── package.json                     # Dependencias del proyecto
├── vite.config.js                   # Configuración de Vite
├── tailwind.config.js               # Configuración de Tailwind
├── .env.example                     # Ejemplo de variables de entorno
├── .gitignore                       # Archivos ignorados por git
├── GUIA_SUPABASE.md                # Guía detallada de Supabase
└── README.md                        # Este archivo
```

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Producción
npm run build        # Genera build de producción
npm run preview      # Vista previa del build

# Linting
npm run lint         # Ejecuta ESLint
```

## 🔐 Seguridad

### Variables de Entorno

- ✅ Archivo `.env` está en `.gitignore`
- ✅ Usa solo la clave `anon` (pública) en el frontend
- ✅ No expongas la clave `service_role` en el cliente

### Base de Datos

- ✅ Row Level Security (RLS) habilitado
- ✅ Políticas de acceso configuradas
- ✅ Validaciones en la base de datos
- ✅ Triggers de auditoría activos

### Mejores Prácticas

- No compartas el archivo `.env`
- No hagas commit de credenciales
- Usa HTTPS en producción
- Implementa autenticación para el panel admin

## 📊 Uso de la API de Supabase

### Funciones Disponibles

```javascript
import {
  crearMatricula,
  verificarDocumentoEstudiante,
  obtenerMatriculaPorNumero,
  obtenerMatriculasAnoActual,
  obtenerEstadisticasMatriculas,
  actualizarEstadoMatricula,
  obtenerHistorialMatricula
} from './utils/supabaseClient';
```

### Ejemplo: Crear una matrícula

```javascript
const resultado = await crearMatricula(formData, 'inscripcion');

if (resultado.success) {
  console.log('Matrícula creada:', resultado.numeroMatricula);
} else {
  console.error('Error:', resultado.error);
}
```

### Ejemplo: Consultar matrículas

```javascript
// Obtener todas las matrículas del año actual
const matriculas = await obtenerMatriculasAnoActual();

// Obtener estadísticas
const stats = await obtenerEstadisticasMatriculas();
```

## 🎨 Personalización

### Cambiar Colores

Los colores principales están en `tailwind.config.js`. Modifica:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#4F46E5',  // Indigo-600
      secondary: '#10B981', // Green-500
    }
  }
}
```

Luego reemplaza las clases en los componentes:
- `bg-indigo-600` → `bg-primary`
- `text-indigo-700` → `text-primary`

### Agregar Campos al Formulario

1. Agrega el campo al estado en `MatriculaForm.jsx`:
   ```javascript
   const [formData, setFormData] = useState({
     // ... campos existentes
     nuevoCampo: ''
   });
   ```

2. Agrega la validación en `validarFormulario()`:
   ```javascript
   if (!formData.nuevocampo.trim()) {
     nuevosErrores.nuevocampo = 'Este campo es obligatorio';
   }
   ```

3. Agrega el campo HTML en el JSX
4. Actualiza la tabla en Supabase si es necesario

## 🧪 Datos de Prueba

Para insertar datos de prueba en Supabase:

```sql
-- En el SQL Editor de Supabase
INSERT INTO estudiantes (nombre_completo, tipo_documento, numero_documento, fecha_nacimiento, grado)
VALUES ('Ana María Rodríguez', 'TI', '1122334455', '2013-08-20', '5°');

INSERT INTO acudientes (nombre_completo, numero_documento, parentesco, telefono, correo_electronico)
VALUES ('Pedro Rodríguez', '5544332211', 'Padre', '3109876543', 'pedro.rodriguez@email.com');
```

## 📱 Responsividad

El diseño es completamente responsivo:

- **Móvil (< 768px)**: Formulario de una columna
- **Tablet (768px - 1024px)**: Dos columnas en secciones
- **Escritorio (> 1024px)**: Layout optimizado

## 🚧 Roadmap / Próximas Características

- [ ] Panel administrativo para gestionar matrículas
- [ ] Búsqueda y filtrado de estudiantes
- [ ] Exportación de datos a Excel/PDF
- [ ] Subida de documentos (fotos, certificados)
- [ ] Envío de correos de confirmación automáticos
- [ ] Dashboard con estadísticas visuales
- [ ] Sistema de notificaciones
- [ ] Impresión de comprobantes
- [ ] Firma digital de acudientes
- [ ] Integración con sistemas de pago

## 🐛 Solución de Problemas

### El formulario no se carga

- Verifica que instalaste las dependencias: `npm install`
- Revisa la consola del navegador para errores
- Confirma que el servidor está corriendo: `npm run dev`

### Error de conexión a Supabase

- Verifica que el archivo `.env` existe y tiene las credenciales correctas
- Confirma que tu proyecto de Supabase está activo (no pausado)
- Revisa la consola del navegador para más detalles

### Los datos no se guardan

- Verifica que ejecutaste el script SQL completo en Supabase
- Confirma que las políticas RLS están habilitadas
- Revisa el SQL Editor de Supabase para ver si hay errores

Para más ayuda, consulta la [Guía de Supabase](./GUIA_SUPABASE.md).

## 📚 Tecnologías Utilizadas

- **Frontend**:
  - React 18.2
  - Tailwind CSS 3.4
  - Vite 5.0

- **Backend**:
  - Supabase (PostgreSQL)
  - Row Level Security (RLS)

- **Herramientas**:
  - ESLint
  - PostCSS
  - Autoprefixer

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📧 Soporte

Si tienes preguntas o necesitas ayuda:

- Revisa la documentación en este README
- Consulta la [Guía de Supabase](./GUIA_SUPABASE.md)
- Abre un issue en GitHub
- Contacta al equipo de desarrollo

## 🎉 Créditos

Desarrollado como parte del proyecto de **Digitalización Institucional** para instituciones educativas colombianas.

---

**¡Gracias por usar el Sistema de Matrícula Digital!** 🚀
