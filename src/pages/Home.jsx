import { useState, useRef, useEffect } from 'react'
import PersonForm from '../components/PersonForm'
import ConsultaDoc from '../components/consultDoc'
import ListaPersonas from '../components/personList'
import PersonDetail from '../components/PersonDetail'
import BusquedaNatural from '../components/naturalSearch'
import { checkLLM } from '../utils/checkLLM'
import { checkQueryModule } from '../utils/chekQueryModule'

function Home() {
  const [consulta, setConsulta] = useState("");
  const [modo, setModo] = useState("inicio");
  const [personaSeleccionada, setPersonaSeleccionada] = useState(null);
  const [documentoBuscar, setDocumentoBuscar] = useState("");
  const [consultaNatural, setConsultaNatural] = useState("");
  const [llmDisponible, setLlmDisponible] = useState(null);
  const [queryModuleDisponible, setQueryModuleDisponible] = useState(null); // ← Nuevo estado
  const listaPersonasRef = useRef(null);

  // Verificar LLM y QueryModule al cargar
  useEffect(() => {
    const verificar = async () => {
      // Verificar LLM
      const resultLLM = await checkLLM();
      setLlmDisponible(resultLLM.status);
      
      // Verificar módulo de consulta
      const resultQuery = await checkQueryModule();
      setQueryModuleDisponible(resultQuery.status);
    };
    verificar();
  }, []);

  const cerrarFormulario = () => {
    setModo("inicio");
    setPersonaSeleccionada(null);
    setConsulta("");
  };

  const buscarPorDocumento = () => {
    if (!queryModuleDisponible) {
      alert('El módulo de consulta no está disponible en este momento');
      return;
    }
    
    if (documentoBuscar.trim()) {
      setModo("buscar_doc");
      setConsulta(`Búsqueda por documento: ${documentoBuscar}`);
    }
  };

  const buscarNatural = () => {
    if (!llmDisponible) {
      alert('La función de búsqueda natural no está disponible en este momento');
      return;
    }
    
    if (consultaNatural.trim()) {
      setModo("buscar_nl");
      setConsulta(`Búsqueda natural: ${consultaNatural}`);
    }
  };

  const seleccionarPersonaDeLista = (persona) => {
    setPersonaSeleccionada(persona);
    setModo("detalle");
    setConsulta(`Viendo: ${persona.primer_nombre} ${persona.apellidos}`);
  };

  const actualizarLista = () => {
    cerrarFormulario();
  };

  return (
    <div className="p-6 space-y-4">
      {consulta && (
        <div className="bg-blue-50 border-l-4 border-blue-600 p-3 rounded">
          <p className="text-blue-800 font-medium">
            <span className="font-bold">Consulta:</span> {consulta}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <div className="flex justify-end">
          <button 
            onClick={() => setModo("crear")} 
            className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 w-auto transition-colors flex items-center gap-2 shadow-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Crear Persona
          </button>
        </div>
        
        {/* Búsqueda por documento - Solo visible si el módulo está disponible */}
        {queryModuleDisponible === true && (
          <div className='flex gap-2'>
            <input
              type="text"
              placeholder="Buscar por documento"
              className="border p-2 rounded flex-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={documentoBuscar}
              onChange={(e) => setDocumentoBuscar(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && buscarPorDocumento()}
            />
            <button 
              onClick={buscarPorDocumento} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded transition-colors shadow-md"
            >
              Buscar
            </button>
          </div>
        )}
        
        {/* Búsqueda natural - Solo visible si LLM está disponible */}
        {llmDisponible === true && (
          <div className='flex gap-2'>
            <input
              type="text"
              placeholder="Consulta en lenguaje natural"
              className="border p-2 rounded flex-1 focus:ring-2 focus:ring-green-400 focus:outline-none"
              value={consultaNatural}
              onChange={(e) => setConsultaNatural(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && buscarNatural()}
            />
            <button 
              onClick={buscarNatural}
              className="bg-green-600 hover:bg-green-700 text-white px-4 rounded transition-colors shadow-md"
            >
              Consultar
            </button>
          </div>
        )}

        {/* Mensajes de módulos no disponibles */}
        <div className="space-y-2">
          {/* Mensaje cuando módulo de consulta no está disponible */}
          {queryModuleDisponible === false && modo === "inicio" && (
            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3">
              <p className="text-sm text-yellow-800 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                El módulo de consulta de personas no está disponible actualmente
              </p>
            </div>
          )}

          {/* Mensaje cuando LLM no está disponible */}
          {llmDisponible === false && modo === "inicio" && (
            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3">
              <p className="text-sm text-yellow-800 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                La búsqueda en lenguaje natural no está disponible actualmente
              </p>
            </div>
          )}

          {/* Verificando módulos */}
          {(queryModuleDisponible === null || llmDisponible === null) && (
            <div className="bg-gray-50 border border-gray-300 rounded-lg p-3">
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                Verificando disponibilidad de servicios...
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Formulario crear persona */}
      {modo === "crear" && (
        <PersonForm onClose={cerrarFormulario} onActualizar={actualizarLista} />
      )}

      {/* Consulta por documento */}
      {modo === "buscar_doc" && (
        <ConsultaDoc 
          onClose={cerrarFormulario} 
          documento={documentoBuscar}
          onActualizar={actualizarLista}
        />
      )}

      {/* Búsqueda natural */}
      {modo === "buscar_nl" && llmDisponible && (
        <BusquedaNatural 
          consulta={consultaNatural}
          onSeleccionar={seleccionarPersonaDeLista}
        />
      )}

      {/* Detalle de persona desde la lista o búsqueda natural */}
      {modo === "detalle" && personaSeleccionada && (
        <PersonDetail 
          onClose={cerrarFormulario}
          personaInicial={personaSeleccionada}
          onActualizar={actualizarLista}
        />
      )}

      {/* Lista de todas las personas - Solo visible si módulo de consulta está disponible */}
      {modo === "inicio" && queryModuleDisponible === true && (
        <ListaPersonas 
          ref={listaPersonasRef}
          onSeleccionar={seleccionarPersonaDeLista}
        />
      )}

      {/* Mensaje cuando lista no está disponible */}
      {modo === "inicio" && queryModuleDisponible === false && (
        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-6">
          <div className="flex flex-col items-center justify-center gap-3">
            <svg className="w-16 h-16 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="text-center">
              <p className="text-yellow-800 font-semibold text-lg mb-2">
                Módulo de Consulta No Disponible
              </p>
              <p className="text-yellow-700">
                El servicio de consulta de personas está temporalmente deshabilitado.
              </p>
              <p className="text-yellow-600 text-sm mt-2">
                Puede crear nuevas personas, pero no consultar las existentes.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Loading mientras verifica */}
      {modo === "inicio" && queryModuleDisponible === null && (
        <div className="bg-white border border-gray-300 rounded-lg p-6">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-center text-gray-600">Verificando disponibilidad del servicio...</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home