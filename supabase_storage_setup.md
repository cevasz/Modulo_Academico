# Configuración de Supabase Storage para Documentos

## 📦 Paso 1: Crear el Bucket de Storage

1. Ve a tu proyecto en [Supabase](https://app.supabase.com)
2. En el menú lateral, haz clic en **"Storage"**
3. Haz clic en **"Create a new bucket"**
4. Configura el bucket:
   - **Name**: `documentos-estudiantes`
   - **Public bucket**: ✅ Activado (para permitir acceso público a los documentos)
   - **File size limit**: 10MB (o el límite que prefieras)
   - **Allowed MIME types**: `application/pdf, image/jpeg, image/png, image/jpg, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document`

5. Haz clic en **"Create bucket"**

## 🔐 Paso 2: Configurar Políticas de Seguridad

### Opción A: Usar el SQL Editor (Recomendado)

Copia y ejecuta este SQL en el **SQL Editor** de Supabase:

```sql
-- ============================================
-- POLÍTICAS DE STORAGE PARA DOCUMENTOS
-- ============================================

-- Política: Permitir lectura pública de documentos
CREATE POLICY "Lectura pública de documentos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'documentos-estudiantes');

-- Política: Permitir subida de archivos (usuarios autenticados o público)
CREATE POLICY "Permitir subida de documentos"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'documentos-estudiantes');

-- Política: Permitir actualización de documentos
CREATE POLICY "Permitir actualización de documentos"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'documentos-estudiantes');

-- Política: Permitir eliminación de documentos
CREATE POLICY "Permitir eliminación de documentos"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'documentos-estudiantes');
```

### Opción B: Usar la Interfaz de Supabase

1. En **Storage**, selecciona el bucket `documentos-estudiantes`
2. Ve a la pestaña **"Policies"**
3. Crea las siguientes políticas:

#### Política de Lectura
- **Policy name**: `Lectura pública`
- **Operation**: `SELECT`
- **Target roles**: `public`
- **USING expression**: `bucket_id = 'documentos-estudiantes'`

#### Política de Inserción
- **Policy name**: `Permitir subida`
- **Operation**: `INSERT`
- **Target roles**: `public`
- **WITH CHECK expression**: `bucket_id = 'documentos-estudiantes'`

#### Política de Actualización
- **Policy name**: `Permitir actualización`
- **Operation**: `UPDATE`
- **Target roles**: `public`
- **USING expression**: `bucket_id = 'documentos-estudiantes'`

#### Política de Eliminación
- **Policy name**: `Permitir eliminación`
- **Operation**: `DELETE`
- **Target roles**: `public`
- **USING expression**: `bucket_id = 'documentos-estudiantes'`

## 📁 Paso 3: Estructura de Carpetas

Los archivos se organizarán automáticamente así:

```
documentos-estudiantes/
├── {estudiante_id_1}/
│   ├── admision_1234567890.pdf
│   ├── carnet_1234567891.jpg
│   └── certificado_1234567892.pdf
├── {estudiante_id_2}/
│   ├── admision_1234567893.pdf
│   └── paz_y_salvo_1234567894.pdf
└── ...
```

Cada estudiante tiene su propia carpeta identificada por su UUID.

## 🧪 Paso 4: Probar la Configuración

### Prueba 1: Subir un archivo de prueba

1. Ve a **Storage** → `documentos-estudiantes`
2. Haz clic en **"Upload file"**
3. Sube cualquier archivo de prueba
4. Verifica que se suba correctamente

### Prueba 2: Obtener URL pública

En el SQL Editor, ejecuta:

```sql
-- Obtener URL pública de un archivo
SELECT storage.get_public_url('documentos-estudiantes', 'ruta/del/archivo.pdf');
```

### Prueba 3: Desde la aplicación

1. Inicia tu aplicación: `npm run dev`
2. Ve al módulo de Gestión Documental
3. Intenta subir un documento
4. Verifica que aparezca en la tabla
5. Prueba descargar el documento

## 🔒 Seguridad Adicional (Opcional)

### Limitar subida solo a usuarios autenticados

Si prefieres que solo usuarios autenticados puedan subir archivos:

```sql
-- Eliminar la política pública de inserción
DROP POLICY IF EXISTS "Permitir subida de documentos" ON storage.objects;

-- Crear política solo para autenticados
CREATE POLICY "Subida solo autenticados"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'documentos-estudiantes');
```

### Limitar tamaño de archivo por política

```sql
-- Política con límite de tamaño (10MB)
CREATE POLICY "Subida con límite de tamaño"
ON storage.objects FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'documentos-estudiantes' 
  AND (storage.foldername(name))[1] = auth.uid()::text
  AND octet_length(decode(encode(content, 'base64'), 'base64')) < 10485760
);
```

## 📊 Monitoreo y Mantenimiento

### Ver estadísticas de uso

```sql
-- Total de archivos por tipo
SELECT 
  mime_type,
  COUNT(*) as cantidad,
  SUM(metadata->>'size')::bigint / 1024 / 1024 as total_mb
FROM storage.objects
WHERE bucket_id = 'documentos-estudiantes'
GROUP BY mime_type;

-- Espacio usado por estudiante
SELECT 
  (metadata->>'estudiante_id') as estudiante_id,
  COUNT(*) as num_archivos,
  SUM((metadata->>'size')::bigint) / 1024 / 1024 as total_mb
FROM storage.objects
WHERE bucket_id = 'documentos-estudiantes'
GROUP BY metadata->>'estudiante_id'
ORDER BY total_mb DESC;
```

### Limpiar archivos huérfanos

Archivos que están en Storage pero no en la tabla `documentos`:

```sql
-- Identificar archivos huérfanos
SELECT name, created_at
FROM storage.objects
WHERE bucket_id = 'documentos-estudiantes'
  AND name NOT IN (
    SELECT url_archivo FROM documentos
  );
```

## 🚨 Solución de Problemas

### Error: "new row violates row-level security policy"

**Causa**: Las políticas RLS no están configuradas correctamente.

**Solución**: Verifica que ejecutaste todas las políticas del Paso 2.

### Error: "The resource already exists"

**Causa**: El bucket ya existe.

**Solución**: Usa el bucket existente o elimínalo y créalo de nuevo.

### Error: "Bucket not found"

**Causa**: El nombre del bucket no coincide.

**Solución**: Verifica que en `supabaseClient.js` estés usando `'documentos-estudiantes'` como nombre del bucket.

### Los archivos no se ven

**Causa**: El bucket no es público o las políticas de lectura faltan.

**Solución**: 
1. Verifica que el bucket sea público
2. Ejecuta la política de lectura pública

### Error de CORS al subir archivos

**Causa**: Configuración de CORS en Supabase.

**Solución**: Ve a **Storage** → **Settings** y agrega tu dominio a los orígenes permitidos.

## 📚 Tipos de Archivo Soportados

Por defecto, la aplicación acepta:

- **PDF**: `.pdf`
- **Word**: `.doc`, `.docx`
- **Imágenes**: `.jpg`, `.jpeg`, `.png`

Para agregar más tipos, modifica:

1. El input HTML en `GestionDocumental.jsx`:
   ```jsx
   accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
   ```

2. La configuración del bucket en Supabase (Allowed MIME types)

## 🎯 Límites del Plan Free de Supabase

- **Storage**: 1 GB
- **Bandwidth**: 2 GB/mes
- **File uploads**: Ilimitados

Para más capacidad, considera actualizar a un plan de pago.

## 🔗 Referencias

- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Storage Policies](https://supabase.com/docs/guides/storage/security/access-control)
- [File Upload Best Practices](https://supabase.com/docs/guides/storage/uploads/standard-uploads)

---

Una vez completados estos pasos, tu módulo de gestión documental estará completamente funcional. 🎉
