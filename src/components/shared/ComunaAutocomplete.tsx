'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { searchComunas, getRegionByComuna } from '@/lib/chile-locations';

interface ComunaResult {
  comuna: string;
  region: string;
  regionId: string;
}

interface ComunaAutocompleteProps {
  value: string;
  onChange: (comuna: string, region: string, postalCode: string) => void;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
}

export default function ComunaAutocomplete({
  value,
  onChange,
  error,
  disabled = false,
  placeholder = 'Escribe tu comuna...'
}: ComunaAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<ComunaResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [fetchingPostalCode, setFetchingPostalCode] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sincronizar value externo
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Buscar comunas cuando el usuario escribe
  useEffect(() => {
    if (inputValue.length >= 2) {
      const results = searchComunas(inputValue, 8);
      setSuggestions(results);
      setIsOpen(results.length > 0);
      setHighlightedIndex(-1);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [inputValue]);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Obtener código postal de la API
  const fetchPostalCode = useCallback(async (comuna: string): Promise<string> => {
    try {
      setFetchingPostalCode(true);
      const response = await fetch(`/api/shipping/postal-codes?comuna=${encodeURIComponent(comuna)}`);
      const data = await response.json();
      
      if (data.success && data.data && data.data.length > 0) {
        return data.data[0].postalCode;
      }
      return '';
    } catch (error) {
      console.error('Error fetching postal code:', error);
      return '';
    } finally {
      setFetchingPostalCode(false);
    }
  }, []);

  // Seleccionar una comuna
  const handleSelect = useCallback(async (result: ComunaResult) => {
    setInputValue(result.comuna);
    setIsOpen(false);
    setSuggestions([]);
    
    // Obtener código postal
    const postalCode = await fetchPostalCode(result.comuna);
    
    // Notificar al padre
    onChange(result.comuna, result.region, postalCode);
  }, [onChange, fetchPostalCode]);

  // Manejar navegación con teclado
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
          handleSelect(suggestions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  // Scroll al elemento destacado
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const highlightedElement = listRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex]);

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete="off"
          className={`w-full bg-black/30 border ${
            error ? 'border-red-500' : 'border-white/10'
          } rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors pr-10`}
        />
        
        {/* Icono de búsqueda o loading */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {fetchingPostalCode || isLoading ? (
            <div className="w-5 h-5 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          ) : (
            <svg 
              className="w-5 h-5 text-gray-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          )}
        </div>
      </div>

      {/* Dropdown de sugerencias */}
      {isOpen && suggestions.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-50 w-full mt-2 bg-[#0f0f0f] border border-white/10 rounded-xl overflow-hidden shadow-xl max-h-64 overflow-y-auto"
        >
          {suggestions.map((result, index) => (
            <li
              key={`${result.comuna}-${result.regionId}`}
              onClick={() => handleSelect(result)}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={`px-4 py-3 cursor-pointer transition-colors ${
                index === highlightedIndex
                  ? 'bg-purple-500/20 border-l-2 border-purple-500'
                  : 'hover:bg-white/5 border-l-2 border-transparent'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-white">{result.comuna}</span>
                  <span className="text-gray-500 text-sm ml-2">
                    {result.region}
                  </span>
                </div>
                <svg 
                  className={`w-4 h-4 text-purple-400 transition-opacity ${
                    index === highlightedIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 5l7 7-7 7" 
                  />
                </svg>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Mensaje de ayuda */}
      {inputValue.length > 0 && inputValue.length < 2 && (
        <p className="text-gray-500 text-xs mt-1">
          Escribe al menos 2 caracteres para buscar
        </p>
      )}

      {/* Error */}
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
}
