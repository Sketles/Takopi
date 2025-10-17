// Search Repository Local Simple - Versión simplificada para testing
import { ISearchRepository } from '../../domain/repositories/search.repository.interface';
import { SearchQueryEntity } from '../../domain/entities/search-query.entity';
import { SearchResultEntity } from '../../domain/entities/search-result.entity';

export class SearchRepositoryLocalSimple implements ISearchRepository {
  async search(query: SearchQueryEntity): Promise<SearchResultEntity> {
    // console.log('🔍 SearchRepositoryLocalSimple: Ejecutando búsqueda', query);

    try {
      // Datos de prueba hardcodeados
      const mockContent = [
        {
          id: '1',
          title: 'Musica de Stream',
          description: 'Incluye:\n-musica\n-noticicaciones\n-alertas',
          author: 'test-author',
          authorUsername: 'test-user',
          price: 2500,
          currency: 'CLP',
          contentType: 'musica',
          category: 'musica',
          tags: ['audio', 'sound', 'instrumental'],
          isPublished: true,
          coverImage: '/uploads/covers/cover-1760509465855-537278852.jpg',
          files: ['test.mp3'],
          likes: 5,
          views: 100,
          downloads: 10,
          authorAvatar: null,
          authorId: 'test-author',
          shortDescription: 'Musica para streaming',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          // Métodos básicos
          get isFree() { return this.price === 0; },
          get displayPrice() { return this.isFree ? 'Gratis' : `${this.price.toLocaleString()} ${this.currency}`; },
          get typeDisplay() { return this.contentType; },
          get categoryDisplay() { return this.category; }
        },
        {
          id: '2',
          title: 'Modelo 3D de Casa Moderna',
          description: 'Modelo 3D detallado de una casa moderna con texturas y materiales',
          author: 'designer-3d',
          authorUsername: '3d-artist',
          price: 15000,
          currency: 'CLP',
          contentType: 'modelo3d',
          category: 'modelo3d',
          tags: ['3d', 'casa', 'arquitectura', 'moderno'],
          isPublished: true,
          coverImage: '/uploads/covers/cover-1760575626627-940927130.png',
          files: ['casa-moderna.glb'],
          likes: 12,
          views: 250,
          downloads: 8,
          authorAvatar: null,
          authorId: 'designer-3d',
          shortDescription: 'Modelo 3D de casa moderna',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          // Métodos básicos
          get isFree() { return this.price === 0; },
          get displayPrice() { return this.isFree ? 'Gratis' : `${this.price.toLocaleString()} ${this.currency}`; },
          get typeDisplay() { return this.contentType; },
          get categoryDisplay() { return this.category; }
        },
        {
          id: '3',
          title: 'Pack de Texturas Realistas',
          description: 'Colección de texturas realistas para materiales de construcción',
          author: 'texture-master',
          authorUsername: 'texture-artist',
          price: 0,
          currency: 'CLP',
          contentType: 'textura',
          category: 'textura',
          tags: ['texturas', 'realista', 'materiales', 'construccion'],
          isPublished: true,
          coverImage: '/uploads/covers/cover-1760509624100-156509763.jpg',
          files: ['texture-pack.zip'],
          likes: 25,
          views: 500,
          downloads: 45,
          authorAvatar: null,
          authorId: 'texture-master',
          shortDescription: 'Pack gratuito de texturas realistas',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          // Métodos básicos
          get isFree() { return this.price === 0; },
          get displayPrice() { return this.isFree ? 'Gratis' : `${this.price.toLocaleString()} ${this.currency}`; },
          get typeDisplay() { return this.contentType; },
          get categoryDisplay() { return this.category; }
        }
      ];

      // Filtrar por categorías si se especifica
      let filteredContent = mockContent;
      if (query.categories && query.categories.length > 0) {
        filteredContent = mockContent.filter(item => 
          query.categories!.includes(item.contentType)
        );
      }

      // Filtrar por texto si se especifica
      if (query.text) {
        const searchText = query.text.toLowerCase();
        filteredContent = filteredContent.filter(item =>
          item.title.toLowerCase().includes(searchText) ||
          item.description.toLowerCase().includes(searchText) ||
          item.tags.some(tag => tag.toLowerCase().includes(searchText))
        );
      }

      const result = SearchResultEntity.create(
        filteredContent,
        filteredContent.length,
        query.page || 1,
        query.limit || 20
      );

      // console.log('✅ SearchRepositoryLocalSimple: Búsqueda completada', {
      //   total: result.total,
      //   items: result.items.length,
      //   page: result.page
      // });

      return result;

    } catch (error) {
      console.error('❌ SearchRepositoryLocalSimple: Error en búsqueda', error);
      throw new Error('Error al realizar la búsqueda');
    }
  }

  async getPopularTags(limit: number = 20): Promise<string[]> {
    // console.log('🏷️ SearchRepositoryLocalSimple: Obteniendo tags populares', { limit });
    return ['audio', 'sound', 'instrumental', 'streaming', 'music', '3d', 'casa', 'arquitectura', 'moderno', 'texturas', 'realista', 'materiales', 'construccion'];
  }

  async getSuggestions(partial: string): Promise<{ tags: string[]; titles: string[] }> {
    // console.log('💡 SearchRepositoryLocalSimple: Obteniendo sugerencias', { partial });
    return {
      tags: ['audio', 'sound', 'music', '3d', 'texturas', 'casa'],
      titles: ['Musica de Stream', 'Modelo 3D de Casa Moderna', 'Pack de Texturas Realistas']
    };
  }

  async getRelatedSearches(query: string): Promise<string[]> {
    // console.log('🔗 SearchRepositoryLocalSimple: Obteniendo búsquedas relacionadas', { query });
    return ['música streaming', 'audio pack', 'sound effects', 'modelos 3d', 'texturas realistas', 'arquitectura moderna'];
  }

  async getSearchStats(): Promise<{
    totalContent: number;
    totalTags: number;
    popularTags: Array<{ tag: string; count: number }>;
    recentSearches: string[];
  }> {
    return {
      totalContent: 3,
      totalTags: 13,
      popularTags: [
        { tag: 'audio', count: 3 },
        { tag: 'sound', count: 2 },
        { tag: '3d', count: 2 },
        { tag: 'texturas', count: 2 },
        { tag: 'realista', count: 1 }
      ],
      recentSearches: []
    };
  }

  async incrementTagUsage(tag: string): Promise<void> {
    // console.log('📈 SearchRepositoryLocalSimple: Incrementando uso de tag', { tag });
  }

  async recordSearch(query: string): Promise<void> {
    // console.log('📝 SearchRepositoryLocalSimple: Registrando búsqueda', { query });
  }
}
