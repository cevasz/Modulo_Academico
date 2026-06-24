import React, { useState, useEffect } from 'react';
import MatriculaForm from './components/MatriculaForm';
import GestionDocumental from './components/GestionDocumental';
import PerfilEstudiante from './components/PerfilEstudiante';
import MenuLateral from './components/MenuLateral';
import { PLANES } from './config/planesModulos';

function App() {
  const [vistaActual, setVistaActual] = useState('matricula');
  
  // En producción, esto vendría de Supabase según la institución autenticada
  // Por ahora usamos un estado local para demostración
  const [planActual, setPlanActual] = useState(PLANES.ESENCIAL);
  const [mostrarSelectorPlan, setMostrarSelectorPlan] = useState(false);

  const handleNavegar = (moduloId) => {
    setVistaActual(moduloId);
  };

  const handleSolicitarUpgrade = (planSolicitado = null) => {
    if (planSolicitado) {
      alert(`Solicitud de upgrade a ${planSolicitado} enviada. Un asesor se pondrá en contacto pronto.`);
    } else {
      setMostrarSelectorPlan(true);
    }
  };

  const renderContenido = () => {
    switch (vistaActual) {
      case 'matricula':
        return <MatriculaForm />;
      case 'documentos':
        return <GestionDocumental />;
      case 'perfil':
        return <PerfilEstudiante />;
      default:
        return (
          <div className="flex items-center justify-center h-screen bg-gray-50">
            <div className="text-center">
              <svg className="w-24 h-24 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Módulo en Desarrollo</h2>
              <p className="text-gray-600">Este módulo estará disponible próximamente</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Menú Lateral */}
      <MenuLateral
        planActual={planActual}
        onNavegar={handleNavegar}
        vistaActual={vistaActual}
        onSolicitarUpgrade={handleSolicitarUpgrade}
      />

      {/* Contenido Principal */}
      <div className="flex-1 overflow-y-auto">
        {/* Header Superior con selector de plan (solo para demo) */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {vistaActual === 'matricula' && 'Matrícula Digital'}
                {vistaActual === 'documentos' && 'Gestión Documental'}
                {vistaActual === 'perfil' && 'Perfil Estudiante'}
                {!['matricula', 'documentos', 'perfil'].includes(vistaActual) && 'Módulo en Desarrollo'}
              </h1>
            </div>
            
            {/* Selector de plan para demo */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Plan de Demo:</span>
              <select
                value={planActual}
                onChange={(e) => setPlanActual(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
              >
                <option value={PLANES.ESENCIAL}>Esencial</option>
                <option value={PLANES.SMART}>Smart</option>
                <option value={PLANES.CAMPUS_IA}>Campus IA</option>
                <option value={PLANES.ENTERPRISE}>Enterprise</option>
              </select>
              <span className="text-xs text-gray-500">(Para pruebas)</span>
            </div>
          </div>
        </div>

        {/* Contenido del módulo */}
        <main>
          {renderContenido()}
        </main>
      </div>

      {/* Modal selector de planes (para demostración) */}
      {mostrarSelectorPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Elige tu Plan</h2>
                  <p className="text-gray-600 mt-2">Selecciona el plan que mejor se ajuste a las necesidades de tu institución</p>
                </div>
                <button
                  onClick={() => setMostrarSelectorPlan(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries({ esencial: 'Esencial', smart: 'Smart', campus_ia: 'Campus IA', enterprise: 'Enterprise' }).map(([plan, nombre]) => (
                  <div
                    key={plan}
                    className={`border-2 rounded-xl p-6 transition-all hover:shadow-xl ${
                      planActual === plan ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'
                    }`}
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{nombre}</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {plan === 'esencial' && 'Digitalización básica completa'}
                      {plan === 'smart' && 'Campus conectado'}
                      {plan === 'campus_ia' && 'Inteligencia institucional'}
                      {plan === 'enterprise' && 'Ecosistema autónomo'}
                    </p>
                    <p className="text-3xl font-bold text-indigo-600 mb-6">
                      {plan === 'esencial' && 'Base'}
                      {plan === 'smart' && '$4M'}
                      {plan === 'campus_ia' && '$5.5M'}
                      {plan === 'enterprise' && '$7M'}
                    </p>
                    <button
                      onClick={() => {
                        setPlanActual(plan);
                        setMostrarSelectorPlan(false);
                      }}
                      className={`w-full py-2 rounded-lg font-semibold transition ${
                        planActual === plan
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      {planActual === plan ? 'Plan Actual' : 'Seleccionar'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
