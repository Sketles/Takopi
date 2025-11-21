// Search Mapper - Convierte entre modelos de datos y entidades de dominio
import { SearchQueryEntity } from '../../domain/entities/search-query.entity';
import { SearchResultEntity } from '../../domain/entities/search-result.entity';
import { ContentEntity } from '../../../content/domain/entities/content.entity';

export class SearchMapper {
  // Convertir modelo de query a entidad de dominio
  static toSearchQueryDomain(model: any): SearchQueryEntity {
    return new SearchQueryEntity(
      model.text,
      model.tags,
      model.tagsOperator,
      model.categories,
      model.priceRange,
      model.isFree,
      model.authorId,
      model.sortBy,
      model.page,
      model.limit
    );
  }

  // Convertir entidad de query a modelo de datos
  static toSearchQueryModel(entity: SearchQueryEntity): any {
    return {
      text: entity.text,
      tags: entity.tags,
      tagsOperator: entity.tagsOperator,
      categories: entity.categories,
      priceRange: entity.priceRange,
      isFree: entity.isFree,
      authorId: entity.authorId,
      sortBy: entity.sortBy,
      page: entity.page,
      limit: entity.limit
    };
  }

  // Convertir modelo de resultado a entidad de dominio
  static toSearchResultDomain(model: any): SearchResultEntity {
    return new SearchResultEntity(
      model.items || [],
      model.total || 0,
      model.page || 1,
      model.totalPages || 0,
      model.hasMore || false,
      model.suggestedTags,
      model.relatedSearches
    );
  }

  // Convertir entidad de resultado a modelo de datos
  static toSearchResultModel(entity: SearchResultEntity): any {
    return {
      items: entity.items,
      total: entity.total,
      page: entity.page,
      totalPages: entity.totalPages,
      hasMore: entity.hasMore,
      suggestedTags: entity.suggestedTags,
      relatedSearches: entity.relatedSearches
    };
  }

  // Convertir parámetros URL a entidad de query
  static fromUrlParams(params: URLSearchParams): SearchQueryEntity {
    const text = params.get('q') || undefined;
    const tags = params.get('tags')?.split(',').filter(Boolean) || undefined;
    const categories = params.get('categories')?.split(',').filter(Boolean) || undefined;
    const tagsOperator = (params.get('tags_operator') as 'AND' | 'OR') || 'OR';
    const sortBy = (params.get('sort') as any) || 'relevance';
    const page = parseInt(params.get('page') || '1');
    const limit = parseInt(params.get('limit') || '20');
    
    const priceMin = params.get('price_min');
    const priceMax = params.get('price_max');
    const priceRange = priceMin && priceMax ? {
      min: parseInt(priceMin),
      max: parseInt(priceMax)
    } : undefined;

    const isFree = params.get('free') === 'true' ? true : 
                   params.get('free') === 'false' ? false : undefined;

    return new SearchQueryEntity(
      text,
      tags,
      tagsOperator,
      categories,
      priceRange,
      isFree,
      params.get('author') || undefined,
      sortBy,
      page,
      limit
    );
  }

  // Convertir entidad de query a parámetros URL
  static toUrlParams(entity: SearchQueryEntity): URLSearchParams {
    const params = new URLSearchParams();
    
    if (entity.text) params.set('q', entity.text);
    if (entity.tags?.length) params.set('tags', entity.tags.join(','));
    if (entity.categories?.length) params.set('categories', entity.categories.join(','));
    if (entity.tagsOperator && entity.tagsOperator !== 'OR') params.set('tags_operator', entity.tagsOperator);
    if (entity.sortBy && entity.sortBy !== 'relevance') params.set('sort', entity.sortBy);
    if (entity.page && entity.page !== 1) params.set('page', entity.page.toString());
    if (entity.limit && entity.limit !== 20) params.set('limit', entity.limit.toString());
    
    if (entity.priceRange) {
      params.set('price_min', entity.priceRange.min.toString());
      params.set('price_max', entity.priceRange.max.toString());
    }
    
    if (entity.isFree !== undefined) params.set('free', entity.isFree.toString());
    if (entity.authorId) params.set('author', entity.authorId);

    return params;
  }

  // Serializar resultado para respuesta API
  static serializeSearchResult(entity: SearchResultEntity): any {
    return {
      items: entity.items.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        shortDescription: item.shortDescription,
        author: item.author,
        authorUsername: item.authorUsername,
        authorAvatar: item.authorAvatar,
        price: item.price,
        currency: item.currency,
        contentType: item.contentType,
        category: item.category,
        tags: item.tags,
        coverImage: item.coverImage,
        files: item.files,
        likes: item.likes,
        views: item.views,
        downloads: item.downloads,
        isFree: item.isFree,
        displayPrice: item.displayPrice,
        typeDisplay: item.typeDisplay,
        categoryDisplay: item.categoryDisplay,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      })),
      total: entity.total,
      page: entity.page,
      totalPages: entity.totalPages,
      hasMore: entity.hasMore,
      suggestedTags: entity.suggestedTags,
      relatedSearches: entity.relatedSearches,
      stats: entity.getSearchStats()
    };
  }

  // Validar query antes de búsqueda
  static validateQuery(entity: SearchQueryEntity): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!entity.text && !entity.tags?.length && !entity.categories?.length) {
      errors.push('Se requiere al menos un término de búsqueda, tag o categoría');
    }

    if (entity.text && entity.text.length < 2) {
      errors.push('El término de búsqueda debe tener al menos 2 caracteres');
    }

    if (entity.tags?.some(tag => !tag.trim())) {
      errors.push('Los tags no pueden estar vacíos');
    }

    if (entity.priceRange) {
      if (entity.priceRange.min < 0) {
        errors.push('El precio mínimo no puede ser negativo');
      }
      if (entity.priceRange.max < entity.priceRange.min) {
        errors.push('El precio máximo debe ser mayor al mínimo');
      }
    }

    if (entity.page && entity.page < 1) {
      errors.push('La página debe ser mayor a 0');
    }

    if (entity.limit && (entity.limit < 1 || entity.limit > 100)) {
      errors.push('El límite debe estar entre 1 y 100');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
