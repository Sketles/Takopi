import Layout from '@/components/shared/Layout';
import Link from 'next/link';

export default function HomePage() {
  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          {/* Background Animation */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(147,51,234,0.3),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.2),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_70%)]"></div>
          </div>

          {/* Floating Elements - Corners Only */}
          {/* Top-Left Corner */}
          <div className="absolute top-8 left-8 w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse opacity-70 shadow-lg shadow-purple-400/50"></div>
          <div className="absolute top-16 left-16 w-1 h-1 bg-gradient-to-r from-purple-300 to-violet-400 rounded-full animate-ping opacity-70 shadow-lg shadow-purple-300/40" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute top-24 left-12 w-1.5 h-1.5 bg-gradient-to-r from-purple-200 to-purple-400 rounded-full animate-bounce opacity-45 shadow-lg shadow-purple-200/30" style={{animationDelay: '0.8s'}}></div>
          <div className="absolute top-12 left-24 w-1 h-1 bg-gradient-to-r from-violet-300 to-purple-400 rounded-full opacity-85 shadow-lg shadow-violet-300/60 animate-bounce" style={{animationDelay: '2.3s'}}></div>
          
          {/* Top-Right Corner */}
          <div className="absolute top-8 right-8 w-1 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-ping opacity-60 shadow-lg shadow-blue-400/50"></div>
          <div className="absolute top-16 right-16 w-2 h-2 bg-gradient-to-r from-blue-300 to-indigo-400 rounded-full animate-bounce opacity-60 shadow-lg shadow-blue-300/40" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-24 right-12 w-1 h-1 bg-gradient-to-r from-blue-200 to-blue-400 rounded-full animate-pulse opacity-80 shadow-lg shadow-blue-200/40" style={{animationDelay: '2.5s'}}></div>
          <div className="absolute top-12 right-24 w-1 h-1 bg-gradient-to-r from-sky-300 to-blue-400 rounded-full opacity-90 shadow-lg shadow-sky-300/60 animate-ping" style={{animationDelay: '3.2s'}}></div>
          
          {/* Bottom-Left Corner */}
          <div className="absolute bottom-8 left-8 w-3 h-3 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full animate-bounce opacity-50 shadow-lg shadow-pink-400/50"></div>
          <div className="absolute bottom-16 left-16 w-1.5 h-1.5 bg-gradient-to-r from-pink-300 to-fuchsia-400 rounded-full animate-pulse opacity-65 shadow-lg shadow-pink-300/40" style={{animationDelay: '1.5s'}}></div>
          <div className="absolute bottom-24 left-12 w-1 h-1 bg-gradient-to-r from-pink-200 to-rose-400 rounded-full animate-ping opacity-55 shadow-lg shadow-pink-200/30" style={{animationDelay: '1.2s'}}></div>
          <div className="absolute bottom-12 left-24 w-2 h-2 bg-gradient-to-r from-amber-300 to-yellow-400 rounded-full opacity-60 shadow-lg shadow-amber-300/50 animate-bounce" style={{animationDelay: '1.4s'}}></div>
          
          {/* Bottom-Right Corner */}
          <div className="absolute bottom-8 right-8 w-1.5 h-1.5 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full animate-pulse opacity-65 shadow-lg shadow-cyan-400/50"></div>
          <div className="absolute bottom-16 right-16 w-1 h-1 bg-gradient-to-r from-cyan-300 to-teal-400 rounded-full animate-ping opacity-75 shadow-lg shadow-cyan-300/40" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-24 right-12 w-2 h-2 bg-gradient-to-r from-cyan-200 to-cyan-400 rounded-full animate-bounce opacity-50 shadow-lg shadow-cyan-200/30" style={{animationDelay: '3s'}}></div>
          <div className="absolute bottom-12 right-24 w-1.5 h-1.5 bg-gradient-to-r from-emerald-300 to-green-400 rounded-full opacity-70 shadow-lg shadow-emerald-300/50 animate-ping" style={{animationDelay: '1.7s'}}></div>
          
          {/* Extra corner sparkles */}
          <div className="absolute top-4 left-4 w-1 h-1 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full opacity-80 shadow-lg shadow-yellow-300/60 animate-spin" style={{animationDelay: '0.2s', animationDuration: '3s'}}></div>
          <div className="absolute top-4 right-4 w-1 h-1 bg-gradient-to-r from-rose-300 to-pink-400 rounded-full opacity-75 shadow-lg shadow-rose-300/50 animate-pulse" style={{animationDelay: '0.9s'}}></div>
          <div className="absolute bottom-4 left-4 w-1 h-1 bg-gradient-to-r from-purple-100 to-purple-300 rounded-full animate-pulse opacity-70 shadow-lg shadow-purple-100/40" style={{animationDelay: '1.8s'}}></div>
          <div className="absolute bottom-4 right-4 w-1 h-1 bg-gradient-to-r from-blue-100 to-blue-300 rounded-full animate-ping opacity-65 shadow-lg shadow-blue-100/35" style={{animationDelay: '2.2s'}}></div>
          
          {/* Glowing orbs in corners only */}
          <div className="absolute top-2 left-2 w-3 h-3 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full animate-pulse opacity-40 blur-sm" style={{animationDelay: '0.6s'}}></div>
          <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-full animate-ping opacity-35 blur-sm" style={{animationDelay: '2.1s'}}></div>
          <div className="absolute bottom-2 left-2 w-2 h-2 bg-gradient-to-r from-pink-400/30 to-rose-400/30 rounded-full animate-bounce opacity-30 blur-sm" style={{animationDelay: '1.6s'}}></div>
          <div className="absolute bottom-2 right-2 w-2.5 h-2.5 bg-gradient-to-r from-cyan-400/30 to-blue-400/30 rounded-full animate-pulse opacity-35 blur-sm" style={{animationDelay: '2.8s'}}></div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 py-32">
            <div className="text-center space-y-8">
              {/* Main Title */}
              <div className="space-y-4">
                <h1 className="text-6xl sm:text-8xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_200%]">
              TAKOPI
            </span>
          </h1>
                <div className="text-lg sm:text-xl text-purple-300 font-light tracking-wider">
                  MARKETPLACE DIGITAL
                </div>
              </div>

              {/* Subtitle */}
              <p className="text-xl sm:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
                Donde la creatividad encuentra su valor. Descubre, compra y vende contenido digital único 
                creado por una comunidad global de artistas y creadores.
              </p>

              {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-12">
                <Link
              href="/explore"
                  className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-500 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25 flex items-center gap-3"
            >
                  <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
              Explorar Marketplace
                </Link>
                <Link
              href="/auth/register"
                  className="group px-8 py-4 border-2 border-purple-400 text-purple-400 rounded-xl font-semibold hover:bg-purple-400 hover:text-white transition-all duration-500 transform hover:scale-105 flex items-center gap-3"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Unirse como Creador
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Content Categories Section */}
        <section className="py-24 bg-gradient-to-b from-slate-900/50 to-slate-900">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Tipos de Contenido
                </span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light">
                Explora nuestra diversa colección de contenido digital premium
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Avatares */}
              <div className="group relative p-8 border border-purple-500/20 rounded-2xl bg-gradient-to-br from-purple-900/10 to-blue-900/10 backdrop-blur-sm hover:border-purple-400/40 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-blue-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🎭</div>
                  <h3 className="font-bold text-xl mb-4 text-white group-hover:text-purple-300 transition-colors">Avatares</h3>
                  <p className="text-gray-300 leading-relaxed text-sm">
                    Modelos 3D únicos para juegos, metaverso y aplicaciones interactivas
                  </p>
                </div>
              </div>

              {/* Modelos 3D */}
              <div className="group relative p-8 border border-blue-500/20 rounded-2xl bg-gradient-to-br from-blue-900/10 to-cyan-900/10 backdrop-blur-sm hover:border-blue-400/40 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-cyan-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🎯</div>
                  <h3 className="font-bold text-xl mb-4 text-white group-hover:text-blue-300 transition-colors">Modelos 3D</h3>
                  <p className="text-gray-300 leading-relaxed text-sm">
                    Objetos, escenas y elementos tridimensionales para proyectos creativos
                  </p>
                </div>
              </div>

              {/* Música */}
              <div className="group relative p-8 border border-pink-500/20 rounded-2xl bg-gradient-to-br from-pink-900/10 to-rose-900/10 backdrop-blur-sm hover:border-pink-400/40 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-600/10 to-rose-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🎵</div>
                  <h3 className="font-bold text-xl mb-4 text-white group-hover:text-pink-300 transition-colors">Música</h3>
                  <p className="text-gray-300 leading-relaxed text-sm">
                    Composiciones originales y tracks para proyectos multimedia
                  </p>
                </div>
              </div>

              {/* Texturas */}
              <div className="group relative p-8 border border-emerald-500/20 rounded-2xl bg-gradient-to-br from-emerald-900/10 to-green-900/10 backdrop-blur-sm hover:border-emerald-400/40 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-green-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🎨</div>
                  <h3 className="font-bold text-xl mb-4 text-white group-hover:text-emerald-300 transition-colors">Texturas</h3>
                  <p className="text-gray-300 leading-relaxed text-sm">
                    Materiales y texturas de alta calidad para modelado y diseño
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  ¿Por qué Takopi?
              </span>
            </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light">
                Una plataforma diseñada para creadores, por creadores
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
              {/* Secure Marketplace */}
              <div className="p-8 border border-purple-500/20 rounded-2xl bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-sm hover:border-purple-400/40 transition-all duration-500 transform hover:scale-105 group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🔒</div>
                <h3 className="font-bold text-xl mb-4 text-white">Marketplace Seguro</h3>
              <p className="text-gray-300 leading-relaxed">
                  Transacciones protegidas con verificación de calidad y derechos de autor garantizados
              </p>
            </div>

              {/* Global Community */}
              <div className="p-8 border border-blue-500/20 rounded-2xl bg-gradient-to-br from-blue-900/20 to-cyan-900/20 backdrop-blur-sm hover:border-blue-400/40 transition-all duration-500 transform hover:scale-105 group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🌍</div>
                <h3 className="font-bold text-xl mb-4 text-white">Comunidad Global</h3>
              <p className="text-gray-300 leading-relaxed">
                  Conecta con artistas y creadores de todo el mundo en una plataforma inclusiva
              </p>
            </div>

              {/* Creator Tools */}
              <div className="p-8 border border-pink-500/20 rounded-2xl bg-gradient-to-br from-pink-900/20 to-rose-900/20 backdrop-blur-sm hover:border-pink-400/40 transition-all duration-500 transform hover:scale-105 group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">⚡</div>
                <h3 className="font-bold text-xl mb-4 text-white">Herramientas Creativas</h3>
              <p className="text-gray-300 leading-relaxed">
                  Visor 3D integrado, previews en tiempo real y gestión avanzada de contenido
              </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24 bg-gradient-to-b from-slate-900/50 to-slate-900">
          <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Nuestra Comunidad
              </span>
            </h2>
              <p className="text-xl text-gray-300 font-light">Creciendo cada día con creatividad y pasión</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center group">
                <div className="text-5xl sm:text-6xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                  500+
                </div>
                <div className="text-gray-300 font-medium">Creadores Activos</div>
              </div>
              <div className="text-center group">
                <div className="text-5xl sm:text-6xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                1,200+
                </div>
                <div className="text-gray-300 font-medium">Contenidos Digitales</div>
              </div>
              <div className="text-center group">
                <div className="text-5xl sm:text-6xl font-bold mb-2 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                  50+
            </div>
                <div className="text-gray-300 font-medium">Países</div>
              </div>
              <div className="text-center group">
                <div className="text-5xl sm:text-6xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                  98%
            </div>
                <div className="text-gray-300 font-medium">Satisfacción</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="p-12 border border-purple-500/20 rounded-3xl bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-sm">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  ¿Listo para comenzar?
                </span>
              </h2>
              <p className="text-xl text-gray-300 mb-8 font-light">
                Únete a la revolución del comercio digital creativo
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                  href="/explore"
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
                >
                  Explorar Ahora
                </Link>
                <Link
                  href="/upload"
                  className="px-8 py-4 border-2 border-purple-400 text-purple-400 rounded-xl font-semibold hover:bg-purple-400 hover:text-white transition-all duration-300 transform hover:scale-105"
                >
                  Vender Contenido
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}