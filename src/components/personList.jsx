import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/apiConfig';
import { mapPersonFromAPI } from '../utils/personMapper';

const PersonList = ({ onSeleccionar }) => {
  const [personas, setPersonas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarPersonas();
  }, []);

  const cargarPersonas = async () => {
    setCargando(true);
    setError(null);
    try {
      const response = await fetch(API_ENDPOINTS.READ_PERSONS);
      if (response.ok) {
        const result = await response.json();
        // Mapear los datos del backend al formato del frontend
        const personasMapeadas = result.data.map(mapPersonFromAPI);
        setPersonas(personasMapeadas);
      } else {
        setError('Error al cargar las personas');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error al conectar con la API');
    } finally {
      setCargando(false);
    }
  };

  const recargarLista = async () => {
    setCargando(true);
    try {
      const response = await fetch('http://localhost:3002/persons');
      if (response.ok) {
        const data = await response.json();
        setPersonas(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setCargando(false);
    }
  };

  if (cargando) {
    return (
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <p className="text-center text-gray-600">Cargando personas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-300 rounded-lg p-6">
        <p className="text-center text-red-600">{error}</p>
        <button 
          onClick={recargarLista}
          className="mt-3 mx-auto block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (personas.length === 0) {
    return (
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <p className="text-center text-gray-600">No hay personas registradas</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          Lista de Personas ({personas.length})
        </h2>
        <button 
          onClick={recargarLista}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
        >
          Actualizar
        </button>
      </div>
      
      <div className="grid gap-2 max-h-96 overflow-y-auto">
        {personas.map((persona) => (
          <div
            key={persona.nro_documento}
            onClick={() => onSeleccionar(persona)}
            className="border border-gray-300 p-3 rounded hover:bg-blue-50 hover:border-blue-400 cursor-pointer transition-colors"
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

export default PersonList;