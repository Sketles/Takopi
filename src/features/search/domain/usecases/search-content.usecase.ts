// Search Content UseCase - Lógica de negocio para búsqueda de contenido
import { ISearchRepository } from '../repositories/search.repository.interface';
import { SearchQueryEntity } from '../entities/search-query.entity';
import { SearchResultEntity } from '../entities/search-result.entity';

export class SearchContentUseCase {
  constructor(private searchRepository: ISearchRepository) {}

  async execute(query: SearchQueryEntity): Promise<SearchResultEntity> {
    console.log('🔍 SearchContentUseCase: Ejecutando búsqueda', {
      text: query.text,
      tags: query.tags,
      categories: query.categories,
      page: query.page,
      limit: query.limit
    });

    // Validar query
    if (!query.isValid()) {
      console.log('❌ SearchContentUseCase: Query inválida');
      return SearchResultEntity.empty(query.page || 1, query.limit || 20);
    }

    try {
      // Registrar búsqueda para analytics
      if (query.text) {
        await this.searchRepository.recordSearch(query.text);
      }

      // Registrar uso de tags para analytics
      if (query.tags && query.tags.length > 0) {
        await Promise.all(
          query.tags.map(tag => this.searchRepository.incrementTagUsage(tag))
        );
      }

      // Ejecutar búsqueda
      const result = await this.searchRepository.search(query);

      console.log('✅ SearchContentUseCase: Búsqueda completada', {
        total: result.total,
        items: result.items.length,
        page: result.page
      });

      return result;

    } catch (error) {
      console.error('❌ SearchContentUseCase: Error en búsqueda', error);
      throw new Error('Error al realizar la búsqueda');
    }
  }

  // Método para búsqueda rápida (sin analytics)
  async quickSearch(query: SearchQueryEntity): Promise<SearchResultEntity> {
    console.log('⚡ SearchContentUseCase: Búsqueda rápida');

    if (!query.isValid()) {
      return SearchResultEntity.empty(query.page || 1, query.limit || 20);
    }

    try {
      return await this.searchRepository.search(query);
    } catch (error) {
      console.error('❌ SearchContentUseCase: Error en búsqueda rápida', error);
      throw new Error('Error al realizar la búsqueda rápida');
    }
  }

  // Método para búsqueda con sugerencias mejoradas
  async searchWithSuggestions(query: SearchQueryEntity): Promise<SearchResultEntity> {
    console.log('🎯 SearchContentUseCase: Búsqueda con sugerencias');

    try {
      // Ejecutar búsqueda normal
      const result = await this.execute(query);

      // Si no hay resultados y hay texto, obtener sugerencias
      if (result.isEmpty() && query.text && query.text.length > 2) {
        const suggestions = await this.searchRepository.getSuggestions(query.text);
        
        // Crear resultado con sugerencias
        return new SearchResultEntity(
          result.items,
          result.total,
          result.page,
          result.totalPages,
          result.hasMore,
          suggestions.tags,
          await this.searchRepository.getRelatedSearches(query.text)
        );
      }

      return result;

    } catch (error) {
      console.error('❌ SearchContentUseCase: Error en búsqueda con sugerencias', error);
      throw new Error('Error al realizar la búsqueda con sugerencias');
    }
  }
}
