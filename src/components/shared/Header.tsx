'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

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
              href="/feed"
              className="text-gray-300 hover:text-purple-400 transition-colors"
            >
              Feed
            </Link>
            <Link
              href="/explore"
              className="text-gray-300 hover:text-purple-400 transition-colors"
            >
              Explorar
            </Link>
            <Link
              href="/cultural-map"
              className="text-gray-300 hover:text-purple-400 transition-colors"
            >
              Mapa Cultural
            </Link>
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <span className="text-gray-300 text-sm">
                  Hola, <span className="text-purple-400 font-medium">{user.username}</span>
                </span>
                <Link
                  href="/feed"
                  className="text-gray-300 hover:text-purple-400 transition-colors px-4 py-2 rounded-lg hover:bg-purple-500/20"
                >
                  Mi Feed
                </Link>
                <button
                  onClick={logout}
                  className="text-gray-300 hover:text-red-400 transition-colors px-4 py-2 rounded-lg hover:bg-red-500/20"
                >
                  Cerrar Sesión
                </button>
              </>
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
                href="/feed"
                className="text-gray-300 hover:text-purple-400 transition-colors py-2 px-4 rounded-lg hover:bg-purple-500/10"
                onClick={() => setIsMenuOpen(false)}
              >
                Feed
              </Link>
              <Link
                href="/explore"
                className="text-gray-300 hover:text-purple-400 transition-colors py-2 px-4 rounded-lg hover:bg-purple-500/10"
                onClick={() => setIsMenuOpen(false)}
              >
                Explorar
              </Link>
              <Link
                href="/cultural-map"
                className="text-gray-300 hover:text-purple-400 transition-colors py-2 px-4 rounded-lg hover:bg-purple-500/10"
                onClick={() => setIsMenuOpen(false)}
              >
                Mapa Cultural
              </Link>
              <div className="flex flex-col gap-2 pt-2 border-t border-purple-500/20">
                {user ? (
                  <>
                    <div className="px-4 py-2 text-gray-300 text-sm">
                      Hola, <span className="text-purple-400 font-medium">{user.username}</span>
                    </div>
                    <Link
                      href="/feed"
                      className="text-gray-300 hover:text-purple-400 transition-colors py-2 px-4 rounded-lg hover:bg-purple-500/10"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Mi Feed
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="text-gray-300 hover:text-red-400 transition-colors py-2 px-4 rounded-lg hover:bg-red-500/10 text-left"
                    >
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