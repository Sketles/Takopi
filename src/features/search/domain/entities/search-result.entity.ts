// Search Result Entity - Representa el resultado de una búsqueda
import { ContentEntity } from '../../content/domain/entities/content.entity';

export class SearchResultEntity {
  constructor(
    public readonly items: ContentEntity[],
    public readonly total: number,
    public readonly page: number,
    public readonly totalPages: number,
    public readonly hasMore: boolean,
    public readonly suggestedTags?: string[],
    public readonly relatedSearches?: string[]
  ) {}

  // Métodos de utilidad
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  getCurrentPageItems(): ContentEntity[] {
    return this.items;
  }

  getTotalItems(): number {
    return this.total;
  }

  hasNextPage(): boolean {
    return this.page < this.totalPages;
  }

  hasPreviousPage(): boolean {
    return this.page > 1;
  }

  getNextPage(): number | null {
    return this.hasNextPage() ? this.page + 1 : null;
  }

  getPreviousPage(): number | null {
    return this.hasPreviousPage() ? this.page - 1 : null;
  }

  // Método para obtener estadísticas de la búsqueda
  getSearchStats(): {
    total: number;
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    showing: string;
  } {
    const itemsPerPage = this.items.length;
    const start = (this.page - 1) * itemsPerPage + 1;
    const end = Math.min(start + itemsPerPage - 1, this.total);
    
    return {
      total: this.total,
      currentPage: this.page,
      totalPages: this.totalPages,
      itemsPerPage,
      showing: `${start}-${end} de ${this.total}`
    };
  }

  // Método para crear resultado vacío
  static empty(page: number = 1, limit: number = 20): SearchResultEntity {
    return new SearchResultEntity(
      [],
      0,
      page,
      0,
      false,
      [],
      []
    );
  }

  // Método para crear resultado con paginación
  static create(
    items: ContentEntity[],
    total: number,
    page: number,
    limit: number,
    suggestedTags?: string[],
    relatedSearches?: string[]
  ): SearchResultEntity {
    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;

    return new SearchResultEntity(
      items,
      total,
      page,
      totalPages,
      hasMore,
      suggestedTags,
      relatedSearches
    );
  }

  // Método para serializar a objeto plano (para API responses)
  toObject(): {
    items: any[];
    total: number;
    page: number;
    totalPages: number;
    hasMore: boolean;
    suggestedTags?: string[];
    relatedSearches?: string[];
    stats: {
      total: number;
      currentPage: number;
      totalPages: number;
      itemsPerPage: number;
      showing: string;
    };
  } {
    return {
      items: this.items.map(item => ({
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
      total: this.total,
      page: this.page,
      totalPages: this.totalPages,
      hasMore: this.hasMore,
      suggestedTags: this.suggestedTags,
      relatedSearches: this.relatedSearches,
      stats: this.getSearchStats()
    };
  }
}
