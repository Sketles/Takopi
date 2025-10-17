// Like Repository Local Implementation
import { ILikeRepository } from '../../domain/repositories/like.repository.interface';
import { LikeEntity } from '../../domain/entities/like.entity';
import { fileStorageService } from '@/shared/infrastructure/storage/file-storage.service';

export class LikeRepositoryLocal implements ILikeRepository {
  private collection = 'likes';

  async findAll(): Promise<LikeEntity[]> {
    const models = await fileStorageService.findAll<any>(this.collection);
    return models.map(m => new LikeEntity(m._id, m.userId, m.contentId, new Date(m.createdAt)));
  }

  async findById(id: string): Promise<LikeEntity | null> {
    const model = await fileStorageService.findById<any>(this.collection, id);
    return model ? new LikeEntity(model._id, model.userId, model.contentId, new Date(model.createdAt)) : null;
  }

  async findByUser(userId: string): Promise<LikeEntity[]> {
    const models = await fileStorageService.find<any>(this.collection, { userId });
    return models.map(m => new LikeEntity(m._id, m.userId, m.contentId, new Date(m.createdAt)));
  }

  async findByContent(contentId: string): Promise<LikeEntity[]> {
    const models = await fileStorageService.find<any>(this.collection, { contentId });
    return models.map(m => new LikeEntity(m._id, m.userId, m.contentId, new Date(m.createdAt)));
  }

  async findByUserAndContent(userId: string, contentId: string): Promise<LikeEntity | null> {
    const models = await fileStorageService.find<any>(this.collection, { userId, contentId });
    return models.length > 0 ? new LikeEntity(models[0]._id, models[0].userId, models[0].contentId, new Date(models[0].createdAt)) : null;
  }

  async create(like: { userId: string; contentId: string }): Promise<LikeEntity> {
    const model = await fileStorageService.create(this.collection, like);
    return new LikeEntity(model._id, model.userId, model.contentId, new Date(model.createdAt));
  }

  async delete(id: string): Promise<boolean> {
    return await fileStorageService.delete(this.collection, id);
  }

  async countByContent(contentId: string): Promise<number> {
    return await fileStorageService.count(this.collection, { contentId });
  }
}

