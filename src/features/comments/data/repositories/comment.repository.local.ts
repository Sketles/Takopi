// Comment Repository Local Implementation - Usa FileStorage
import { ICommentRepository, CreateCommentDTO } from '../../domain/repositories/comment.repository.interface';
import { CommentEntity } from '../../domain/entities/comment.entity';
import { CommentMapper } from '../mappers/comment.mapper';
import { fileStorageService } from '@/shared/infrastructure/storage/file-storage.service';

export class CommentRepositoryLocal implements ICommentRepository {
  private collection = 'comments';

  async create(data: CreateCommentDTO): Promise<CommentEntity> {
    const commentModel = {
      _id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      contentId: data.contentId,
      userId: data.userId,
      username: data.username,
      userAvatar: data.userAvatar,
      text: data.text,
      likes: 0,
      likedBy: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await fileStorageService.create(this.collection, commentModel);
    return CommentMapper.toDomain(commentModel);
  }

  async findById(id: string): Promise<CommentEntity | null> {
    const commentModel = await fileStorageService.findById(this.collection, id);
    return commentModel ? CommentMapper.toDomain(commentModel) : null;
  }

  async findByContentId(contentId: string): Promise<CommentEntity[]> {
    const commentModels = await fileStorageService.find(this.collection, { contentId });
    return CommentMapper.toDomainList(commentModels);
  }

  async update(id: string, data: Partial<CreateCommentDTO>): Promise<CommentEntity | null> {
    try {
      await fileStorageService.update(this.collection, id, {
        ...data,
        updatedAt: new Date().toISOString()
      });
      return await this.findById(id);
    } catch (error) {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await fileStorageService.delete(this.collection, id);
      return true;
    } catch (error) {
      return false;
    }
  }

  async toggleLike(commentId: string, userId: string): Promise<CommentEntity | null> {
    try {
      const commentModel = await fileStorageService.findById(this.collection, commentId);
      if (!commentModel) return null;

      const isLiked = commentModel.likedBy.includes(userId);
      const newLikedBy = isLiked 
        ? commentModel.likedBy.filter(id => id !== userId)
        : [...commentModel.likedBy, userId];

      const updatedModel = {
        ...commentModel,
        likes: newLikedBy.length,
        likedBy: newLikedBy,
        updatedAt: new Date().toISOString()
      };

      await fileStorageService.update(this.collection, commentId, updatedModel);
      return CommentMapper.toDomain(updatedModel, userId);
    } catch (error) {
      return null;
    }
  }

  async getCommentLikes(commentId: string): Promise<number> {
    const commentModel = await fileStorageService.findById(this.collection, commentId);
    return commentModel ? commentModel.likes : 0;
  }
}
