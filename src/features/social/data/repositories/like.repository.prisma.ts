// Like Repository Prisma Implementation
import { ILikeRepository } from '../../domain/repositories/like.repository.interface';
import { LikeEntity } from '../../domain/entities/like.entity';
import prisma from '@/lib/prisma';

export class LikeRepositoryPrisma implements ILikeRepository {
  async findAll(): Promise<LikeEntity[]> {
    const likes = await prisma.like.findMany();
    return likes.map(l => this.toEntity(l));
  }

  async findById(id: string): Promise<LikeEntity | null> {
    const like = await prisma.like.findUnique({ where: { id } });
    return like ? this.toEntity(like) : null;
  }

  async findByUser(userId: string): Promise<LikeEntity[]> {
    const likes = await prisma.like.findMany({
      where: { userId }
    });
    return likes.map(l => this.toEntity(l));
  }

  async findByContent(contentId: string): Promise<LikeEntity[]> {
    const likes = await prisma.like.findMany({
      where: { contentId }
    });
    return likes.map(l => this.toEntity(l));
  }

  async findByUserAndContent(userId: string, contentId: string): Promise<LikeEntity | null> {
    const like = await prisma.like.findUnique({
      where: {
        contentId_userId: {
          contentId,
          userId
        }
      }
    });
    return like ? this.toEntity(like) : null;
  }

  async create(data: { userId: string; contentId: string }): Promise<LikeEntity> {
    const like = await prisma.like.create({
      data: {
        userId: data.userId,
        contentId: data.contentId
      }
    });
    return this.toEntity(like);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.like.delete({ where: { id } });
      return true;
    } catch (error) {
      return false;
    }
  }

  async countByContent(contentId: string): Promise<number> {
    return await prisma.like.count({
      where: { contentId }
    });
  }

  private toEntity(like: any): LikeEntity {
    return {
      id: like.id,
      userId: like.userId,
      contentId: like.contentId,
      createdAt: like.createdAt.toISOString()
    } as LikeEntity;
  }
}
