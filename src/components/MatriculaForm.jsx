import React, { useState } from 'react';
import { crearMatricula } from '../utils/supabaseClient';

const MatriculaForm = () => {
  const [tipoOperacion, setTipoOperacion] = useState('inscripcion');
  const [loading, setLoading] = useState(false);
  const [errorServidor, setErrorServidor] = useState('');
  const [formData, setFormData] = useState({
    // Datos del estudiante
    nombreEstudiante: '',
    tipoDocumento: 'TI',
    numeroDocumento: '',
    fechaNacimiento: '',
    grado: '',
    
    // Datos del acudiente
    nombreAcudiente: '',
    documentoAcudiente: '',
    parentesco: '',
    telefonoAcudiente: '',
    correoAcudiente: '',
    
    // Para renovación
    numeroMatriculaAnterior: ''
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [numeroMatricula, setNumeroMatricula] = useState('');

  const grados = [
    'Preescolar',
    '1°',
    '2°',
    '3°',
    '4°',
    '5°',
    '6°',
    '7°',
    '8°',
    '9°',
    '10°',
    '11°'
  ];

  const parentescos = ['Padre', 'Madre', 'Abuelo/a', 'Tío/a', 'Hermano/a', 'Otro'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo al empezar a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    // Validación de nombre del estudiante
    if (!formData.nombreEstudiante.trim()) {
      nuevosErrores.nombreEstudiante = 'El nombre del estudiante es obligatorio';
    } else if (formData.nombreEstudiante.trim().length < 3) {
      nuevosErrores.nombreEstudiante = 'El nombre debe tener al menos 3 caracteres';
    }

    // Validación de documento
    if (!formData.numeroDocumento.trim()) {
      nuevosErrores.numeroDocumento = 'El número de documento es obligatorio';
    } else if (!/^\d{7,11}$/.test(formData.numeroDocumento)) {
      nuevosErrores.numeroDocumento = 'Ingrese un número de documento válido (7-11 dígitos)';
    }

    // Validación de fecha de nacimiento
    if (!formData.fechaNacimiento) {
      nuevosErrores.fechaNacimiento = 'La fecha de nacimiento es obligatoria';
    } else {
      const fechaNac = new Date(formData.fechaNacimiento);
      const hoy = new Date();
      const edad = hoy.getFullYear() - fechaNac.getFullYear();
      if (edad < 3 || edad > 20) {
        nuevosErrores.fechaNacimiento = 'La edad debe estar entre 3 y 20 años';
      }
    }

    // Validación de grado
    if (!formData.grado) {
      nuevosErrores.grado = 'Debe seleccionar un grado';
    }

    // Validación de nombre del acudiente
    if (!formData.nombreAcudiente.trim()) {
      nuevosErrores.nombreAcudiente = 'El nombre del acudiente es obligatorio';
    } else if (formData.nombreAcudiente.trim().length < 3) {
      nuevosErrores.nombreAcudiente = 'El nombre debe tener al menos 3 caracteres';
    }

    // Validación de documento del acudiente
    if (!formData.documentoAcudiente.trim()) {
      nuevosErrores.documentoAcudiente = 'El documento del acudiente es obligatorio';
    } else if (!/^\d{7,11}$/.test(formData.documentoAcudiente)) {
      nuevosErrores.documentoAcudiente = 'Ingrese un documento válido (7-11 dígitos)';
    }

    // Validación de parentesco
    if (!formData.parentesco) {
      nuevosErrores.parentesco = 'Debe seleccionar el parentesco';
    }

    // Validación de teléfono
    if (!formData.telefonoAcudiente.trim()) {
      nuevosErrores.telefonoAcudiente = 'El teléfono es obligatorio';
    } else if (!/^3\d{9}$/.test(formData.telefonoAcudiente)) {
      nuevosErrores.telefonoAcudiente = 'Ingrese un celular válido (10 dígitos, inicia con 3)';
    }

    // Validación de correo
    if (!formData.correoAcudiente.trim()) {
      nuevosErrores.correoAcudiente = 'El correo electrónico es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correoAcudiente)) {
      nuevosErrores.correoAcudiente = 'Ingrese un correo electrónico válido';
    }

    // Validación específica para renovación
    if (tipoOperacion === 'renovacion' && !formData.numeroMatriculaAnterior.trim()) {
      nuevosErrores.numeroMatriculaAnterior = 'El número de matrícula anterior es obligatorio';
    }

    return nuevosErrores;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const nuevosErrores = validarFormulario();
    
    if (Object.keys(nuevosErrores).length > 0) {
      setErrors(nuevosErrores);
      return;
    }

    setLoading(true);
    setErrorServidor('');

    try {
      // Enviar datos a Supabase
      const resultado = await crearMatricula(formData, tipoOperacion);
      
      if (resultado.success) {
        setNumeroMatricula(resultado.numeroMatricula);
        setSubmitted(true);
      } else {
        setErrorServidor(resultado.error || 'Error al procesar la matrícula');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorServidor('Error de conexión. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const resetearFormulario = () => {
    setFormData({
      nombreEstudiante: '',
      tipoDocumento: 'TI',
      numeroDocumento: '',
      fechaNacimiento: '',
      grado: '',
      nombreAcudiente: '',
      documentoAcudiente: '',
      parentesco: '',
      telefonoAcudiente: '',
      correoAcudiente: '',
      numeroMatriculaAnterior: ''
    });
    setErrors({});
    setSubmitted(false);
    setNumeroMatricula('');
    setErrorServidor('');
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                ¡Matrícula {tipoOperacion === 'inscripcion' ? 'Registrada' : tipoOperacion === 'renovacion' ? 'Renovada' : 'Actualizada'} Exitosamente!
              </h2>
              <p className="text-gray-600">Los datos han sido procesados correctamente</p>
            </div>

            <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 mb-6">
              <div className="flex items-center mb-2">
                <span className="text-indigo-700 font-semibold text-lg">Número de Matrícula:</span>
              </div>
              <p className="text-3xl font-bold text-indigo-900">{numeroMatricula}</p>
            </div>

            <div className="space-y-4 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Resumen de la Información</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-3">Datos del Estudiante</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Nombre:</span> {formData.nombreEstudiante}</p>
                    <p><span className="font-medium">Documento:</span> {formData.tipoDocumento} {formData.numeroDocumento}</p>
                    <p><span className="font-medium">Fecha de Nacimiento:</span> {formData.fechaNacimiento}</p>
                    <p><span className="font-medium">Grado:</span> {formData.grado}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-3">Datos del Acudiente</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Nombre:</span> {formData.nombreAcudiente}</p>
                    <p><span className="font-medium">Documento:</span> {formData.documentoAcudiente}</p>
                    <p><span className="font-medium">Parentesco:</span> {formData.parentesco}</p>
                    <p><span className="font-medium">Teléfono:</span> {formData.telefonoAcudiente}</p>
                    <p><span className="font-medium">Correo:</span> {formData.correoAcudiente}</p>
                  </div>
                </div>
              </div>

              {tipoOperacion === 'renovacion' && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm"><span className="font-medium">Matrícula Anterior:</span> {formData.numeroMatriculaAnterior}</p>
                </div>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Próximos pasos:</strong> Recibirá un correo de confirmación a {formData.correoAcudiente} con los detalles de la matrícula y las instrucciones para completar el proceso.
              </p>
            </div>

            <button
              onClick={resetearFormulario}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 shadow-lg"
            >
              Realizar Nueva Matrícula
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Matrícula Digital</h1>
          <p className="text-gray-600">Sistema de Gestión Institucional</p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Selector de tipo de operación */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Tipo de Operación
            </label>
            <div className="grid grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setTipoOperacion('inscripcion')}
                className={`py-3 px-4 rounded-lg font-medium transition duration-200 ${
                  tipoOperacion === 'inscripcion'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Inscripción Nueva
              </button>
              <button
                type="button"
                onClick={() => setTipoOperacion('renovacion')}
                className={`py-3 px-4 rounded-lg font-medium transition duration-200 ${
                  tipoOperacion === 'renovacion'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Renovación
              </button>
              <button
                type="button"
                onClick={() => setTipoOperacion('actualizacion')}
                className={`py-3 px-4 rounded-lg font-medium transition duration-200 ${
                  tipoOperacion === 'actualizacion'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Actualización
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Campo para renovación */}
            {tipoOperacion === 'renovacion' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Datos de Renovación</h3>
                <div>
                  <label htmlFor="numeroMatriculaAnterior" className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Matrícula Anterior *
                  </label>
                  <input
                    type="text"
                    id="numeroMatriculaAnterior"
                    name="numeroMatriculaAnterior"
                    value={formData.numeroMatriculaAnterior}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      errors.numeroMatriculaAnterior ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ej: 2025-1234"
                  />
                  {errors.numeroMatriculaAnterior && (
                    <p className="mt-1 text-sm text-red-600">{errors.numeroMatriculaAnterior}</p>
                  )}
                </div>
              </div>
            )}

            {/* Datos del Estudiante */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Datos del Estudiante</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="nombreEstudiante" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    id="nombreEstudiante"
                    name="nombreEstudiante"
                    value={formData.nombreEstudiante}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      errors.nombreEstudiante ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nombre completo del estudiante"
                  />
                  {errors.nombreEstudiante && (
                    <p className="mt-1 text-sm text-red-600">{errors.nombreEstudiante}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="tipoDocumento" className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Documento *
                  </label>
                  <select
                    id="tipoDocumento"
                    name="tipoDocumento"
                    value={formData.tipoDocumento}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="TI">Tarjeta de Identidad</option>
                    <option value="RC">Registro Civil</option>
                    <option value="CE">Cédula de Extranjería</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="numeroDocumento" className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Documento *
                  </label>
                  <input
                    type="text"
                    id="numeroDocumento"
                    name="numeroDocumento"
                    value={formData.numeroDocumento}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      errors.numeroDocumento ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Número sin puntos ni comas"
                  />
                  {errors.numeroDocumento && (
                    <p className="mt-1 text-sm text-red-600">{errors.numeroDocumento}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="fechaNacimiento" className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Nacimiento *
                  </label>
                  <input
                    type="date"
                    id="fechaNacimiento"
                    name="fechaNacimiento"
                    value={formData.fechaNacimiento}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      errors.fechaNacimiento ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.fechaNacimiento && (
                    <p className="mt-1 text-sm text-red-600">{errors.fechaNacimiento}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="grado" className="block text-sm font-medium text-gray-700 mb-2">
                    Grado a Cursar *
                  </label>
                  <select
                    id="grado"
                    name="grado"
                    value={formData.grado}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      errors.grado ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Seleccione un grado</option>
                    {grados.map(grado => (
                      <option key={grado} value={grado}>{grado}</option>
                    ))}
                  </select>
                  {errors.grado && (
                    <p className="mt-1 text-sm text-red-600">{errors.grado}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Datos del Acudiente */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Datos del Acudiente</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="nombreAcudiente" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    id="nombreAcudiente"
                    name="nombreAcudiente"
                    value={formData.nombreAcudiente}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      errors.nombreAcudiente ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nombre completo del acudiente"
                  />
                  {errors.nombreAcudiente && (
                    <p className="mt-1 text-sm text-red-600">{errors.nombreAcudiente}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="documentoAcudiente" className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Documento *
                  </label>
                  <input
                    type="text"
                    id="documentoAcudiente"
                    name="documentoAcudiente"
                    value={formData.documentoAcudiente}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      errors.documentoAcudiente ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Cédula sin puntos ni comas"
                  />
                  {errors.documentoAcudiente && (
                    <p className="mt-1 text-sm text-red-600">{errors.documentoAcudiente}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="parentesco" className="block text-sm font-medium text-gray-700 mb-2">
                    Parentesco *
                  </label>
                  <select
                    id="parentesco"
                    name="parentesco"
                    value={formData.parentesco}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      errors.parentesco ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Seleccione parentesco</option>
                    {parentescos.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  {errors.parentesco && (
                    <p className="mt-1 text-sm text-red-600">{errors.parentesco}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="telefonoAcudiente" className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono Celular *
                  </label>
                  <input
                    type="tel"
                    id="telefonoAcudiente"
                    name="telefonoAcudiente"
                    value={formData.telefonoAcudiente}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      errors.telefonoAcudiente ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="3001234567"
                  />
                  {errors.telefonoAcudiente && (
                    <p className="mt-1 text-sm text-red-600">{errors.telefonoAcudiente}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="correoAcudiente" className="block text-sm font-medium text-gray-700 mb-2">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    id="correoAcudiente"
                    name="correoAcudiente"
                    value={formData.correoAcudiente}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      errors.correoAcudiente ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="correo@ejemplo.com"
                  />
                  {errors.correoAcudiente && (
                    <p className="mt-1 text-sm text-red-600">{errors.correoAcudiente}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Botón de envío */}
            <div className="border-t pt-6">
              {errorServidor && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  <p className="font-semibold">Error al procesar la matrícula</p>
                  <p className="text-sm">{errorServidor}</p>
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition duration-200 shadow-lg hover:shadow-xl ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </span>
                ) : (
                  tipoOperacion === 'inscripcion' ? 'Registrar Matrícula' : tipoOperacion === 'renovacion' ? 'Renovar Matrícula' : 'Actualizar Datos'
                )}
              </button>
              <p className="text-sm text-gray-500 text-center mt-3">
                Los campos marcados con * son obligatorios
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MatriculaForm;
