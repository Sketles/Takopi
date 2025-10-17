'use client';

import { useState } from 'react';

interface EmptyStateProps {
  query: {
    text?: string;
    tags?: string[];
    categories?: string[];
    priceRange?: { min: number; max: number };
    isFree?: boolean;
  };
  suggestedTags?: string[];
  relatedSearches?: string[];
  onClearSearch: () => void;
  onRetrySearch: () => void;
  className?: string;
}

export default function EmptyState({
  query,
  suggestedTags = [],
  relatedSearches = [],
  onClearSearch,
  onRetrySearch,
  className = ""
}: EmptyStateProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const getEmptyMessage = () => {
    if (query.text) {
      return `No se encontraron resultados para "${query.text}"`;
    }
    if (query.tags?.length) {
      return `No se encontraron resultados para los tags: ${query.tags.map(t => `#${t}`).join(', ')}`;
    }
    if (query.categories?.length) {
      return `No se encontraron resultados en las categorías seleccionadas`;
    }
    return 'No se encontraron resultados';
  };

  const getSuggestions = () => {
    const suggestions = [];
    
    if (query.text && query.text.length > 2) {
      suggestions.push('Verifica la ortografía de tu búsqueda');
      suggestions.push('Prueba con términos más generales');
      suggestions.push('Usa sinónimos o palabras relacionadas');
    }
    
    if (query.tags?.length) {
      suggestions.push('Intenta con menos tags');
      suggestions.push('Cambia el operador de Y a O (o viceversa)');
    }
    
    if (query.categories?.length) {
      suggestions.push('Busca en todas las categorías');
    }
    
    if (query.priceRange) {
      suggestions.push('Amplía el rango de precios');
    }

    return suggestions;
  };

  return (
    <div className={`text-center py-16 ${className}`}>
      {/* Empty State Illustration */}
      <div className="mb-8">
        <div className="text-8xl mb-4">🔍</div>
        <div className="text-6xl mb-2">😔</div>
      </div>

      {/* Message */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-white mb-4">
          {getEmptyMessage()}
        </h3>
        <p className="text-gray-400 max-w-md mx-auto">
          No te preocupes, intenta con otros términos de búsqueda o explora nuestras sugerencias
        </p>
      </div>

      {/* Suggestions */}
      {getSuggestions().length > 0 && (
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-white mb-4">Sugerencias:</h4>
          <ul className="text-gray-300 space-y-2 max-w-md mx-auto">
            {getSuggestions().map((suggestion, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="text-purple-400">•</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggested Tags */}
      {suggestedTags.length > 0 && (
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-white mb-4">
            Tags relacionados:
          </h4>
          <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
            {suggestedTags.slice(0, 6).map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-purple-600/20 border border-purple-500/30 text-purple-300 rounded-full text-sm hover:bg-purple-600/30 transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Related Searches */}
      {relatedSearches.length > 0 && showSuggestions && (
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-white mb-4">
            Búsquedas relacionadas:
          </h4>
          <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
            {relatedSearches.map((search, index) => (
              <button
                key={index}
                className="px-3 py-1 bg-blue-600/20 border border-blue-500/30 text-blue-300 rounded-full text-sm hover:bg-blue-600/30 transition-colors"
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button
          onClick={onRetrySearch}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
        >
          Reintentar búsqueda
        </button>
        
        <button
          onClick={onClearSearch}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
        >
          Limpiar filtros
        </button>
      </div>

      {/* Show More Suggestions */}
      {relatedSearches.length > 0 && (
        <div className="mt-6">
          <button
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
          >
            {showSuggestions ? 'Ocultar sugerencias' : 'Ver más sugerencias'}
          </button>
        </div>
      )}

      {/* Popular Categories */}
      <div className="mt-12">
        <h4 className="text-lg font-semibold text-white mb-4">
          Explora categorías populares:
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {[
            { name: 'Música', icon: '🎵', category: 'musica' },
            { name: 'Modelos 3D', icon: '🎨', category: 'modelos3d' },
            { name: 'Avatares', icon: '👤', category: 'avatares' },
            { name: 'Texturas', icon: '🖼️', category: 'texturas' }
          ].map((category) => (
            <button
              key={category.category}
              className="p-4 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 rounded-xl transition-colors group"
            >
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                {category.icon}
              </div>
              <div className="text-white font-medium">{category.name}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
