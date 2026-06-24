# 👤 Módulo de Perfil Integral del Estudiante

Componente completo para visualizar y editar toda la información de un estudiante en un solo lugar.

## 🎯 Características

### 📋 Tres Secciones Principales

#### 1. **Información Académica** (Azul)
- ✏️ Grado (editable inline)
- ✏️ Grupo (editable inline)
- ✏️ Director de Grupo (editable inline)
- 📅 Fecha de Nacimiento (solo lectura)
- 🎂 Edad calculada automáticamente

#### 2. **Información Familiar** (Púrpura)
- ✏️ Nombre del Acudiente (editable inline)
- 📄 Documento del Acudiente (solo lectura)
- ✏️ Parentesco (editable inline)
- ✏️ Teléfono (editable inline)
- ✏️ Correo Electrónico (editable inline)

#### 3. **Información Administrativa** (Verde)
- 📊 Estado de Matrícula (activa, cancelada, graduado)
- 🔢 Número de Matrícula
- 📆 Año Lectivo
- 📁 Estadísticas de Documentos:
  - Documentos subidos
  - Documentos pendientes
  - Documentos rechazados
- ⚠️ Alertas de documentos requeridos
- ✏️ Observaciones (editable inline con textarea)

### ✨ Funcionalidades Especiales

#### 🔄 Edición Inline
- **Hover para editar**: Al pasar el mouse sobre un campo, aparece el ícono de edición
- **Modo edición**: Click en el ícono para activar el campo editable
- **Guardar/Cancelar**: Botones de confirmación o cancelación
- **Actualización automática**: Los cambios se guardan en Supabase inmediatamente
- **Feedback visual**: Mensajes de éxito o error

#### 🎨 Diseño en Tarjetas
- **Layout en 3 columnas** (escritorio)
- **Tarjetas independientes** para cada sección
- **Iconos coloridos** para identificar cada sección
- **Gradiente en el header** con foto del estudiante
- **Estado visual** del estudiante (activo, inactivo, retirado)

#### 📊 Historial de Documentos
- Tabla completa de todos los documentos subidos
- Información de fecha, estado y tipo
- Enlaces directos para ver documentos
- Estados visuales con colores

### 🔍 Búsqueda de Estudiante

Si no se proporciona un ID de estudiante, el componente muestra:
- Campo de búsqueda
- Opción de buscar por ID o número de documento
- Interfaz clara y sencilla

## 🗄️ Datos Mostrados

### Header Principal
- Avatar con inicial del nombre
- Nombre completo del estudiante
- Tipo y número de documento
- Edad y grado
- Badge de estado (activo/inactivo/retirado)

### Información Académica
```
- Grado: 8°
- Grupo: A
- Director de Grupo: Prof. Juan Pérez
- Fecha de Nacimiento: 15 de mayo de 2010
- Edad: 14 años
```

### Información Familiar
```
- Acudiente: María García López
- Documento: 9876543210
- Parentesco: Madre
- Teléfono: 3001234567
- Correo: maria.garcia@email.com
```

### Información Administrativa
```
- Estado de Matrícula: Activa
- Número de Matrícula: 2026-1234
- Año Lectivo: 2026
- Documentos:
  • Subidos: 5
  • Pendientes: 2
  • Rechazados: 0
- Documentos Requeridos:
  ⚠️ admision
  ⚠️ carnet
```

## 🔧 Uso del Componente

### Importación

```javascript
import PerfilEstudiante from './components/PerfilEstudiante';
```

### Con ID de Estudiante Conocido

```jsx
<PerfilEstudiante estudianteId="uuid-del-estudiante" />
```

### Sin ID (Con Búsqueda)

```jsx
<PerfilEstudiante />
```

Esto mostrará una interfaz de búsqueda donde el usuario puede ingresar el ID o documento del estudiante.

## 📱 Responsividad

### Escritorio (>1024px)
- **3 columnas** lado a lado
- Máximo aprovechamiento del espacio
- Todas las secciones visibles simultáneamente

### Tablet (768-1024px)
- **2 columnas** con wrap
- Diseño adaptado
- Scroll vertical suave

### Móvil (<768px)
- **1 columna** apilada
- Tarjetas completas
- Navegación vertical

## 🎨 Componentes Visuales

### CampoEditable

Componente interno para campos editables inline:

```jsx
<CampoEditable
  seccion="estudiante"
  campo="grado"
  valor={perfil?.grado}
  tipo="text"
  label="Grado"
  placeholder="Ejemplo: 8°"
/>
```

**Tipos soportados:**
- `text` - Campo de texto simple
- `email` - Campo de correo
- `tel` - Campo de teléfono
- `textarea` - Área de texto multilínea

### Estados de Campo

- **Vista**: Muestra el valor con hover para editar
- **Edición**: Input/textarea con botones guardar/cancelar
- **Guardando**: Indicador de carga (opcional)
- **Error**: Mensaje de error si falla

## 🔐 Seguridad y Validación

### Campos Editables
Solo los campos marcados como editables pueden modificarse:
- ✅ Grado, grupo, director de grupo
- ✅ Información de contacto del acudiente
- ✅ Observaciones
- ❌ Documento del estudiante (inmutable)
- ❌ Fecha de nacimiento (inmutable)
- ❌ Número de matrícula (generado automáticamente)

### Validación
- Frontend: Validación básica en el cliente
- Backend: Validación en Supabase con constraints
- RLS: Políticas de seguridad configuradas

## 📊 Funciones API Utilizadas

```javascript
// Obtener perfil completo
const perfil = await obtenerPerfilEstudiante(estudianteId);

// Actualizar estudiante
await actualizarEstudiante(estudianteId, {
  grado: '9°',
  grupo: 'B'
});

// Actualizar acudiente
await actualizarAcudiente(acudienteId, {
  telefono: '3001234567',
  correo_electronico: 'nuevo@email.com'
});

// Obtener documentos del estudiante
const docs = await obtenerDocumentosPorEstudiante(estudianteId);
```

## 🎯 Cálculos Automáticos

### Edad del Estudiante
```javascript
const calcularEdad = (fechaNacimiento) => {
  const hoy = new Date();
  const nac = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nac.getFullYear();
  const mes = hoy.getMonth() - nac.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nac.getDate())) {
    edad--;
  }
  return edad;
};
```

### Documentos Pendientes
```javascript
const obtenerDocumentosPendientes = () => {
  const tiposRequeridos = ['admision', 'carnet', 'certificado'];
  const tiposSubidos = documentos.map(d => d.tipo_documento);
  return tiposRequeridos.filter(tipo => !tiposSubidos.includes(tipo));
};
```

## 🎨 Personalización

### Cambiar Colores de Sección

```jsx
// Académica (Azul → Verde)
<div className="p-2 bg-green-100 rounded-lg">
  <svg className="w-6 h-6 text-green-600" ... />
</div>

// Familiar (Púrpura → Naranja)
<div className="p-2 bg-orange-100 rounded-lg">
  <svg className="w-6 h-6 text-orange-600" ... />
</div>
```

### Agregar Nuevos Campos

1. **Actualizar schema SQL**:
```sql
ALTER TABLE estudiantes ADD COLUMN nuevo_campo VARCHAR(255);
```

2. **Agregar en el componente**:
```jsx
<div>
  <label className="block text-sm font-medium text-gray-500 mb-1">
    Nuevo Campo
  </label>
  <CampoEditable
    seccion="estudiante"
    campo="nuevo_campo"
    valor={perfil?.nuevo_campo}
    label="Nuevo Campo"
    placeholder="Valor"
  />
</div>
```

### Documentos Requeridos

Modifica el array en `obtenerDocumentosPendientes()`:

```javascript
const tiposRequeridos = [
  'admision',
  'carnet',
  'certificado',
  'paz_y_salvo',  // Agregar nuevo
  'boletin'        // Agregar nuevo
];
```

## 🔄 Flujo de Edición

1. **Usuario hace hover** sobre un campo editable
2. **Aparece ícono de edición** (lápiz)
3. **Usuario hace click** en el ícono
4. **Campo se convierte en input** con el valor actual
5. **Usuario modifica** el valor
6. **Usuario hace click** en guardar (✓) o cancelar (✗)
7. **Si guarda**:
   - Se envía petición a Supabase
   - Se actualiza el estado local
   - Se muestra mensaje de éxito
   - Campo vuelve a modo vista
8. **Si cancela**:
   - Se descarta el cambio
   - Campo vuelve a valor original
   - Sin petición al servidor

## 🐛 Manejo de Errores

### Errores Comunes

**Estudiante no encontrado**
```
Error: Estudiante no encontrado
→ Verificar que el ID sea correcto
→ Verificar que el estudiante exista en la BD
```

**Error al guardar cambios**
```
Error: Error al guardar: [mensaje]
→ Verificar conexión a Supabase
→ Verificar políticas RLS
→ Verificar validación de datos
```

**Sin documentos**
```
Estado: No hay documentos cargados
→ Normal para estudiantes nuevos
→ Dirigir a módulo de gestión documental
```

## 📊 Integración con Otros Módulos

### Con Matrícula Digital
- Al crear matrícula, se crea el perfil
- Información familiar vinculada
- Número de matrícula mostrado

### Con Gestión Documental
- Documentos del estudiante listados
- Estados actualizados en tiempo real
- Enlaces directos a documentos

### Flujo Completo
```
1. Matrícula → Crea estudiante y acudiente
2. Gestión Documental → Sube documentos requeridos
3. Perfil Estudiante → Visualiza todo en un lugar
4. Edición Inline → Actualiza información necesaria
```

## 🚧 Mejoras Futuras

- [ ] Subida de foto de perfil
- [ ] Historial de cambios en el perfil
- [ ] Notificaciones de documentos vencidos
- [ ] Exportar perfil a PDF
- [ ] Gráficas de rendimiento académico
- [ ] Timeline de eventos del estudiante
- [ ] Integración con calificaciones
- [ ] Chat con el acudiente
- [ ] Firma digital en observaciones
- [ ] Comparación año a año

## 💡 Tips de Uso

### Para Administradores
- Revisa documentos pendientes regularmente
- Usa observaciones para notas importantes
- Actualiza director de grupo al inicio del año
- Verifica información de contacto actualizada

### Para Docentes
- Consulta información familiar cuando necesites contactar
- Revisa observaciones administrativas
- Verifica estado de matrícula antes de procesos

### Para Acudientes (vista futura)
- Mantén tu información de contacto actualizada
- Revisa documentos pendientes
- Consulta observaciones regularmente

## 📚 Referencias

- [React Hooks](https://react.dev/reference/react)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase Client](https://supabase.com/docs/reference/javascript)

---

**¿Necesitas ayuda?** Consulta la documentación o contacta al equipo de desarrollo.
