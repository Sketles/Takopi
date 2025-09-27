'use client';

import Layout from '@/components/shared/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { ModelViewerModal, ModelViewerPreview } from '@/components/ModelViewer3D';
import ContentCard, { useContentCard } from '@/components/shared/ContentCard';
import ProductModal from '@/components/product/ProductModal';

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
  files?: Array<{
    name: string;
    type: string;
    size: number;
    url: string;
    previewUrl?: string;
  }>;
  coverImage?: string;
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { createCardProps } = useContentCard();

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
      console.log('🔍 fetchContent - Respuesta de API:', result);

      if (result.success) {
        console.log('🔍 fetchContent - Datos recibidos:', result.data);
        console.log('🔍 fetchContent - Primer item files:', result.data[0]?.files);
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



  // Filtrar por categoría (ahora se hace en el servidor)
  const filteredItems = content;

  // Función para abrir el modal con los detalles
  const openItemModal = (item: ContentItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  // Función para transformar ContentItem a formato de ProductModal
  const transformContentItem = (item: ContentItem) => {
    console.log('🔍 transformContentItem - Item recibido:', item);
    console.log('🔍 transformContentItem - Item.files:', (item as any).files);
    
    const transformed = {
      id: item.id,
      title: item.title,
      description: item.description || '',
      shortDescription: item.shortDescription,
      contentType: item.contentType,
      category: item.category,
      price: typeof item.price === 'string' ? parseFloat(item.price) || 0 : item.price,
      currency: item.currency || 'CLP',
      isFree: item.isFree,
      license: item.license || 'personal',
      customLicense: undefined,
      visibility: 'public',
      status: 'published',
      author: item.author,
      authorAvatar: undefined,
      authorId: undefined,
      likes: item.likes,
      views: item.views,
      files: (item as any).files || [], // Usar los archivos reales de la API
      coverImage: item.image,
      additionalImages: [],
      tags: item.tags || [],
      customTags: [],
      createdAt: item.createdAt,
      updatedAt: item.createdAt
    };
    
    console.log('🔍 transformContentItem - Resultado transformado:', transformed);
    return transformed;
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
                <div key={`personalized-${item.id}`} className="relative">
                  <ContentCard
                    {...createCardProps(item, {
                      onClick: () => openItemModal(item),
                      variant: 'featured',
                      showPrice: true,
                      showStats: true,
                      showTags: false,
                      showAuthor: false,
                      showDescription: true
                    })}
                  />
                  <div className="absolute top-3 right-3 z-10">
                    <span className="px-3 py-1.5 bg-gradient-to-r from-purple-600/90 to-blue-600/90 backdrop-blur-sm text-white text-xs font-medium rounded-full border border-purple-400/50 shadow-lg">
                        Recomendado
                      </span>
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
              <div key={item.id} style={{ animationDelay: `${index * 100}ms` }}>
                <ContentCard
                  {...createCardProps(item, {
                    onClick: () => openItemModal(item),
                    variant: 'default',
                    showPrice: true,
                    showStats: true,
                    showTags: false,
                    showAuthor: false,
                    showDescription: true
                  })}
                  className="flex flex-col h-[420px]"
                />
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

      {/* Modal de producto */}
      {selectedItem && (
        <ProductModal
          product={transformContentItem(selectedItem)}
          isOpen={isModalOpen}
          onClose={closeModal}
          isOwner={user?.username === selectedItem.author}
          onEdit={(product) => console.log('Edit product:', product)}
          onDelete={(product) => console.log('Delete product:', product)}
          onBuy={(product) => console.log('Buy product:', product)}
          onAddToBox={(product) => console.log('Add to box:', product)}
          onLike={(product) => console.log('Like product:', product)}
          onSave={(product) => console.log('Save product:', product)}
          onShare={(product) => console.log('Share product:', product)}
        />
      )}
    </Layout>
  );
}