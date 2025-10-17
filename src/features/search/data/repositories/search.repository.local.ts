// Search Repository Local Implementation - Usa FileStorage
import { ISearchRepository } from '../../domain/repositories/search.repository.interface';
import { SearchQueryEntity } from '../../domain/entities/search-query.entity';
import { SearchResultEntity } from '../../domain/entities/search-result.entity';
import { ContentEntity } from '../../../content/domain/entities/content.entity';
import { ContentMapper } from '../../../content/data/mappers/content.mapper';
import { fileStorageService } from '@/shared/infrastructure/storage/file-storage.service';

export class SearchRepositoryLocal implements ISearchRepository {
  private contentCollection = 'content';
  private searchCollection = 'search';
  private analyticsCollection = 'search_analytics';

  async search(query: SearchQueryEntity): Promise<SearchResultEntity> {
    console.log('🔍 SearchRepositoryLocal: Ejecutando búsqueda', query);

    try {
      // Obtener todo el contenido
      const allContent = await fileStorageService.findAll(this.contentCollection);
      console.log('📁 Contenido obtenido:', allContent.length);
      
      // Filtrar solo contenido publicado
      let filteredContent = allContent.filter((item: any) => item.isPublished);
      console.log('✅ Contenido publicado:', filteredContent.length);

      // Aplicar filtros
      filteredContent = this.applyFilters(filteredContent, query);
      console.log('🔍 Después de filtros:', filteredContent.length);

      // Aplicar ordenamiento
      filteredContent = this.applySorting(filteredContent, query);

      // Aplicar paginación
      const { items, total, page, totalPages } = this.applyPagination(filteredContent, query);
      console.log('📄 Paginación:', { items: items.length, total, page, totalPages });

      // Convertir a entidades de dominio (simplificado)
      const domainEntities = items.map((item: any) => {
        return {
          id: item._id,
          title: item.title,
          description: item.description,
          author: item.author,
          authorUsername: item.authorUsername,
          price: parseFloat(item.price || '0'),
          currency: item.currency || 'CLP',
          contentType: item.contentType,
          category: item.category,
          tags: item.tags || [],
          isPublished: item.isPublished,
          coverImage: item.coverImage,
          files: item.files,
          likes: item.likes || 0,
          views: item.views || 0,
          downloads: item.downloads || 0,
          authorAvatar: item.authorAvatar,
          authorId: item.authorId,
          shortDescription: item.shortDescription,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          // Métodos básicos
          get isFree() { return this.price === 0; },
          get displayPrice() { return this.isFree ? 'Gratis' : `${this.price.toLocaleString()} ${this.currency}`; },
          get typeDisplay() { return item.contentType; },
          get categoryDisplay() { return item.category; }
        };
      });

      const result = SearchResultEntity.create(
        domainEntities,
        total,
        query.page || 1,
        query.limit || 20
      );

      console.log('✅ SearchRepositoryLocal: Búsqueda completada', {
        total: result.total,
        items: result.items.length,
        page: result.page
      });

      return result;

    } catch (error) {
      console.error('❌ SearchRepositoryLocal: Error en búsqueda', error);
      throw new Error('Error al realizar la búsqueda');
    }
  }

  async getPopularTags(limit: number = 20): Promise<string[]> {
    console.log('🏷️ SearchRepositoryLocal: Obteniendo tags populares', { limit });

    try {
      const allContent = await fileStorageService.findAll(this.contentCollection);
      const tagCounts: { [key: string]: number } = {};

      // Contar uso de tags
      allContent.forEach((item: any) => {
        if (item.isPublished && item.tags) {
          item.tags.forEach((tag: string) => {
            const normalizedTag = tag.toLowerCase().trim();
            if (normalizedTag) {
              tagCounts[normalizedTag] = (tagCounts[normalizedTag] || 0) + 1;
            }
          });
        }
      });

      // Ordenar por popularidad
      const sortedTags = Object.entries(tagCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, limit)
        .map(([tag]) => tag);

      console.log('✅ SearchRepositoryLocal: Tags populares obtenidos', {
        count: sortedTags.length
      });

      return sortedTags;

    } catch (error) {
      console.error('❌ SearchRepositoryLocal: Error obteniendo tags populares', error);
      return [];
    }
  }

  async getSuggestions(partial: string): Promise<{ tags: string[]; titles: string[] }> {
    console.log('💡 SearchRepositoryLocal: Obteniendo sugerencias', { partial });

    if (!partial || partial.length < 2) {
      return { tags: [], titles: [] };
    }

    try {
      const allContent = await fileStorageService.findAll(this.contentCollection);
      const partialLower = partial.toLowerCase();

      const tagSuggestions = new Set<string>();
      const titleSuggestions = new Set<string>();

      allContent.forEach((item: any) => {
        if (!item.isPublished) return;

        // Sugerencias de tags
        if (item.tags) {
          item.tags.forEach((tag: string) => {
            if (tag.toLowerCase().includes(partialLower)) {
              tagSuggestions.add(tag);
            }
          });
        }

        // Sugerencias de títulos
        if (item.title && item.title.toLowerCase().includes(partialLower)) {
          titleSuggestions.add(item.title);
        }
      });

      // Convertir a arrays y limitar
      const tags = Array.from(tagSuggestions).slice(0, 10);
      const titles = Array.from(titleSuggestions).slice(0, 10);

      console.log('✅ SearchRepositoryLocal: Sugerencias obtenidas', {
        tags: tags.length,
        titles: titles.length
      });

      return { tags, titles };

    } catch (error) {
      console.error('❌ SearchRepositoryLocal: Error obteniendo sugerencias', error);
      return { tags: [], titles: [] };
    }
  }

  async getRelatedSearches(query: string): Promise<string[]> {
    console.log('🔗 SearchRepositoryLocal: Obteniendo búsquedas relacionadas', { query });

    try {
      // Por ahora, retornar búsquedas relacionadas basadas en contenido similar
      const allContent = await fileStorageService.findAll(this.contentCollection);
      const queryLower = query.toLowerCase();
      const relatedSearches = new Set<string>();

      allContent.forEach((item: any) => {
        if (!item.isPublished) return;

        // Buscar títulos que contengan palabras similares
        if (item.title) {
          const titleLower = item.title.toLowerCase();
          const queryWords = queryLower.split(/\s+/);
          const titleWords = titleLower.split(/\s+/);
          
          const commonWords = queryWords.filter(word => 
            titleWords.some(titleWord => titleWord.includes(word) || word.includes(titleWord))
          );

          if (commonWords.length > 0 && commonWords.length < queryWords.length) {
            relatedSearches.add(item.title);
          }
        }
      });

      return Array.from(relatedSearches).slice(0, 5);

    } catch (error) {
      console.error('❌ SearchRepositoryLocal: Error obteniendo búsquedas relacionadas', error);
      return [];
    }
  }

  async getSearchStats(): Promise<{
    totalContent: number;
    totalTags: number;
    popularTags: Array<{ tag: string; count: number }>;
    recentSearches: string[];
  }> {
    console.log('📊 SearchRepositoryLocal: Obteniendo estadísticas de búsqueda');

    try {
      const allContent = await fileStorageService.findAll(this.contentCollection);
      const publishedContent = allContent.filter((item: any) => item.isPublished);
      
      const tagCounts: { [key: string]: number } = {};
      publishedContent.forEach((item: any) => {
        if (item.tags) {
          item.tags.forEach((tag: string) => {
            const normalizedTag = tag.toLowerCase().trim();
            if (normalizedTag) {
              tagCounts[normalizedTag] = (tagCounts[normalizedTag] || 0) + 1;
            }
          });
        }
      });

      const popularTags = Object.entries(tagCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([tag, count]) => ({ tag, count }));

      return {
        totalContent: publishedContent.length,
        totalTags: Object.keys(tagCounts).length,
        popularTags,
        recentSearches: [] // TODO: Implementar cuando tengamos analytics
      };

    } catch (error) {
      console.error('❌ SearchRepositoryLocal: Error obteniendo estadísticas', error);
      return {
        totalContent: 0,
        totalTags: 0,
        popularTags: [],
        recentSearches: []
      };
    }
  }

  async incrementTagUsage(tag: string): Promise<void> {
    console.log('📈 SearchRepositoryLocal: Incrementando uso de tag', { tag });
    // TODO: Implementar analytics cuando sea necesario
  }

  async recordSearch(query: string): Promise<void> {
    console.log('📝 SearchRepositoryLocal: Registrando búsqueda', { query });
    // TODO: Implementar analytics cuando sea necesario
  }

  // Métodos privados de ayuda
  private applyFilters(content: any[], query: SearchQueryEntity): any[] {
    let filtered = content;

    // Filtro por texto
    if (query.text) {
      const searchTerms = query.text.toLowerCase().split(/\s+/).filter(Boolean);
      filtered = filtered.filter(item => {
        const searchableText = [
          item.title,
          item.description,
          item.shortDescription,
          ...(item.tags || [])
        ].join(' ').toLowerCase();
        
        return searchTerms.every(term => searchableText.includes(term));
      });
    }

    // Filtro por tags
    if (query.tags && query.tags.length > 0) {
      const searchTags = query.tags.map(tag => tag.toLowerCase().trim());
      
      filtered = filtered.filter(item => {
        const itemTags = (item.tags || []).map((tag: string) => tag.toLowerCase().trim());
        
        if (query.tagsOperator === 'AND') {
          return searchTags.every(tag => itemTags.includes(tag));
        } else {
          return searchTags.some(tag => itemTags.includes(tag));
        }
      });
    }

    // Filtro por categorías
    if (query.categories && query.categories.length > 0) {
      const searchCategories = query.categories.map(cat => cat.toLowerCase().trim());
      filtered = filtered.filter(item => {
        const itemCategory = (item.contentType || '').toLowerCase().trim();
        return searchCategories.includes(itemCategory);
      });
    }

    // Filtro por rango de precio
    if (query.priceRange) {
      filtered = filtered.filter(item => {
        const price = parseFloat(item.price || '0');
        return price >= query.priceRange!.min && price <= query.priceRange!.max;
      });
    }

    // Filtro por contenido gratis
    if (query.isFree !== undefined) {
      filtered = filtered.filter(item => {
        const isFree = parseFloat(item.price || '0') === 0;
        return isFree === query.isFree;
      });
    }

    // Filtro por autor
    if (query.authorId) {
      filtered = filtered.filter(item => item.author === query.authorId);
    }

    return filtered;
  }

  private applySorting(content: any[], query: SearchQueryEntity): any[] {
    const sortBy = query.sortBy || 'relevance';

    return content.sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return parseFloat(a.price || '0') - parseFloat(b.price || '0');
        
        case 'price_desc':
          return parseFloat(b.price || '0') - parseFloat(a.price || '0');
        
        case 'date':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        
        case 'popularity':
          const aScore = (a.likes || 0) * 2 + (a.views || 0) + (a.downloads || 0);
          const bScore = (b.likes || 0) * 2 + (b.views || 0) + (b.downloads || 0);
          return bScore - aScore;
        
        case 'relevance':
        default:
          // Ranking por relevancia de texto si hay query de texto
          if (query.text) {
            const aRelevance = this.calculateTextRelevance(a, query.text);
            const bRelevance = this.calculateTextRelevance(b, query.text);
            
            if (aRelevance !== bRelevance) {
              return bRelevance - aRelevance;
            }
          }
          
          // Fallback a popularidad
          const aScoreFallback = (a.likes || 0) * 2 + (a.views || 0) + (a.downloads || 0);
          const bScoreFallback = (b.likes || 0) * 2 + (b.views || 0) + (b.downloads || 0);
          return bScoreFallback - aScoreFallback;
      }
    });
  }

  private applyPagination(content: any[], query: SearchQueryEntity): {
    items: any[];
    total: number;
    page: number;
    totalPages: number;
  } {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const total = content.length;
    const totalPages = Math.ceil(total / limit);
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const items = content.slice(startIndex, endIndex);
    
    return { items, total, page, totalPages };
  }

  private calculateTextRelevance(item: any, query: string): number {
    const queryLower = query.toLowerCase();
    const queryTerms = queryLower.split(/\s+/);
    
    let score = 0;
    const searchableFields = [
      { text: item.title, weight: 3 },
      { text: item.description, weight: 2 },
      { text: item.shortDescription, weight: 1 },
      { text: (item.tags || []).join(' '), weight: 2 }
    ];

    searchableFields.forEach(field => {
      if (field.text) {
        const fieldLower = field.text.toLowerCase();
        
        queryTerms.forEach(term => {
          // Exact match
          if (fieldLower === term) {
            score += field.weight * 10;
          }
          // Starts with
          else if (fieldLower.startsWith(term)) {
            score += field.weight * 8;
          }
          // Contains
          else if (fieldLower.includes(term)) {
            score += field.weight * 5;
          }
          // Word boundary
          else if (fieldLower.split(/\s+/).some(word => word.startsWith(term))) {
            score += field.weight * 3;
          }
        });
      }
    });

    return score;
  }

  private async enrichWithAuthorData(content: any[]): Promise<any[]> {
    return Promise.all(
      content.map(async (item) => {
        try {
          const user = await fileStorageService.findById('users', item.author);
          
          if (user) {
            return {
              ...item,
              authorAvatar: user.avatar,
              authorId: user._id,
              authorUsername: user.username || item.authorUsername
            };
          }
          
          return {
            ...item,
            authorAvatar: null,
            authorId: item.author,
            authorUsername: item.authorUsername || 'Usuario'
          };
        } catch (error) {
          console.error('Error enriching content with author data:', error);
          return {
            ...item,
            authorAvatar: null,
            authorId: item.author,
            authorUsername: item.authorUsername || 'Usuario'
          };
        }
      })
    );
  }

  private async getSuggestedTagsFromContent(query: string): Promise<string[]> {
    try {
      const allContent = await fileStorageService.findAll(this.contentCollection);
      const queryLower = query.toLowerCase();
      const suggestions = new Set<string>();

      allContent.forEach((item: any) => {
        if (item.isPublished && item.tags) {
          item.tags.forEach((tag: string) => {
            if (tag.toLowerCase().includes(queryLower)) {
              suggestions.add(tag);
            }
          });
        }
      });

      return Array.from(suggestions).slice(0, 5);
    } catch (error) {
      console.error('Error getting suggested tags:', error);
      return [];
    }
  }

  private async getRelatedSearches(query: string): Promise<string[]> {
    try {
      const allContent = await fileStorageService.findAll(this.contentCollection);
      const queryLower = query.toLowerCase();
      const related = new Set<string>();

      allContent.forEach((item: any) => {
        if (item.isPublished && item.title) {
          const titleLower = item.title.toLowerCase();
          const queryWords = queryLower.split(/\s+/);
          const titleWords = titleLower.split(/\s+/);
          
          const commonWords = queryWords.filter(word => 
            titleWords.some(titleWord => titleWord.includes(word) || word.includes(titleWord))
          );

          if (commonWords.length > 0 && commonWords.length < queryWords.length) {
            related.add(item.title);
          }
        }
      });

      return Array.from(related).slice(0, 3);
    } catch (error) {
      console.error('Error getting related searches:', error);
      return [];
    }
  }
}
