import Layout from '@/components/shared/Layout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Datos de ejemplo para el feed
const sampleModels = [
  {
    id: 1,
    title: "Futuristic Robot",
    author: "TechArtist",
    image: "/placeholder-3d.jpg",
    likes: 42,
    price: "$15.99",
    license: "Personal"
  },
  {
    id: 2,
    title: "Modern House",
    author: "ArchDesigner",
    image: "/placeholder-3d.jpg",
    likes: 28,
    price: "$25.99",
    license: "Indie"
  },
  {
    id: 3,
    title: "Combat Aircraft",
    author: "Military3D",
    image: "/placeholder-3d.jpg",
    likes: 67,
    price: "$35.99",
    license: "Pro"
  },
  {
    id: 4,
    title: "Anime Character",
    author: "AnimeCreator",
    image: "/placeholder-3d.jpg",
    likes: 89,
    price: "$20.99",
    license: "Personal"
  },
  {
    id: 5,
    title: "V8 Engine",
    author: "AutoMech",
    image: "/placeholder-3d.jpg",
    likes: 34,
    price: "$45.99",
    license: "Pro"
  },
  {
    id: 6,
    title: "Mountain Landscape",
    author: "Nature3D",
    image: "/placeholder-3d.jpg",
    likes: 56,
    price: "$18.99",
    license: "Indie"
  }
];

export default function FeedPage() {
  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header del Feed */}
          <div className="mb-12 text-center">
            <h1 className="text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Creative Feed
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Discover the most popular and creative 3D models from our global community
            </p>
          </div>

          {/* Filtros */}
          <div className="mb-12 flex flex-wrap gap-4 justify-center">
            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25">
              All Models
            </button>
            <button className="px-6 py-3 bg-gray-800/50 border border-gray-600 text-gray-300 rounded-xl font-medium hover:bg-gray-700/50 hover:border-purple-400 hover:text-purple-400 transition-all duration-300">
              Personal
            </button>
            <button className="px-6 py-3 bg-gray-800/50 border border-gray-600 text-gray-300 rounded-xl font-medium hover:bg-gray-700/50 hover:border-purple-400 hover:text-purple-400 transition-all duration-300">
              Indie
            </button>
            <button className="px-6 py-3 bg-gray-800/50 border border-gray-600 text-gray-300 rounded-xl font-medium hover:bg-gray-700/50 hover:border-purple-400 hover:text-purple-400 transition-all duration-300">
              Pro
            </button>
          </div>

          {/* Grid de Modelos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {sampleModels.map((model, index) => (
              <div
                key={model.id}
                className="group bg-black/40 backdrop-blur-md rounded-2xl border border-purple-500/20 overflow-hidden hover:border-purple-400/40 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Imagen del modelo */}
                <div className="aspect-square bg-gradient-to-br from-purple-900/30 to-blue-900/30 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10"></div>
                  <div className="text-center relative z-10">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl mx-auto mb-3 flex items-center justify-center backdrop-blur-sm border border-purple-500/30">
                      <svg className="w-10 h-10 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-sm text-purple-300 font-medium">3D Model</p>
                  </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white font-medium hover:bg-white/30 transition-all duration-300">
                      View 3D
                    </button>
                  </div>
                </div>

                {/* Información del modelo */}
                <div className="p-6">
                  <h3 className="font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">{model.title}</h3>
                  <p className="text-sm text-gray-400 mb-4">by {model.author}</p>

                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${model.license === 'Personal' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                      model.license === 'Indie' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                        'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                      {model.license}
                    </span>
                    <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                      {model.price}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-400">
                      <svg className="w-5 h-5 mr-2 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium">{model.likes}</span>
                    </div>
                    <button className="text-purple-400 hover:text-white text-sm font-medium transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Botón cargar más */}
          <div className="text-center mt-16">
            <button className="group px-10 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25">
              <span className="relative z-10">Load More Models</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
            </button>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
