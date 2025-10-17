'use client';

import { useState, useRef, useEffect } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  onSuggestions?: (partial: string) => void;
  suggestions?: Array<{ type: string; value: string }>;
  loading?: boolean;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  value,
  onChange,
  onSearch,
  onSuggestions,
  suggestions = [],
  loading = false,
  placeholder = "Buscar contenido...",
  className = ""
}: SearchBarProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Manejar debounce para sugerencias
  useEffect(() => {
    if (value.length >= 2 && onSuggestions) {
      const timeout = setTimeout(() => {
        onSuggestions(value);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [value, onSuggestions]);

  // Manejar clicks fuera del componente
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current && 
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setShowSuggestions(newValue.length >= 2);
    setFocusedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter') {
        e.preventDefault();
        onSearch();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0) {
          handleSuggestionSelect(suggestions[focusedIndex]);
        } else {
          onSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setFocusedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSuggestionSelect = (suggestion: { type: string; value: string }) => {
    onChange(suggestion.value);
    setShowSuggestions(false);
    setFocusedIndex(-1);
    onSearch();
  };

  const handleClear = () => {
    onChange('');
    setShowSuggestions(false);
    setFocusedIndex(-1);
    inputRef.current?.focus();
  };

  const handleSearch = () => {
    setShowSuggestions(false);
    setFocusedIndex(-1);
    onSearch();
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <MagnifyingGlassIcon 
            className={`h-6 w-6 ${loading ? 'text-purple-400 animate-pulse' : 'text-gray-400'}`} 
          />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(value.length >= 2)}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg transition-all duration-200"
          disabled={loading}
        />

        {value && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-12 flex items-center pr-3 text-gray-400 hover:text-white transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}

        <button
          onClick={handleSearch}
          disabled={loading || !value.trim()}
          className="absolute inset-y-0 right-0 flex items-center pr-4 text-white hover:text-purple-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          )}
        </button>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-gray-800/95 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-2xl z-50 max-h-80 overflow-y-auto"
        >
          <div className="p-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={`${suggestion.type}-${suggestion.value}-${index}`}
                onClick={() => handleSuggestionSelect(suggestion)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  index === focusedIndex
                    ? 'bg-purple-600/50 text-white'
                    : 'text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    suggestion.type === 'tag' 
                      ? 'bg-blue-400' 
                      : 'bg-green-400'
                  }`}></div>
                  <span className="font-medium">{suggestion.value}</span>
                  <span className="text-xs text-gray-500 ml-auto">
                    {suggestion.type === 'tag' ? 'Tag' : 'Título'}
                  </span>
                </div>
              </button>
            ))}
          </div>
          
          <div className="border-t border-gray-700/50 p-2">
            <div className="text-xs text-gray-500 text-center">
              Usa ↑↓ para navegar • Enter para seleccionar • Esc para cerrar
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Shortcut Hint */}
      <div className="absolute -bottom-8 left-0 text-xs text-gray-500">
        Presiona Ctrl+K para enfocar
      </div>
    </div>
  );
}
