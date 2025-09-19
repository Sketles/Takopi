import Layout from '@/components/shared/Layout';

// Datos de ejemplo para explorar - Marketplace
const marketplaceItems = [
  {
    id: 1,
    title: "Robot Futurista Pro",
    author: "TechArtist",
    type: "3D Model",
    category: "Personajes",
    image: "/placeholder-3d.jpg",
    likes: 142,
    price: "$15.99",
    license: "Personal",
    downloads: 234
  },
  {
    id: 2,
    title: "Pack Texturas Metal",
    author: "TextureMaster",
    type: "Texture Pack",
    category: "Texturas",
    image: "/placeholder-3d.jpg",
    likes: 89,
    price: "$8.99",
    license: "Indie",
    downloads: 156
  },
  {
    id: 3,
    title: "Cyberpunk City Builder",
    author: "GameDevStudio",
    type: "Game",
    category: "Juegos",
    image: "/placeholder-3d.jpg",
    likes: 267,
    price: "$24.99",
    license: "Pro",
    downloads: 89
  },
  {
    id: 4,
    title: "Colección Anime Chars",
    author: "AnimeCreator",
    type: "Collection",
    category: "Colecciones",
    image: "/placeholder-3d.jpg",
    likes: 334,
    price: "$45.99",
    license: "Personal",
    downloads: 445
  },
  {
    id: 5,
    title: "V8 Engine Kit",
    author: "AutoMech",
    type: "3D Model",
    category: "Vehículos",
    image: "/placeholder-3d.jpg",
    likes: 78,
    price: "$35.99",
    license: "Pro",
    downloads: 123
  },
  {
    id: 6,
    title: "Pack Texturas Naturaleza",
    author: "Nature3D",
    type: "Texture Pack",
    category: "Texturas",
    image: "/placeholder-3d.jpg",
    likes: 156,
    price: "$12.99",
    license: "Indie",
    downloads: 298
  },
  {
    id: 7,
    title: "Indie Horror Game",
    author: "HorrorDev",
    type: "Game",
    category: "Juegos",
    image: "/placeholder-3d.jpg",
    likes: 445,
    price: "$19.99",
    license: "Personal",
    downloads: 567
  },
  {
    id: 8,
    title: "Arquitectura Moderna",
    author: "ArchDesigner",
    type: "3D Model",
    category: "Arquitectura",
    image: "/placeholder-3d.jpg",
    likes: 189,
    price: "$28.99",
    license: "Indie",
    downloads: 234
  }
];

export default function ExplorePage() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header de Explorar */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Explorar Marketplace
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Descubre modelos 3D, packs de texturas, colecciones de artistas y juegos indie
          </p>
        </div>

        {/* Filtros por categoría */}
        <div className="mb-12 flex flex-wrap gap-4 justify-center">
          <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25">
            Todo
          </button>
          <button className="px-6 py-3 bg-gray-800/50 border border-gray-600 text-gray-300 rounded-xl font-medium hover:bg-gray-700/50 hover:border-purple-400 hover:text-purple-400 transition-all duration-300">
            🎮 Juegos
          </button>
          <button className="px-6 py-3 bg-gray-800/50 border border-gray-600 text-gray-300 rounded-xl font-medium hover:bg-gray-700/50 hover:border-purple-400 hover:text-purple-400 transition-all duration-300">
            🎨 Modelos 3D
          </button>
          <button className="px-6 py-3 bg-gray-800/50 border border-gray-600 text-gray-300 rounded-xl font-medium hover:bg-gray-700/50 hover:border-purple-400 hover:text-purple-400 transition-all duration-300">
            🖼️ Texturas
          </button>
          <button className="px-6 py-3 bg-gray-800/50 border border-gray-600 text-gray-300 rounded-xl font-medium hover:bg-gray-700/50 hover:border-purple-400 hover:text-purple-400 transition-all duration-300">
            📦 Colecciones
          </button>
        </div>

        {/* Grid de Contenido del Marketplace */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {marketplaceItems.map((item, index) => (
            <div
              key={item.id}
              className="group bg-black/40 backdrop-blur-md rounded-2xl border border-purple-500/20 overflow-hidden hover:border-purple-400/40 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Imagen del contenido */}
              <div className="aspect-square bg-gradient-to-br from-purple-900/30 to-blue-900/30 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10"></div>

                {/* Icono según el tipo */}
                <div className="text-center relative z-10">
                  <div className={`w-20 h-20 rounded-xl mx-auto mb-3 flex items-center justify-center backdrop-blur-sm border border-purple-500/30 ${item.type === 'Game' ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20' :
                      item.type === 'Texture Pack' ? 'bg-gradient-to-br from-orange-500/20 to-red-500/20' :
                        item.type === 'Collection' ? 'bg-gradient-to-br from-pink-500/20 to-purple-500/20' :
                          'bg-gradient-to-br from-purple-500/20 to-blue-500/20'
                    }`}>
                    {item.type === 'Game' ? (
                      <svg className="w-10 h-10 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    ) : item.type === 'Texture Pack' ? (
                      <svg className="w-10 h-10 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                    ) : item.type === 'Collection' ? (
                      <svg className="w-10 h-10 text-pink-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="w-10 h-10 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <p className={`text-sm font-medium ${item.type === 'Game' ? 'text-green-300' :
                      item.type === 'Texture Pack' ? 'text-orange-300' :
                        item.type === 'Collection' ? 'text-pink-300' :
                          'text-purple-300'
                    }`}>
                    {item.type}
                  </p>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white font-medium hover:bg-white/30 transition-all duration-300">
                    {item.type === 'Game' ? 'Jugar Demo' : 'Ver Detalles'}
                  </button>
                </div>
              </div>

              {/* Información del contenido */}
              <div className="p-6">
                <h3 className="font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">{item.title}</h3>
                <p className="text-sm text-gray-400 mb-2">por {item.author}</p>
                <p className="text-xs text-gray-500 mb-4">{item.category}</p>

                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.license === 'Personal' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                      item.license === 'Indie' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                        'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                    {item.license}
                  </span>
                  <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    {item.price}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    <span>{item.likes}</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span>{item.downloads}</span>
                  </div>
                </div>

                <button className="w-full py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105">
                  {item.type === 'Game' ? 'Jugar' : 'Comprar'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Botón cargar más */}
        <div className="text-center mt-16">
          <button className="group px-10 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25">
            <span className="relative z-10">Cargar Más Contenido</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
          </button>
        </div>
      </div>
    </Layout>
  );
}
