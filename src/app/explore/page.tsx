'use client';

import Layout from '@/components/shared/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { ModelViewerModal, ModelViewerPreview } from '@/components/ModelViewer3D';
import DefaultCover from '@/components/shared/DefaultCover';
import ProductDetailModal from '@/components/ProductDetailModal';

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

// Datos de ejemplo para explorar - Solo usuarios reales
const marketplaceItems = [
  // Solo mantener datos reales de usuarios existentes
  // Estos se reemplazarán con datos reales de la API
];

// Datos de tendencias (para usuarios no autenticados)
const trendingItems = marketplaceItems.slice(0, 6);

// Datos personalizados (para usuarios autenticados)
const personalizedItems = marketplaceItems.slice(1, 7);

export default function ExplorePage() {
  const { user, isLoading } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('Todo');
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Función para mapear categorías del frontend a tipos de contenido del backend
  const mapCategoryToContentType = (category: string): string => {
    const categoryMap: { [key: string]: string } = {
      'Todo': 'all',
      'Avatares': 'avatares',
      'Modelos 3D': 'modelos3d',
      'Música': 'musica',
      'Texturas': 'texturas',
      'Animaciones': 'animaciones',
      'OBS': 'OBS',
      'Colecciones': 'colecciones'
    };
    return categoryMap[category] || 'all';
  };

  // Función para cargar contenido desde la API
  const fetchContent = async (category: string = 'Todo') => {
    try {
      setLoading(true);
      setError(null);

      const contentTypeParam = mapCategoryToContentType(category);
      const response = await fetch(`/api/content/explore?category=${encodeURIComponent(contentTypeParam)}&limit=50`);

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
      // En caso de error, mostrar lista vacía
      setContent([]);
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


  // Filtrar por categoría (ahora se hace en el servidor)
  const filteredItems = content;

  // Función para abrir el modal con los detalles
  const openItemModal = (item: ContentItem) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  const categories = ['Todo', 'Avatares', 'Modelos 3D', 'Música', 'Texturas', 'Animaciones', 'OBS', 'Colecciones'];

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
        {user && content.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Basado en tus intereses
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {content.slice(0, 3).map((item, index) => (
                <div
                  key={`personalized-${item.id}`}
                  className="group bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-md rounded-2xl border border-purple-500/30 overflow-hidden hover:border-purple-400/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
                >
                  <div className="aspect-video bg-gradient-to-br from-purple-500/10 to-blue-500/10 flex items-center justify-center relative">
                    {item.image && !item.image.includes('/placeholder-') && !item.image.includes('http') && item.image.trim() !== '' ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    {/* DefaultCover - siempre presente como fallback */}
                    <div className={item.image && !item.image.includes('/placeholder-') && !item.image.includes('http') && item.image.trim() !== '' ? 'hidden w-full h-full' : 'w-full h-full'}>
                      <DefaultCover
                        contentType={item.contentType || 'models'}
                        className="w-full h-full"
                      />
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
                        {item.isFree ? 'GRATIS' : (item.price || '$0')}
                      </span>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                          </svg>
                          <span>{item.likes || 0}</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          <span>{item.downloads || 0}</span>
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
                  category === 'Avatares' ? '👤 Avatares' :
                    category === 'Modelos 3D' ? '🎯 Modelos 3D' :
                      category === 'Música' ? '🎵 Música' :
                        category === 'Texturas' ? '✨ Texturas' :
                          category === 'Animaciones' ? '🎬 Animaciones' :
                            category === 'OBS' ? '📺 OBS' :
                              category === 'Colecciones' ? '📦 Colecciones' : category}
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

                  {/* Mostrar imagen de portada o portada por defecto */}
                  {item.image && !item.image.includes('/placeholder-') && !item.image.includes('http') && item.image.trim() !== '' ? (
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
                  {/* DefaultCover - siempre presente como fallback */}
                  <div className={item.image && !item.image.includes('/placeholder-') && !item.image.includes('http') && item.image.trim() !== '' ? 'hidden w-full h-full' : 'w-full h-full'}>
                    <DefaultCover
                      contentType={item.contentType || 'models'}
                      className="w-full h-full"
                    />
                  </div>

                  {/* Debug info */}
                  {process.env.NODE_ENV === 'development' && (
                    <div className="absolute bottom-2 left-2 bg-black/80 text-white text-xs p-1 rounded">
                      Type: {item.contentType || 'undefined'}
                    </div>
                  )}

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

      {/* Nuevo Modal de Detalle de Producto */}
      <ProductDetailModal
        product={selectedItem}
        isOpen={showModal}
        onClose={closeModal}
      />
    </Layout>
  );
}