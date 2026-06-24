# 🏢 Sistema Multiinstitucional con Planes

Sistema completo de gestión de múltiples instituciones educativas con control de acceso basado en planes contratados.

## 🎯 Características del Sistema

### 📊 **4 Planes Disponibles**

#### 1. **Plan Esencial** - Digitalización Básica
**Precio:** Base de referencia

**Módulos Incluidos:**
- ✅ Matrícula Digital (inscripción, renovación, actualización)
- ✅ Perfil Integral del Estudiante
- ✅ Gestión Documental
- ✅ Control de Asistencia
- ✅ Registro de Calificaciones
- ✅ Comunicados Institucionales
- ✅ Biblioteca Digital
- ✅ Aplicación Móvil

**Ideal para:** Instituciones que buscan digitalización básica completa.

---

#### 2. **Plan Smart** - Campus Conectado
**Precio:** $4.000.000/mes

**Incluye todo el Plan Esencial más:**
- ✅ Encuestas Institucionales
- ✅ Gobierno Escolar Digital
- ✅ Sistema de Reconocimientos
- ✅ Gestión de Eventos con QR
- ✅ Sistema PQRS
- ✅ Chatbot Institucional

**Ideal para:** Instituciones que quieren herramientas sociales y de participación.

---

#### 3. **Plan Campus IA** - Inteligencia Institucional
**Precio:** $5.500.000/mes

**Incluye todo el Plan Smart más:**
- ✅ Asistente con IA Personalizado
- ✅ OVAs Generados por IA
- ✅ Analítica Avanzada
- ✅ Informes Narrativos Automáticos
- ✅ IA Entrenada con Documentos Propios (RAG)

**Ideal para:** Instituciones que buscan automatización inteligente.

---

#### 4. **Plan Enterprise** - Ecosistema Autónomo
**Precio:** $7.000.000/mes

**Incluye todo el Plan Campus IA más:**
- ✅ Agente de WhatsApp con IA
- ✅ Agente de Voz Telefónico
- ✅ Analítica Predictiva
- ✅ Automatización de Flujos
- ✅ Firma Digital
- ✅ API e Integraciones
- ✅ Desarrollo Personalizado

**Ideal para:** Instituciones grandes que necesitan el ecosistema completo.

---

## 🗄️ Arquitectura de Base de Datos

### Tabla: `instituciones`

```sql
CREATE TABLE instituciones (
    id UUID PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    nit VARCHAR(20) UNIQUE NOT NULL,
    direccion TEXT,
    telefono VARCHAR(20),
    email VARCHAR(255),
    logo_url TEXT,
    plan VARCHAR(20) NOT NULL CHECK (plan IN ('esencial', 'smart', 'campus_ia', 'enterprise')),
    fecha_suscripcion DATE DEFAULT CURRENT_DATE,
    estado VARCHAR(20) DEFAULT 'activa' CHECK (estado IN ('activa', 'suspendida', 'cancelada')),
    configuracion JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Relaciones

Todas las entidades principales están relacionadas con `instituciones`:

- `estudiantes.institucion_id` → `instituciones.id`
- `acudientes` (a través de estudiantes)
- `matriculas` (a través de estudiantes)
- `documentos` (a través de estudiantes)

Esto asegura **aislamiento completo de datos** entre instituciones.

---

## 🎨 Interfaz de Usuario

### Menú Lateral Inteligente

El menú lateral (`MenuLateral.jsx`) se adapta automáticamente según el plan:

#### **Módulos Disponibles**
- ✅ Se muestran con color normal
- ✅ Son clicables
- ✅ Incluyen descripción al pasar el mouse

#### **Módulos Bloqueados**
- 🔒 Se muestran en gris con ícono de candado
- 🔒 Incluyen texto "Disponible en Plan X"
- 🔒 Al hacer click, muestran modal de upgrade
- 🔒 Tooltip con información del plan requerido

### Características del Menú

#### **Modo Expandido**
- Logo y nombre de la institución
- Plan actual visible
- Módulos agrupados por categoría
- Descripciones completas
- Botón de "Ver Planes" al final

#### **Modo Contraído**
- Solo iconos
- Tooltips al hacer hover
- Más espacio para contenido

#### **Agrupación por Categorías**
```
📚 Gestión Básica
  - Matrícula Digital
  - Perfil Estudiante
  - Gestión Documental
  - ...

🌐 Campus Conectado (Smart)
  - Encuestas
  - Gobierno Escolar
  - Reconocimientos
  - ...

🤖 Inteligencia Artificial (Campus IA)
  - Asistente con IA
  - OVAs Inteligentes
  - Analítica Avanzada
  - ...

🚀 Ecosistema Autónomo (Enterprise)
  - Agente WhatsApp
  - Agente de Voz
  - Analítica Predictiva
  - ...
```

---

## 🔧 Configuración de Módulos

### Archivo: `src/config/planesModulos.js`

Este archivo define todos los módulos y su disponibilidad:

```javascript
export const MODULOS = {
  MATRICULA: {
    id: 'matricula',
    nombre: 'Matrícula Digital',
    descripcion: 'Inscripción, renovación y actualización',
    icono: 'document',
    planMinimo: PLANES.ESENCIAL,  // ← Plan requerido
    ruta: '/matricula',
    categoria: 'Gestión Básica'
  },
  // ... más módulos
};
```

### Funciones Útiles

```javascript
// Obtener módulos disponibles para un plan
const modulosDisponibles = obtenerModulosDisponibles('smart');

// Verificar si un módulo está disponible
const disponible = esModuloDisponible('encuestas', 'esencial'); // false

// Obtener plan requerido para un módulo
const planRequerido = obtenerPlanRequerido('asistente-ia', 'smart'); // 'campus_ia'

// Agrupar módulos por categoría
const agrupados = agruparModulosPorCategoria('smart');
```

---

## 💻 Implementación en el Frontend

### 1. Obtener Plan de la Institución

```javascript
import { obtenerInstitucionActual } from './utils/supabaseClient';

// En el componente principal
useEffect(() => {
  const cargarInstitucion = async () => {
    const institucion = await obtenerInstitucionActual(institucionId);
    setPlanActual(institucion.plan);
  };
  cargarInstitucion();
}, []);
```

### 2. Renderizar Menú Según Plan

```jsx
<MenuLateral
  planActual={planActual}
  onNavegar={handleNavegar}
  vistaActual={vistaActual}
  onSolicitarUpgrade={handleSolicitarUpgrade}
/>
```

### 3. Proteger Rutas

```javascript
import { esModuloDisponible } from './config/planesModulos';

const renderContenido = () => {
  if (!esModuloDisponible(vistaActual, planActual)) {
    return <PaginaBloqueada planRequerido={obtenerPlanRequerido(vistaActual, planActual)} />;
  }
  
  // Renderizar módulo
  switch (vistaActual) {
    case 'matricula':
      return <MatriculaForm />;
    // ...
  }
};
```

---

## 🔐 Seguridad y Aislamiento

### Row Level Security (RLS)

Todas las consultas deben filtrar por `institucion_id`:

```sql
-- Ejemplo de política RLS
CREATE POLICY "Usuarios solo ven datos de su institución"
ON estudiantes
FOR SELECT
USING (institucion_id = current_setting('app.current_institution_id')::UUID);
```

### En el Cliente

```javascript
// Siempre incluir institucion_id en las consultas
const { data } = await supabase
  .from('estudiantes')
  .select('*')
  .eq('institucion_id', institucionId);
```

---

## 📊 Flujo de Upgrade

### 1. Usuario ve módulo bloqueado

El menú muestra:
```
🔒 Encuestas
   Disponible en Plan Smart
```

### 2. Usuario hace click

Se abre modal con:
- Nombre del plan requerido
- Precio mensual
- Lista de características incluidas
- Botón "Solicitar Upgrade"

### 3. Solicitud enviada

```javascript
const handleSolicitarUpgrade = async (planSolicitado) => {
  // Enviar notificación al equipo de ventas
  await enviarSolicitudUpgrade({
    institucionId,
    planActual,
    planSolicitado,
    contacto: institucion.email
  });
  
  // Mostrar confirmación al usuario
  alert('Solicitud enviada. Un asesor se contactará pronto.');
};
```

### 4. Aprobación y activación

Una vez aprobado:
```javascript
await actualizarPlanInstitucion(institucionId, 'smart');
```

El menú se actualiza automáticamente y los nuevos módulos están disponibles.

---

## 🎯 Casos de Uso

### Institución Nueva

1. Se crea con Plan Esencial por defecto
2. Usa módulos básicos durante periodo de prueba
3. Solicita upgrade según necesidades
4. Se activa plan superior tras pago

### Institución Existente

1. Ya tiene plan activo
2. Ve módulos de su plan + bloqueados de planes superiores
3. Puede solicitar upgrade en cualquier momento
4. Downgrade también posible (con confirmación)

### Suspensión de Cuenta

```javascript
// Si la institución suspende pago
await supabase
  .from('instituciones')
  .update({ estado: 'suspendida' })
  .eq('id', institucionId);

// El sistema puede bloquear acceso o limitar funcionalidades
```

---

## 🧪 Modo Demo

El sistema incluye un selector de plan para demostración:

```jsx
<select value={planActual} onChange={(e) => setPlanActual(e.target.value)}>
  <option value="esencial">Esencial</option>
  <option value="smart">Smart</option>
  <option value="campus_ia">Campus IA</option>
  <option value="enterprise">Enterprise</option>
</select>
```

Esto permite:
- Probar diferentes planes sin BD
- Demos comerciales
- Testing de interfaz

**⚠️ En producción, remover este selector y obtener plan desde Supabase.**

---

## 📈 Analítica de Planes

### Consultas Útiles

#### Instituciones por plan
```sql
SELECT 
  plan,
  COUNT(*) as total,
  SUM(CASE WHEN estado = 'activa' THEN 1 ELSE 0 END) as activas
FROM instituciones
GROUP BY plan;
```

#### Ingresos proyectados
```sql
SELECT 
  plan,
  COUNT(*) as instituciones,
  CASE 
    WHEN plan = 'smart' THEN COUNT(*) * 4000000
    WHEN plan = 'campus_ia' THEN COUNT(*) * 5500000
    WHEN plan = 'enterprise' THEN COUNT(*) * 7000000
    ELSE 0
  END as ingreso_mensual
FROM instituciones
WHERE estado = 'activa'
GROUP BY plan;
```

#### Solicitudes de upgrade
```sql
-- Crear tabla de solicitudes
CREATE TABLE solicitudes_upgrade (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institucion_id UUID REFERENCES instituciones(id),
  plan_actual VARCHAR(20),
  plan_solicitado VARCHAR(20),
  fecha_solicitud TIMESTAMP DEFAULT NOW(),
  estado VARCHAR(20) DEFAULT 'pendiente'
);
```

---

## 🚀 Próximos Pasos

### Para Implementación Completa

1. **Autenticación Multi-tenancy**
   - Identificar institución del usuario autenticado
   - Guardar `institucion_id` en sesión

2. **RLS Completo**
   - Aplicar políticas a todas las tablas
   - Testing exhaustivo de aislamiento

3. **Facturación**
   - Integración con pasarela de pago
   - Generación de facturas
   - Recordatorios de pago

4. **Panel de Administración**
   - Gestión de instituciones (superadmin)
   - Estadísticas globales
   - Activación/desactivación de planes

5. **Notificaciones**
   - Email al solicitar upgrade
   - Alertas de vencimiento
   - Confirmaciones de cambio de plan

---

## 📚 Archivos Clave

```
src/
├── config/
│   └── planesModulos.js          # Definición de módulos y planes
├── components/
│   ├── MenuLateral.jsx           # Menú con control de acceso
│   ├── MatriculaForm.jsx
│   ├── GestionDocumental.jsx
│   └── PerfilEstudiante.jsx
├── utils/
│   └── supabaseClient.js         # Funciones de instituciones
└── App.jsx                        # App principal con selector demo

supabase_schema.sql                # Schema con tabla instituciones
```

---

## 💡 Tips de Desarrollo

### Agregar Nuevo Módulo

1. **Definir en `planesModulos.js`**:
```javascript
NUEVO_MODULO: {
  id: 'nuevo-modulo',
  nombre: 'Nuevo Módulo',
  descripcion: 'Descripción',
  icono: 'lightning',
  planMinimo: PLANES.SMART,  // Plan requerido
  ruta: '/nuevo-modulo',
  categoria: 'Campus Conectado'
}
```

2. **Crear componente**: `src/components/NuevoModulo.jsx`

3. **Agregar en App.jsx**:
```javascript
case 'nuevo-modulo':
  return <NuevoModulo />;
```

4. El menú lo mostrará automáticamente según el plan.

### Cambiar Plan de un Módulo

Simplemente cambia `planMinimo` en la definición:

```javascript
ENCUESTAS: {
  // ...
  planMinimo: PLANES.ESENCIAL  // Era SMART, ahora ESENCIAL
}
```

---

## 🆘 Soporte

¿Preguntas sobre el sistema de planes?
- Revisa `README_SISTEMA_PLANES.md`
- Consulta `planesModulos.js`
- Contacta al equipo de desarrollo

---

**Sistema listo para comercialización SaaS** 🚀
