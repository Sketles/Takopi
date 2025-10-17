// Search Query Entity - Representa una consulta de búsqueda
export class SearchQueryEntity {
  constructor(
    public readonly text?: string,
    public readonly tags?: string[],
    public readonly tagsOperator?: 'AND' | 'OR',
    public readonly categories?: string[],
    public readonly priceRange?: { min: number; max: number },
    public readonly isFree?: boolean,
    public readonly authorId?: string,
    public readonly sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'date' | 'popularity',
    public readonly page?: number,
    public readonly limit?: number
  ) {}

  // Métodos de validación
  isValid(): boolean {
    return !!(this.text || this.tags?.length || this.categories?.length);
  }

  hasFilters(): boolean {
    return !!(this.priceRange || this.isFree !== undefined || this.authorId);
  }

  // Método para crear query desde parámetros URL
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

  // Método para convertir a parámetros URL
  toUrlParams(): URLSearchParams {
    const params = new URLSearchParams();
    
    if (this.text) params.set('q', this.text);
    if (this.tags?.length) params.set('tags', this.tags.join(','));
    if (this.categories?.length) params.set('categories', this.categories.join(','));
    if (this.tagsOperator && this.tagsOperator !== 'OR') params.set('tags_operator', this.tagsOperator);
    if (this.sortBy && this.sortBy !== 'relevance') params.set('sort', this.sortBy);
    if (this.page && this.page !== 1) params.set('page', this.page.toString());
    if (this.limit && this.limit !== 20) params.set('limit', this.limit.toString());
    
    if (this.priceRange) {
      params.set('price_min', this.priceRange.min.toString());
      params.set('price_max', this.priceRange.max.toString());
    }
    
    if (this.isFree !== undefined) params.set('free', this.isFree.toString());
    if (this.authorId) params.set('author', this.authorId);

    return params;
  }

  // Método para crear una copia con nuevos valores
  withUpdates(updates: Partial<SearchQueryEntity>): SearchQueryEntity {
    return new SearchQueryEntity(
      updates.text !== undefined ? updates.text : this.text,
      updates.tags !== undefined ? updates.tags : this.tags,
      updates.tagsOperator !== undefined ? updates.tagsOperator : this.tagsOperator,
      updates.categories !== undefined ? updates.categories : this.categories,
      updates.priceRange !== undefined ? updates.priceRange : this.priceRange,
      updates.isFree !== undefined ? updates.isFree : this.isFree,
      updates.authorId !== undefined ? updates.authorId : this.authorId,
      updates.sortBy !== undefined ? updates.sortBy : this.sortBy,
      updates.page !== undefined ? updates.page : this.page,
      updates.limit !== undefined ? updates.limit : this.limit
    );
  }
}
