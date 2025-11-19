'use client';

import Layout from '@/components/shared/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect, useMemo, useRef } from 'react';
import ContentCard, { useContentCard } from '@/components/shared/ContentCard';
import ProductModal from '@/components/product/ProductModal';
import SearchBar from '@/components/search/SearchBar';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/components/shared/Toast';
import { ChevronLeftIcon, ChevronRightIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

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

export default function ExplorePage() {
  const { user, isLoading } = useAuth();
  const { addProductToCart, isProductInCart } = useCart();
  const { addToast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState('Todo');
  const [content, setContent] = useState<ContentItem[]>([]);
  const [trendingContent, setTrendingContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [likesData, setLikesData] = useState<{ [key: string]: { isLiked: boolean; likesCount: number } }>({});
  const { createCardProps } = useContentCard();

  // Estados para búsqueda y filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ContentItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<Array<{ type: string; value: string }>>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Filtros Avanzados
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'price_asc' | 'price_desc'>('newest');
  const [licenseFilter, setLicenseFilter] = useState<'all' | 'personal' | 'commercial'>('all');

  // Carousel Refs
  const carouselRef = useRef<HTMLDivElement>(null);

  // Función para cargar todos los likes de una vez usando batch endpoint
  const loadAllLikes = async (items: ContentItem[]) => {
    const token = localStorage.getItem('takopi_token');
    if (!token || items.length === 0) return;

    try {
      const contentIds = items.map(item => item.id).join(',');
      const response = await fetch(`/api/likes?contentIds=${contentIds}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          const likesMap: { [key: string]: { isLiked: boolean; likesCount: number } } = {};

          result.data.forEach((item: any) => {
            likesMap[item.contentId] = {
              isLiked: item.isLiked,
              likesCount: item.likesCount
            };
          });

          setLikesData(prev => ({ ...prev, ...likesMap }));
        }
      }
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error loading likes:', error);
      }
    }
  };

  // Función para obtener las props de una tarjeta
  const getCardProps = (item: ContentItem, options: any = {}) => {
    const likeInfo = likesData[item.id] || { isLiked: false, likesCount: item.likes || 0 };

    return {
      id: item.id,
      title: item.title,
      author: item.author,
      authorAvatar: (item as any).authorAvatar,
      authorId: (item as any).authorId,
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
    return <ContentCard {...cardProps} className="h-full" />;
  };

  // Mapeo de categorías
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

  // Cargar contenido
  const fetchContent = async (category: string = 'Todo') => {
    try {
      setLoading(true);
      setError(null);

      const contentTypeParam = mapCategoryToContentType(category);
      let url = `/api/content/explore?category=${encodeURIComponent(contentTypeParam)}&limit=50`;

      // Añadir filtros a la URL (simulado por ahora si la API no lo soporta, pero preparado)
      if (priceFilter !== 'all') url += `&price=${priceFilter}`;
      if (sortBy !== 'newest') url += `&sort=${sortBy}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Error al cargar contenido');
      }

      const result = await response.json();

      if (result.success) {
        let filteredData = result.data;

        // Filtrado en cliente si la API no lo soporta completamente
        if (priceFilter === 'free') filteredData = filteredData.filter((item: ContentItem) => item.isFree);
        if (priceFilter === 'paid') filteredData = filteredData.filter((item: ContentItem) => !item.isFree);

        // Ordenamiento en cliente
        if (sortBy === 'price_asc') {
          filteredData.sort((a: ContentItem, b: ContentItem) => {
            const priceA = parseFloat(a.price) || 0;
            const priceB = parseFloat(b.price) || 0;
            return priceA - priceB;
          });
        } else if (sortBy === 'price_desc') {
          filteredData.sort((a: ContentItem, b: ContentItem) => {
            const priceA = parseFloat(a.price) || 0;
            const priceB = parseFloat(b.price) || 0;
            return priceB - priceA;
          });
        }

        setContent(filteredData);
        loadAllLikes(filteredData);

        // Cargar tendencias (simulado con los primeros 5 items o aleatorios)
        if (trendingContent.length === 0 && result.data.length > 0) {
          setTrendingContent(result.data.slice(0, 5));
        }
      } else {
        throw new Error(result.error || 'Error al cargar contenido');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setContent([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      fetchContent(selectedCategory);
    }
  }, [selectedCategory, isLoading, priceFilter, sortBy]); // Recargar cuando cambian filtros

  // Búsqueda
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
      // Añadir filtros a la búsqueda
      if (priceFilter !== 'all') params.set('price', priceFilter);

      const response = await fetch(`/api/search?${params}`);
      const data = await response.json();

      if (data.success) {
        setSearchResults(data.data.items);
        loadAllLikes(data.data.items);
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

  const filteredItems = content;
  const displayItems = isSearching ? searchResults : filteredItems;

  const openItemModal = (item: ContentItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleAddToBox = async (product: any) => {
    try {
      if (isProductInCart(product.id)) {
        addToast({
          type: 'warning',
          title: 'Ya está en tu Box',
          message: 'Este producto ya está en tu carrito'
        });
        return;
      }

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

  const handleDeleteContent = async (product: any, source?: string) => {
    try {
      const token = localStorage.getItem('takopi_token');
      const response = await fetch(`/api/content/${product.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        if (source === 'explore') {
          setContent(prev => prev.filter(item => item.id !== product.id));
        }
        return { success: true };
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Error al eliminar el contenido');
      }
    } catch (error) {
      console.error('❌ Error eliminando contenido:', error);
      alert('Error al eliminar el contenido');
      throw error;
    }
  };

  const transformContentItem = (item: ContentItem) => {
    return {
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
      files: (item as any).files || [],
      coverImage: item.image,
      additionalImages: [],
      tags: item.tags || [],
      customTags: [],
      createdAt: item.createdAt,
      updatedAt: item.createdAt
    };
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 350;
      if (direction === 'left') {
        carouselRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  const categories = ['Todo', 'Avatares', 'Modelos 3D', 'Música', 'Texturas', 'Animaciones', 'OBS', 'Colecciones'];

  return (
    <Layout>
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        {/* Hero Section Espectacular */}
        <div className="relative pt-32 pb-16 px-4 overflow-hidden">
          {/* Fondos Abstractos */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]"></div>
          </div>

          <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">
              Explorar
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-600 drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]">
                Marketplace
              </span>
            </h1>

            {/* Carousel de Tendencias */}
            {trendingContent.length > 0 && (
              <div className="relative mt-12 mb-16 text-left">
                <div className="flex items-center justify-between mb-4 px-4">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <span className="text-yellow-400">★</span> Tendencias para ti
                  </h2>
                  <div className="flex gap-2">
                    <button onClick={() => scrollCarousel('left')} className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
                      <ChevronLeftIcon className="w-5 h-5" />
                    </button>
                    <button onClick={() => scrollCarousel('right')} className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
                      <ChevronRightIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div
                  ref={carouselRef}
                  className="flex gap-6 overflow-x-auto pb-8 px-4 snap-x snap-mandatory scrollbar-hide"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {trendingContent.map((item) => (
                    <div key={`trend-${item.id}`} className="min-w-[300px] md:min-w-[350px] snap-center">
                      <ContentCardWrapper
                        item={item}
                        options={{
                          onClick: () => openItemModal(item),
                          showPrice: true,
                          showStats: false,
                          showDescription: false
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Search Bar & Filtros */}
            <div className="max-w-3xl mx-auto">
              <div className="relative group z-20">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-[#0f0f0f] rounded-2xl shadow-2xl flex items-center p-2 gap-2">
                  <div className="flex-1">
                    <SearchBar
                      value={searchQuery}
                      onChange={setSearchQuery}
                      onSearch={handleSearch}
                      onSuggestions={handleSuggestions}
                      suggestions={searchSuggestions}
                      loading={loading}
                      placeholder="Buscar productos, creadores, etiquetas..."
                      className="w-full"
                    />
                  </div>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`p-4 rounded-xl border transition-all duration-300 flex items-center gap-2 ${showFilters
                      ? 'bg-purple-500 text-white border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                      }`}
                  >
                    <AdjustmentsHorizontalIcon className="w-6 h-6" />
                    <span className="hidden md:inline font-medium">Filtros</span>
                  </button>
                </div>
              </div>

              {/* Panel de Filtros Avanzados */}
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showFilters ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                <div className="bg-[#151515] border border-white/10 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-left shadow-2xl">

                  {/* Filtro de Precio */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Precio</h3>
                    <div className="flex flex-col gap-2">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${priceFilter === 'all' ? 'border-purple-500 bg-purple-500/20' : 'border-gray-600 group-hover:border-gray-400'}`}>
                          {priceFilter === 'all' && <div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div>}
                        </div>
                        <input type="radio" name="price" className="hidden" checked={priceFilter === 'all'} onChange={() => setPriceFilter('all')} />
                        <span className={priceFilter === 'all' ? 'text-white' : 'text-gray-400'}>Todos los precios</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${priceFilter === 'free' ? 'border-green-500 bg-green-500/20' : 'border-gray-600 group-hover:border-gray-400'}`}>
                          {priceFilter === 'free' && <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>}
                        </div>
                        <input type="radio" name="price" className="hidden" checked={priceFilter === 'free'} onChange={() => setPriceFilter('free')} />
                        <span className={priceFilter === 'free' ? 'text-white' : 'text-gray-400'}>Gratis</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${priceFilter === 'paid' ? 'border-purple-500 bg-purple-500/20' : 'border-gray-600 group-hover:border-gray-400'}`}>
                          {priceFilter === 'paid' && <div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div>}
                        </div>
                        <input type="radio" name="price" className="hidden" checked={priceFilter === 'paid'} onChange={() => setPriceFilter('paid')} />
                        <span className={priceFilter === 'paid' ? 'text-white' : 'text-gray-400'}>De Pago</span>
                      </label>
                    </div>
                  </div>

                  {/* Ordenar Por */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Ordenar Por</h3>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-colors appearance-none cursor-pointer"
                    >
                      <option value="newest">✨ Más Recientes</option>
                      <option value="popular">🔥 Más Populares</option>
                      <option value="price_asc">💰 Precio: Menor a Mayor</option>
                      <option value="price_desc">💎 Precio: Mayor a Menor</option>
                    </select>
                  </div>

                  {/* Licencia */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Licencia</h3>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setLicenseFilter('all')}
                        className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${licenseFilter === 'all' ? 'bg-white text-black border-white' : 'bg-transparent border-white/10 text-gray-400 hover:border-white/30'}`}
                      >
                        Cualquiera
                      </button>
                      <button
                        onClick={() => setLicenseFilter('personal')}
                        className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${licenseFilter === 'personal' ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' : 'bg-transparent border-white/10 text-gray-400 hover:border-white/30'}`}
                      >
                        Personal
                      </button>
                      <button
                        onClick={() => setLicenseFilter('commercial')}
                        className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${licenseFilter === 'commercial' ? 'bg-purple-500/20 text-purple-400 border-purple-500/50' : 'bg-transparent border-white/10 text-gray-400 hover:border-white/30'}`}
                      >
                        Comercial
                      </button>
                    </div>
                  </div>

                  {/* Botón de Aplicar (Opcional, ya que es reactivo) */}
                  <div className="md:col-span-3 pt-4 border-t border-white/5 flex justify-end">
                    <button
                      onClick={() => setShowFilters(false)}
                      className="text-sm text-gray-400 hover:text-white underline decoration-gray-600 hover:decoration-white underline-offset-4 transition-all"
                    >
                      Ocultar Filtros
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-24">
          {/* Categorías */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-300 border ${selectedCategory === category
                  ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white hover:border-white/30'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Estado de Carga */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-400 animate-pulse">Cargando contenido increíble...</p>
            </div>
          )}

          {/* Grid de Contenido */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {displayItems.map((item, index) => (
                <div key={item.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                  <ContentCardWrapper
                    item={item}
                    options={{
                      onClick: () => openItemModal(item),
                      showPrice: true,
                      showStats: true,
                      showDescription: true
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && displayItems.length === 0 && (
            <div className="text-center py-24">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/5 mb-6">
                <span className="text-4xl">🔍</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No encontramos nada por aquí</h3>
              <p className="text-gray-400">Intenta con otra categoría o ajusta tus filtros.</p>
              <button
                onClick={() => {
                  setPriceFilter('all');
                  setSortBy('newest');
                  setSearchQuery('');
                  setSelectedCategory('Todo');
                }}
                className="mt-4 text-purple-400 hover:text-purple-300 font-medium"
              >
                Limpiar todos los filtros
              </button>
            </div>
          )}
        </div>

        {/* Modal de producto */}
        {selectedItem && (
          <ProductModal
            product={transformContentItem(selectedItem)}
            isOpen={isModalOpen}
            onClose={closeModal}
            isOwner={user?.username === selectedItem.author}
            currentUserId={user?._id}
            onEdit={() => { }}
            onDelete={handleDeleteContent}
            onBuy={() => { }}
            onAddToBox={handleAddToBox}
            onLike={() => { }}
            onSave={() => { }}
            onShare={() => { }}
            source="explore"
          />
        )}
      </div>
    </Layout>
  );
}