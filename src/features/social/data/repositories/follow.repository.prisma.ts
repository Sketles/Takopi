// Follow Repository Prisma Implementation
import { IFollowRepository } from '../../domain/repositories/follow.repository.interface';
import { FollowEntity } from '../../domain/entities/follow.entity';
import prisma from '@/lib/prisma';

export class FollowRepositoryPrisma implements IFollowRepository {
  async create(data: any): Promise<FollowEntity> {
    const follow = await prisma.follow.create({
      data: {
        followerId: data.followerId,
        followingId: data.followingId
      }
    });
    return this.toEntity(follow);
  }

  async findById(id: string): Promise<FollowEntity | null> {
    const follow = await prisma.follow.findUnique({ where: { id } });
    return follow ? this.toEntity(follow) : null;
  }

  async findByUsers(followerId: string, followingId: string): Promise<FollowEntity | null> {
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId
        }
      }
    });
    return follow ? this.toEntity(follow) : null;
  }

  async findByFollower(followerId: string): Promise<FollowEntity[]> {
    const follows = await prisma.follow.findMany({
      where: { followerId }
    });
    return follows.map((f: any) => this.toEntity(f));
  }

  async findByFollowing(followingId: string): Promise<FollowEntity[]> {
    const follows = await prisma.follow.findMany({
      where: { followingId }
    });
    return follows.map((f: any) => this.toEntity(f));
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.follow.delete({ where: { id } });
      return true;
    } catch (error) {
      return false;
    }
  }

  async countByFollower(followerId: string): Promise<number> {
    return await prisma.follow.count({ where: { followerId } });
  }

  async countByFollowing(followingId: string): Promise<number> {
    return await prisma.follow.count({ where: { followingId } });
  }

  private toEntity(follow: any): FollowEntity {
    return {
      id: follow.id,
      followerId: follow.followerId,
      followingId: follow.followingId,
      createdAt: follow.createdAt.toISOString()
    } as FollowEntity;
  }
}
