// Get Popular Tags UseCase - Lógica de negocio para obtener tags populares
import { ISearchRepository } from '../repositories/search.repository.interface';

export class GetPopularTagsUseCase {
  constructor(private searchRepository: ISearchRepository) {}

  async execute(limit: number = 20): Promise<string[]> {
    console.log('🏷️ GetPopularTagsUseCase: Obteniendo tags populares', { limit });

    try {
      const popularTags = await this.searchRepository.getPopularTags(limit);
      
      console.log('✅ GetPopularTagsUseCase: Tags obtenidos', { 
        count: popularTags.length 
      });

      return popularTags;

    } catch (error) {
      console.error('❌ GetPopularTagsUseCase: Error obteniendo tags', error);
      throw new Error('Error al obtener tags populares');
    }
  }

  // Método para obtener tags con estadísticas
  async executeWithStats(limit: number = 20): Promise<Array<{ 
    tag: string; 
    count: number; 
    popularity: number; 
  }>> {
    console.log('📊 GetPopularTagsUseCase: Obteniendo tags con estadísticas', { limit });

    try {
      const searchStats = await this.searchRepository.getSearchStats();
      const popularTags = searchStats.popularTags.slice(0, limit);
      
      // Calcular popularidad relativa (0-100)
      const maxCount = Math.max(...popularTags.map(t => t.count), 1);
      
      const tagsWithStats = popularTags.map(tag => ({
        tag: tag.tag,
        count: tag.count,
        popularity: Math.round((tag.count / maxCount) * 100)
      }));

      console.log('✅ GetPopularTagsUseCase: Tags con estadísticas obtenidos', { 
        count: tagsWithStats.length 
      });

      return tagsWithStats;

    } catch (error) {
      console.error('❌ GetPopularTagsUseCase: Error obteniendo tags con stats', error);
      throw new Error('Error al obtener tags con estadísticas');
    }
  }

  // Método para obtener tags sugeridos basados en contexto
  async getContextualTags(
    currentTags: string[] = [], 
    limit: number = 10
  ): Promise<string[]> {
    console.log('🎯 GetPopularTagsUseCase: Obteniendo tags contextuales', { 
      currentTags, 
      limit 
    });

    try {
      const allPopularTags = await this.searchRepository.getPopularTags(50);
      
      // Filtrar tags que no estén ya seleccionados
      const availableTags = allPopularTags.filter(tag => 
        !currentTags.includes(tag.toLowerCase())
      );

      // Retornar los primeros disponibles
      const contextualTags = availableTags.slice(0, limit);

      console.log('✅ GetPopularTagsUseCase: Tags contextuales obtenidos', { 
        count: contextualTags.length 
      });

      return contextualTags;

    } catch (error) {
      console.error('❌ GetPopularTagsUseCase: Error obteniendo tags contextuales', error);
      throw new Error('Error al obtener tags contextuales');
    }
  }
}
