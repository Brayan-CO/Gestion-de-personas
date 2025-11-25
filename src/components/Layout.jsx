import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { useState, useEffect, useRef } from 'react'
import ToggleSwitch from './switch.jsx'
function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isLoading } = useAuth0();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout({ 
      logoutParams: { 
        returnTo: window.location.origin
      } 
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar compartido */}
      <nav className="bg-blue-600 shadow-lg sticky top-0 z-50">
        <div className="p-4">
          <div className="flex justify-between items-center">
            <div 
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate('/')}
            >
              <h1 className="text-3xl font-bold text-blue-100">Gestión De Datos Personales</h1>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Botones de navegación */}
              <div className="flex gap-2">
                <button
                  onClick={() => navigate('/')}
                  className={`px-4 py-2 rounded transition-colors flex items-center gap-2 ${
                    location.pathname === '/'
                      ? 'bg-blue-800 text-white shadow-lg'
                      : 'bg-blue-500 hover:bg-blue-700 text-white'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Inicio
                </button>
                
                <button
                  onClick={() => navigate('/logs')}
                  className={`px-4 py-2 rounded transition-colors flex items-center gap-2 ${
                    location.pathname === '/logs'
                      ? 'bg-blue-800 text-white shadow-lg'
                      : 'bg-blue-500 hover:bg-blue-700 text-white'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Logs
                </button>
              </div>

              {/* Menú de usuario */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-700 text-white px-3 py-2 rounded transition-colors"
                >
                  {user?.picture ? (
                    <img 
                      src={user.picture} 
                      alt={user.name} 
                      className="w-8 h-8 rounded-full border-2 border-blue-300" 
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-300 flex items-center justify-center font-bold text-blue-800">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  <span className="hidden md:block max-w-32 truncate">
                    {user?.name || 'Usuario'}
                  </span>
                  <svg 
                    className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-200">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        {user?.picture ? (
                          <img 
                            src={user.picture} 
                            alt={user.name} 
                            className="w-12 h-12 rounded-full" 
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 text-xl">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">
                            {user?.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido de las páginas */}
      <main className="flex-1"> 
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 mt-auto">
        <ToggleSwitch />
        <div className="text-center">
          <p className="text-sm">© 2025 Sistema de Gestión de Datos Personales</p>
          <p className="text-xs text-gray-400 mt-1">
            {user?.email && `Sesión iniciada como: ${user.email}`}
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Layout