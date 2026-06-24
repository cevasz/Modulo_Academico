import React, { useState, useEffect } from 'react';

import {
  obtenerPerfilEstudiante,
  actualizarEstudiante,
  actualizarAcudiente,
  obtenerDocumentosPorEstudiante
} from '../utils/supabaseClient';

const PerfilEstudiante = ({ estudianteId: propEstudianteId }) => {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editando, setEditando] = useState({});
  const [documentos, setDocumentos] = useState([]);
  
  // Estado para búsqueda de estudiante
  const [busqueda, setBusqueda] = useState('');
  const [estudianteId, setEstudianteId] = useState(propEstudianteId || null);

  useEffect(() => {
    if (estudianteId) {
      cargarPerfil();
    }
  }, [estudianteId]);

  const cargarPerfil = async () => {
    setLoading(true);
    setError('');
    try {
      const [perfilData, docsData] = await Promise.all([
        obtenerPerfilEstudiante(estudianteId),
        obtenerDocumentosPorEstudiante(estudianteId)
      ]);
      
      if (perfilData) {
        setPerfil(perfilData);
        setDocumentos(docsData || []);
      } else {
        setError('Estudiante no encontrado');
      }
    } catch (err) {
      setError('Error al cargar el perfil: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (seccion, campo) => {
    setEditando({ ...editando, [`${seccion}.${campo}`]: true });
  };

  const handleCancelarEdit = (seccion, campo) => {
    const newEditando = { ...editando };
    delete newEditando[`${seccion}.${campo}`];
    setEditando(newEditando);
  };

  const handleGuardar = async (seccion, campo, valor) => {
    try {
      if (seccion === 'estudiante') {
        await actualizarEstudiante(estudianteId, { [campo]: valor });
      } else if (seccion === 'acudiente') {
        await actualizarAcudiente(perfil.acudiente_id, { [campo]: valor });
      }
      
      setSuccess('Cambios guardados exitosamente');
      await cargarPerfil();
      handleCancelarEdit(seccion, campo);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Error al guardar: ' + err.message);
    }
  };

  const handleChange = (campo, valor) => {
    setPerfil({ ...perfil, [campo]: valor });
  };

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

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const obtenerDocumentosPendientes = () => {
    const tiposRequeridos = ['admision', 'carnet', 'certificado'];
    const tiposSubidos = documentos.map(d => d.tipo_documento);
    const pendientes = tiposRequeridos.filter(tipo => !tiposSubidos.includes(tipo));
    
    const rechazados = documentos.filter(d => d.estado === 'rechazado');
    
    return [...pendientes, ...rechazados.map(d => d.tipo_documento)];
  };

  const CampoEditable = ({ seccion, campo, valor, tipo = 'text', label, placeholder }) => {
    const key = `${seccion}.${campo}`;
    const estaEditando = editando[key];
    const [valorTemp, setValorTemp] = useState(valor);

    useEffect(() => {
      setValorTemp(valor);
    }, [valor]);

    if (estaEditando) {
      return (
        <div className="flex items-center gap-2">
          {tipo === 'textarea' ? (
            <textarea
              value={valorTemp || ''}
              onChange={(e) => setValorTemp(e.target.value)}
              className="flex-1 px-3 py-2 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder={placeholder}
              rows="3"
            />
          ) : (
            <input
              type={tipo}
              value={valorTemp || ''}
              onChange={(e) => setValorTemp(e.target.value)}
              className="flex-1 px-3 py-2 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder={placeholder}
            />
          )}
          <button
            onClick={() => handleGuardar(seccion, campo, valorTemp)}
            className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            title="Guardar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </button>
          <button
            onClick={() => handleCancelarEdit(seccion, campo)}
            className="p-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
            title="Cancelar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between group">
        <span className="text-gray-900">{valor || <span className="text-gray-400 italic">No especificado</span>}</span>
        <button
          onClick={() => handleEdit(seccion, campo)}
          className="opacity-0 group-hover:opacity-100 p-1 text-indigo-600 hover:text-indigo-700 transition"
          title="Editar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      </div>
    );
  };

  if (!propEstudianteId && !estudianteId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Buscar Estudiante</h2>
            <div className="flex gap-4">
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Ingresa el ID del estudiante o número de documento"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={() => setEstudianteId(busqueda)}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                Buscar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-indigo-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (error && !perfil) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => setEstudianteId(null)}
              className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
            >
              ← Volver a buscar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const documentosPendientes = obtenerDocumentosPendientes();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header del perfil */}
        <div className="bg-white rounded-lg shadow-lg mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-3xl font-bold text-indigo-600 shadow-lg">
                  {perfil?.nombre_completo?.charAt(0).toUpperCase()}
                </div>
                <div className="text-white">
                  <h1 className="text-3xl font-bold mb-1">{perfil?.nombre_completo}</h1>
                  <p className="text-indigo-200">{perfil?.tipo_documento} {perfil?.numero_documento}</p>
                  <p className="text-indigo-200">{calcularEdad(perfil?.fecha_nacimiento)} años • Grado {perfil?.grado}</p>
                </div>
              </div>
              <div>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  perfil?.estado === 'activo' ? 'bg-green-100 text-green-800' :
                  perfil?.estado === 'inactivo' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {perfil?.estado?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mensajes */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* SECCIÓN 1: Información Académica */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Información Académica</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Grado</label>
                <CampoEditable
                  seccion="estudiante"
                  campo="grado"
                  valor={perfil?.grado}
                  label="Grado"
                  placeholder="Ejemplo: 8°"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Grupo</label>
                <CampoEditable
                  seccion="estudiante"
                  campo="grupo"
                  valor={perfil?.grupo}
                  label="Grupo"
                  placeholder="Ejemplo: A, B, C"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Director de Grupo</label>
                <CampoEditable
                  seccion="estudiante"
                  campo="director_grupo"
                  valor={perfil?.director_grupo}
                  label="Director de Grupo"
                  placeholder="Nombre del docente"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Fecha de Nacimiento</label>
                <p className="text-gray-900">{formatearFecha(perfil?.fecha_nacimiento)}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Edad</label>
                <p className="text-gray-900">{calcularEdad(perfil?.fecha_nacimiento)} años</p>
              </div>
            </div>
          </div>

          {/* SECCIÓN 2: Información Familiar */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Información Familiar</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Acudiente</label>
                <CampoEditable
                  seccion="acudiente"
                  campo="nombre_completo"
                  valor={perfil?.nombre_acudiente}
                  label="Nombre del Acudiente"
                  placeholder="Nombre completo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Documento</label>
                <p className="text-gray-900">{perfil?.documento_acudiente}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Parentesco</label>
                <CampoEditable
                  seccion="acudiente"
                  campo="parentesco"
                  valor={perfil?.parentesco}
                  label="Parentesco"
                  placeholder="Padre, Madre, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Teléfono</label>
                <CampoEditable
                  seccion="acudiente"
                  campo="telefono"
                  valor={perfil?.telefono_acudiente}
                  tipo="tel"
                  label="Teléfono"
                  placeholder="3001234567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Correo Electrónico</label>
                <CampoEditable
                  seccion="acudiente"
                  campo="correo_electronico"
                  valor={perfil?.correo_acudiente}
                  tipo="email"
                  label="Correo"
                  placeholder="correo@ejemplo.com"
                />
              </div>
            </div>
          </div>

          {/* SECCIÓN 3: Información Administrativa */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Info. Administrativa</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Estado de Matrícula</label>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    perfil?.estado_matricula === 'activa' ? 'bg-green-100 text-green-800' :
                    perfil?.estado_matricula === 'cancelada' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {perfil?.estado_matricula || 'Sin matrícula'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Número de Matrícula</label>
                <p className="text-gray-900 font-mono">{perfil?.numero_matricula || 'N/A'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Año Lectivo</label>
                <p className="text-gray-900">{perfil?.ano_lectivo || 'N/A'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Documentos</label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Subidos:</span>
                    <span className="font-semibold text-green-600">{documentos.filter(d => d.estado === 'aprobado').length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Pendientes:</span>
                    <span className="font-semibold text-yellow-600">{documentos.filter(d => d.estado === 'pendiente').length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Rechazados:</span>
                    <span className="font-semibold text-red-600">{documentos.filter(d => d.estado === 'rechazado').length}</span>
                  </div>
                </div>
              </div>

              {documentosPendientes.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm font-semibold text-yellow-800 mb-2">Documentos Requeridos:</p>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    {documentosPendientes.map((doc, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        {doc}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Observaciones</label>
                <CampoEditable
                  seccion="estudiante"
                  campo="observaciones"
                  valor={perfil?.observaciones}
                  tipo="textarea"
                  label="Observaciones"
                  placeholder="Notas administrativas o académicas"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sección de historial */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Historial de Documentos</h3>
          {documentos.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No hay documentos cargados</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Archivo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {documentos.map(doc => (
                    <tr key={doc.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doc.tipo_documento}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{doc.nombre_archivo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(doc.fecha_carga).toLocaleDateString('es-CO')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          doc.estado === 'aprobado' ? 'bg-green-100 text-green-800' :
                          doc.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {doc.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <a
                          href={doc.url_archivo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Ver
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerfilEstudiante;
