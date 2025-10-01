'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const profileRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown cuando se hace clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="border-b border-purple-500/20 bg-black/40 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="font-bold text-2xl text-white hover:text-purple-400 transition-colors"
          >
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              TAKOPI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-gray-300 hover:text-purple-400 transition-all duration-300 relative group"
            >
              Inicio
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/explore"
              className="text-gray-300 hover:text-purple-400 transition-all duration-300 relative group"
            >
              Explorar
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Botón Box (Carrito) - Solo para usuarios autenticados */}
            {user && (
              <Link
                href="/box"
                className="group relative px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-500 transform hover:scale-110 hover:rotate-1 shadow-lg hover:shadow-purple-500/30 flex items-center gap-2 overflow-hidden"
              >
                {/* Efecto de brillo animado */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                {/* Icono de caja con animación */}
                <div className="relative z-10 flex items-center gap-2">
                  <svg 
                    className="w-5 h-5 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" 
                    />
                  </svg>
                  <span className="font-semibold">Box</span>
                  
                  {/* Contador de items con mejor visibilidad */}
                  <div className="bg-white text-purple-700 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg border-2 border-purple-300 group-hover:animate-bounce">
                    0
                  </div>
                </div>
                
                {/* Efecto de partículas flotantes */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1 left-2 w-1 h-1 bg-white/60 rounded-full animate-ping group-hover:animate-bounce"></div>
                  <div className="absolute top-3 right-3 w-1 h-1 bg-white/40 rounded-full animate-ping group-hover:animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  <div className="absolute bottom-2 left-4 w-1 h-1 bg-white/50 rounded-full animate-ping group-hover:animate-bounce" style={{animationDelay: '0.4s'}}></div>
                </div>
              </Link>
            )}
            
            {/* Botón Subir - Solo para usuarios autenticados */}
            {user && (
              <Link
                href="/upload"
                className="group px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/25 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Subir
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
              </Link>
            )}
            {user ? (
              <div className="relative" ref={profileRef}>
                {/* User Profile Dropdown Trigger */}
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-purple-500/20"
                >
                  {/* Avatar */}
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.username}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-sm font-bold">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  {/* Username */}
                  <span className="font-medium">{user.username}</span>
                  {/* Dropdown Arrow */}
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-md border border-purple-500/20 rounded-xl shadow-2xl py-2 z-50 animate-in slide-in-from-top duration-200">
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-purple-500/20 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Perfil
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsProfileOpen(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 text-gray-300 hover:text-red-400 hover:bg-red-500/20 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-purple-500/20"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white hover:text-purple-400 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-purple-500/20 pt-4">
            <div className="flex flex-col gap-4">
              <Link
                href="/"
                className="text-gray-300 hover:text-purple-400 transition-colors py-2 px-4 rounded-lg hover:bg-purple-500/10"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link
                href="/explore"
                className="text-gray-300 hover:text-purple-400 transition-colors py-2 px-4 rounded-lg hover:bg-purple-500/10"
                onClick={() => setIsMenuOpen(false)}
              >
                Explorar
              </Link>
              <div className="flex flex-col gap-2 pt-2 border-t border-purple-500/20">
                {user ? (
                  <>
                    {/* Botón Box en Mobile */}
                    <Link
                      href="/box"
                      className="group relative text-gray-300 hover:text-purple-400 transition-all duration-300 py-2 px-4 rounded-lg hover:bg-purple-500/10 flex items-center gap-3 overflow-hidden"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {/* Efecto de brillo animado */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      
                      <div className="relative z-10 flex items-center gap-3">
                        <svg 
                          className="w-5 h-5 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" 
                          />
                        </svg>
                        <span className="font-semibold">Box</span>
                        
                        {/* Contador de items con mejor visibilidad */}
                        <div className="bg-white text-purple-700 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg border-2 border-purple-300 group-hover:animate-bounce">
                          0
                        </div>
                      </div>
                    </Link>
                    
                    {/* Botón Subir en Mobile */}
                    <Link
                      href="/upload"
                      className="text-gray-300 hover:text-green-400 transition-colors py-2 px-4 rounded-lg hover:bg-green-500/10 flex items-center gap-3"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Subir
                    </Link>
                    <div className="px-4 py-2 text-gray-300 text-sm flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.username}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-white text-xs font-bold">
                            {user.username.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <span className="text-purple-400 font-medium">{user.username}</span>
                    </div>
                    <Link
                      href="/profile"
                      className="text-gray-300 hover:text-purple-400 transition-colors py-2 px-4 rounded-lg hover:bg-purple-500/10 flex items-center gap-3"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Perfil
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="text-gray-300 hover:text-red-400 transition-colors py-2 px-4 rounded-lg hover:bg-red-500/10 text-left flex items-center gap-3"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Cerrar Sesión
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      className="text-gray-300 hover:text-white transition-colors py-2 px-4 rounded-lg hover:bg-purple-500/10"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Iniciar Sesión
                    </Link>
                    <Link
                      href="/auth/register"
                      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Registrarse
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}