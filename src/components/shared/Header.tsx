'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/hooks/useCart';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const profileRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
          ? 'bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 py-3'
          : 'bg-transparent py-6'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <nav className="flex items-center justify-between relative">
          {/* Logo */}
          <Link
            href="/"
            className="relative group z-10"
          >
            <div className="absolute -inset-2 bg-purple-500/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <span className="relative font-black text-2xl tracking-tighter text-white">
              TAKOPI
              <span className="text-purple-500">.</span>
            </span>
          </Link>

          {/* Desktop Navigation - Floating Pill */}
          <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full p-1.5 shadow-2xl shadow-black/20">
            {[
              { name: 'Inicio', path: '/' },
              { name: 'Explorar', path: '/explore' },
              { name: 'Impresión 3D', path: '/impresion-3d' }
            ].map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`relative px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isActive(item.path)
                    ? 'text-white bg-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                {item.name}
                {isActive(item.path) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-purple-500 rounded-full shadow-[0_0_10px_#a855f7]"></span>
                )}
              </Link>
            ))}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center gap-4 z-10">
            {/* Cart Button */}
            {user && (
              <Link
                href="/box"
                className="group relative p-2 text-gray-400 hover:text-white transition-colors"
              >
                <div className="absolute -inset-2 bg-purple-500/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-[0_0_10px_#a855f7]">
                      {itemCount}
                    </span>
                  )}
                </div>
              </Link>
            )}

            {/* Upload Button */}
            {user && (
              <Link
                href="/upload"
                className="group relative px-5 py-2 bg-white text-black rounded-full font-bold text-sm hover:scale-105 transition-transform overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative group-hover:text-white transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  Crear
                </span>
              </Link>
            )}

            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 p-[2px]">
                    <div className="w-full h-full rounded-full bg-black overflow-hidden">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-4 w-56 bg-[#0f0f0f] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] py-2 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-white/5 mb-2">
                      <p className="text-sm text-white font-bold">{user.username}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      Mi Perfil
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsProfileOpen(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  href="/auth/register"
                  className="px-5 py-2 bg-white text-black rounded-full font-bold text-sm hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className={`w-full h-0.5 bg-white rounded-full transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`w-full h-0.5 bg-white rounded-full transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-full h-0.5 bg-white rounded-full transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
            </div>
          </button>
        </nav>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-[#0a0a0a] border-b border-white/10 p-4 animate-in slide-in-from-top-5 shadow-2xl">
            <div className="flex flex-col gap-2">
              {[
                { name: 'Inicio', path: '/' },
                { name: 'Explorar', path: '/explore' },
                { name: 'Impresión 3D', path: '/impresion-3d' }
              ].map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`p-4 rounded-xl text-lg font-medium transition-colors ${isActive(item.path) ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              <div className="h-px bg-white/10 my-2"></div>

              {user ? (
                <>
                  <Link href="/box" className="p-4 rounded-xl text-lg font-medium text-gray-400 hover:bg-white/5 hover:text-white flex items-center justify-between" onClick={() => setIsMenuOpen(false)}>
                    Box (Carrito)
                    {itemCount > 0 && <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">{itemCount}</span>}
                  </Link>
                  <Link href="/upload" className="p-4 rounded-xl text-lg font-medium text-gray-400 hover:bg-white/5 hover:text-white" onClick={() => setIsMenuOpen(false)}>
                    Subir Contenido
                  </Link>
                  <Link href="/profile" className="p-4 rounded-xl text-lg font-medium text-gray-400 hover:bg-white/5 hover:text-white" onClick={() => setIsMenuOpen(false)}>
                    Mi Perfil
                  </Link>
                  <button
                    onClick={() => { logout(); setIsMenuOpen(false); }}
                    className="p-4 rounded-xl text-lg font-medium text-red-400 hover:bg-red-500/10 text-left"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <Link href="/auth/login" className="p-3 text-center rounded-xl bg-white/5 text-white font-medium" onClick={() => setIsMenuOpen(false)}>
                    Entrar
                  </Link>
                  <Link href="/auth/register" className="p-3 text-center rounded-xl bg-white text-black font-bold" onClick={() => setIsMenuOpen(false)}>
                    Registrarse
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}