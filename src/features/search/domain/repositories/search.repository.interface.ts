// Search Repository Interface - Contrato para acceso a datos de búsqueda
import { SearchQueryEntity } from '../entities/search-query.entity';
import { SearchResultEntity } from '../entities/search-result.entity';

export interface ISearchRepository {
  /**
   * Realiza una búsqueda completa con todos los filtros
   * @param query - Parámetros de búsqueda
   * @returns Resultado de la búsqueda con paginación
   */
  search(query: SearchQueryEntity): Promise<SearchResultEntity>;

  /**
   * Obtiene los tags más populares
   * @param limit - Número máximo de tags a retornar (default: 20)
   * @returns Array de tags ordenados por popularidad
   */
  getPopularTags(limit?: number): Promise<string[]>;

  /**
   * Obtiene sugerencias de autocompletado
   * @param partial - Texto parcial para buscar sugerencias
   * @returns Objeto con sugerencias de tags y títulos
   */
  getSuggestions(partial: string): Promise<{
    tags: string[];
    titles: string[];
  }>;

  /**
   * Obtiene búsquedas relacionadas
   * @param query - Query original para encontrar búsquedas similares
   * @returns Array de queries relacionadas
   */
  getRelatedSearches(query: string): Promise<string[]>;

  /**
   * Obtiene estadísticas de búsqueda (para analytics)
   * @returns Estadísticas generales del sistema de búsqueda
   */
  getSearchStats(): Promise<{
    totalContent: number;
    totalTags: number;
    popularTags: Array<{ tag: string; count: number }>;
    recentSearches: string[];
  }>;

  /**
   * Incrementa el contador de uso de un tag (para analytics)
   * @param tag - Tag que fue utilizado en una búsqueda
   */
  incrementTagUsage(tag: string): Promise<void>;

  /**
   * Registra una búsqueda realizada (para analytics y sugerencias)
   * @param query - Query que fue realizada
   */
  recordSearch(query: string): Promise<void>;
}
