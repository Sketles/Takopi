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
  description?: string;
  shortDescription?: string;
}

// Datos de ejemplo para explorar - Solo usuarios reales
const marketplaceItems: ContentItem[] = [
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

  // Función para obtener el icono del tipo de contenido
  const getContentTypeIcon = (type: string) => {
    if (type === 'OBS') {
      return (
        <img
          src="/logos/OBS_Studio_logo.png"
          alt="OBS"
          className="w-4 h-4 object-contain filter brightness-0 invert"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextElementSibling?.classList.remove('hidden');
          }}
        />
      );
    }

    const icons: { [key: string]: string } = {
      'avatares': '👤',
      'modelos3d': '🧩',
      'musica': '🎵',
      'texturas': '🖼️',
      'animaciones': '🎬',
      'colecciones': '📦'
    };
    return icons[type] || '📁';
  };

  // Función para obtener el nombre del tipo de contenido
  const getContentTypeName = (type: string) => {
    const names: { [key: string]: string } = {
      'avatares': 'Avatar',
      'modelos3d': 'Modelo 3D',
      'musica': 'Música',
      'texturas': 'Textura',
      'animaciones': 'Animación',
      'OBS': 'OBS Widget',
      'colecciones': 'Colección'
    };
    return names[type] || type;
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 overflow-hidden hover:shadow-xl hover:shadow-purple-500/10 cursor-pointer flex flex-col h-[420px]"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => openItemModal(item)}
              >
                {/* Imagen de la creación */}
                <div className="aspect-square relative overflow-hidden">
                  {item.image && !item.image.includes('/placeholder-') && !item.image.includes('http') && item.image.trim() !== '' ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : (
                    <DefaultCover
                      contentType={item.contentType || 'modelos3d'}
                      className="w-full h-full"
                    />
                  )}

                  {/* Overlay con tipo de contenido */}
                  <div className="absolute top-3 left-3 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-lg text-white text-xs font-medium flex items-center gap-1">
                    <span>{getContentTypeIcon(item.contentType)}</span>
                    <span>{getContentTypeName(item.contentType)}</span>
                  </div>


                  {/* Stats overlay */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <div className="flex items-center gap-3 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1">
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                        </svg>
                        <span>{item.likes || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>{item.views || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span>0</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Información de la creación */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
                    {item.title || 'Sin título'}
                  </h3>

                  {/* Contenido flexible */}
                  <div className="flex-1">
                    {/* Mostrar descripción breve si existe, sino descripción normal */}
                    {(item.shortDescription || item.description) && (
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                        {item.shortDescription || item.description}
                      </p>
                    )}

                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs border border-purple-500/30"
                          >
                            #{tag}
                          </span>
                        ))}
                        {item.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs">
                            +{item.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span>
                        {new Date(item.createdAt).toLocaleDateString('es-CL', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                      <span className="capitalize">{item.category}</span>
                    </div>
                  </div>

                  {/* Precio elegante y profesional - siempre al final */}
                  <div className="mt-auto flex justify-end">
                    <div className="px-4 py-2 rounded-xl border-2 border-purple-500/60 group/price-hover transition-all duration-300 hover:border-purple-400/80 hover:shadow-lg hover:shadow-purple-500/20">
                      <span className="bg-gradient-to-r from-purple-400 via-purple-300 to-blue-400 bg-clip-text text-transparent font-bold text-base tracking-wide drop-shadow-lg group-hover/price-hover:from-purple-300 group-hover/price-hover:via-blue-300 group-hover/price-hover:to-cyan-400 transition-all duration-500">
                        {item.price}
                      </span>

                      {/* Efecto de resplandor sutil */}
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 via-purple-300/10 to-blue-400/10 rounded-xl opacity-0 group-hover/price-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                    </div>
                  </div>
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