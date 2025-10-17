'use client';

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface TagCloudProps {
  tags: string[];
  selectedTags: string[];
  onTagSelect: (tags: string[]) => void;
  tagsOperator: 'AND' | 'OR';
  onOperatorChange: (operator: 'AND' | 'OR') => void;
  className?: string;
}

export default function TagCloud({
  tags,
  selectedTags,
  onTagSelect,
  tagsOperator,
  onOperatorChange,
  className = ""
}: TagCloudProps) {
  const [showAll, setShowAll] = useState(false);

  // Calcular tamaños de tags basados en popularidad (simulado)
  const getTagSize = (index: number) => {
    const sizes = ['text-sm', 'text-base', 'text-lg', 'text-xl'];
    return sizes[Math.min(index, sizes.length - 1)];
  };

  // Calcular colores de tags
  const getTagColor = (index: number) => {
    const colors = [
      'from-blue-500 to-purple-500',
      'from-purple-500 to-pink-500',
      'from-pink-500 to-red-500',
      'from-green-500 to-blue-500',
      'from-yellow-500 to-orange-500',
      'from-indigo-500 to-purple-500'
    ];
    return colors[index % colors.length];
  };

  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      // Remover tag
      onTagSelect(selectedTags.filter(t => t !== tag));
    } else {
      // Agregar tag
      onTagSelect([...selectedTags, tag]);
    }
  };

  const handleRemoveTag = (tag: string) => {
    onTagSelect(selectedTags.filter(t => t !== tag));
  };

  const clearAllTags = () => {
    onTagSelect([]);
  };

  const displayTags = showAll ? tags : tags.slice(0, 12);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Tags Populares</h3>
        {selectedTags.length > 0 && (
          <button
            onClick={clearAllTags}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Limpiar todos
          </button>
        )}
      </div>

      {/* Selected Tags */}
      {selectedTags.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-300">Filtros activos:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOperatorChange('AND')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  tagsOperator === 'AND'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Y (AND)
              </button>
              <button
                onClick={() => onOperatorChange('OR')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  tagsOperator === 'OR'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                O (OR)
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <div
                key={tag}
                className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm font-medium"
              >
                <span>#{tag}</span>
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tag Cloud */}
      <div className="flex flex-wrap gap-2">
        {displayTags.map((tag, index) => {
          const isSelected = selectedTags.includes(tag);
          const sizeClass = getTagSize(index);
          const colorClass = getTagColor(index);

          return (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`px-4 py-2 rounded-full font-medium transition-all duration-200 hover:scale-105 ${
                isSelected
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25'
                  : `bg-gradient-to-r ${colorClass} text-white/80 hover:text-white hover:shadow-lg hover:shadow-purple-500/25`
              } ${sizeClass}`}
            >
              #{tag}
            </button>
          );
        })}
      </div>

      {/* Show More/Less Button */}
      {tags.length > 12 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full py-2 px-4 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white rounded-lg transition-colors"
        >
          {showAll ? 'Mostrar menos' : `Mostrar todos (${tags.length})`}
        </button>
      )}

      {/* Operator Explanation */}
      {selectedTags.length > 1 && (
        <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
          <div className="flex items-start gap-2">
            <div className="text-blue-400 text-sm">ℹ️</div>
            <div className="text-sm text-blue-300">
              <strong>
                {tagsOperator === 'AND' ? 'Y (AND):' : 'O (OR):'}
              </strong>{' '}
              {tagsOperator === 'AND'
                ? 'Mostrar contenido que tenga TODOS los tags seleccionados'
                : 'Mostrar contenido que tenga ALGUNO de los tags seleccionados'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
