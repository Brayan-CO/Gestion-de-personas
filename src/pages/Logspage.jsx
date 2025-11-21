import Log from '../components/Logs'

function LogsPage() {
  return (
    <div className="min-h-full p-6 space-y-4">
      <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg">
        <h2 className="text-2xl font-bold text-blue-900 mb-2">
          Registro de Transacciones
        </h2>
        <p className="text-blue-700">
          Visualiza y filtra todas las operaciones realizadas en el sistema
        </p>
      </div>

      {/* Componente de logs */}
      <Log />
    </div>
  )
}

export default LogsPage