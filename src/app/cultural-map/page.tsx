import Layout from '@/components/shared/Layout';

export default function CulturalMapPage() {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Mapa Cultural</h1>
          <p className="text-xl text-gray-600">
            Explora tribus urbanas, eventos y microculturas en tu ciudad
          </p>
        </div>

        {/* Mapa placeholder */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="aspect-video bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Mapa Interactivo</h3>
              <p className="text-gray-600">Aquí se mostrará el mapa con Leaflet</p>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtrar por categoría</h3>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Todos
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
              Tribus Urbanas
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
              Eventos
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
              Espacios Maker
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
              Conciertos
            </button>
          </div>
        </div>

        {/* Lista de pines */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">🎨</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Taller de Arte Digital</h4>
                <p className="text-sm text-gray-600">Santiago Centro</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Espacio para aprender modelado 3D y arte digital. Todos los sábados.
            </p>
            <div className="flex items-center justify-between">
              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                Espacio Maker
              </span>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Ver en mapa
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">🎵</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Concierto Música Electrónica</h4>
                <p className="text-sm text-gray-600">Providencia</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Evento de música electrónica con artistas locales. Próximo viernes.
            </p>
            <div className="flex items-center justify-between">
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                Evento
              </span>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Ver en mapa
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">🏍️</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Junta de Motociclistas</h4>
                <p className="text-sm text-gray-600">Las Condes</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Reunión semanal de motociclistas y entusiastas de las motos.
            </p>
            <div className="flex items-center justify-between">
              <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
                Tribu Urbana
              </span>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Ver en mapa
              </button>
            </div>
          </div>
        </div>

        {/* Botón para agregar pin */}
        <div className="text-center mt-8">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Agregar nuevo pin
          </button>
        </div>
      </div>
    </Layout>
  );
}
