# 📘 Guía de Configuración de Supabase

Esta guía te ayudará a configurar Supabase para el sistema de matrícula digital paso a paso.

## 🚀 Paso 1: Crear una cuenta en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Haz clic en **"Start your project"** o **"Sign up"**
3. Regístrate con GitHub, Google o email
4. Verifica tu correo electrónico si es necesario

## 📦 Paso 2: Crear un nuevo proyecto

1. En el dashboard de Supabase, haz clic en **"New Project"**
2. Completa la información:
   - **Name**: `matricula-digital` (o el nombre que prefieras)
   - **Database Password**: Genera una contraseña segura (guárdala en un lugar seguro)
   - **Region**: Selecciona la región más cercana (para Colombia: `South America (São Paulo)`)
   - **Pricing Plan**: Selecciona el plan Free (gratis) para empezar

3. Haz clic en **"Create new project"**
4. Espera 2-3 minutos mientras Supabase crea tu proyecto

## 🗄️ Paso 3: Crear la base de datos

### Opción A: Usar el SQL Editor (Recomendado)

1. En el menú lateral, ve a **"SQL Editor"**
2. Haz clic en **"+ New query"**
3. Abre el archivo `supabase_schema.sql` de este proyecto
4. Copia TODO el contenido del archivo
5. Pégalo en el editor de Supabase
6. Haz clic en **"Run"** (botón verde en la esquina inferior derecha)
7. Deberías ver el mensaje: **"Success. No rows returned"**

### Opción B: Usar Table Editor (Manual)

Si prefieres crear las tablas manualmente:

1. Ve a **"Table Editor"** en el menú lateral
2. Crea las siguientes tablas en orden:
   - `estudiantes`
   - `acudientes`
   - `matriculas`
   - `historial_matriculas`

**Nota:** Es más rápido y confiable usar la Opción A.

## 🔑 Paso 4: Obtener tus credenciales

1. En el menú lateral, ve a **"Project Settings"** (ícono de engranaje)
2. Haz clic en **"API"** en el submenú
3. Verás dos valores importantes:

   ```
   Project URL: https://xyzabcdefg.supabase.co
   anon public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

4. **IMPORTANTE**: Copia estos valores, los necesitarás en el siguiente paso

## ⚙️ Paso 5: Configurar las variables de entorno

1. En la raíz del proyecto, crea un archivo llamado `.env`
2. Copia el contenido de `.env.example`
3. Reemplaza los valores con tus credenciales de Supabase:

   ```bash
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

4. Guarda el archivo `.env`

**⚠️ IMPORTANTE**: NUNCA compartas tu archivo `.env` ni lo subas a GitHub. Ya está incluido en `.gitignore` para protegerlo.

## 🔐 Paso 6: Configurar las políticas de seguridad (RLS)

Las políticas de Row Level Security (RLS) ya están incluidas en el archivo `supabase_schema.sql`. El esquema está pensado para datos sensibles de menores de edad, por eso aplica este modelo:

- ✅ El formulario público usa únicamente la función `crear_matricula_publica`.
- ✅ La llave `anon` no tiene lectura directa sobre `estudiantes`, `acudientes`, `matriculas` ni `historial_matriculas`.
- ✅ La lectura y gestión interna requiere usuarios autenticados con rol institucional.
- ✅ No hay políticas de borrado directo; los cambios sensibles deben quedar auditados.
- ✅ Las vistas usan `security_invoker` para respetar las políticas RLS de las tablas base.

### Roles institucionales

Para que un usuario autenticado pueda consultar o administrar datos, configura su metadata en Supabase:

1. Ve a **Authentication** → **Users**
2. Selecciona el usuario
3. En **Raw app metadata**, agrega el rol correspondiente:

```json
{
  "rol": "admin"
}
```

Roles contemplados:

- `admin`: lectura y administración de matrículas.
- `secretaria`: lectura, creación y actualización operativa.
- `directivo`: lectura de matrículas, acudientes, historial y estadísticas.
- `docente`: lectura limitada a estudiantes y matrículas.

### Verificar que RLS está habilitado:

1. Ve a **"Authentication"** → **"Policies"** en Supabase
2. Verifica que cada tabla tenga políticas activas:
   - `estudiantes`: 3 políticas
   - `acudientes`: 3 políticas
   - `matriculas`: 3 políticas
   - `historial_matriculas`: 1 política
3. Ve a **Database** → **Functions** y verifica que `crear_matricula_publica` tenga permiso de ejecución para `anon` y `authenticated`.

## 🧪 Paso 7: Probar la conexión

### Insertar datos de prueba

En el SQL Editor de Supabase, ejecuta:

```sql
-- Insertar estudiante de prueba
INSERT INTO estudiantes (nombre_completo, tipo_documento, numero_documento, fecha_nacimiento, grado)
VALUES ('María González López', 'TI', '1234567890', '2012-03-15', '6°');

-- Insertar acudiente de prueba
INSERT INTO acudientes (nombre_completo, numero_documento, parentesco, telefono, correo_electronico)
VALUES ('Carlos González', '9876543210', 'Padre', '3001234567', 'carlos.gonzalez@email.com');

-- Verificar que se crearon correctamente
SELECT * FROM estudiantes;
SELECT * FROM acudientes;
```

### Verificar desde la aplicación

1. Instala las dependencias:
   ```bash
   npm install
   ```

2. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

3. Abre tu navegador en `http://localhost:5173`
4. Completa el formulario de matrícula
5. Si todo está correcto, deberías ver el mensaje de éxito con el número de matrícula

## 📊 Paso 8: Ver los datos en Supabase

1. Ve a **"Table Editor"** en Supabase
2. Selecciona la tabla `matriculas`
3. Deberías ver tu matrícula recién creada
4. También puedes revisar las tablas `estudiantes` y `acudientes`

### Usar las vistas para consultas complejas

Supabase incluye dos vistas útiles:

#### Vista de matrículas completas
```sql
SELECT * FROM vista_matriculas_completas;
```

Esta vista combina información de estudiantes, acudientes y matrículas en una sola consulta.

#### Vista de estadísticas
```sql
SELECT * FROM vista_estadisticas_matriculas;
```

Muestra estadísticas agregadas por año lectivo.

## 🔧 Configuraciones adicionales (Opcionales)

### Configurar email automático

1. Ve a **"Authentication"** → **"Email Templates"**
2. Personaliza las plantillas de correo
3. Configura tu proveedor SMTP personalizado si lo deseas

### Habilitar autenticación (para panel administrativo)

1. Ve a **"Authentication"** → **"Providers"**
2. Habilita los métodos de autenticación que desees:
   - Email/Password
   - Google
   - GitHub
   - etc.

### Configurar Storage (para documentos)

1. Ve a **"Storage"** en el menú lateral
2. Crea un bucket llamado `documentos-matricula`
3. Configura las políticas de acceso según tus necesidades

## 🐛 Solución de problemas

### Error: "Invalid API key"
- Verifica que copiaste correctamente las credenciales
- Asegúrate de usar la clave `anon public` (no `service_role`)
- Verifica que el archivo `.env` esté en la raíz del proyecto

### Error: "relation does not exist"
- Las tablas no se crearon correctamente
- Vuelve a ejecutar el archivo `supabase_schema.sql` completo
- Verifica que no haya errores en el SQL Editor

### Error: "Row Level Security policy violation"
- Verifica que RLS esté habilitado
- Revisa que las políticas se hayan creado correctamente
- Ejecuta nuevamente las políticas del archivo SQL

### Los datos no se guardan
- Abre la consola del navegador (F12) para ver errores
- Verifica la conexión a internet
- Revisa que las credenciales en `.env` sean correctas
- Verifica que el proyecto de Supabase esté activo (no pausado)

## 📚 Recursos adicionales

- [Documentación oficial de Supabase](https://supabase.com/docs)
- [Guía de Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Tutorial de React + Supabase](https://supabase.com/docs/guides/getting-started/tutorials/with-react)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)

## 🎉 ¡Listo!

Tu sistema de matrícula digital ahora está conectado a Supabase y listo para usar. Los datos se guardan de forma segura en la nube y puedes acceder a ellos desde cualquier lugar.

### Próximos pasos sugeridos:

1. Personalizar el diseño del formulario
2. Agregar validación de documentos duplicados
3. Implementar panel administrativo
4. Agregar funcionalidad de búsqueda
5. Generar reportes en PDF
6. Configurar copias de seguridad automáticas

---

**¿Necesitas ayuda?** Revisa la documentación oficial o contacta al equipo de soporte.
