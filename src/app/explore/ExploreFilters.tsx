'use client';

import { memo } from 'react';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import SearchBar from '@/components/search/SearchBar';
import type { ExploreState, ExploreAction, SortBy } from '@/hooks/useExploreState';

interface ExploreFiltersProps {
  state: ExploreState;
  dispatch: (action: ExploreAction) => void;
}

const ExploreFilters = memo(({ state, dispatch }: ExploreFiltersProps) => {
  const handleSearch = async () => {
    if (!state.searchQuery.trim()) {
      dispatch({ type: 'SET_SEARCHING', payload: false });
      return;
    }

    try {
      dispatch({ type: 'SET_SEARCHING', payload: true });
      dispatch({ type: 'SET_LOADING', payload: true });

      const params = new URLSearchParams();
      params.set('q', state.searchQuery);
      if (state.priceFilter !== 'all') params.set('price', state.priceFilter);

      const token = localStorage.getItem('takopi_token');
      const headers: HeadersInit = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`/api/search?${params}`, { headers });
      const data = await response.json();

      dispatch({ type: 'SET_SEARCH_RESULTS', payload: data.success ? data.data.items : [] });
    } catch (error) {
      console.error('Error en búsqueda:', error);
      dispatch({ type: 'SET_SEARCH_RESULTS', payload: [] });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
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
        dispatch({ type: 'SET_SUGGESTIONS', payload: suggestions });
      }
    } catch (error) {
      console.error('Error obteniendo sugerencias:', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="relative group z-20">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative bg-[#0f0f0f] rounded-2xl shadow-2xl flex items-center p-2 gap-2">
          <div className="flex-1">
            <SearchBar
              value={state.searchQuery}
              onChange={(val) => dispatch({ type: 'SET_SEARCH_QUERY', payload: val })}
              onSearch={handleSearch}
              onSuggestions={handleSuggestions}
              suggestions={state.searchSuggestions}
              loading={state.loading}
              placeholder="Buscar productos, creadores, etiquetas..."
              className="w-full"
            />
          </div>
          <button
            onClick={() => dispatch({ type: 'SET_SHOW_FILTERS', payload: !state.showFilters })}
            className={`p-4 rounded-xl border transition-all duration-300 flex items-center gap-2 ${
              state.showFilters
                ? 'bg-purple-500 text-white border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <AdjustmentsHorizontalIcon className="w-6 h-6" />
            <span className="hidden md:inline font-medium">Filtros</span>
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          state.showFilters ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-[#151515] border border-white/10 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-left shadow-2xl">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Precio</h3>
            <div className="flex flex-col gap-2">
              {(['all', 'free', 'paid'] as const).map((filter) => (
                <label key={filter} className="flex items-center gap-3 cursor-pointer group">
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                      state.priceFilter === filter
                        ? filter === 'free'
                          ? 'border-green-500 bg-green-500/20'
                          : 'border-purple-500 bg-purple-500/20'
                        : 'border-gray-600 group-hover:border-gray-400'
                    }`}
                  >
                    {state.priceFilter === filter && (
                      <div className={`w-2.5 h-2.5 rounded-full ${filter === 'free' ? 'bg-green-500' : 'bg-purple-500'}`}></div>
                    )}
                  </div>
                  <input
                    type="radio"
                    name="price"
                    className="hidden"
                    checked={state.priceFilter === filter}
                    onChange={() => dispatch({ type: 'SET_PRICE_FILTER', payload: filter })}
                  />
                  <span className={state.priceFilter === filter ? 'text-white' : 'text-gray-400'}>
                    {filter === 'all' ? 'Todos los precios' : filter === 'free' ? 'Gratis' : 'De Pago'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Ordenar Por</h3>
            <select
              value={state.sortBy}
              onChange={(e) => dispatch({ type: 'SET_SORT_BY', payload: e.target.value as SortBy })}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-colors appearance-none cursor-pointer"
            >
              <option value="newest">✨ Más Recientes</option>
              <option value="popular">🔥 Más Populares</option>
              <option value="price_asc">💰 Precio: Menor a Mayor</option>
              <option value="price_desc">💎 Precio: Mayor a Menor</option>
            </select>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Licencia</h3>
            <div className="flex flex-wrap gap-2">
              {(['all', 'personal', 'commercial'] as const).map((license) => (
                <button
                  key={license}
                  onClick={() => dispatch({ type: 'SET_LICENSE_FILTER', payload: license })}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                    state.licenseFilter === license
                      ? license === 'personal'
                        ? 'bg-blue-500/20 text-blue-400 border-blue-500/50'
                        : license === 'commercial'
                          ? 'bg-purple-500/20 text-purple-400 border-purple-500/50'
                          : 'bg-white text-black border-white'
                      : 'bg-transparent border-white/10 text-gray-400 hover:border-white/30'
                  }`}
                >
                  {license === 'all' ? 'Cualquiera' : license === 'personal' ? 'Personal' : 'Comercial'}
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-3 pt-4 border-t border-white/5 flex justify-end">
            <button
              onClick={() => dispatch({ type: 'SET_SHOW_FILTERS', payload: false })}
              className="text-sm text-gray-400 hover:text-white underline decoration-gray-600 hover:decoration-white underline-offset-4 transition-all"
            >
              Ocultar Filtros
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

ExploreFilters.displayName = 'ExploreFilters';
export default ExploreFilters;