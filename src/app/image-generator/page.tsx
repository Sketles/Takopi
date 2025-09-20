import Layout from '@/components/shared/Layout';

export default function ImageGeneratorPage() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header del Generador de Imágenes */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Generador de Imágenes IA
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Crea imágenes únicas con inteligencia artificial para tus proyectos creativos
          </p>
        </div>

        {/* Generador de Imágenes */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-purple-500/20 p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Panel de entrada */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-4">Configura tu Imagen</h2>

                <div>
                  <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
                    Descripción de la Imagen
                  </label>
                  <textarea
                    id="prompt"
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    placeholder="Describe la imagen que quieres crear... Ej: 'Un robot futurista en una ciudad cyberpunk al atardecer'"
                  />
                </div>

                <div>
                  <label htmlFor="style" className="block text-sm font-medium text-gray-300 mb-2">
                    Estilo Artístico
                  </label>
                  <select
                    id="style"
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="realistic">Realista</option>
                    <option value="anime">Anime</option>
                    <option value="cyberpunk">Cyberpunk</option>
                    <option value="fantasy">Fantasía</option>
                    <option value="sci-fi">Ciencia Ficción</option>
                    <option value="abstract">Abstracto</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="quality" className="block text-sm font-medium text-gray-300 mb-2">
                    Calidad
                  </label>
                  <select
                    id="quality"
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="standard">Estándar</option>
                    <option value="hd">Alta Definición</option>
                    <option value="ultra">Ultra HD</option>
                  </select>
                </div>

                <button className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25">
                  🎨 Generar Imagen
                </button>
              </div>

              {/* Panel de resultado */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-4">Resultado</h2>

                <div className="aspect-square bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl border border-purple-500/20 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl mx-auto mb-4 flex items-center justify-center backdrop-blur-sm border border-purple-500/30">
                      <svg className="w-10 h-10 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-purple-300 font-medium">Tu imagen aparecerá aquí</p>
                    <p className="text-sm text-gray-400 mt-2">Usa el panel izquierdo para generar</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 py-3 bg-gray-800/50 border border-gray-600 text-gray-300 rounded-lg font-medium hover:bg-gray-700/50 hover:border-purple-400 hover:text-purple-400 transition-all duration-300">
                    📥 Descargar
                  </button>
                  <button className="flex-1 py-3 bg-gray-800/50 border border-gray-600 text-gray-300 rounded-lg font-medium hover:bg-gray-700/50 hover:border-purple-400 hover:text-purple-400 transition-all duration-300">
                    🔄 Regenerar
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Ejemplos de prompts */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Ejemplos de Prompts</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-black/40 backdrop-blur-md rounded-xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 cursor-pointer">
                <p className="text-gray-300 text-sm">"Un robot futurista caminando por una ciudad cyberpunk al atardecer, estilo anime"</p>
              </div>
              <div className="p-4 bg-black/40 backdrop-blur-md rounded-xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 cursor-pointer">
                <p className="text-gray-300 text-sm">"Una nave espacial en el espacio profundo con nebulosas de colores vibrantes"</p>
              </div>
              <div className="p-4 bg-black/40 backdrop-blur-md rounded-xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 cursor-pointer">
                <p className="text-gray-300 text-sm">"Un bosque mágico con luces bioluminiscentes y criaturas fantásticas"</p>
              </div>
              <div className="p-4 bg-black/40 backdrop-blur-md rounded-xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 cursor-pointer">
                <p className="text-gray-300 text-sm">"Un laboratorio científico futurista con equipos holográficos"</p>
              </div>
              <div className="p-4 bg-black/40 backdrop-blur-md rounded-xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 cursor-pointer">
                <p className="text-gray-300 text-sm">"Un guerrero con armadura de energía en un paisaje post-apocalíptico"</p>
              </div>
              <div className="p-4 bg-black/40 backdrop-blur-md rounded-xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 cursor-pointer">
                <p className="text-gray-300 text-sm">"Una ciudad flotante en las nubes con arquitectura steampunk"</p>
              </div>
            </div>
          </div>

          {/* Información sobre el generador */}
          <div className="mt-16 bg-black/40 backdrop-blur-md rounded-2xl border border-purple-500/20 p-8">
            <h3 className="text-2xl font-bold text-white mb-4">¿Cómo funciona?</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <span className="text-2xl">✍️</span>
                </div>
                <h4 className="font-semibold text-white mb-2">1. Describe tu idea</h4>
                <p className="text-gray-300 text-sm">Escribe una descripción detallada de la imagen que quieres crear</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <span className="text-2xl">🤖</span>
                </div>
                <h4 className="font-semibold text-white mb-2">2. IA procesa</h4>
                <p className="text-gray-300 text-sm">Nuestra inteligencia artificial genera la imagen basada en tu descripción</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <span className="text-2xl">🎨</span>
                </div>
                <h4 className="font-semibold text-white mb-2">3. Descarga y usa</h4>
                <p className="text-gray-300 text-sm">Descarga tu imagen y úsala en tus proyectos creativos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
