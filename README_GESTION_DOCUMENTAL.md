# 📁 Módulo de Gestión Documental

Sistema completo de gestión de documentos institucionales para estudiantes.

## 🎯 Características

### 📤 Subida de Documentos

- **Tipos de documento soportados**:
  - 📋 Admisión
  - ✅ Paz y Salvo
  - 🆔 Carnet
  - 📜 Certificado
  - 📊 Boletín
  - 📄 Otro

- **Formatos aceptados**:
  - PDF (`.pdf`)
  - Word (`.doc`, `.docx`)
  - Imágenes (`.jpg`, `.jpeg`, `.png`)

- **Validaciones**:
  - Tamaño máximo: 10MB por archivo
  - Validación de formato
  - Asignación obligatoria de estudiante y tipo

### 🗂️ Organización

- **Por estudiante**: Cada estudiante tiene su propia carpeta
- **Por tipo**: Clasificación automática por tipo de documento
- **Metadata completa**: Nombre, tamaño, tipo MIME, fecha de carga

### 📊 Visualización

- **Tabla completa** con:
  - Nombre del estudiante
  - Número de documento
  - Grado
  - Tipo de documento
  - Nombre del archivo
  - Tamaño del archivo
  - Fecha y hora de carga
  - Estado actual

- **Estadísticas en tiempo real**:
  - Total de documentos
  - Documentos pendientes
  - Documentos aprobados
  - Documentos rechazados

### 🔍 Filtros Avanzados

Filtra documentos por:
- **Estudiante**: Busca por nombre o número de documento
- **Tipo de documento**: Selecciona un tipo específico
- **Estado**: Pendiente, aprobado o rechazado
- **Rango de fechas**: Desde - hasta

Con contador de resultados filtrados.

### ⚡ Acciones

Para cada documento:
- 👁️ **Ver**: Abre el documento en una nueva pestaña
- ⬇️ **Descargar**: Descarga el archivo
- ✅ **Cambiar estado**: Pendiente → Aprobado → Rechazado
- 🗑️ **Eliminar**: Borra el documento (con confirmación)

### 🎨 Estados de Documento

- 🟡 **Pendiente**: Documento subido, esperando revisión
- 🟢 **Aprobado**: Documento validado y aprobado
- 🔴 **Rechazado**: Documento rechazado (requiere resubida)

## 🗄️ Estructura de Datos

### Tabla `documentos`

```sql
CREATE TABLE documentos (
    id UUID PRIMARY KEY,
    estudiante_id UUID REFERENCES estudiantes(id),
    tipo_documento VARCHAR(50),
    nombre_archivo VARCHAR(255),
    url_archivo TEXT,
    tamanio_bytes BIGINT,
    mime_type VARCHAR(100),
    estado VARCHAR(20),
    observaciones TEXT,
    fecha_carga TIMESTAMP,
    fecha_revision TIMESTAMP,
    revisado_por VARCHAR(255)
);
```

### Vista `vista_documentos_completos`

Combina información de documentos con datos del estudiante:
- Información completa del estudiante
- Detalles del documento
- Estado y fechas
- Número de matrícula activa

## 🚀 Uso

### Subir un Documento

1. Haz clic en **"Subir Documento"**
2. Selecciona el estudiante
3. Selecciona el tipo de documento
4. Elige el archivo (máx 10MB)
5. Haz clic en **"Subir Documento"**

### Filtrar Documentos

1. Usa los campos de filtro en la sección superior
2. Ingresa criterios de búsqueda
3. Los resultados se actualizan automáticamente
4. Usa **"Limpiar filtros"** para resetear

### Cambiar Estado

1. En la tabla, localiza el documento
2. Usa el dropdown de estado
3. Selecciona el nuevo estado
4. El cambio se guarda automáticamente

### Descargar Documento

1. Haz clic en el ícono de descarga (⬇️)
2. El archivo se descarga con su nombre original

### Eliminar Documento

1. Haz clic en el ícono de eliminar (🗑️)
2. Confirma la acción
3. El documento se elimina de Storage y de la base de datos

## 🔐 Seguridad

### Storage (Supabase)

Los archivos se almacenan en Supabase Storage:
- Bucket: `documentos-estudiantes`
- Organización: `{estudiante_id}/{tipo}_{timestamp}.{ext}`
- URLs públicas para acceso controlado

### Políticas RLS

- ✅ Lectura pública (para visualizar documentos)
- ✅ Inserción permitida (para subir archivos)
- ✅ Actualización permitida (para cambiar estados)
- ✅ Eliminación permitida (para administradores)

### Validaciones

- Tamaño máximo de archivo: 10MB
- Tipos MIME permitidos configurables
- Verificación de estudiante existente
- Confirmación antes de eliminar

## 📱 Responsividad

El módulo se adapta a diferentes pantallas:

- **Escritorio (>1024px)**: Tabla completa con todas las columnas
- **Tablet (768-1024px)**: Tabla optimizada con columnas prioritarias
- **Móvil (<768px)**: Vista de tarjetas apiladas

## 🧪 Funciones API Disponibles

### En `supabaseClient.js`:

```javascript
// Obtener todos los estudiantes
await obtenerEstudiantes();

// Subir un documento
await subirDocumento(archivo, estudianteId, tipoDocumento);

// Obtener todos los documentos
await obtenerDocumentos();

// Obtener documentos de un estudiante
await obtenerDocumentosPorEstudiante(estudianteId);

// Actualizar estado
await actualizarEstadoDocumento(docId, estado, observaciones);

// Eliminar documento
await eliminarDocumento(docId, urlArchivo);

// Obtener estadísticas
await obtenerEstadisticasDocumentos();
```

## 🎨 Personalización

### Agregar Nuevos Tipos de Documento

En `GestionDocumental.jsx`, modifica:

```javascript
const tiposDocumento = [
  { value: 'admision', label: 'Admisión' },
  { value: 'paz_y_salvo', label: 'Paz y Salvo' },
  { value: 'carnet', label: 'Carnet' },
  { value: 'certificado', label: 'Certificado' },
  { value: 'boletin', label: 'Boletín' },
  { value: 'nuevo_tipo', label: 'Nuevo Tipo' }, // Agregar aquí
  { value: 'otro', label: 'Otro' }
];
```

Y actualiza la tabla en Supabase:

```sql
ALTER TABLE documentos 
DROP CONSTRAINT documentos_tipo_documento_check;

ALTER TABLE documentos 
ADD CONSTRAINT documentos_tipo_documento_check 
CHECK (tipo_documento IN ('admision', 'paz_y_salvo', 'carnet', 'certificado', 'boletin', 'nuevo_tipo', 'otro'));
```

### Cambiar Tamaño Máximo

En `GestionDocumental.jsx`:

```javascript
// Cambiar de 10MB a 20MB
if (file.size > 20 * 1024 * 1024) {
  setError('El archivo no debe superar los 20MB');
  return;
}
```

Y en el bucket de Supabase Storage.

### Agregar Formatos de Archivo

En el input HTML:

```jsx
<input
  type="file"
  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx" // Agregar nuevos
  ...
/>
```

## 📊 Estadísticas

### Vista de Estadísticas por Tipo

```sql
SELECT * FROM vista_estadisticas_documentos;
```

Retorna:
- Tipo de documento
- Total de documentos
- Cantidad por estado
- Tamaño promedio

### Consultas Útiles

#### Documentos sin revisar
```sql
SELECT * FROM vista_documentos_completos 
WHERE estado = 'pendiente'
ORDER BY fecha_carga ASC;
```

#### Documentos por estudiante
```sql
SELECT 
  nombre_estudiante,
  COUNT(*) as total_docs,
  SUM(CASE WHEN estado = 'aprobado' THEN 1 ELSE 0 END) as aprobados
FROM vista_documentos_completos
GROUP BY estudiante_id, nombre_estudiante;
```

#### Espacio usado por grado
```sql
SELECT 
  grado,
  COUNT(*) as num_documentos,
  SUM(tamanio_bytes) / 1024 / 1024 as total_mb
FROM vista_documentos_completos
GROUP BY grado
ORDER BY total_mb DESC;
```

## 🔧 Mantenimiento

### Limpiar Documentos Antiguos

```javascript
// Eliminar documentos de estudiantes inactivos
const estudiantesInactivos = await supabase
  .from('estudiantes')
  .select('id')
  .eq('estado', 'retirado');

// Eliminar sus documentos
for (const estudiante of estudiantesInactivos) {
  const docs = await obtenerDocumentosPorEstudiante(estudiante.id);
  for (const doc of docs) {
    await eliminarDocumento(doc.id, doc.url_archivo);
  }
}
```

### Backup de Documentos

Desde Supabase:
1. Ve a **Storage** → `documentos-estudiantes`
2. Usa la API de Supabase para descargar todos los archivos
3. O usa la función de backup de tu plan

## 🐛 Solución de Problemas

### Los documentos no se suben

**Causa**: Bucket no configurado o políticas incorrectas

**Solución**: Revisa [supabase_storage_setup.md](./supabase_storage_setup.md)

### Error "File too large"

**Causa**: Archivo supera el límite

**Solución**: Comprime el archivo o aumenta el límite

### Los documentos no se muestran

**Causa**: Vista no creada o query incorrecta

**Solución**: Ejecuta el SQL completo de `supabase_schema.sql`

### Error de permisos al eliminar

**Causa**: Políticas RLS restrictivas

**Solución**: Verifica que la política DELETE esté habilitada

## 🚧 Mejoras Futuras

- [ ] Previsualización de documentos (PDF, imágenes)
- [ ] Firma digital en documentos
- [ ] OCR para extraer texto de imágenes
- [ ] Versionado de documentos
- [ ] Comentarios y anotaciones
- [ ] Notificaciones al cambiar estado
- [ ] Exportación masiva (ZIP)
- [ ] Plantillas de documentos
- [ ] Integración con Google Drive
- [ ] Compresión automática de imágenes

## 📚 Referencias

- [Supabase Storage](https://supabase.com/docs/guides/storage)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [File Upload Best Practices](https://supabase.com/docs/guides/storage/uploads)

---

**¿Necesitas ayuda?** Consulta la documentación o contacta al equipo de desarrollo.
