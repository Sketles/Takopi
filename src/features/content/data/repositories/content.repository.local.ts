// Content Repository Local Implementation - Usa FileStorage
import { IContentRepository } from '../../domain/repositories/content.repository.interface';
import { ContentEntity } from '../../domain/entities/content.entity';
import { ContentMapper } from '../mappers/content.mapper';
import { fileStorageService } from '@/shared/infrastructure/storage/file-storage.service';

export class ContentRepositoryLocal implements IContentRepository {
  private collection = 'content';

  async findAll(): Promise<ContentEntity[]> {
    console.log('📁 ContentRepositoryLocal: findAll');
    const models = await fileStorageService.findAll(this.collection);
    return await this.enrichWithAuthorData(models);
  }

  async findById(id: string): Promise<ContentEntity | null> {
    console.log('📁 ContentRepositoryLocal: findById', id);
    const model = await fileStorageService.findById(this.collection, id);
    if (!model) return null;
    
    const enrichedModels = await this.enrichWithAuthorData([model]);
    return enrichedModels[0] || null;
  }

  async findByCategory(category: string): Promise<ContentEntity[]> {
    console.log('📁 ContentRepositoryLocal: findByCategory', category);
    const models = await fileStorageService.find(this.collection, { 
      contentType: category,  // Cambiar de 'category' a 'contentType'
      isPublished: true 
    });
    return await this.enrichWithAuthorData(models);
  }

  async findByAuthor(authorId: string): Promise<ContentEntity[]> {
    console.log('📁 ContentRepositoryLocal: findByAuthor', authorId);
    const models = await fileStorageService.find(this.collection, { 
      author: authorId 
    });
    return await this.enrichWithAuthorData(models);
  }

  async findPublished(): Promise<ContentEntity[]> {
    console.log('📁 ContentRepositoryLocal: findPublished');
    const models = await fileStorageService.find(this.collection, { 
      isPublished: true 
    });
    return await this.enrichWithAuthorData(models);
  }

  async create(data: any): Promise<ContentEntity> {
    console.log('📁 ContentRepositoryLocal: create');
    const model = await fileStorageService.create(this.collection, data);
    return ContentMapper.toDomain(model);
  }

  async update(id: string, data: any): Promise<ContentEntity | null> {
    console.log('📁 ContentRepositoryLocal: update', id);
    const model = await fileStorageService.update(this.collection, id, data);
    return model ? ContentMapper.toDomain(model) : null;
  }

  async delete(id: string): Promise<boolean> {
    console.log('📁 ContentRepositoryLocal: delete', id);
    return await fileStorageService.delete(this.collection, id);
  }

  async paginate(page: number, limit: number, filter?: any) {
    console.log('📁 ContentRepositoryLocal: paginate', { page, limit, filter });
    const result = await fileStorageService.paginate(this.collection, page, limit, filter);
    return {
      items: ContentMapper.toDomainList(result.data),
      total: result.pagination.totalItems,
      page: result.pagination.currentPage,
      totalPages: result.pagination.totalPages
    };
  }

  // Método privado para enriquecer contenido con datos del autor
  private async enrichWithAuthorData(models: any[]): Promise<ContentEntity[]> {
    const enrichedModels = await Promise.all(
      models.map(async (model) => {
        try {
          // Buscar el usuario autor
          const user = await fileStorageService.findById('users', model.author);
          
          if (user) {
            // Enriquecer el modelo con datos del autor
            const enrichedModel = {
              ...model,
              authorAvatar: user.avatar,
              authorId: user._id,
              authorUsername: user.username || model.authorUsername
            };
            return enrichedModel;
          }
          
          // Si no se encuentra el usuario, usar datos por defecto
          return {
            ...model,
            authorAvatar: null,
            authorId: model.author,
            authorUsername: model.authorUsername || 'Usuario'
          };
        } catch (error) {
          console.error('Error enriching content with author data:', error);
          // En caso de error, retornar modelo original
          return {
            ...model,
            authorAvatar: null,
            authorId: model.author,
            authorUsername: model.authorUsername || 'Usuario'
          };
        }
      })
    );

    return ContentMapper.toDomainList(enrichedModels);
  }
}

