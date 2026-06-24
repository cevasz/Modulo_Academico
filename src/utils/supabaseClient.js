// ============================================
// CONFIGURACIÓN DE SUPABASE CLIENT
// ============================================

import { createClient } from '@supabase/supabase-js';

// Obtener credenciales desde variables de entorno
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validar que las credenciales estén configuradas
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('⚠️ Error: Las credenciales de Supabase no están configuradas.');
  console.error('Por favor, crea un archivo .env con tus credenciales.');
  console.error('Puedes copiar .env.example y agregar tus valores reales.');
}

// Crear cliente de Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================
// FUNCIONES HELPER PARA MATRÍCULA
// ============================================

/**
 * Generar número de matrícula único
 */
export const generarNumeroMatricula = async () => {
  const año = new Date().getFullYear();
  let intentos = 0;
  const maxIntentos = 10;
  
  while (intentos < maxIntentos) {
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const numeroMatricula = `${año}-${random}`;
    
    // Verificar si ya existe
    const { data, error } = await supabase
      .from('matriculas')
      .select('numero_matricula')
      .eq('numero_matricula', numeroMatricula)
      .single();
    
    if (!data) {
      return numeroMatricula;
    }
    
    intentos++;
  }
  
  throw new Error('No se pudo generar un número de matrícula único');
};

/**
 * Crear o actualizar estudiante
 */
export const upsertEstudiante = async (datosEstudiante) => {
  const { data, error } = await supabase
    .from('estudiantes')
    .upsert({
      nombre_completo: datosEstudiante.nombreEstudiante,
      tipo_documento: datosEstudiante.tipoDocumento,
      numero_documento: datosEstudiante.numeroDocumento,
      fecha_nacimiento: datosEstudiante.fechaNacimiento,
      grado: datosEstudiante.grado,
      estado: 'activo'
    }, {
      onConflict: 'numero_documento',
      returning: 'representation'
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

/**
 * Crear o actualizar acudiente
 */
export const upsertAcudiente = async (datosAcudiente) => {
  // Buscar si el acudiente ya existe
  const { data: existente } = await supabase
    .from('acudientes')
    .select('id')
    .eq('numero_documento', datosAcudiente.documentoAcudiente)
    .single();
  
  if (existente) {
    // Actualizar acudiente existente
    const { data, error } = await supabase
      .from('acudientes')
      .update({
        nombre_completo: datosAcudiente.nombreAcudiente,
        parentesco: datosAcudiente.parentesco,
        telefono: datosAcudiente.telefonoAcudiente,
        correo_electronico: datosAcudiente.correoAcudiente
      })
      .eq('id', existente.id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } else {
    // Crear nuevo acudiente
    const { data, error } = await supabase
      .from('acudientes')
      .insert({
        nombre_completo: datosAcudiente.nombreAcudiente,
        numero_documento: datosAcudiente.documentoAcudiente,
        parentesco: datosAcudiente.parentesco,
        telefono: datosAcudiente.telefonoAcudiente,
        correo_electronico: datosAcudiente.correoAcudiente
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

/**
 * Crear matrícula completa
 */
export const crearMatricula = async (formData, tipoOperacion) => {
  try {
    const { data, error } = await supabase.rpc('crear_matricula_publica', {
      p_tipo_operacion: tipoOperacion,
      p_nombre_estudiante: formData.nombreEstudiante,
      p_tipo_documento: formData.tipoDocumento,
      p_numero_documento: formData.numeroDocumento,
      p_fecha_nacimiento: formData.fechaNacimiento,
      p_grado: formData.grado,
      p_nombre_acudiente: formData.nombreAcudiente,
      p_documento_acudiente: formData.documentoAcudiente,
      p_parentesco: formData.parentesco,
      p_telefono_acudiente: formData.telefonoAcudiente,
      p_correo_acudiente: formData.correoAcudiente,
      p_numero_matricula_anterior: formData.numeroMatriculaAnterior || null
    });

    if (error) throw error;

    const resultado = Array.isArray(data) ? data[0] : data;

    if (!resultado?.success) {
      return {
        success: false,
        error: resultado?.error || 'Error al procesar la matrícula'
      };
    }
    
    return {
      success: true,
      numeroMatricula: resultado.numero_matricula
    };
  } catch (error) {
    console.error('Error al crear matrícula:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Verificar si un número de documento ya está registrado
 */
export const verificarDocumentoEstudiante = async (numeroDocumento) => {
  const { data, error } = await supabase
    .from('estudiantes')
    .select('id, nombre_completo, numero_documento')
    .eq('numero_documento', numeroDocumento)
    .single();
  
  return { existe: !!data, datos: data };
};

/**
 * Obtener matrícula por número
 */
export const obtenerMatriculaPorNumero = async (numeroMatricula) => {
  const { data, error } = await supabase
    .from('vista_matriculas_completas')
    .select('*')
    .eq('numero_matricula', numeroMatricula)
    .single();
  
  if (error) throw error;
  return data;
};

/**
 * Obtener todas las matrículas del año actual
 */
export const obtenerMatriculasAnoActual = async () => {
  const añoActual = new Date().getFullYear();
  
  const { data, error } = await supabase
    .from('vista_matriculas_completas')
    .select('*')
    .eq('ano_lectivo', añoActual)
    .order('fecha_matricula', { ascending: false });
  
  if (error) throw error;
  return data;
};

/**
 * Obtener estadísticas de matrículas
 */
export const obtenerEstadisticasMatriculas = async () => {
  const { data, error } = await supabase
    .from('vista_estadisticas_matriculas')
    .select('*')
    .order('ano_lectivo', { ascending: false });
  
  if (error) throw error;
  return data;
};

/**
 * Actualizar estado de matrícula
 */
export const actualizarEstadoMatricula = async (matriculaId, nuevoEstado) => {
  const { data, error } = await supabase
    .from('matriculas')
    .update({ estado: nuevoEstado })
    .eq('id', matriculaId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

/**
 * Obtener historial de una matrícula
 */
export const obtenerHistorialMatricula = async (matriculaId) => {
  const { data, error } = await supabase
    .from('historial_matriculas')
    .select('*')
    .eq('matricula_id', matriculaId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

// ============================================
// FUNCIONES PARA GESTIÓN DOCUMENTAL
// ============================================

/**
 * Obtener todos los estudiantes
 */
export const obtenerEstudiantes = async () => {
  const { data, error } = await supabase
    .from('estudiantes')
    .select('id, nombre_completo, numero_documento, grado')
    .eq('estado', 'activo')
    .order('nombre_completo', { ascending: true });
  
  if (error) throw error;
  return data;
};

/**
 * Subir documento a Supabase Storage
 */
export const subirDocumento = async (archivo, estudianteId, tipoDocumento) => {
  try {
    // Generar nombre único para el archivo
    const timestamp = Date.now();
    const nombreOriginal = archivo.name;
    const extension = nombreOriginal.split('.').pop();
    const nombreArchivo = `${estudianteId}/${tipoDocumento}_${timestamp}.${extension}`;
    
    // Subir archivo a Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documentos-estudiantes')
      .upload(nombreArchivo, archivo, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (uploadError) throw uploadError;
    
    // Obtener URL pública del archivo
    const { data: urlData } = supabase.storage
      .from('documentos-estudiantes')
      .getPublicUrl(nombreArchivo);
    
    // Guardar referencia en la base de datos
    const { data: docData, error: docError } = await supabase
      .from('documentos')
      .insert({
        estudiante_id: estudianteId,
        tipo_documento: tipoDocumento,
        nombre_archivo: nombreOriginal,
        url_archivo: urlData.publicUrl,
        tamanio_bytes: archivo.size,
        mime_type: archivo.type,
        estado: 'pendiente'
      })
      .select()
      .single();
    
    if (docError) throw docError;
    
    return {
      success: true,
      documento: docData
    };
  } catch (error) {
    console.error('Error al subir documento:', error);
    throw error;
  }
};

/**
 * Obtener todos los documentos con información completa
 */
export const obtenerDocumentos = async () => {
  const { data, error } = await supabase
    .from('vista_documentos_completos')
    .select('*')
    .order('fecha_carga', { ascending: false });
  
  if (error) throw error;
  return data;
};

/**
 * Obtener documentos de un estudiante específico
 */
export const obtenerDocumentosPorEstudiante = async (estudianteId) => {
  const { data, error } = await supabase
    .from('documentos')
    .select('*')
    .eq('estudiante_id', estudianteId)
    .order('fecha_carga', { ascending: false });
  
  if (error) throw error;
  return data;
};

/**
 * Actualizar estado de un documento
 */
export const actualizarEstadoDocumento = async (documentoId, nuevoEstado, observaciones = null) => {
  const updateData = {
    estado: nuevoEstado,
    fecha_revision: new Date().toISOString()
  };
  
  if (observaciones) {
    updateData.observaciones = observaciones;
  }
  
  const { data, error } = await supabase
    .from('documentos')
    .update(updateData)
    .eq('id', documentoId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

/**
 * Eliminar documento
 */
export const eliminarDocumento = async (documentoId, urlArchivo) => {
  try {
    // Extraer ruta del archivo desde la URL
    const url = new URL(urlArchivo);
    const pathParts = url.pathname.split('/');
    const bucket = pathParts[pathParts.length - 2];
    const fileName = decodeURIComponent(pathParts[pathParts.length - 1]);
    
    // Eliminar archivo de Storage
    const { error: storageError } = await supabase.storage
      .from('documentos-estudiantes')
      .remove([fileName]);
    
    if (storageError) console.error('Error al eliminar archivo de storage:', storageError);
    
    // Eliminar registro de la base de datos
    const { error: dbError } = await supabase
      .from('documentos')
      .delete()
      .eq('id', documentoId);
    
    if (dbError) throw dbError;
    
    return { success: true };
  } catch (error) {
    console.error('Error al eliminar documento:', error);
    throw error;
  }
};

/**
 * Obtener estadísticas de documentos
 */
export const obtenerEstadisticasDocumentos = async () => {
  const { data, error } = await supabase
    .from('vista_estadisticas_documentos')
    .select('*');
  
  if (error) throw error;
  return data;
};


// ============================================
// FUNCIONES PARA PERFIL DE ESTUDIANTE
// ============================================

/**
 * Obtener perfil completo de un estudiante
 */
export const obtenerPerfilEstudiante = async (estudianteId) => {
  const { data, error } = await supabase
    .from('vista_matriculas_completas')
    .select('*')
    .eq('estudiante_id', estudianteId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

/**
 * Actualizar información del estudiante
 */
export const actualizarEstudiante = async (estudianteId, cambios) => {
  const { data, error } = await supabase
    .from('estudiantes')
    .update(cambios)
    .eq('id', estudianteId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

/**
 * Actualizar información del acudiente
 */
export const actualizarAcudiente = async (acudienteId, cambios) => {
  const { data, error } = await supabase
    .from('acudientes')
    .update(cambios)
    .eq('id', acudienteId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};


// ============================================
// FUNCIONES PARA INSTITUCIONES Y PLANES
// ============================================

/**
 * Obtener información de la institución actual
 */
export const obtenerInstitucionActual = async (institucionId) => {
  const { data, error } = await supabase
    .from('instituciones')
    .select('*')
    .eq('id', institucionId)
    .single();
  
  if (error) throw error;
  return data;
};

/**
 * Actualizar plan de una institución
 */
export const actualizarPlanInstitucion = async (institucionId, nuevoPlan) => {
  const { data, error } = await supabase
    .from('instituciones')
    .update({ plan: nuevoPlan })
    .eq('id', institucionId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

/**
 * Crear nueva institución
 */
export const crearInstitucion = async (datosInstitucion) => {
  const { data, error } = await supabase
    .from('instituciones')
    .insert(datosInstitucion)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

/**
 * Obtener todas las instituciones (para superadmin)
 */
export const obtenerTodasInstituciones = async () => {
  const { data, error } = await supabase
    .from('instituciones')
    .select('*')
    .order('nombre', { ascending: true });
  
  if (error) throw error;
  return data;
};
