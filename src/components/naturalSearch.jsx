import { useState, useEffect, useRef } from 'react';
import { API_ENDPOINTS } from '../config/apiConfig';
import { checkLLM } from '../utils/checkLLM';

const BusquedaNatural = ({ onSeleccionar, consulta }) => {
  const [personas, setPersonas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);
  const [llmDisponible, setLlmDisponible] = useState(null);
  const cargaInicial = useRef(false);

  // Verificar si el LLM está disponible al montar el componente
  useEffect(() => {
    const verificarLLM = async () => {
      const result = await checkLLM();
      setLlmDisponible(result.status);
      
      if (result.status && consulta && !cargaInicial.current) {
        cargaInicial.current = true;
        realizarBusqueda();
      }
    };

    verificarLLM();
  }, []);

  const realizarBusqueda = async () => {
    if (!consulta || consulta.trim() === '') {
      setError('Debe ingresar una consulta');
      return;
    }

    setCargando(true);
    setError(null);
    setBusquedaRealizada(true);

    try {
      const response = await fetch(API_ENDPOINTS.RAG, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ consulta: consulta })
      });

      if (response.ok) {
        const result = await response.json();
        
        console.log('Respuesta RAG:', result);
        
        
        if (Array.isArray(result.personas)) {
          // Mapear las personas al formato del frontend
          const personasMapeadas = result.personas.map(persona => ({
            id: persona.id,
            primer_nombre: persona.primer_nombre,
            segundo_nombre: persona.segundo_nombre || '',
            apellidos: persona.apellidos,
            fecha_nacimiento: persona.fecha_nacimiento,
            genero: persona.genero,
            correo: persona.correo,
            celular: persona.celular || persona.phone,
            nro_documento: persona.nro_documento,
            tipo_documento: persona.tipo_documento,
            foto: persona.foto
          }));
          
          setPersonas(personasMapeadas);
          
          if (personasMapeadas.length === 0) {
            setError('No se encontraron personas que coincidan con la búsqueda');
          }
        } else {
          setError('Formato de respuesta inesperado');
          console.error('Respuesta no es un array:', result);
        }
      } else {
        setError('Error al realizar la búsqueda');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error al conectar con la API');
    } finally {
      setCargando(false);
    }
  };

  // Estado: Verificando LLM
  if (llmDisponible === null) {
    return (
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
          <p className="text-center text-gray-600">Verificando disponibilidad del servicio de IA...</p>
        </div>
      </div>
    );
  }

  // Estado: LLM no disponible
  if (llmDisponible === false) {
    return (
      <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-6">
        <div className="flex items-center justify-center gap-3">
          <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="text-yellow-800 font-semibold">Servicio de IA no disponible</p>
            <p className="text-yellow-700 text-sm">La búsqueda en lenguaje natural no está disponible en este momento.</p>
          </div>
        </div>
      </div>
    );
  }

  // Estado: Cargando búsqueda
  if (cargando) {
    return (
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
          <p className="text-center text-gray-600">Procesando consulta con IA...</p>
          <p className="text-center text-sm text-gray-500 mt-2">"{consulta}"</p>
        </div>
      </div>
    );
  }

  // Estado: Error
  if (error && personas.length === 0) {
    return (
      <div className="bg-red-50 border border-red-300 rounded-lg p-6">
        <p className="text-center text-red-600 mb-3">{error}</p>
        <button 
          onClick={realizarBusqueda}
          className="mx-auto block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
        >
          Reintentar búsqueda
        </button>
      </div>
    );
  }

  // Estado: Búsqueda no realizada aún
  if (!busquedaRealizada) {
    return (
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <p className="text-center text-gray-600">Presione "Consultar" para realizar la búsqueda</p>
      </div>
    );
  }

  // Estado: Resultados
  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Personas Encontradas ({personas.length})
          </h2>
          <p className="text-sm text-gray-600 italic mt-1">Consulta: "{consulta}"</p>
        </div>
        <button 
          onClick={realizarBusqueda}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
        >
          Buscar de nuevo
        </button>
      </div>

      {personas.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No se encontraron personas que coincidan con la consulta
        </div>
      ) : (
        <div className="grid gap-2 max-h-96 overflow-y-auto">
          {personas.map((persona, index) => (
            <div
              key={persona.nro_documento || index}
              onClick={() => onSeleccionar(persona)}
              className="border border-gray-300 p-3 rounded hover:bg-green-50 hover:border-green-400 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                {/* Foto miniatura */}
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-300 flex-shrink-0 bg-gray-100">
                  {persona.foto ? (
                    <img
                      src={persona.foto}
                      alt={`${persona.primer_nombre} ${persona.apellidos}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      Sin foto
                    </div>
                  )}
                </div>
                
                {/* Información de la persona */}
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">
                    {persona.primer_nombre} {persona.segundo_nombre && persona.segundo_nombre + ' '}{persona.apellidos}
                  </p>
                  <p className="text-sm text-gray-600">
                    {persona.tipo_documento}: {persona.nro_documento}
                  </p>
                  <p className="text-xs text-gray-500">
                    {persona.correo}
                  </p>
                </div>
                
                {/* Indicador visual */}
                <div className="text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BusquedaNatural;