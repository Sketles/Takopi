'use client';

import Layout from '@/components/shared/Layout';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const [featuredContent, setFeaturedContent] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch contenido destacado
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await fetch('/api/content/explore?limit=6');
        if (response.ok) {
          const result = await response.json();
          const data = result.data || result; // Soporta ambos formatos
          setFeaturedContent(Array.isArray(data) ? data.slice(0, 6) : []);
        }
      } catch (error) {
        console.error('Error fetching featured:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(147,51,234,0.3),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.2),transparent_50%)]"></div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-8 left-8 w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse opacity-70"></div>
          <div className="absolute top-16 right-16 w-2 h-2 bg-gradient-to-r from-blue-300 to-indigo-400 rounded-full animate-bounce opacity-60"></div>
          <div className="absolute bottom-8 left-8 w-3 h-3 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full animate-bounce opacity-50"></div>
          <div className="absolute bottom-16 right-16 w-1 h-1 bg-gradient-to-r from-cyan-300 to-teal-400 rounded-full animate-ping opacity-75"></div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 py-24 md:py-32">
            <div className="text-center space-y-8">
              <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  TAKOPI
                </span>
              </h1>
              
              <div className="text-lg sm:text-xl text-purple-300 font-light tracking-wider">
                MARKETPLACE PARA CREADORES DE CONTENIDO
              </div>

              <p className="text-xl sm:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
                La plataforma integral para comprar y vender contenido digital: modelos 3D, música, efectos, overlays para streaming, scripts, texturas y más
              </p>

              {/* Quick Stats */}
              <div className="flex flex-wrap justify-center gap-8 pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">7+</div>
                  <div className="text-sm text-gray-400">Tipos de Contenido</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">100%</div>
                  <div className="text-sm text-gray-400">Seguro</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-400">24/7</div>
                  <div className="text-sm text-gray-400">Disponible</div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
                <Link
                  href="/explore"
                  className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-500 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25 flex items-center gap-3"
                >
                  <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Explorar Contenido
                </Link>
                <Link
                  href="/auth/register"
                  className="group px-8 py-4 border-2 border-purple-400 text-purple-400 rounded-xl font-semibold hover:bg-purple-400 hover:text-white transition-all duration-500 transform hover:scale-105 flex items-center gap-3"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Comenzar a Vender
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Para Quién es Takopi */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-slate-900/50 to-slate-900">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  ¿Para Quién es Takopi?
                </span>
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Diseñado para cada tipo de creador de contenido
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Streamers */}
              <div className="group p-6 border border-purple-500/20 rounded-2xl bg-gradient-to-br from-purple-900/10 to-blue-900/10 backdrop-blur-sm hover:border-purple-400/40 transition-all duration-300 hover:scale-105">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🎮</div>
                <h3 className="font-bold text-lg mb-2 text-white">Streamers</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Overlays, alertas, música, efectos de sonido, widgets para OBS
                </p>
              </div>

              {/* Editores */}
              <div className="group p-6 border border-blue-500/20 rounded-2xl bg-gradient-to-br from-blue-900/10 to-cyan-900/10 backdrop-blur-sm hover:border-blue-400/40 transition-all duration-300 hover:scale-105">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🎬</div>
                <h3 className="font-bold text-lg mb-2 text-white">Editores de Video</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  LUTs, presets, scripts para Adobe/DaVinci, efectos, transiciones
                </p>
              </div>

              {/* Artistas 3D */}
              <div className="group p-6 border border-pink-500/20 rounded-2xl bg-gradient-to-br from-pink-900/10 to-rose-900/10 backdrop-blur-sm hover:border-pink-400/40 transition-all duration-300 hover:scale-105">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🗿</div>
                <h3 className="font-bold text-lg mb-2 text-white">Artistas 3D</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Modelos, texturas PBR, rigs, HDRIs, brushes para escultura
                </p>
              </div>

              {/* Músicos */}
              <div className="group p-6 border border-emerald-500/20 rounded-2xl bg-gradient-to-br from-emerald-900/10 to-green-900/10 backdrop-blur-sm hover:border-emerald-400/40 transition-all duration-300 hover:scale-105">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🎵</div>
                <h3 className="font-bold text-lg mb-2 text-white">Músicos</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Samples, loops, presets, MIDI packs, stems para producción
                </p>
              </div>

              {/* Diseñadores */}
              <div className="group p-6 border border-orange-500/20 rounded-2xl bg-gradient-to-br from-orange-900/10 to-red-900/10 backdrop-blur-sm hover:border-orange-400/40 transition-all duration-300 hover:scale-105">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🎨</div>
                <h3 className="font-bold text-lg mb-2 text-white">Diseñadores</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Ilustraciones, brushes, mockups, iconos, UI kits
                </p>
              </div>

              {/* Game Devs */}
              <div className="group p-6 border border-cyan-500/20 rounded-2xl bg-gradient-to-br from-cyan-900/10 to-blue-900/10 backdrop-blur-sm hover:border-cyan-400/40 transition-all duration-300 hover:scale-105">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">👾</div>
                <h3 className="font-bold text-lg mb-2 text-white">Game Developers</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Assets 3D, sprites, música, shaders, animaciones
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contenido Destacado */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Contenido Destacado
                </span>
              </h2>
              <p className="text-lg text-gray-300">
                Las creaciones más recientes de nuestra comunidad
              </p>
            </div>

            {isLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-2xl animate-pulse"></div>
                ))}
              </div>
            ) : featuredContent.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {featuredContent.map((content) => (
                  <Link
                    key={content.id}
                    href={`/contenido/${content.id}`}
                    className="group relative overflow-hidden rounded-2xl border border-purple-500/20 bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm hover:border-purple-400/40 transition-all duration-300 hover:scale-105"
                  >
                    {/* Cover Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={content.coverImage || content.image || '/placeholder-content.jpg'}
                        alt={content.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-2 right-2 px-3 py-1 bg-purple-600/90 backdrop-blur-sm rounded-full text-xs font-semibold text-white">
                        {content.contentType}
                      </div>
                    </div>

                    {/* Content Info */}
                    <div className="p-4">
                      <h3 className="font-bold text-white mb-2 line-clamp-1 group-hover:text-purple-300 transition-colors">
                        {content.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm">
                          por {content.author || 'Usuario'}
                        </span>
                        <span className="font-bold text-purple-400">
                          {content.isFree ? 'GRATIS' : `$${content.price?.toLocaleString('es-CL') || '0'}`}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400">No hay contenido disponible aún</p>
              </div>
            )}

            <div className="text-center">
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
              >
                Ver Todo el Contenido
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Reales */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-slate-900/50 to-slate-900">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Características Principales
                </span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Visualización 3D */}
              <div className="p-6 border border-purple-500/20 rounded-2xl bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-sm hover:border-purple-400/40 transition-all duration-300 group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🎯</div>
                <h3 className="font-bold text-xl mb-3 text-white">Previsualización 3D</h3>
                <p className="text-gray-300 leading-relaxed">
                  Explora modelos 3D interactivos con rotación 360° antes de comprar
                </p>
              </div>

              {/* Pagos Seguros */}
              <div className="p-6 border border-blue-500/20 rounded-2xl bg-gradient-to-br from-blue-900/20 to-cyan-900/20 backdrop-blur-sm hover:border-blue-400/40 transition-all duration-300 group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">💳</div>
                <h3 className="font-bold text-xl mb-3 text-white">Pagos con Transbank</h3>
                <p className="text-gray-300 leading-relaxed">
                  Integración oficial con Webpay Plus para pagos seguros en Chile
                </p>
              </div>

              {/* Dashboard */}
              <div className="p-6 border border-pink-500/20 rounded-2xl bg-gradient-to-br from-pink-900/20 to-rose-900/20 backdrop-blur-sm hover:border-pink-400/40 transition-all duration-300 group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📊</div>
                <h3 className="font-bold text-xl mb-3 text-white">Dashboard de Creador</h3>
                <p className="text-gray-300 leading-relaxed">
                  Estadísticas detalladas de ventas, vistas y engagement
                </p>
              </div>

              {/* Licencias */}
              <div className="p-6 border border-emerald-500/20 rounded-2xl bg-gradient-to-br from-emerald-900/20 to-green-900/20 backdrop-blur-sm hover:border-emerald-400/40 transition-all duration-300 group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📜</div>
                <h3 className="font-bold text-xl mb-3 text-white">Licencias Flexibles</h3>
                <p className="text-gray-300 leading-relaxed">
                  Personal, Indie y Profesional - Elige según tu proyecto
                </p>
              </div>

              {/* Carrito */}
              <div className="p-6 border border-orange-500/20 rounded-2xl bg-gradient-to-br from-orange-900/20 to-red-900/20 backdrop-blur-sm hover:border-orange-400/40 transition-all duration-300 group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🛒</div>
                <h3 className="font-bold text-xl mb-3 text-white">Carrito Inteligente</h3>
                <p className="text-gray-300 leading-relaxed">
                  Compra múltiples items en una sola transacción con persistencia local
                </p>
              </div>

              {/* Descarga */}
              <div className="p-6 border border-cyan-500/20 rounded-2xl bg-gradient-to-br from-cyan-900/20 to-blue-900/20 backdrop-blur-sm hover:border-cyan-400/40 transition-all duration-300 group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">⚡</div>
                <h3 className="font-bold text-xl mb-3 text-white">Descarga Inmediata</h3>
                <p className="text-gray-300 leading-relaxed">
                  Acceso instantáneo a tus archivos después de la compra
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Próximas Features - Impresión 3D */}
        <section className="py-16 md:py-24">
          <div className="max-w-5xl mx-auto px-4">
            <div className="relative overflow-hidden p-8 md:p-12 border-2 border-purple-500/30 rounded-3xl bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-purple-900/20 backdrop-blur-sm">
              {/* Badge "Próximamente" */}
              <div className="absolute top-4 right-4 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-sm font-bold text-white shadow-lg">
                Próximamente Q3 2025
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="text-6xl mb-4">🖨️</div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Impresión 3D Local
                    </span>
                  </h2>
                  <p className="text-gray-300 leading-relaxed mb-6">
                    Muy pronto podrás imprimir físicamente tus modelos 3D favoritos. Selecciona material, color y calidad, y te lo enviamos a tu casa.
                  </p>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">✓</span>
                      <span>Múltiples materiales (PLA, ABS, PETG, Resina)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">✓</span>
                      <span>Cotización automática en tiempo real</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">✓</span>
                      <span>Seguimiento con fotos del proceso</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">✓</span>
                      <span>Despacho a domicilio o retiro en tienda</span>
                    </li>
                  </ul>
                </div>

                <div className="relative">
                  <div className="aspect-square rounded-2xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center border border-purple-500/30">
                    <div className="text-center">
                      <div className="text-8xl mb-4 animate-bounce">🎨</div>
                      <p className="text-gray-400 font-semibold">Tu modelo impreso<br/>en la vida real</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-slate-900/50 to-slate-900">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Comienza Tu Viaje Creativo
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-10 font-light max-w-2xl mx-auto">
              Únete a cientos de creadores que ya monetizan su talento en Takopi
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Link
                href="/explore"
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
              >
                Explorar Contenido
              </Link>
              <Link
                href="/upload"
                className="px-8 py-4 border-2 border-purple-400 text-purple-400 rounded-xl font-semibold hover:bg-purple-400 hover:text-white transition-all duration-300 transform hover:scale-105"
              >
                Subir Mi Primera Creación
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex flex-wrap justify-center gap-6 text-gray-400 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Pagos Seguros
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Sin Comisiones Ocultas
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Soporte 24/7
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
