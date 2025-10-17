// Get Suggestions UseCase - Lógica de negocio para autocompletado y sugerencias
import { ISearchRepository } from '../repositories/search.repository.interface';

export interface SearchSuggestion {
  type: 'tag' | 'title' | 'category';
  value: string;
  count?: number;
  relevance?: number;
}

export class GetSuggestionsUseCase {
  constructor(private searchRepository: ISearchRepository) {}

  async execute(partial: string): Promise<{
    tags: string[];
    titles: string[];
  }> {
    console.log('💡 GetSuggestionsUseCase: Obteniendo sugerencias', { partial });

    if (!partial || partial.length < 2) {
      console.log('⚠️ GetSuggestionsUseCase: Texto muy corto para sugerencias');
      return { tags: [], titles: [] };
    }

    try {
      const suggestions = await this.searchRepository.getSuggestions(partial);
      
      console.log('✅ GetSuggestionsUseCase: Sugerencias obtenidas', {
        tags: suggestions.tags.length,
        titles: suggestions.titles.length
      });

      return suggestions;

    } catch (error) {
      console.error('❌ GetSuggestionsUseCase: Error obteniendo sugerencias', error);
      throw new Error('Error al obtener sugerencias');
    }
  }

  // Método para obtener sugerencias estructuradas con tipos
  async getStructuredSuggestions(
    partial: string, 
    limit: number = 10
  ): Promise<SearchSuggestion[]> {
    console.log('🎯 GetSuggestionsUseCase: Obteniendo sugerencias estructuradas', { 
      partial, 
      limit 
    });

    if (!partial || partial.length < 2) {
      return [];
    }

    try {
      const suggestions = await this.searchRepository.getSuggestions(partial);
      const structuredSuggestions: SearchSuggestion[] = [];

      // Agregar sugerencias de tags
      suggestions.tags.slice(0, Math.ceil(limit / 2)).forEach(tag => {
        structuredSuggestions.push({
          type: 'tag',
          value: tag,
          relevance: this.calculateRelevance(partial, tag)
        });
      });

      // Agregar sugerencias de títulos
      suggestions.titles.slice(0, Math.floor(limit / 2)).forEach(title => {
        structuredSuggestions.push({
          type: 'title',
          value: title,
          relevance: this.calculateRelevance(partial, title)
        });
      });

      // Ordenar por relevancia
      structuredSuggestions.sort((a, b) => (b.relevance || 0) - (a.relevance || 0));

      console.log('✅ GetSuggestionsUseCase: Sugerencias estructuradas obtenidas', {
        count: structuredSuggestions.length
      });

      return structuredSuggestions.slice(0, limit);

    } catch (error) {
      console.error('❌ GetSuggestionsUseCase: Error obteniendo sugerencias estructuradas', error);
      throw new Error('Error al obtener sugerencias estructuradas');
    }
  }

  // Método para obtener sugerencias de búsquedas relacionadas
  async getRelatedSearches(query: string): Promise<string[]> {
    console.log('🔗 GetSuggestionsUseCase: Obteniendo búsquedas relacionadas', { query });

    if (!query || query.length < 3) {
      return [];
    }

    try {
      const relatedSearches = await this.searchRepository.getRelatedSearches(query);
      
      console.log('✅ GetSuggestionsUseCase: Búsquedas relacionadas obtenidas', {
        count: relatedSearches.length
      });

      return relatedSearches;

    } catch (error) {
      console.error('❌ GetSuggestionsUseCase: Error obteniendo búsquedas relacionadas', error);
      throw new Error('Error al obtener búsquedas relacionadas');
    }
  }

  // Método para obtener sugerencias de autocompletado en tiempo real
  async getAutoCompleteSuggestions(
    partial: string,
    context?: {
      currentTags?: string[];
      category?: string;
    }
  ): Promise<string[]> {
    console.log('⚡ GetSuggestionsUseCase: Autocompletado en tiempo real', { 
      partial, 
      context 
    });

    if (!partial || partial.length < 1) {
      return [];
    }

    try {
      const suggestions = await this.searchRepository.getSuggestions(partial);
      
      // Combinar tags y títulos, priorizando tags
      const allSuggestions = [
        ...suggestions.tags,
        ...suggestions.titles.filter(title => 
          !suggestions.tags.some(tag => tag.toLowerCase() === title.toLowerCase())
        )
      ];

      // Filtrar por contexto si se proporciona
      let filteredSuggestions = allSuggestions;
      
      if (context?.currentTags) {
        filteredSuggestions = filteredSuggestions.filter(suggestion =>
          !context.currentTags!.includes(suggestion.toLowerCase())
        );
      }

      // Limitar resultados y ordenar por relevancia
      const autoCompleteSuggestions = filteredSuggestions
        .map(suggestion => ({
          value: suggestion,
          relevance: this.calculateRelevance(partial, suggestion)
        }))
        .sort((a, b) => b.relevance - a.relevance)
        .slice(0, 8)
        .map(item => item.value);

      console.log('✅ GetSuggestionsUseCase: Autocompletado completado', {
        count: autoCompleteSuggestions.length
      });

      return autoCompleteSuggestions;

    } catch (error) {
      console.error('❌ GetSuggestionsUseCase: Error en autocompletado', error);
      throw new Error('Error en autocompletado');
    }
  }

  // Método privado para calcular relevancia
  private calculateRelevance(partial: string, suggestion: string): number {
    const partialLower = partial.toLowerCase();
    const suggestionLower = suggestion.toLowerCase();
    
    // Exact match
    if (suggestionLower === partialLower) return 100;
    
    // Starts with
    if (suggestionLower.startsWith(partialLower)) return 90;
    
    // Contains
    if (suggestionLower.includes(partialLower)) return 70;
    
    // Word boundary match
    const words = suggestionLower.split(/\s+/);
    const wordMatches = words.filter(word => word.startsWith(partialLower));
    if (wordMatches.length > 0) return 60 + (wordMatches.length * 10);
    
    // Fuzzy match (simple)
    const fuzzyScore = this.fuzzyMatch(partialLower, suggestionLower);
    return Math.round(fuzzyScore * 50);
  }

  // Método privado para fuzzy matching simple
  private fuzzyMatch(pattern: string, text: string): number {
    let score = 0;
    let patternIndex = 0;
    
    for (let i = 0; i < text.length && patternIndex < pattern.length; i++) {
      if (text[i] === pattern[patternIndex]) {
        score++;
        patternIndex++;
      }
    }
    
    return patternIndex === pattern.length ? score / text.length : 0;
  }
}
