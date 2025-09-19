import Layout from '@/components/shared/Layout';

export default function HomePage() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-20">
        {/* Hero Section */}
        <div className="text-center space-y-8 relative">
          <h1 className="text-6xl sm:text-8xl font-bold tracking-tight animate-float">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_200%]">
              TAKOPI
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            El futuro del comercio digital creativo. Donde la innovación se encuentra con la comunidad,
            y la tecnología transforma la creatividad.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-12">
            <a
              href="/feed"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25 animate-glow"
            >
              Explorar Feed
            </a>
            <a
              href="/auth/register"
              className="px-8 py-4 border-2 border-purple-400 text-purple-400 rounded-xl font-semibold hover:bg-purple-400 hover:text-white transition-all duration-300 transform hover:scale-105"
            >
              Unirse a la Comunidad
            </a>
          </div>
        </div>

        {/* Features Section */}
        <section className="py-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Características Revolucionarias
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Descubre las herramientas que están remodelando la creatividad digital
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 border border-purple-500/20 rounded-2xl bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-sm hover:border-purple-400/40 transition-all duration-300 transform hover:scale-105">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="font-bold text-xl mb-4 text-white">Mercado Creativo</h3>
              <p className="text-gray-300 leading-relaxed">
                Descubre y compra modelos 3D únicos creados por artistas talentosos de nuestra comunidad global
              </p>
            </div>

            <div className="p-8 border border-purple-500/20 rounded-2xl bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-sm hover:border-purple-400/40 transition-all duration-300 transform hover:scale-105">
              <div className="text-4xl mb-4">🗺️</div>
              <h3 className="font-bold text-xl mb-4 text-white">Mapeo Cultural</h3>
              <p className="text-gray-300 leading-relaxed">
                Explora tribus urbanas, eventos y microculturas en tu ciudad a través de nuestro mapa interactivo de la comunidad
              </p>
            </div>

            <div className="p-8 border border-purple-500/20 rounded-2xl bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-sm hover:border-purple-400/40 transition-all duration-300 transform hover:scale-105">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="font-bold text-xl mb-4 text-white">Asistente IA</h3>
              <p className="text-gray-300 leading-relaxed">
                Obtén ayuda instantánea con consultas de productos, licencias y seguimiento de pedidos a través de nuestro chatbot inteligente
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Nuestra Comunidad en Crecimiento
              </span>
            </h2>
            <p className="text-xl text-gray-300">Únete a miles de creadores y exploradores en todo el mundo</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                1,200+
              </div>
              <div className="text-gray-300 font-medium">Modelos 3D</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                500+
              </div>
              <div className="text-gray-300 font-medium">Artistas</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                50+
              </div>
              <div className="text-gray-300 font-medium">Ciudades</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                2,500+
              </div>
              <div className="text-gray-300 font-medium">Usuarios</div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}