'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Layout from '@/components/shared/Layout';
import { useAuth } from '@/contexts/AuthContext';
import SearchBar from '@/components/search/SearchBar';
import TagCloud from '@/components/search/TagCloud';
import SearchFilters from '@/components/search/SearchFilters';
import SearchResults from '@/components/search/SearchResults';
import EmptyState from '@/components/search/EmptyState';

// Interfaces
interface SearchQuery {
  text?: string;
  tags?: string[];
  tagsOperator?: 'AND' | 'OR';
  categories?: string[];
  priceRange?: { min: number; max: number };
  isFree?: boolean;
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'date' | 'popularity';
  page?: number;
  limit?: number;
}

interface SearchResult {
  items: any[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
  suggestedTags?: string[];
  relatedSearches?: string[];
  stats: {
    total: number;
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    showing: string;
  };
}

interface SearchState {
  query: SearchQuery;
  results: SearchResult | null;
  loading: boolean;
  error: string | null;
  popularTags: string[];
  suggestions: Array<{ type: string; value: string }>;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  // Estado principal
  const [state, setState] = useState<SearchState>({
    query: {},
    results: null,
    loading: false,
    error: null,
    popularTags: [],
    suggestions: []
  });

  // Estado de UI
  const [showFilters, setShowFilters] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Ref para prevenir búsquedas múltiples simultáneas
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSearchingRef = useRef(false);

  // Inicializar query desde URL
  useEffect(() => {
    const urlQuery: SearchQuery = {};
    
    if (searchParams.get('q')) urlQuery.text = searchParams.get('q')!;
    if (searchParams.get('tags')) urlQuery.tags = searchParams.get('tags')!.split(',');
    if (searchParams.get('tags_operator')) urlQuery.tagsOperator = searchParams.get('tags_operator') as 'AND' | 'OR';
    if (searchParams.get('categories')) urlQuery.categories = searchParams.get('categories')!.split(',');
    if (searchParams.get('sort')) urlQuery.sortBy = searchParams.get('sort') as any;
    if (searchParams.get('page')) urlQuery.page = parseInt(searchParams.get('page')!);
    if (searchParams.get('limit')) urlQuery.limit = parseInt(searchParams.get('limit')!);
    
    if (searchParams.get('price_min') && searchParams.get('price_max')) {
      urlQuery.priceRange = {
        min: parseInt(searchParams.get('price_min')!),
        max: parseInt(searchParams.get('price_max')!)
      };
    }
    
    if (searchParams.get('free')) {
      urlQuery.isFree = searchParams.get('free') === 'true';
    }

    setState(prev => ({ ...prev, query: urlQuery }));
    setIsInitialized(true);
  }, [searchParams]);

  // Función para verificar si hay criterios de búsqueda
  const hasSearchCriteria = useCallback((query: SearchQuery): boolean => {
    return !!(
      (query.text && query.text.length >= 2) || 
      query.tags?.length || 
      query.categories?.length
    );
  }, []);

  // Función para cargar tags populares
  const loadPopularTags = async () => {
    try {
      const response = await fetch('/api/search/tags?limit=20');
      const data = await response.json();
      
      if (data.success) {
        setState(prev => ({ ...prev, popularTags: data.data.tags }));
      }
    } catch (error) {
      console.error('Error cargando tags populares:', error);
    }
  };

  // Función principal de búsqueda
  const performSearch = useCallback(async (query: SearchQuery) => {
    // Validar que la query tenga criterios de búsqueda válidos
    if (!hasSearchCriteria(query)) {
      return;
    }

    // Prevenir búsquedas múltiples simultáneas
    if (isSearchingRef.current) {
      return;
    }

    isSearchingRef.current = true;
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const params = new URLSearchParams();
      
      if (query.text) params.set('q', query.text);
      if (query.tags?.length) params.set('tags', query.tags.join(','));
      if (query.categories?.length) params.set('categories', query.categories.join(','));
      if (query.tagsOperator && query.tagsOperator !== 'OR') params.set('tags_operator', query.tagsOperator);
      if (query.sortBy && query.sortBy !== 'relevance') params.set('sort', query.sortBy);
      if (query.page && query.page !== 1) params.set('page', query.page.toString());
      if (query.limit && query.limit !== 20) params.set('limit', query.limit.toString());
      
      if (query.priceRange) {
        params.set('price_min', query.priceRange.min.toString());
        params.set('price_max', query.priceRange.max.toString());
      }
      
      if (query.isFree !== undefined) params.set('free', query.isFree.toString());

      const url = `/api/search?${params}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setState(prev => ({ 
          ...prev, 
          results: data.data, 
          loading: false 
        }));
      } else {
        setState(prev => ({ 
          ...prev, 
          error: data.error, 
          loading: false 
        }));
      }
    } catch (error) {
      console.error('Error en búsqueda:', error);
      setState(prev => ({ 
        ...prev, 
        error: 'Error al realizar la búsqueda', 
        loading: false 
      }));
    } finally {
      isSearchingRef.current = false;
    }
  }, [hasSearchCriteria]);

  // Cargar tags populares al inicializar
  useEffect(() => {
    loadPopularTags();
  }, []);

  // Realizar búsqueda cuando cambie la query (con debounce)
  useEffect(() => {
    if (isInitialized && hasSearchCriteria(state.query)) {
      // Limpiar timeout anterior si existe
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      
      // Usar debounce para evitar búsquedas en cada keystroke
      searchTimeoutRef.current = setTimeout(() => {
        performSearch(state.query);
      }, 500); // 500ms de delay
      
      return () => {
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current);
        }
      };
    }
  }, [state.query, isInitialized, performSearch, hasSearchCriteria]);

  // Función para actualizar query
  const updateQuery = useCallback((updates: Partial<SearchQuery>) => {
    const newQuery = { ...state.query, ...updates };
    setState(prev => ({ ...prev, query: newQuery }));
    
    // Actualizar URL
    const params = new URLSearchParams();
    
    if (newQuery.text) params.set('q', newQuery.text);
    if (newQuery.tags?.length) params.set('tags', newQuery.tags.join(','));
    if (newQuery.categories?.length) params.set('categories', newQuery.categories.join(','));
    if (newQuery.tagsOperator && newQuery.tagsOperator !== 'OR') params.set('tags_operator', newQuery.tagsOperator);
    if (newQuery.sortBy && newQuery.sortBy !== 'relevance') params.set('sort', newQuery.sortBy);
    if (newQuery.page && newQuery.page !== 1) params.set('page', newQuery.page.toString());
    
    if (newQuery.priceRange) {
      params.set('price_min', newQuery.priceRange.min.toString());
      params.set('price_max', newQuery.priceRange.max.toString());
    }
    
    if (newQuery.isFree !== undefined) params.set('free', newQuery.isFree.toString());

    const newUrl = params.toString() ? `/search?${params}` : '/search';
    router.push(newUrl, { scroll: false });
  }, [state.query, router]);

  // Función para limpiar búsqueda
  const clearSearch = () => {
    setState(prev => ({ 
      ...prev, 
      query: {}, 
      results: null, 
      error: null 
    }));
    router.push('/search');
  };

  // Función para obtener sugerencias
  const getSuggestions = async (partial: string) => {
    if (partial.length < 2) return;
    
    try {
      const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(partial)}&limit=8`);
      const data = await response.json();
      
      if (data.success) {
        const suggestions = [
          ...data.data.tags.map((tag: string) => ({ type: 'tag', value: tag })),
          ...data.data.titles.map((title: string) => ({ type: 'title', value: title }))
        ];
        setState(prev => ({ ...prev, suggestions }));
      }
    } catch (error) {
      console.error('Error obteniendo sugerencias:', error);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Descubre
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {' '}Creatividad
                </span>
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
                Encuentra avatares, modelos 3D, música, texturas y más contenido creativo
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-4xl mx-auto mb-8">
              <SearchBar
                value={state.query.text || ''}
                onChange={(text) => updateQuery({ text })}
                onSearch={() => performSearch(state.query)}
                onSuggestions={getSuggestions}
                suggestions={state.suggestions}
                loading={state.loading}
                placeholder="Buscar contenido... (ej: música streaming, modelo 3D casa)"
              />
            </div>

            {/* Popular Tags */}
            {state.popularTags.length > 0 && (
              <div className="max-w-4xl mx-auto mb-8">
                <TagCloud
                  tags={state.popularTags}
                  selectedTags={state.query.tags || []}
                  onTagSelect={(tags: string[]) => updateQuery({ tags })}
                  tagsOperator={state.query.tagsOperator || 'OR'}
                  onOperatorChange={(operator: 'AND' | 'OR') => updateQuery({ tagsOperator: operator })}
                />
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <SearchFilters
                categories={state.query.categories || []}
                priceRange={state.query.priceRange}
                isFree={state.query.isFree}
                sortBy={state.query.sortBy || 'relevance'}
                onCategoriesChange={(categories) => updateQuery({ categories })}
                onPriceRangeChange={(priceRange) => updateQuery({ priceRange })}
                onFreeToggle={(isFree) => updateQuery({ isFree })}
                onSortChange={(sortBy: 'relevance' | 'price_asc' | 'price_desc' | 'date' | 'popularity') => updateQuery({ sortBy })}
                onClearFilters={() => updateQuery({ 
                  categories: undefined, 
                  priceRange: undefined, 
                  isFree: undefined,
                  sortBy: 'relevance'
                })}
              />
            </div>

            {/* Results */}
            <div className="flex-1">
              {/* Results Header */}
              {state.results && (
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                  <div className="text-white">
                    <h2 className="text-2xl font-bold mb-2">
                      {state.results.total} resultado{state.results.total !== 1 ? 's' : ''}
                    </h2>
                    <p className="text-gray-300">
                      Mostrando {state.results.stats.showing}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden mt-4 sm:mt-0 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  >
                    {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
                  </button>
                </div>
              )}

              {/* Search Results */}
              {state.loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-gray-800/50 rounded-xl p-6 animate-pulse">
                      <div className="h-48 bg-gray-700 rounded-lg mb-4"></div>
                      <div className="h-4 bg-gray-700 rounded mb-2"></div>
                      <div className="h-3 bg-gray-700 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              ) : state.error ? (
                <div className="text-center py-12">
                  <div className="text-red-400 text-xl mb-4">❌ {state.error}</div>
                  <button
                    onClick={() => performSearch(state.query)}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  >
                    Reintentar
                  </button>
                </div>
              ) : state.results && state.results.items.length > 0 ? (
                <SearchResults
                  results={state.results}
                  currentUserId={user?._id}
                  onLoadMore={() => {
                    if (state.results?.hasMore) {
                      updateQuery({ page: (state.query.page || 1) + 1 });
                    }
                  }}
                />
              ) : hasSearchCriteria(state.query) ? (
                <EmptyState
                  query={state.query}
                  suggestedTags={state.results?.suggestedTags}
                  relatedSearches={state.results?.relatedSearches}
                  onClearSearch={clearSearch}
                  onRetrySearch={() => performSearch(state.query)}
                />
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Comienza tu búsqueda
                  </h3>
                  <p className="text-gray-300 mb-6">
                    Escribe algo en el buscador o selecciona un tag popular
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
