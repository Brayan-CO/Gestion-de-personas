import { useState, useEffect } from 'react';

const NaturalSearch = ({ onSeleccionar, consulta }) => {
  const [personas, setPersonas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);

  const realizarBusqueda = async () => {
    if (!consulta || consulta.trim() === '') {
      setError('Debe ingresar una consulta');
      return;
    }

    setCargando(true);
    setError(null);
    setBusquedaRealizada(true);

    try {
      const response = await fetch('TU_URL_API/rag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ consulta: consulta })
      });

      if (response.status === 403) {
     
        setError('La función de búsqueda natural ha sido deshabilitada');
      } else if (response.ok) {
        const data = await response.json();
        setPersonas(data);
        
        if (data.length === 0) {
          setError('No se encontraron personas que coincidan con la búsqueda');
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

  
  useEffect(() => {
    if (consulta) {
      realizarBusqueda();
    }
  }, []); 
  if (cargando) {
    return (
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-center text-gray-600">Buscando personas...</p>
          <p className="text-center text-sm text-gray-500 mt-2">"{consulta}"</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-300 rounded-lg p-6">
        <p className="text-center text-red-600 mb-3">{error}</p>
        {error !== 'La función de búsqueda natural ha sido deshabilitada' && (
          <button 
            onClick={realizarBusqueda}
            className="mx-auto block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
          >
            Reintentar búsqueda
          </button>
        )}
      </div>
    );
  }

  if (!busquedaRealizada) {
    return (
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <p className="text-center text-gray-600">Presione "Consultar" para realizar la búsqueda</p>
      </div>
    );
  }

  if (personas.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-6">
        <p className="text-center text-yellow-800 mb-2">No se encontraron resultados</p>
        <p className="text-center text-sm text-yellow-700">Consulta: "{consulta}"</p>
        <button 
          onClick={realizarBusqueda}
          className="mt-4 mx-auto block bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded transition-colors"
        >
          Buscar nuevamente
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Resultados de búsqueda ({personas.length})
          </h2>
          <p className="text-sm text-gray-600 italic mt-1">Consulta: "{consulta}"</p>
        </div>
        <button 
          onClick={realizarBusqueda}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
        >
          Actualizar
        </button>
      </div>
      
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
    </div>
  );
};

export default NaturalSearch;