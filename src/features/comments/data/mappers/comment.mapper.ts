// Comment Mapper - Transforma Model ↔ Entity
import { CommentEntity } from '../../domain/entities/comment.entity';
import { CommentModel } from '../models/comment.model';

export class CommentMapper {
  static toDomain(model: CommentModel, currentUserId?: string): CommentEntity {
    return new CommentEntity(
      model._id,
      model.contentId,
      model.userId,
      model.username,
      model.userAvatar,
      model.text,
      model.likes,
      model.likedBy || [],
      currentUserId ? (model.likedBy || []).includes(currentUserId) : false,
      new Date(model.createdAt),
      new Date(model.updatedAt)
    );
  }

  static toModel(entity: CommentEntity): CommentModel {
    return {
      _id: entity.id,
      contentId: entity.contentId,
      userId: entity.userId,
      username: entity.username,
      userAvatar: entity.userAvatar,
      text: entity.text,
      likes: entity.likes,
      likedBy: entity.likedBy,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString()
    };
  }

  static toDomainList(models: CommentModel[], currentUserId?: string): CommentEntity[] {
    return models.map(model => this.toDomain(model, currentUserId));
  }
}
