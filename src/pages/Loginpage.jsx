import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';

function LoginPage() {
  const { loginWithRedirect, isAuthenticated } = useAuth0();


  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/';
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          {/* Icono */}
          <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
            <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Gestión de Datos Personales
          </h1>
          <p className="text-gray-600">
            Inicia sesión para continuar
          </p>
        </div>

        {/* Botón de login */}
        <button
          onClick={() => loginWithRedirect()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-3 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
          Iniciar Sesión
        </button>

        {/* Información adicional */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-2">
            Puedes iniciar sesión con su cuenta corporativa
          </p>
          <div className="flex justify-center gap-3 text-xs text-gray-600">
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Al iniciar sesión, aceptas nuestros</p>
          <p className="mt-6 text-center text-xs text-gray-500">
            Términos de Servicio y Política de Privacidad
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;