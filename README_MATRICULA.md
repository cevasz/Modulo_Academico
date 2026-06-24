# Formulario de Matrícula Digital

Sistema de matrícula digital para instituciones educativas colombianas, desarrollado con React y Tailwind CSS.

## 🎯 Características

### Tres Tipos de Operación
- **Inscripción Nueva**: Para estudiantes que ingresan por primera vez a la institución
- **Renovación**: Para estudiantes que renuevan matrícula de años anteriores
- **Actualización**: Para actualizar datos de estudiantes activos

### Validaciones Implementadas

#### Datos del Estudiante
- **Nombre**: Mínimo 3 caracteres, obligatorio
- **Documento**: 7-11 dígitos numéricos, obligatorio
- **Fecha de Nacimiento**: Edad entre 3 y 20 años, obligatorio
- **Grado**: Selección desde Preescolar hasta 11°, obligatorio

#### Datos del Acudiente
- **Nombre**: Mínimo 3 caracteres, obligatorio
- **Documento**: 7-11 dígitos numéricos, obligatorio
- **Parentesco**: Selección requerida (Padre, Madre, Abuelo/a, Tío/a, Hermano/a, Otro)
- **Teléfono**: 10 dígitos, debe iniciar con 3 (formato celular colombiano), obligatorio
- **Correo**: Formato de email válido, obligatorio

#### Validaciones Específicas
- **Renovación**: Requiere número de matrícula anterior
- **Feedback inmediato**: Los errores se muestran en tiempo real al completar campos
- **Prevención de envío**: El formulario no se envía si hay errores

### Funcionalidades

✅ **Generación automática de número de matrícula**
- Formato: AAAA-XXXX (año + número aleatorio de 4 dígitos)
- Ejemplo: 2026-1234

✅ **Pantalla de confirmación**
- Resumen completo de datos ingresados
- Número de matrícula generado destacado
- Información sobre próximos pasos
- Opción de realizar nueva matrícula

✅ **Diseño responsivo**
- Adaptado a móviles, tablets y escritorio
- Interfaz limpia y profesional
- Estilos con Tailwind CSS

## 🚀 Instalación y Uso

### Opción 1: Uso Rápido (con CDN)

Abre el archivo `index.html` directamente en tu navegador. El formulario carga React y Tailwind desde CDN.

```bash
# Abrir en el navegador
open index.html  # macOS
xdg-open index.html  # Linux
start index.html  # Windows
```

### Opción 2: Integración en Proyecto React

1. **Instala las dependencias necesarias**:
```bash
npm install react react-dom
npm install -D tailwindcss
```

2. **Configura Tailwind CSS** (si no está configurado):
```bash
npx tailwindcss init
```

3. **Agrega al archivo `tailwind.config.js`**:
```javascript
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

4. **Importa los estilos de Tailwind** en tu `index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

5. **Usa el componente**:
```jsx
import MatriculaForm from './MatriculaForm';

function App() {
  return <MatriculaForm />;
}

export default App;
```

## 📋 Estructura del Formulario

### Campos del Estudiante
- Nombre completo
- Tipo de documento (TI, RC, CE)
- Número de documento
- Fecha de nacimiento
- Grado a cursar

### Campos del Acudiente
- Nombre completo
- Número de documento
- Parentesco
- Teléfono celular
- Correo electrónico

### Campo Condicional (Renovación)
- Número de matrícula anterior

## 🎨 Personalización

### Cambiar Colores
El formulario usa la paleta de colores `indigo` de Tailwind. Para cambiarla:

```jsx
// Buscar y reemplazar:
bg-indigo-600 → bg-blue-600    // Color de botones
text-indigo-700 → text-blue-700
border-indigo-500 → border-blue-500
```

### Ajustar Validaciones
Las validaciones están en la función `validarFormulario()`:

```javascript
// Ejemplo: Cambiar rango de edad
if (edad < 3 || edad > 20) {  // Modificar estos valores
  nuevosErrores.fechaNacimiento = 'La edad debe estar entre 3 y 20 años';
}

// Ejemplo: Modificar validación de teléfono
if (!/^3\d{9}$/.test(formData.telefonoAcudiente)) {
  // Cambiar la expresión regular según necesidad
}
```

### Agregar Grados
Modifica el array `grados`:

```javascript
const grados = [
  'Preescolar',
  '1°',
  // ... agregar más grados
  '11°',
  '12°',  // Agregar nuevo
  '13°'
];
```

## 🔗 Integración con Backend

Para conectar con una API real, modifica la función `handleSubmit`:

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  const nuevosErrores = validarFormulario();
  if (Object.keys(nuevosErrores).length > 0) {
    setErrors(nuevosErrores);
    return;
  }

  try {
    const response = await fetch('https://tu-api.com/matriculas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData,
        tipoOperacion
      })
    });

    const data = await response.json();
    setNumeroMatricula(data.numeroMatricula);
    setSubmitted(true);
  } catch (error) {
    console.error('Error al enviar formulario:', error);
    // Manejar error
  }
};
```

## 📱 Características Responsivas

- **Móvil**: Formulario de una sola columna
- **Tablet/Escritorio**: Campos organizados en dos columnas
- **Botones**: Ocupan el ancho completo en móvil
- **Tipo de operación**: Grid adaptativo de 3 columnas

## ✨ Mejoras Futuras Sugeridas

- [ ] Subida de documentos (foto, certificados)
- [ ] Guardar borrador localmente
- [ ] Impresión del comprobante de matrícula
- [ ] Integración con API de backend
- [ ] Envío de correo de confirmación automático
- [ ] Sistema de pago en línea
- [ ] Firma digital del acudiente
- [ ] Verificación de documentos con IA

## 📄 Licencia

Este componente es parte del sistema de Digitalización Institucional.

## 🤝 Contribuciones

Para reportar problemas o sugerir mejoras, contacta al equipo de desarrollo.
