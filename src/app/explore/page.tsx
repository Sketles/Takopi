'use client';

import Layout from '@/components/shared/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect, useMemo } from 'react';
import ContentCard, { useContentCard } from '@/components/shared/ContentCard';
import ProductModal from '@/components/product/ProductModal';
import SearchBar from '@/components/search/SearchBar';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/components/shared/Toast';

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
  const { addProductToCart, isProductInCart } = useCart();
  const { addToast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState('Todo');
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [likesData, setLikesData] = useState<{ [key: string]: { isLiked: boolean; likesCount: number } }>({});
  const { createCardProps } = useContentCard();

  // Estados para búsqueda
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ContentItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<Array<{ type: string; value: string }>>([]);

  // Función para cargar todos los likes de una vez
  const loadAllLikes = async (items: ContentItem[]) => {
    const token = localStorage.getItem('takopi_token');
    if (!token) return;

    try {
      const promises = items.map(async (item) => {
        try {
          const response = await fetch(`/api/likes?contentId=${item.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const result = await response.json();
            if (result.success) {
              return {
                contentId: item.id,
                data: result.data
              };
            }
          }
        } catch (error) {
          // Error silencioso para likes individuales
        }
        
        return {
          contentId: item.id,
          data: { isLiked: false, likesCount: item.likes || 0 }
        };
      });

      const results = await Promise.all(promises);
      const likesMap: { [key: string]: { isLiked: boolean; likesCount: number } } = {};
      
      results.forEach(result => {
        likesMap[result.contentId] = result.data;
      });

      setLikesData(likesMap);
    } catch (error) {
      // Error silencioso para carga de likes
    }
  };

  // Función para obtener las props de una tarjeta de manera síncrona (sin side effects)
  const getCardProps = (item: ContentItem, options: any = {}) => {
    // Usar datos de likes ya cargados
    const likeInfo = likesData[item.id] || { isLiked: false, likesCount: item.likes || 0 };
    
    return {
      id: item.id,
      title: item.title,
      author: item.author,
      authorAvatar: (item as any).authorAvatar,
      contentType: item.contentType || item.type,
      category: item.category,
      price: item.price,
      isFree: item.isFree,
      currency: item.currency,
      image: item.image,
      coverImage: item.coverImage,
      description: item.description,
      shortDescription: item.shortDescription,
      tags: item.tags || [],
      likes: likeInfo.likesCount,
      views: item.views || 0,
      downloads: item.downloads || 0,
      favorites: (item as any).favorites || 0,
      createdAt: item.createdAt,
      updatedAt: (item as any).updatedAt || item.createdAt,
      isLiked: likeInfo.isLiked,
      ...options
    };
  };

  // Componente optimizado para tarjetas
  const ContentCardWrapper = ({ item, options }: { item: ContentItem; options: any }) => {
    const cardProps = useMemo(() => getCardProps(item, options), [item, options, likesData]);
    return <ContentCard {...cardProps} className="flex flex-col h-[420px]" />;
  };

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
        
        // Cargar likes después de cargar el contenido
        loadAllLikes(result.data);
      } else {
        throw new Error(result.error || 'Error al cargar contenido');
      }
    } catch (err) {
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

  // Funciones para búsqueda
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      setLoading(true);
      
      const params = new URLSearchParams();
      params.set('q', searchQuery);
      
      const response = await fetch(`/api/search?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setSearchResults(data.data.items);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error en búsqueda:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
    fetchContent(selectedCategory);
  };

  const handleSuggestions = async (partial: string) => {
    if (partial.length < 2) return;
    
    try {
      const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(partial)}&limit=8`);
      const data = await response.json();
      
      if (data.success) {
        const suggestions = [
          ...data.data.tags.map((tag: string) => ({ type: 'tag', value: tag })),
          ...data.data.titles.map((title: string) => ({ type: 'title', value: title }))
        ];
        setSearchSuggestions(suggestions);
      }
    } catch (error) {
      console.error('Error obteniendo sugerencias:', error);
    }
  };



  // Filtrar por categoría (ahora se hace en el servidor)
  const filteredItems = content;

  // Determinar qué contenido mostrar
  const displayItems = isSearching ? searchResults : filteredItems;

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

  // Función para manejar agregar al carrito
  const handleAddToBox = async (product: any) => {
    try {
      // Verificar si ya está en el carrito
      if (isProductInCart(product.id)) {
        addToast({
          type: 'warning',
          title: 'Ya está en tu Box',
          message: 'Este producto ya está en tu carrito'
        });
        return;
      }

      // Agregar al carrito
      const result = addProductToCart({
        ...product,
        author: product.author || 'Usuario',
        authorUsername: typeof product.author === 'string' ? product.author : 'Usuario',
        coverImage: product.coverImage || product.image || '/placeholder-content.jpg'
      });

      if (result.success) {
        addToast({
          type: 'success',
          title: 'Agregado a tu Box',
          message: result.message
        });
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          message: result.message
        });
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'No se pudo agregar al carrito'
      });
    }
  };

  // Función para manejar eliminación de contenido
  const handleDeleteContent = async (product: any, source?: string) => {
    try {
      const token = localStorage.getItem('takopi_token');
      
      console.log('🔍 Eliminando contenido con ID:', product.id);
      
      const response = await fetch(`/api/content/${product.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Remover el contenido de la lista si estamos en explore
        if (source === 'explore') {
          setContent(prev => prev.filter(item => item.id !== product.id));
        }
        
        // El modal se cerrará automáticamente por el ProductModal
        return { success: true };
      } else {
        console.error('❌ Error eliminando contenido:', response.status);
        const errorData = await response.json().catch(() => ({}));
        alert(`Error: ${errorData.error || 'Error al eliminar el contenido'}`);
        throw new Error(errorData.error || 'Error al eliminar el contenido');
      }
    } catch (error) {
      console.error('❌ Error eliminando contenido:', error);
      alert('Error al eliminar el contenido');
      throw error;
    }
  };

  // Función para transformar ContentItem a formato de ProductModal
  const transformContentItem = (item: ContentItem) => {
    
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
      authorAvatar: (item as any).authorAvatar,
      authorId: (item as any).authorId,
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

        {/* SearchBar integrado */}
        <div className="mb-12">
          <div className="max-w-4xl mx-auto">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
              onSuggestions={handleSuggestions}
              suggestions={searchSuggestions}
              loading={loading}
              placeholder="Buscar contenido... (ej: música streaming, modelo 3D casa, texturas metal)"
            />
            
            {/* Indicador de búsqueda activa */}
            {isSearching && (
              <div className="mt-4 flex items-center justify-between bg-purple-900/20 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="text-purple-300">
                    Buscando: <strong className="text-white">{searchQuery}</strong>
                  </span>
                  <span className="text-gray-400 text-sm">
                    ({isSearching ? searchResults.length : content.length} resultados)
                  </span>
                </div>
                <button
                  onClick={handleClearSearch}
                  className="px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white rounded-lg transition-colors text-sm"
                >
                  Limpiar búsqueda
                </button>
              </div>
            )}

            {/* Enlace a búsqueda avanzada */}
            <div className="text-center mt-4">
              <Link
                href="/search"
                className="text-purple-400 hover:text-purple-300 text-sm transition-colors inline-flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                Búsqueda avanzada con filtros
              </Link>
            </div>
          </div>
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
                  <ContentCardWrapper
                    item={item}
                    options={{
                      onClick: () => openItemModal(item),
                      variant: 'featured',
                      showPrice: true,
                      showStats: true,
                      showTags: false,
                      showAuthor: false,
                      showDescription: true
                    }}
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
            {displayItems.map((item, index) => (
              <div key={item.id} style={{ animationDelay: `${index * 100}ms` }}>
                <ContentCardWrapper
                  item={item}
                  options={{
                    onClick: () => openItemModal(item),
                    variant: 'default',
                    showPrice: true,
                    showStats: true,
                    showTags: false,
                    showAuthor: false,
                    showDescription: true
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Mensaje cuando no hay contenido */}
        {!loading && !error && displayItems.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 backdrop-blur-md rounded-2xl border border-purple-500/20 p-8 max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <svg className="w-10 h-10 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {isSearching ? 'No se encontraron resultados' : 'No hay contenido disponible'}
              </h3>
              <p className="text-gray-300 mb-6">
                {isSearching
                  ? `No se encontraron resultados para "${searchQuery}". Intenta con otros términos.`
                  : selectedCategory === 'Todo'
                    ? 'Aún no hay contenido subido a la plataforma. ¡Sé el primero en subir algo!'
                    : `No hay contenido disponible en la categoría "${selectedCategory}". Prueba con otra categoría.`
                }
              </p>
              {isSearching ? (
                <button
                  onClick={handleClearSearch}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Limpiar búsqueda
                </button>
              ) : (
                <a
                  href="/upload"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Subir Contenido
                </a>
              )}
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
          isOwner={(() => {
            return user?.username === selectedItem.author;
          })()}
          currentUserId={user?._id}
          onEdit={() => {}}
          onDelete={handleDeleteContent}
          onBuy={() => {}}
          onAddToBox={handleAddToBox}
          onLike={() => {}}
          onSave={() => {}}
          onShare={() => {}}
          source="explore"
        />
      )}
    </Layout>
  );
}