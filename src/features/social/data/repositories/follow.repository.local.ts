// Follow Repository Local Implementation - Usa FileStorage
import { IFollowRepository, CreateFollowDTO } from '../../domain/repositories/follow.repository.interface';
import { FollowEntity } from '../../domain/entities/follow.entity';
import { fileStorageService } from '@/shared/infrastructure/storage/file-storage.service';

export class FollowRepositoryLocal implements IFollowRepository {
  private collection = 'follows';

  async create(data: CreateFollowDTO): Promise<FollowEntity> {
    console.log('📁 FollowRepositoryLocal: create', data);
    
    const followModel = {
      _id: `follow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      followerId: data.followerId,
      followingId: data.followingId,
      createdAt: data.createdAt.toISOString(),
      updatedAt: new Date().toISOString()
    };

    await fileStorageService.create(this.collection, followModel);

    return new FollowEntity(
      followModel._id,
      followModel.followerId,
      followModel.followingId,
      new Date(followModel.createdAt),
      new Date(followModel.updatedAt)
    );
  }

  async findById(id: string): Promise<FollowEntity | null> {
    console.log('📁 FollowRepositoryLocal: findById', id);
    
    const followModel = await fileStorageService.findById(this.collection, id);
    if (!followModel) return null;

    return new FollowEntity(
      followModel._id,
      followModel.followerId,
      followModel.followingId,
      new Date(followModel.createdAt),
      new Date(followModel.updatedAt)
    );
  }

  async findByUsers(followerId: string, followingId: string): Promise<FollowEntity | null> {
    console.log('📁 FollowRepositoryLocal: findByUsers', { followerId, followingId });
    
    const follows = await fileStorageService.find(this.collection, { 
      followerId, 
      followingId 
    });

    if (follows.length === 0) return null;

    const followModel = follows[0];
    return new FollowEntity(
      followModel._id,
      followModel.followerId,
      followModel.followingId,
      new Date(followModel.createdAt),
      new Date(followModel.updatedAt)
    );
  }

  async findByFollower(followerId: string): Promise<FollowEntity[]> {
    console.log('📁 FollowRepositoryLocal: findByFollower', followerId);
    
    const follows = await fileStorageService.find(this.collection, { followerId });

    return follows.map(follow => new FollowEntity(
      follow._id,
      follow.followerId,
      follow.followingId,
      new Date(follow.createdAt),
      new Date(follow.updatedAt)
    ));
  }

  async findByFollowing(followingId: string): Promise<FollowEntity[]> {
    console.log('📁 FollowRepositoryLocal: findByFollowing', followingId);
    
    const follows = await fileStorageService.find(this.collection, { followingId });

    return follows.map(follow => new FollowEntity(
      follow._id,
      follow.followerId,
      follow.followingId,
      new Date(follow.createdAt),
      new Date(follow.updatedAt)
    ));
  }

  async delete(id: string): Promise<boolean> {
    console.log('📁 FollowRepositoryLocal: delete', id);
    
    try {
      await fileStorageService.delete(this.collection, id);
      return true;
    } catch (error) {
      console.error('Error deleting follow:', error);
      return false;
    }
  }

  async countByFollower(followerId: string): Promise<number> {
    console.log('📁 FollowRepositoryLocal: countByFollower', followerId);
    
    const follows = await fileStorageService.find(this.collection, { followerId });
    return follows.length;
  }

  async countByFollowing(followingId: string): Promise<number> {
    console.log('📁 FollowRepositoryLocal: countByFollowing', followingId);
    
    const follows = await fileStorageService.find(this.collection, { followingId });
    return follows.length;
  }
}

