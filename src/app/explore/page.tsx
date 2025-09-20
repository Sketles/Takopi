'use client';

import Layout from '@/components/shared/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { ModelViewerModal, ModelViewerPreview } from '@/components/ModelViewer3D';

// Interfaces para los datos
interface ContentItem {
  id: string;
  title: string;
  author: string;
  type: string;
  category: string;
  image: string;
  likes: number;
  price: string;
  license: string;
  downloads: number;
  tags: string[];
  views: number;
  createdAt: string;
  contentType: string;
  isFree: boolean;
  currency: string;
}

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
    price: "$12.990",
    license: "Personal",
    downloads: 234,
    tags: ["robot", "futurista", "animación"]
  },
  {
    id: 2,
    title: "Pack Texturas Metal",
    author: "TextureMaster",
    type: "Texture Pack",
    category: "Texturas",
    image: "/placeholder-3d.jpg",
    likes: 89,
    price: "$7.990",
    license: "Indie",
    downloads: 156,
    tags: ["metal", "industrial", "realista"]
  },
  {
    id: 3,
    title: "Cyberpunk City Builder",
    author: "GameDevStudio",
    type: "Game",
    category: "Juegos",
    image: "/placeholder-3d.jpg",
    likes: 267,
    price: "$19.990",
    license: "Pro",
    downloads: 89,
    tags: ["cyberpunk", "city", "builder"]
  },
  {
    id: 4,
    title: "Colección Anime Chars",
    author: "AnimeCreator",
    type: "Collection",
    category: "Colecciones",
    image: "/placeholder-3d.jpg",
    likes: 334,
    price: "$36.990",
    license: "Personal",
    downloads: 445,
    tags: ["anime", "personajes", "colección"]
  },
  {
    id: 5,
    title: "V8 Engine Kit",
    author: "AutoMech",
    type: "3D Model",
    category: "Vehículos",
    image: "/placeholder-3d.jpg",
    likes: 78,
    price: "$28.990",
    license: "Pro",
    downloads: 123,
    tags: ["motor", "vehículo", "mecánico"]
  },
  {
    id: 6,
    title: "Pack Texturas Naturaleza",
    author: "Nature3D",
    type: "Texture Pack",
    category: "Texturas",
    image: "/placeholder-3d.jpg",
    likes: 156,
    price: "$10.990",
    license: "Indie",
    downloads: 298,
    tags: ["naturaleza", "madera", "piedra"]
  },
  {
    id: 7,
    title: "Indie Horror Game",
    author: "HorrorDev",
    type: "Game",
    category: "Juegos",
    image: "/placeholder-3d.jpg",
    likes: 445,
    price: "$15.990",
    license: "Personal",
    downloads: 567,
    tags: ["horror", "indie", "terror"]
  },
  {
    id: 8,
    title: "Arquitectura Moderna",
    author: "ArchDesigner",
    type: "3D Model",
    category: "Arquitectura",
    image: "/placeholder-3d.jpg",
    likes: 189,
    price: "$22.990",
    license: "Indie",
    downloads: 234,
    tags: ["arquitectura", "moderna", "edificio"]
  }
];

// Datos de tendencias (para usuarios no autenticados)
const trendingItems = marketplaceItems.slice(0, 6);

// Datos personalizados (para usuarios autenticados)
const personalizedItems = marketplaceItems.slice(2, 8);

export default function ExplorePage() {
  const { user, isLoading } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('Todo');
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isModalExpanded, setIsModalExpanded] = useState(false);

  // Función para cargar contenido desde la API
  const fetchContent = async (category: string = 'Todo') => {
    try {
      setLoading(true);
      setError(null);

      const categoryParam = category === 'Todo' ? 'all' : category;
      const response = await fetch(`/api/content/explore?category=${encodeURIComponent(categoryParam)}&limit=50`);

      if (!response.ok) {
        throw new Error('Error al cargar contenido');
      }

      const result = await response.json();

      if (result.success) {
        setContent(result.data);
      } else {
        throw new Error(result.error || 'Error al cargar contenido');
      }
    } catch (err) {
      console.error('Error fetching content:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      // En caso de error, usar datos de ejemplo como fallback
      setContent(marketplaceItems);
    } finally {
      setLoading(false);
    }
  };

  // Cargar contenido cuando cambie la categoría
  useEffect(() => {
    if (!isLoading) {
      fetchContent(selectedCategory);
    }
  }, [selectedCategory, isLoading]);

  // Cerrar modal con tecla Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    if (showModal) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [showModal]);

  // Limpiar scroll cuando el componente se desmonte
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Filtrar por categoría (ahora se hace en el servidor)
  const filteredItems = content;

  // Función para abrir el modal con los detalles
  const openItemModal = (item: ContentItem) => {
    setSelectedItem(item);
    setShowModal(true);
    setIsModalExpanded(false); // Reset to compact view
    // Bloquear scroll del body
    document.body.style.overflow = 'hidden';
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    setIsModalExpanded(false);
    // Restaurar scroll del body
    document.body.style.overflow = 'unset';
  };

  // Función para expandir/contraer el modal
  const toggleModalExpansion = () => {
    setIsModalExpanded(!isModalExpanded);
  };

  const categories = ['Todo', 'Juegos', 'Modelos 3D', 'Texturas', 'Colecciones', 'Vehículos', 'Arquitectura', 'Personajes'];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header de Explorar */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              {user ? 'Tu Explorar Personalizado' : 'Explorar Tendencias'}
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {user
              ? 'Contenido personalizado basado en tus intereses + tendencias populares'
              : 'Descubre modelos 3D, packs de texturas, colecciones de artistas y juegos indie'
            }
          </p>

          {/* Indicador de estado de autenticación */}
          {user && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-medium">
                Contenido personalizado activo
              </span>
            </div>
          )}
        </div>

        {/* Sección de contenido recomendado para usuarios autenticados */}
        {user && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Basado en tus intereses
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {personalizedItems.slice(0, 3).map((item, index) => (
                <div
                  key={`personalized-${item.id}`}
                  className="group bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-md rounded-2xl border border-purple-500/30 overflow-hidden hover:border-purple-400/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
                >
                  <div className="aspect-video bg-gradient-to-br from-purple-500/10 to-blue-500/10 flex items-center justify-center relative">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-xl mx-auto mb-3 flex items-center justify-center">
                        <svg className="w-8 h-8 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-purple-300 text-sm font-medium">{item.type}</p>
                    </div>
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 bg-purple-500/30 text-purple-300 text-xs rounded-full border border-purple-500/50">
                        Recomendado
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-white mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-400 mb-2">por {item.author}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                        {item.price}
                      </span>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filtros por categoría */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
            </svg>
            {user ? 'Explorar por categoría' : 'Tendencias por categoría'}
          </h2>
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${selectedCategory === category
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white transform scale-105 shadow-lg shadow-purple-500/25'
                  : 'bg-gray-800/50 border border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:border-purple-400 hover:text-purple-400'
                  }`}
              >
                {category === 'Todo' ? '🔍 Todo' :
                  category === 'Juegos' ? '🎮 Juegos' :
                    category === 'Modelos 3D' ? '🎨 Modelos 3D' :
                      category === 'Texturas' ? '🖼️ Texturas' :
                        category === 'Colecciones' ? '📦 Colecciones' :
                          category === 'Vehículos' ? '🚗 Vehículos' :
                            category === 'Arquitectura' ? '🏗️ Arquitectura' :
                              category === 'Personajes' ? '👤 Personajes' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Indicador de carga */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
            <span className="ml-3 text-purple-400">Cargando contenido...</span>
          </div>
        )}

        {/* Mensaje de error */}
        {error && !loading && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-red-400">Error: {error}</span>
            </div>
            <button
              onClick={() => fetchContent(selectedCategory)}
              className="mt-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 text-sm transition-colors"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Grid de Contenido del Marketplace */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                className="group bg-black/40 backdrop-blur-md rounded-2xl border border-purple-500/20 overflow-hidden hover:border-purple-400/40 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Imagen del contenido */}
                <div
                  className="aspect-square bg-gradient-to-br from-purple-900/30 to-blue-900/30 flex items-center justify-center relative overflow-hidden cursor-pointer"
                  onClick={() => openItemModal(item)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10"></div>

                  {/* Mostrar imagen de portada (no visor 3D en cards) */}
                  {item.image && item.image !== '/placeholder-3d.jpg' ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Si la imagen falla al cargar, mostrar el icono por defecto
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}

                  {/* Icono según el tipo (fallback o por defecto) */}
                  <div className={`text-center relative z-10 ${item.image && item.image !== '/placeholder-3d.jpg' ? 'hidden' : ''}`}>
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
        )}

        {/* Mensaje cuando no hay contenido */}
        {!loading && !error && filteredItems.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 backdrop-blur-md rounded-2xl border border-purple-500/20 p-8 max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <svg className="w-10 h-10 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                No hay contenido disponible
              </h3>
              <p className="text-gray-300 mb-6">
                {selectedCategory === 'Todo'
                  ? 'Aún no hay contenido subido a la plataforma. ¡Sé el primero en subir algo!'
                  : `No hay contenido disponible en la categoría "${selectedCategory}". Prueba con otra categoría.`
                }
              </p>
              <a
                href="/upload"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Subir Contenido
              </a>
            </div>
          </div>
        )}

        {/* Mensaje para usuarios no autenticados */}
        {!user && (
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 backdrop-blur-md rounded-2xl border border-purple-500/20 p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">
                ¿Quieres contenido personalizado?
              </h3>
              <p className="text-gray-300 mb-6">
                Inicia sesión para ver recomendaciones basadas en tus intereses y acceder a más contenido exclusivo.
              </p>
              <div className="flex gap-4 justify-center">
                <a
                  href="/auth/login"
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
                >
                  Iniciar Sesión
                </a>
                <a
                  href="/auth/register"
                  className="px-6 py-3 bg-gray-800/50 border border-gray-600 text-gray-300 rounded-lg font-medium hover:bg-gray-700/50 hover:border-purple-400 hover:text-purple-400 transition-all duration-300"
                >
                  Registrarse
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Botón cargar más */}
        <div className="text-center mt-16">
          <button className="group px-10 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25">
            <span className="relative z-10">Cargar Más Contenido</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
          </button>
        </div>
      </div>

      {/* Modal Híbrido - Quick View */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeModal} />

          {/* Wrapper centrado */}
          <div className="relative h-dvh grid place-items-center p-4">
            {/* Modal: columna + scroll interno */}
            <div className="w-full max-w-6xl bg-gradient-to-br from-gray-900/95 to-purple-900/95 backdrop-blur-xl rounded-3xl border border-purple-500/30 shadow-2xl flex flex-col max-h-[90dvh] overflow-hidden" onClick={(e) => e.stopPropagation()}>

              {/* Header sticky dentro del modal */}
              <header className="sticky top-0 z-10 px-6 py-4 backdrop-blur bg-gray-900/40 border-b border-purple-500/20 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">{selectedItem.title}</h2>
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleModalExpansion}
                    className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg font-medium transition-colors"
                  >
                    {isModalExpanded ? 'Ver menos ↑' : 'Ver más detalles ↓'}
                  </button>
                  <button
                    onClick={closeModal}
                    className="w-10 h-10 bg-red-500/20 hover:bg-red-500/30 rounded-full flex items-center justify-center text-red-400 hover:text-red-300 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </header>

              {/* CONTENIDO SCROLLEABLE */}
              <div className="flex-1 overflow-y-auto px-6 py-5 [@supports(-webkit-touch-callout:none)]:[-webkit-overflow-scrolling:touch]">
                {/* Vista Compacta (siempre visible) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* Columna izquierda - Preview */}
                  <div className="space-y-6">
                    {/* Preview del contenido */}
                    <div className="aspect-square bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-2xl overflow-hidden border border-purple-500/30">
                      {/* Si es un modelo 3D, mostrar visor 3D */}
                      {selectedItem.contentType === 'models' && selectedItem.files && selectedItem.files.length > 0 ? (
                        (() => {
                          // Buscar archivo GLB/GLTF para el visor 3D
                          const modelFile = selectedItem.files.find((file: any) =>
                            file.name && (file.name.endsWith('.glb') || file.name.endsWith('.gltf'))
                          );
                          return modelFile ? (
                            <ModelViewerModal
                              src={modelFile.url || modelFile.previewUrl}
                              alt={selectedItem.title}
                            />
                          ) : (
                            // Si no hay archivo GLB, mostrar imagen de portada
                            selectedItem.image && selectedItem.image !== '/placeholder-3d.jpg' ? (
                              <img
                                src={selectedItem.image}
                                alt={selectedItem.title}
                                className="w-full h-full object-cover"
                              />
                            ) : null
                          );
                        })()
                      ) : selectedItem.image && selectedItem.image !== '/placeholder-3d.jpg' ? (
                        // Si es imagen/textura, mostrar imagen normal
                        <img
                          src={selectedItem.image}
                          alt={selectedItem.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.log('Error cargando imagen:', selectedItem.image);
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className={`w-32 h-32 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-purple-500/30 ${selectedItem.type === 'Game' ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20' :
                            selectedItem.type === 'Texture Pack' ? 'bg-gradient-to-br from-orange-500/20 to-red-500/20' :
                              selectedItem.type === 'Collection' ? 'bg-gradient-to-br from-pink-500/20 to-purple-500/20' :
                                'bg-gradient-to-br from-purple-500/20 to-blue-500/20'
                            }`}>
                            {selectedItem.type === 'Game' ? (
                              <svg className="w-16 h-16 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                              </svg>
                            ) : selectedItem.type === 'Texture Pack' ? (
                              <svg className="w-16 h-16 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                              </svg>
                            ) : selectedItem.type === 'Collection' ? (
                              <svg className="w-16 h-16 text-pink-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            ) : (
                              <svg className="w-16 h-16 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Columna derecha - Información y compra */}
                  <div className="space-y-6">
                    {/* Información básica */}
                    <div>
                      <h3 className="text-3xl font-bold text-white mb-2">{selectedItem.title}</h3>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-gray-400">por</span>
                        <a href={`/profile/${selectedItem.author}`} className="text-purple-400 hover:text-purple-300 font-medium">
                          {selectedItem.author}
                        </a>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-300 mb-6">
                        <span className="bg-purple-500/20 px-3 py-1 rounded-full border border-purple-500/30">
                          {selectedItem.type}
                        </span>
                        <span className="bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/30">
                          {selectedItem.category}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${selectedItem.license === 'personal' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                          selectedItem.license === 'commercial' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                            'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          }`}>
                          {selectedItem.license}
                        </span>
                      </div>
                    </div>

                    {/* Precio y compra */}
                    <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm rounded-2xl p-6 border border-green-500/20">
                      <div className="text-center">
                        <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-4">
                          {selectedItem.price}
                        </div>
                        <button className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/25">
                          {selectedItem.isFree ? 'Descargar Gratis' : 'Comprar Ahora'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vista Expandida (solo cuando está expandida) */}
                {isModalExpanded && (
                  <div className="border-t border-purple-500/20 pt-8">
                    <div className="grid grid-cols-12 gap-6">
                      {/* IZQUIERDA: 70% - Descripción */}
                      <section className="col-span-12 md:col-span-8">
                        <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20 mb-6">
                          <h3 className="text-xl font-bold text-white mb-4">Descripción</h3>
                          <div className="prose prose-invert max-w-none leading-relaxed space-y-4">
                            <p className="text-gray-300 leading-relaxed">
                              {selectedItem.description || 'No hay descripción disponible para este contenido.'}
                            </p>
                            <p className="text-gray-300 leading-relaxed">
                              Este es un contenido de ejemplo para probar el scroll. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            </p>
                            <p className="text-gray-300 leading-relaxed">
                              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.
                            </p>
                            <p className="text-gray-300 leading-relaxed">
                              Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                            </p>
                          </div>
                        </div>

                        {/* Tags clickeables */}
                        {selectedItem.tags && selectedItem.tags.length > 0 && (
                          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
                            <h3 className="text-xl font-bold text-white mb-4">Etiquetas</h3>
                            <div className="flex flex-wrap gap-2">
                              {selectedItem.tags.map((tag, index) => (
                                <button
                                  key={index}
                                  className="px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-full text-sm border border-purple-500/30 transition-colors"
                                >
                                  #{tag}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </section>

                      {/* DERECHA: 30% pegada y sticky */}
                      <aside className="col-span-12 md:col-span-4 md:col-start-9 self-start sticky top-20 space-y-4">
                        {/* Estadísticas */}
                        <div className="p-4 rounded-xl bg-purple-900/40 backdrop-blur-sm border border-gray-500/20">
                          <h4 className="font-semibold mb-2 text-white">Estadísticas</h4>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                </svg>
                                <span className="text-gray-300 text-sm">Likes</span>
                              </div>
                              <span className="text-white font-bold">{selectedItem.likes}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                <span className="text-gray-300 text-sm">Descargas</span>
                              </div>
                              <span className="text-white font-bold">{selectedItem.downloads}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <span className="text-gray-300 text-sm">Vistas</span>
                              </div>
                              <span className="text-white font-bold">{selectedItem.views}</span>
                            </div>
                          </div>
                        </div>

                        {/* Botón principal */}
                        <a
                          href={`/p/${selectedItem.title.toLowerCase().replace(/\s+/g, '-')}`}
                          className="block text-center w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
                        >
                          Ir a página del producto →
                        </a>
                      </aside>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}