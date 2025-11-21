import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/Loginpage'
import Home from './pages/Home'
import LogsPage from './pages/LogsPage'
import './App.css'

function App() {
  const { isAuthenticated, isLoading } = useAuth0();

  // Mostrar loading global mientras verifica
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700">
        <div className="bg-white rounded-lg p-8 shadow-2xl">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg text-center">Cargando aplicación...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Ruta de login */}
      <Route 
        path="/login" 
        element={
          isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
        } 
      />

      {/* Rutas protegidas */}
      <Route element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route path="/" element={<Home />} />
        <Route path="/logs" element={<LogsPage />} />
      </Route>

      {/* Ruta por defecto - redirige según autenticación */}
      <Route 
        path="*" 
        element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} 
      />
    </Routes>
  )
}

export default App