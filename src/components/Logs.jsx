import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/apiConfig';

const Log = () => {
  const [logs, setLogs] = useState([]);
  const [logsFiltrados, setLogsFiltrados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Filtros
  const [filtros, setFiltros] = useState({
    action: "",
    documento: "",
    fechaInicio: "",
    fechaFin: ""
  });

  useEffect(() => {
    cargarLogs();
  }, []);

  const cargarLogs = async () => {
    setCargando(true);
    setError(null);
    try {
      const response = await fetch(API_ENDPOINTS.LOGS);
      if (response.ok) {
        const result = await response.json();
        setLogs(result.data);
        setLogsFiltrados(result.data);
      } else {
        setError('Error al cargar los logs');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error al conectar con la API');
    } finally {
      setCargando(false);
    }
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros({ ...filtros, [name]: value });
  };

  const aplicarFiltros = () => {
    let resultados = [...logs];

    // Filtrar por action
    if (filtros.action) {
      resultados = resultados.filter(log => log.action === filtros.action);
    }

    // Filtrar por documento
    if (filtros.documento) {
      resultados = resultados.filter(log => 
        log.documentNumber && log.documentNumber.includes(filtros.documento)
      );
    }

    // Filtrar por fecha inicio
    if (filtros.fechaInicio) {
      resultados = resultados.filter(log => {
        const fechaLog = new Date(log.timestamp);
        const fechaInicio = new Date(filtros.fechaInicio);
        return fechaLog >= fechaInicio;
      });
    }

    // Filtrar por fecha fin
    if (filtros.fechaFin) {
      resultados = resultados.filter(log => {
        const fechaLog = new Date(log.timestamp);
        const fechaFin = new Date(filtros.fechaFin);
        fechaFin.setHours(23, 59, 59, 999);
        return fechaLog <= fechaFin;
      });
    }

    setLogsFiltrados(resultados);
  };

  const limpiarFiltros = () => {
    setFiltros({
      action: "",
      documento: "",
      fechaInicio: "",
      fechaFin: ""
    });
    setLogsFiltrados(logs);
  };

  const limpiarLogs = async () => {
    const confirmar = window.confirm('¿Está seguro de eliminar todos los logs?');
    if (!confirmar) return;

    try {
      const response = await fetch(API_ENDPOINTS.DELETE_LOGS, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Logs eliminados exitosamente');
        cargarLogs();
      } else {
        alert('Error al eliminar los logs');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al conectar con la API');
    }
  };

  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    return date.toLocaleString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const obtenerColorAccion = (action) => {
    const colores = {
      'PERSON_CREATED': 'bg-green-100 text-green-800 border-green-300',
      'PERSONS_LIST_REQUESTED': 'bg-blue-100 text-blue-800 border-blue-300',
      'PERSON_RETRIEVED': 'bg-blue-100 text-blue-800 border-blue-300',
      'PERSON_UPDATED': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'PERSON_DELETED': 'bg-red-100 text-red-800 border-red-300'
    };
    return colores[action] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const obtenerIconoAccion = (action) => {
    const iconos = {
      'PERSON_CREATED': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      'PERSONS_LIST_REQUESTED': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      'PERSON_RETRIEVED': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      'PERSON_UPDATED': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      'PERSON_DELETED': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      )
    };
    return iconos[action] || null;
  };

  const traducirAccion = (action) => {
    const traducciones = {
      'PERSON_CREATED': 'Persona Creada',
      'PERSONS_LIST_REQUESTED': 'Lista Solicitada',
      'PERSON_RETRIEVED': 'Persona Consultada',
      'PERSON_UPDATED': 'Persona Actualizada',
      'PERSON_DELETED': 'Persona Eliminada'
    };
    return traducciones[action] || action;
  };

  const obtenerAccionesUnicas = () => {
    const acciones = [...new Set(logs.map(log => log.action))];
    return acciones.sort();
  };

  if (cargando) {
    return (
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-center text-gray-600">Cargando logs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-300 rounded-lg p-6">
        <p className="text-center text-red-600 mb-3">{error}</p>
        <button 
          onClick={cargarLogs}
          className="mx-auto block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Panel de filtros */}
      <div className="bg-white border border-gray-300 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Filtros de Búsqueda</h2>
          <button
            onClick={limpiarLogs}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
          >
            Limpiar Todos los Logs
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Filtro por acción */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Tipo de Acción:</label>
            <select
              name="action"
              value={filtros.action}
              onChange={handleFiltroChange}
              className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="">Todas</option>
              {obtenerAccionesUnicas().map(action => (
                <option key={action} value={action}>
                  {traducirAccion(action)}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por documento */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Nro. Documento:</label>
            <input
              type="text"
              name="documento"
              value={filtros.documento}
              onChange={handleFiltroChange}
              placeholder="Buscar por documento"
              className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* Filtro por fecha inicio */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Fecha Inicio:</label>
            <input
              type="date"
              name="fechaInicio"
              value={filtros.fechaInicio}
              onChange={handleFiltroChange}
              className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* Filtro por fecha fin */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Fecha Fin:</label>
            <input
              type="date"
              name="fechaFin"
              value={filtros.fechaFin}
              onChange={handleFiltroChange}
              className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={aplicarFiltros}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
          >
            Aplicar Filtros
          </button>
          <button
            onClick={limpiarFiltros}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
          >
            Limpiar Filtros
          </button>
          <button
            onClick={cargarLogs}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors ml-auto"
          >
            Actualizar Logs
          </button>
        </div>
      </div>

      {/* Tabla de logs */}
      <div className="bg-white border border-gray-300 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Registro de Transacciones ({logsFiltrados.length})
          </h2>
        </div>

        {logsFiltrados.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No se encontraron logs con los filtros aplicados
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="max-h-[600px] overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha y Hora
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acción
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Documento
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Servicio
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Detalles
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {logsFiltrados.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {formatearFecha(log.timestamp)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${obtenerColorAccion(log.action)}`}>
                          {obtenerIconoAccion(log.action)}
                          {traducirAccion(log.action)}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {log.documentNumber || '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {log.service}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {log.details && Object.keys(log.details).length > 0 ? (
                          <div className="max-w-xs truncate" title={JSON.stringify(log.details, null, 2)}>
                            {JSON.stringify(log.details)}
                          </div>
                        ) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            {obtenerIconoAccion('PERSON_CREATED')}
            <div>
              <p className="text-sm text-green-600 font-medium">Creadas</p>
              <p className="text-2xl font-bold text-green-800">
                {logsFiltrados.filter(l => l.action === 'PERSON_CREATED').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            {obtenerIconoAccion('PERSONS_LIST_REQUESTED')}
            <div>
              <p className="text-sm text-blue-600 font-medium">Listas</p>
              <p className="text-2xl font-bold text-blue-800">
                {logsFiltrados.filter(l => l.action === 'PERSONS_LIST_REQUESTED').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            {obtenerIconoAccion('PERSON_RETRIEVED')}
            <div>
              <p className="text-sm text-cyan-600 font-medium">Consultadas</p>
              <p className="text-2xl font-bold text-cyan-800">
                {logsFiltrados.filter(l => l.action === 'PERSON_RETRIEVED').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            {obtenerIconoAccion('PERSON_UPDATED')}
            <div>
              <p className="text-sm text-yellow-600 font-medium">Actualizadas</p>
              <p className="text-2xl font-bold text-yellow-800">
                {logsFiltrados.filter(l => l.action === 'PERSON_UPDATED').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            {obtenerIconoAccion('PERSON_DELETED')}
            <div>
              <p className="text-sm text-red-600 font-medium">Eliminadas</p>
              <p className="text-2xl font-bold text-red-800">
                {logsFiltrados.filter(l => l.action === 'PERSON_DELETED').length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Log;