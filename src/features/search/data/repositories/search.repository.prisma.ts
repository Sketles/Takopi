// Search Repository Prisma Implementation
import { ISearchRepository } from '../../domain/repositories/search.repository.interface';
import { SearchQueryEntity } from '../../domain/entities/search-query.entity';
import { SearchResultEntity } from '../../domain/entities/search-result.entity';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export class SearchRepositoryPrisma implements ISearchRepository {
  async search(query: SearchQueryEntity): Promise<SearchResultEntity> {
    console.log('🔍 SearchRepositoryPrisma: Ejecutando búsqueda', query);

    try {
      // Build where clause
      const where: Prisma.ContentWhereInput = {
        isPublished: true
      };

      // Text search (full-text search on title, description)
      if (query.text) {
        const searchTerms = query.text.toLowerCase().split(/\s+/).filter(Boolean);
        where.OR = searchTerms.map(term => ({
          OR: [
            { title: { contains: term, mode: 'insensitive' } },
            { description: { contains: term, mode: 'insensitive' } },
            { shortDescription: { contains: term, mode: 'insensitive' } }
          ]
        }));
      }

      // Tag filters
      if (query.tags && query.tags.length > 0) {
        if (query.tagsOperator === 'AND') {
          where.AND = query.tags.map(tag => ({
            tags: { has: tag }
          }));
        } else {
          where.tags = { hasSome: query.tags };
        }
      }

      // Category filters
      if (query.categories && query.categories.length > 0) {
        where.contentType = { in: query.categories };
      }

      // Price range filter
      if (query.priceRange) {
        where.price = {
          gte: query.priceRange.min,
          lte: query.priceRange.max
        };
      }

      // Free content filter
      if (query.isFree !== undefined) {
        where.price = query.isFree ? 0 : { gt: 0 };
      }

      // Author filter
      if (query.authorId) {
        where.authorId = query.authorId;
      }

      // Build orderBy clause
      const orderBy = this.buildOrderBy(query.sortBy || 'relevance', query.text);

      // Pagination
      const page = query.page || 1;
      const limit = query.limit || 20;
      const skip = (page - 1) * limit;

      // Execute query
      const [items, total] = await Promise.all([
        prisma.content.findMany({
          where,
          orderBy,
          skip,
          take: limit,
          include: {
            author: {
              select: {
                id: true,
                username: true,
                avatar: true
              }
            },
            _count: {
              select: {
                likes: true,
                comments: true
              }
            }
          }
        }),
        prisma.content.count({ where })
      ]);

      // Map to domain entities
      const domainEntities = items.map(item => this.toContentEntity(item));

      const result = SearchResultEntity.create(
        domainEntities,
        total,
        page,
        limit
      );

      console.log('✅ SearchRepositoryPrisma: Búsqueda completada', {
        total: result.total,
        items: result.items.length,
        page: result.page
      });

      return result;

    } catch (error) {
      console.error('❌ SearchRepositoryPrisma: Error en búsqueda', error);
      throw new Error('Error al realizar la búsqueda');
    }
  }

  async getPopularTags(limit: number = 20): Promise<string[]> {
    console.log('🏷️ SearchRepositoryPrisma: Obteniendo tags populares', { limit });

    try {
      // Get all tags from published content
      const contents = await prisma.content.findMany({
        where: { isPublished: true },
        select: { tags: true }
      });

      // Count tag usage
      const tagCounts: { [key: string]: number } = {};
      contents.forEach(content => {
        content.tags.forEach(tag => {
          const normalizedTag = tag.toLowerCase().trim();
          if (normalizedTag) {
            tagCounts[normalizedTag] = (tagCounts[normalizedTag] || 0) + 1;
          }
        });
      });

      // Sort by popularity and limit
      const popularTags = Object.entries(tagCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, limit)
        .map(([tag]) => tag);

      console.log('✅ SearchRepositoryPrisma: Tags populares obtenidos', {
        count: popularTags.length
      });

      return popularTags;

    } catch (error) {
      console.error('❌ SearchRepositoryPrisma: Error obteniendo tags populares', error);
      return [];
    }
  }

  async getSuggestions(partial: string): Promise<{ tags: string[]; titles: string[] }> {
    console.log('💡 SearchRepositoryPrisma: Obteniendo sugerencias', { partial });

    if (!partial || partial.length < 2) {
      return { tags: [], titles: [] };
    }

    try {
      const partialLower = partial.toLowerCase();

      // Get tag suggestions
      const tagContents = await prisma.content.findMany({
        where: {
          isPublished: true,
          tags: { hasSome: [partial] } // This will be enhanced with full-text search
        },
        select: { tags: true },
        take: 50
      });

      const tagSuggestions = new Set<string>();
      tagContents.forEach(content => {
        content.tags.forEach(tag => {
          if (tag.toLowerCase().includes(partialLower)) {
            tagSuggestions.add(tag);
          }
        });
      });

      // Get title suggestions
      const titleContents = await prisma.content.findMany({
        where: {
          isPublished: true,
          title: { contains: partial, mode: 'insensitive' }
        },
        select: { title: true },
        take: 10
      });

      const tags = Array.from(tagSuggestions).slice(0, 10);
      const titles = titleContents.map(c => c.title);

      console.log('✅ SearchRepositoryPrisma: Sugerencias obtenidas', {
        tags: tags.length,
        titles: titles.length
      });

      return { tags, titles };

    } catch (error) {
      console.error('❌ SearchRepositoryPrisma: Error obteniendo sugerencias', error);
      return { tags: [], titles: [] };
    }
  }

  async getRelatedSearches(query: string): Promise<string[]> {
    console.log('🔗 SearchRepositoryPrisma: Obteniendo búsquedas relacionadas', { query });

    try {
      // Find content with similar titles
      const queryLower = query.toLowerCase();
      const queryWords = queryLower.split(/\s+/).filter(Boolean);

      if (queryWords.length === 0) return [];

      // Search for content that matches some of the query words
      const relatedContent = await prisma.content.findMany({
        where: {
          isPublished: true,
          OR: queryWords.map(word => ({
            title: { contains: word, mode: 'insensitive' }
          }))
        },
        select: { title: true },
        take: 10
      });

      const uniqueTitles = new Set(relatedContent.map(c => c.title));
      return Array.from(uniqueTitles).slice(0, 5);

    } catch (error) {
      console.error('❌ SearchRepositoryPrisma: Error obteniendo búsquedas relacionadas', error);
      return [];
    }
  }

  async getSearchStats(): Promise<{
    totalContent: number;
    totalTags: number;
    popularTags: Array<{ tag: string; count: number }>;
    recentSearches: string[];
  }> {
    console.log('📊 SearchRepositoryPrisma: Obteniendo estadísticas de búsqueda');

    try {
      // Get total published content
      const totalContent = await prisma.content.count({
        where: { isPublished: true }
      });

      // Get all tags
      const contents = await prisma.content.findMany({
        where: { isPublished: true },
        select: { tags: true }
      });

      const tagCounts: { [key: string]: number } = {};
      contents.forEach(content => {
        content.tags.forEach(tag => {
          const normalizedTag = tag.toLowerCase().trim();
          if (normalizedTag) {
            tagCounts[normalizedTag] = (tagCounts[normalizedTag] || 0) + 1;
          }
        });
      });

      const popularTags = Object.entries(tagCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([tag, count]) => ({ tag, count }));

      return {
        totalContent,
        totalTags: Object.keys(tagCounts).length,
        popularTags,
        recentSearches: [] // TODO: Implement analytics tracking
      };

    } catch (error) {
      console.error('❌ SearchRepositoryPrisma: Error obteniendo estadísticas', error);
      return {
        totalContent: 0,
        totalTags: 0,
        popularTags: [],
        recentSearches: []
      };
    }
  }

  async incrementTagUsage(tag: string): Promise<void> {
    console.log('📈 SearchRepositoryPrisma: Incrementando uso de tag', { tag });
    // TODO: Implement analytics when needed
  }

  async recordSearch(query: string): Promise<void> {
    console.log('📝 SearchRepositoryPrisma: Registrando búsqueda', { query });
    // TODO: Implement analytics when needed
  }

  // Private helper methods
  private buildOrderBy(sortBy: string, searchText?: string): Prisma.ContentOrderByWithRelationInput | Prisma.ContentOrderByWithRelationInput[] {
    switch (sortBy) {
      case 'price_asc':
        return { price: 'asc' };
      
      case 'price_desc':
        return { price: 'desc' };
      
      case 'date':
        return { createdAt: 'desc' };
      
      case 'popularity':
        return [
          { views: 'desc' },
          { createdAt: 'desc' }
        ];
      
      case 'relevance':
      default:
        // For relevance, prioritize recent popular content
        if (searchText) {
          return [
            { views: 'desc' },
            { createdAt: 'desc' }
          ];
        }
        return { createdAt: 'desc' };
    }
  }

  private toContentEntity(item: any): any {
    return {
      id: item.id,
      title: item.title,
      description: item.description,
      author: item.authorId,
      authorUsername: item.author.username,
      authorAvatar: item.author.avatar,
      authorId: item.authorId,
      price: item.price,
      currency: item.currency,
      contentType: item.contentType,
      category: item.category,
      tags: item.tags,
      isPublished: item.isPublished,
      coverImage: item.coverImage,
      files: item.files,
      likes: item._count.likes,
      views: item.views,
      downloads: item.downloads,
      shortDescription: item.shortDescription,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
      // Computed properties
      get isFree() { return this.price === 0; },
      get displayPrice() { return this.isFree ? 'Gratis' : `${this.price.toLocaleString()} ${this.currency}`; },
      get typeDisplay() { return this.contentType; },
      get categoryDisplay() { return this.category; }
    };
  }
}
