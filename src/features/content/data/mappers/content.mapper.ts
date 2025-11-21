// Content Mapper - Transforma Model ↔ Entity
import { ContentEntity } from '../../domain/entities/content.entity';
import { ContentModel } from '../models/content.model';

export class ContentMapper {
  static toDomain(model: ContentModel): ContentEntity {
    return new ContentEntity(
      model._id,
      model.title,
      model.description,
      model.author,
      model.authorUsername || 'Anónimo',
      model.price,
      model.currency,
      model.contentType,
      model.category,
      model.tags || [],
      model.isPublished,
      model.coverImage,
      model.files,
      model.likes || 0,
      model.views || 0,
      model.downloads || 0,
      0, // pins - se calcula desde el repositorio
      model.authorAvatar,
      model.authorId,
      model.shortDescription,
      new Date(model.createdAt),
      new Date(model.updatedAt)
    );
  }

  static toModel(entity: ContentEntity): ContentModel {
    return {
      _id: entity.id,
      title: entity.title,
      description: entity.description,
      author: entity.author,
      authorUsername: entity.authorUsername,
      price: entity.price,
      currency: entity.currency,
      contentType: entity.contentType,
      category: entity.category,
      tags: entity.tags,
      isPublished: entity.isPublished,
      coverImage: entity.coverImage,
      files: entity.files,
      likes: entity.likes,
      views: entity.views,
      downloads: entity.downloads,
      authorAvatar: entity.authorAvatar,
      authorId: entity.authorId,
      shortDescription: entity.shortDescription,
      createdAt: entity.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: entity.updatedAt?.toISOString() || new Date().toISOString()
    };
  }

  static toDomainList(models: ContentModel[]): ContentEntity[] {
    return models.map(model => this.toDomain(model));
  }

  static toModelList(entities: ContentEntity[]): ContentModel[] {
    return entities.map(entity => this.toModel(entity));
  }
}

