'use client';

import { useState, useCallback } from 'react';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface SearchFiltersProps {
  categories: string[];
  priceRange?: { min: number; max: number };
  isFree?: boolean;
  sortBy: 'relevance' | 'price_asc' | 'price_desc' | 'date' | 'popularity';
  onCategoriesChange: (categories: string[]) => void;
  onPriceRangeChange: (priceRange: { min: number; max: number }) => void;
  onFreeToggle: (isFree: boolean) => void;
  onSortChange: (sortBy: 'relevance' | 'price_asc' | 'price_desc' | 'date' | 'popularity') => void;
  onClearFilters: () => void;
  className?: string;
}

const CATEGORIES = [
  { value: 'musica', label: 'Música', icon: '🎵' },
  { value: 'modelos3d', label: 'Modelos 3D', icon: '🎨' },
  { value: 'avatares', label: 'Avatares', icon: '👤' },
  { value: 'texturas', label: 'Texturas', icon: '🖼️' },
  { value: 'animaciones', label: 'Animaciones', icon: '🎬' },
  { value: 'OBS', label: 'OBS', icon: '📺' },
  { value: 'colecciones', label: 'Colecciones', icon: '📦' }
];

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Más relevante' },
  { value: 'popularity', label: 'Más popular' },
  { value: 'price_asc', label: 'Precio: menor a mayor' },
  { value: 'price_desc', label: 'Precio: mayor a menor' },
  { value: 'date', label: 'Más reciente' }
];

export default function SearchFilters({
  categories,
  priceRange,
  isFree,
  sortBy,
  onCategoriesChange,
  onPriceRangeChange,
  onFreeToggle,
  onSortChange,
  onClearFilters,
  className = ""
}: SearchFiltersProps) {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    free: true,
    sort: true
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCategoryToggle = useCallback((categoryValue: string) => {
    if (categories.includes(categoryValue)) {
      onCategoriesChange(categories.filter(c => c !== categoryValue));
    } else {
      onCategoriesChange([...categories, categoryValue]);
    }
  }, [categories, onCategoriesChange]);

  const handlePriceRangeChange = (field: 'min' | 'max', value: string) => {
    const numValue = parseInt(value) || 0;
    const currentRange = priceRange || { min: 0, max: 100000 };
    
    onPriceRangeChange({
      ...currentRange,
      [field]: numValue
    });
  };

  const hasActiveFilters = categories.length > 0 || priceRange || isFree !== undefined;

  return (
    <div className={`bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Filtros</h3>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
          >
            Limpiar todo
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('categories')}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="font-medium text-white">Categorías</span>
          {expandedSections.categories ? (
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronRightIcon className="h-5 w-5 text-gray-400" />
          )}
        </button>

        {expandedSections.categories && (
          <div className="mt-3 space-y-2">
            {CATEGORIES.map((category) => (
              <label
                key={category.value}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700/30 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={categories.includes(category.value)}
                  onChange={() => handleCategoryToggle(category.value)}
                  className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
                />
                <span className="text-lg">{category.icon}</span>
                <span className="text-gray-300">{category.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="font-medium text-white">Rango de Precio</span>
          {expandedSections.price ? (
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronRightIcon className="h-5 w-5 text-gray-400" />
          )}
        </button>

        {expandedSections.price && (
          <div className="mt-3 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Mínimo (CLP)</label>
                <input
                  type="number"
                  value={priceRange?.min || ''}
                  onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Máximo (CLP)</label>
                <input
                  type="number"
                  value={priceRange?.max || ''}
                  onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                  placeholder="100000"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Price Presets */}
            <div className="space-y-2">
              <div className="text-sm text-gray-400">Rangos rápidos:</div>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Gratis', min: 0, max: 0 },
                  { label: 'Hasta $5K', min: 0, max: 5000 },
                  { label: '$5K-$10K', min: 5000, max: 10000 },
                  { label: '$10K-$20K', min: 10000, max: 20000 },
                  { label: '+$20K', min: 20000, max: 100000 }
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => onPriceRangeChange({ min: preset.min, max: preset.max })}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      priceRange?.min === preset.min && priceRange?.max === preset.max
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Free Content */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('free')}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="font-medium text-white">Contenido Gratuito</span>
          {expandedSections.free ? (
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronRightIcon className="h-5 w-5 text-gray-400" />
          )}
        </button>

        {expandedSections.free && (
          <div className="mt-3">
            <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700/30 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={isFree === true}
                onChange={(e) => onFreeToggle(e.target.checked)}
                className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
              />
              <span className="text-gray-300">Solo contenido gratuito</span>
            </label>
          </div>
        )}
      </div>

      {/* Sort */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('sort')}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="font-medium text-white">Ordenar por</span>
          {expandedSections.sort ? (
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronRightIcon className="h-5 w-5 text-gray-400" />
          )}
        </button>

        {expandedSections.sort && (
          <div className="mt-3">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-gray-700/50">
          <div className="text-sm text-gray-400 mb-2">Filtros activos:</div>
          <div className="space-y-1">
            {categories.length > 0 && (
              <div className="text-xs text-gray-300">
                📁 {categories.length} categoría{categories.length !== 1 ? 's' : ''}
              </div>
            )}
            {priceRange && (
              <div className="text-xs text-gray-300">
                💰 ${priceRange.min.toLocaleString()} - ${priceRange.max.toLocaleString()}
              </div>
            )}
            {isFree === true && (
              <div className="text-xs text-gray-300">
                🆓 Solo gratis
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
