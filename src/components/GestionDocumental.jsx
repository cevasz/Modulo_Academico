import React, { useState, useEffect } from 'react';
import {
  obtenerDocumentos,
  subirDocumento,
  eliminarDocumento,
  actualizarEstadoDocumento,
  obtenerEstudiantes
} from '../utils/supabaseClient';

const GestionDocumental = () => {
  const [documentos, setDocumentos] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Estados del formulario de subida
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [formData, setFormData] = useState({
    estudianteId: '',
    tipoDocumento: '',
    archivo: null
  });

  // Estados de filtros
  const [filtros, setFiltros] = useState({
    estudiante: '',
    tipoDocumento: '',
    estado: '',
    fechaInicio: '',
    fechaFin: ''
  });

  const tiposDocumento = [
    { value: 'admision', label: 'Admisión' },
    { value: 'paz_y_salvo', label: 'Paz y Salvo' },
    { value: 'carnet', label: 'Carnet' },
    { value: 'certificado', label: 'Certificado' },
    { value: 'boletin', label: 'Boletín' },
    { value: 'otro', label: 'Otro' }
  ];

  const estadosDocumento = [
    { value: 'pendiente', label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'aprobado', label: 'Aprobado', color: 'bg-green-100 text-green-800' },
    { value: 'rechazado', label: 'Rechazado', color: 'bg-red-100 text-red-800' }
  ];

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [docsData, estudiantesData] = await Promise.all([
        obtenerDocumentos(),
        obtenerEstudiantes()
      ]);
      setDocumentos(docsData || []);
      setEstudiantes(estudiantesData || []);
    } catch (err) {
      setError('Error al cargar los datos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tamaño (máximo 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('El archivo no debe superar los 10MB');
        return;
      }
      setFormData(prev => ({ ...prev, archivo: file }));
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.estudianteId || !formData.tipoDocumento || !formData.archivo) {
      setError('Todos los campos son obligatorios');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      await subirDocumento(
        formData.archivo,
        formData.estudianteId,
        formData.tipoDocumento
      );
      
      setSuccess('Documento subido exitosamente');
      setShowUploadForm(false);
      setFormData({ estudianteId: '', tipoDocumento: '', archivo: null });
      cargarDatos();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Error al subir el documento: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleEliminar = async (documentoId, url) => {
    if (!confirm('¿Está seguro de eliminar este documento?')) return;

    try {
      await eliminarDocumento(documentoId, url);
      setSuccess('Documento eliminado exitosamente');
      cargarDatos();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Error al eliminar el documento: ' + err.message);
    }
  };

  const handleCambiarEstado = async (documentoId, nuevoEstado) => {
    try {
      await actualizarEstadoDocumento(documentoId, nuevoEstado);
      setSuccess('Estado actualizado exitosamente');
      cargarDatos();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Error al actualizar el estado: ' + err.message);
    }
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  const limpiarFiltros = () => {
    setFiltros({
      estudiante: '',
      tipoDocumento: '',
      estado: '',
      fechaInicio: '',
      fechaFin: ''
    });
  };

  const documentosFiltrados = documentos.filter(doc => {
    if (filtros.estudiante && !doc.nombre_estudiante?.toLowerCase().includes(filtros.estudiante.toLowerCase()) 
        && !doc.documento_estudiante?.includes(filtros.estudiante)) {
      return false;
    }
    if (filtros.tipoDocumento && doc.tipo_documento !== filtros.tipoDocumento) {
      return false;
    }
    if (filtros.estado && doc.estado !== filtros.estado) {
      return false;
    }
    if (filtros.fechaInicio && new Date(doc.fecha_carga) < new Date(filtros.fechaInicio)) {
      return false;
    }
    if (filtros.fechaFin && new Date(doc.fecha_carga) > new Date(filtros.fechaFin + 'T23:59:59')) {
      return false;
    }
    return true;
  });

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatearTamanio = (bytes) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const obtenerLabelTipo = (tipo) => {
    return tiposDocumento.find(t => t.value === tipo)?.label || tipo;
  };

  const obtenerColorEstado = (estado) => {
    return estadosDocumento.find(e => e.value === estado)?.color || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Gestión Documental</h1>
              <p className="text-gray-600 mt-2">Administración de documentos institucionales</p>
            </div>
            <button
              onClick={() => setShowUploadForm(!showUploadForm)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 shadow-lg flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Subir Documento
            </button>
          </div>

          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-600">Total Documentos</div>
              <div className="text-2xl font-bold text-gray-900">{documentos.length}</div>
            </div>
            <div className="bg-yellow-50 rounded-lg shadow p-4">
              <div className="text-sm text-yellow-700">Pendientes</div>
              <div className="text-2xl font-bold text-yellow-800">
                {documentos.filter(d => d.estado === 'pendiente').length}
              </div>
            </div>
            <div className="bg-green-50 rounded-lg shadow p-4">
              <div className="text-sm text-green-700">Aprobados</div>
              <div className="text-2xl font-bold text-green-800">
                {documentos.filter(d => d.estado === 'aprobado').length}
              </div>
            </div>
            <div className="bg-red-50 rounded-lg shadow p-4">
              <div className="text-sm text-red-700">Rechazados</div>
              <div className="text-2xl font-bold text-red-800">
                {documentos.filter(d => d.estado === 'rechazado').length}
              </div>
            </div>
          </div>
        </div>

        {/* Mensajes */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
            <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
            <button onClick={() => setError('')} className="ml-auto">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {success}
            <button onClick={() => setSuccess('')} className="ml-auto">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        {/* Formulario de subida */}
        {showUploadForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Subir Nuevo Documento</h2>
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estudiante *
                  </label>
                  <select
                    value={formData.estudianteId}
                    onChange={(e) => setFormData(prev => ({ ...prev, estudianteId: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  >
                    <option value="">Seleccionar estudiante</option>
                    {estudiantes.map(est => (
                      <option key={est.id} value={est.id}>
                        {est.nombre_completo} - {est.numero_documento}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Documento *
                  </label>
                  <select
                    value={formData.tipoDocumento}
                    onChange={(e) => setFormData(prev => ({ ...prev, tipoDocumento: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  >
                    <option value="">Seleccionar tipo</option>
                    {tiposDocumento.map(tipo => (
                      <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Archivo *
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Máximo 10MB (PDF, Word, Imágenes)</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={uploading}
                  className={`flex-1 py-2 px-4 rounded-lg font-semibold transition duration-200 ${
                    uploading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {uploading ? 'Subiendo...' : 'Subir Documento'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadForm(false);
                    setFormData({ estudianteId: '', tipoDocumento: '', archivo: null });
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition duration-200"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
            <button
              onClick={limpiarFiltros}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Limpiar filtros
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estudiante</label>
              <input
                type="text"
                name="estudiante"
                value={filtros.estudiante}
                onChange={handleFiltroChange}
                placeholder="Nombre o documento"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
              <select
                name="tipoDocumento"
                value={filtros.tipoDocumento}
                onChange={handleFiltroChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Todos</option>
                {tiposDocumento.map(tipo => (
                  <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
              <select
                name="estado"
                value={filtros.estado}
                onChange={handleFiltroChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Todos</option>
                {estadosDocumento.map(estado => (
                  <option key={estado.value} value={estado.value}>{estado.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Desde</label>
              <input
                type="date"
                name="fechaInicio"
                value={filtros.fechaInicio}
                onChange={handleFiltroChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hasta</label>
              <input
                type="date"
                name="fechaFin"
                value={filtros.fechaFin}
                onChange={handleFiltroChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Mostrando {documentosFiltrados.length} de {documentos.length} documentos
          </div>
        </div>

        {/* Tabla de documentos */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <svg className="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : documentosFiltrados.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="mt-2 text-gray-600">No hay documentos que mostrar</p>
              <button
                onClick={() => setShowUploadForm(true)}
                className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Subir primer documento
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estudiante
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Archivo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tamaño
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {documentosFiltrados.map(doc => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{doc.nombre_estudiante}</div>
                          <div className="text-sm text-gray-500">{doc.documento_estudiante}</div>
                          <div className="text-xs text-gray-400">{doc.grado}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{obtenerLabelTipo(doc.tipo_documento)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">{doc.nombre_archivo}</div>
                        <div className="text-xs text-gray-500">{doc.mime_type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatearTamanio(doc.tamanio_bytes)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatearFecha(doc.fecha_carga)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={doc.estado}
                          onChange={(e) => handleCambiarEstado(doc.id, e.target.value)}
                          className={`text-xs font-semibold px-3 py-1 rounded-full ${obtenerColorEstado(doc.estado)} border-0 cursor-pointer`}
                        >
                          {estadosDocumento.map(est => (
                            <option key={est.value} value={est.value}>{est.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <a
                            href={doc.url_archivo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Ver documento"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </a>
                          <a
                            href={doc.url_archivo}
                            download={doc.nombre_archivo}
                            className="text-green-600 hover:text-green-900"
                            title="Descargar"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </a>
                          <button
                            onClick={() => handleEliminar(doc.id, doc.url_archivo)}
                            className="text-red-600 hover:text-red-900"
                            title="Eliminar"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
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

export default GestionDocumental;
