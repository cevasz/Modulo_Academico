import React, { useState } from 'react';
import {
  MODULOS,
  agruparModulosPorCategoria,
  obtenerNombrePlan,
  PRECIOS_PLANES,
  esModuloDisponible
} from '../config/planesModulos';

const MenuLateral = ({ planActual, onNavegar, vistaActual, onSolicitarUpgrade }) => {
  const [expandido, setExpandido] = useState(true);
  const [mostrarUpgrade, setMostrarUpgrade] = useState(null);
  
  const modulosAgrupados = agruparModulosPorCategoria(planActual);

  const iconos = {
    document: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    ),
    user: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    ),
    folder: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
    ),
    calendar: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    ),
    chart: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    ),
    mail: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    ),
    book: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    ),
    clipboard: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    ),
    users: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    ),
    award: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    ),
    message: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    ),
    robot: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    ),
    ai: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
    ),
    brain: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    ),
    graph: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
    ),
    'document-report': (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    ),
    whatsapp: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    ),
    phone: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    ),
    trending: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    ),
    lightning: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
    ),
    signature: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    ),
    code: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    ),
    'calendar-event': (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    )
  };

  const ItemMenu = ({ modulo, disponible }) => {
    const activo = vistaActual === modulo.id;

    if (!disponible) {
      return (
        <button
          onClick={() => setMostrarUpgrade(modulo.planMinimo)}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-100 transition-colors duration-200 rounded-lg group relative"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 opacity-50">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {iconos[modulo.icono] || iconos.document}
            </svg>
          </div>
          
          {expandido && (
            <>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium line-through">{modulo.nombre}</p>
                <p className="text-xs text-gray-400">Disponible en {obtenerNombrePlan(modulo.planMinimo)}</p>
              </div>
              
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </>
          )}

          {!expandido && (
            <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
              🔒 {modulo.nombre}
              <br />
              <span className="text-gray-300">Requiere {obtenerNombrePlan(modulo.planMinimo)}</span>
            </div>
          )}
        </button>
      );
    }

    return (
      <button
        onClick={() => onNavegar(modulo.id)}
        className={`w-full flex items-center gap-3 px-4 py-3 transition-colors duration-200 rounded-lg group relative ${
          activo
            ? 'bg-indigo-600 text-white shadow-lg'
            : 'text-gray-700 hover:bg-indigo-50'
        }`}
      >
        <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
          activo ? 'bg-indigo-500' : 'bg-indigo-100'
        }`}>
          <svg className={`w-6 h-6 ${activo ? 'text-white' : 'text-indigo-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {iconos[modulo.icono] || iconos.document}
          </svg>
        </div>
        
        {expandido && (
          <div className="flex-1 text-left">
            <p className="text-sm font-medium">{modulo.nombre}</p>
            {!activo && <p className="text-xs text-gray-500">{modulo.descripcion}</p>}
          </div>
        )}

        {!expandido && (
          <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
            {modulo.nombre}
          </div>
        )}
      </button>
    );
  };

  return (
    <>
      <div className={`bg-white h-screen border-r border-gray-200 flex flex-col transition-all duration-300 ${
        expandido ? 'w-80' : 'w-20'
      }`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {expandido && (
              <div>
                <h2 className="text-lg font-bold text-gray-900">Sistema Institucional</h2>
                <p className="text-xs text-gray-500">{obtenerNombrePlan(planActual)}</p>
              </div>
            )}
            <button
              onClick={() => setExpandido(!expandido)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {expandido ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Módulos por categoría */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {Object.entries(modulosAgrupados).map(([categoria, { disponibles, bloqueados }]) => (
            <div key={categoria}>
              {expandido && (
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  {categoria}
                </h3>
              )}
              
              <div className="space-y-2">
                {disponibles.map(modulo => (
                  <ItemMenu key={modulo.id} modulo={modulo} disponible={true} />
                ))}
                
                {bloqueados.map(modulo => (
                  <ItemMenu key={modulo.id} modulo={modulo} disponible={false} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer con upgrade */}
        {expandido && (
          <div className="p-4 border-t border-gray-200">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-4 text-white">
              <h4 className="font-semibold mb-1">¿Necesitas más?</h4>
              <p className="text-xs text-indigo-100 mb-3">Mejora tu plan y desbloquea funcionalidades avanzadas</p>
              <button
                onClick={() => onSolicitarUpgrade()}
                className="w-full bg-white text-indigo-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-50 transition"
              >
                Ver Planes
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de upgrade */}
      {mostrarUpgrade && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-900">Mejora tu Plan</h3>
                <button
                  onClick={() => setMostrarUpgrade(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-white mb-6">
                <h4 className="text-xl font-bold mb-2">{obtenerNombrePlan(mostrarUpgrade)}</h4>
                <p className="text-3xl font-bold mb-2">{PRECIOS_PLANES[mostrarUpgrade].precio}</p>
                <p className="text-indigo-100 text-sm">{PRECIOS_PLANES[mostrarUpgrade].descripcion}</p>
              </div>

              <div className="space-y-3 mb-6">
                <h5 className="font-semibold text-gray-900">Incluye:</h5>
                {PRECIOS_PLANES[mostrarUpgrade].caracteristicas.map((caracteristica, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-700">{caracteristica}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  onSolicitarUpgrade(mostrarUpgrade);
                  setMostrarUpgrade(null);
                }}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                Solicitar Upgrade
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MenuLateral;
