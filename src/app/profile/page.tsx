import Layout from '@/components/shared/Layout';

// Datos de ejemplo para el perfil
const userProfile = {
  username: "TechArtist",
  email: "techartist@takopi.com",
  role: "Artista",
  avatar: "/placeholder-avatar.jpg",
  bio: "Artista digital especializado en modelos 3D futuristas y diseño industrial.",
  stats: {
    modelsPublished: 24,
    totalSales: 156,
    heartsReceived: 342,
    pinsCreated: 8
  },
  models: [
    {
      id: 1,
      title: "Robot Futurista",
      image: "/placeholder-3d.jpg",
      likes: 42,
      price: "$15.99"
    },
    {
      id: 2,
      title: "Nave Espacial",
      image: "/placeholder-3d.jpg",
      likes: 67,
      price: "$25.99"
    },
    {
      id: 3,
      title: "Ciudad Cyberpunk",
      image: "/placeholder-3d.jpg",
      likes: 89,
      price: "$35.99"
    }
  ]
};

export default function ProfilePage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header del Perfil */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {userProfile.username.charAt(0)}
              </span>
            </div>

            {/* Información del usuario */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <h1 className="text-2xl font-bold text-gray-900">{userProfile.username}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${userProfile.role === 'Artista' ? 'bg-purple-100 text-purple-800' :
                    userProfile.role === 'Explorador' ? 'bg-green-100 text-green-800' :
                      userProfile.role === 'Comprador' ? 'bg-blue-100 text-blue-800' :
                        'bg-orange-100 text-orange-800'
                  }`}>
                  {userProfile.role}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{userProfile.bio}</p>

              {/* Estadísticas */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{userProfile.stats.modelsPublished}</div>
                  <div className="text-sm text-gray-600">Modelos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{userProfile.stats.totalSales}</div>
                  <div className="text-sm text-gray-600">Ventas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{userProfile.stats.heartsReceived}</div>
                  <div className="text-sm text-gray-600">Corazones</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{userProfile.stats.pinsCreated}</div>
                  <div className="text-sm text-gray-600">Pines</div>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Seguir
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Mensaje
              </button>
            </div>
          </div>
        </div>

        {/* Navegación de pestañas */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            <button className="py-2 px-1 border-b-2 border-blue-500 text-blue-600 font-medium">
              Modelos
            </button>
            <button className="py-2 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700">
              Guardados
            </button>
            <button className="py-2 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700">
              Likes
            </button>
            <button className="py-2 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700">
              Actividad
            </button>
          </nav>
        </div>

        {/* Grid de modelos del usuario */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userProfile.models.map((model) => (
            <div key={model.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {/* Imagen del modelo */}
              <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500">3D Model</p>
                </div>
              </div>

              {/* Información del modelo */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{model.title}</h3>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-blue-600">{model.price}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">{model.likes}</span>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Ver detalles
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
