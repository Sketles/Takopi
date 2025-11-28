// User Repository Prisma Implementation
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { UserEntity } from '@/features/auth/domain/entities/user.entity';
import { UserProfileEntity } from '../../domain/entities/user-profile.entity';
import prisma from '@/lib/prisma';

export class UserRepositoryPrisma implements IUserRepository {
  async findById(id: string): Promise<UserEntity | null> {
    const user = await prisma.user.findUnique({ where: { id } });
    return user ? this.toEntity(user) : null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    return user ? this.toEntity(user) : null;
  }

  async getPublicProfile(userId: string): Promise<UserProfileEntity | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        contents: {
          where: { isPublished: true }, // Only published content
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            contents: true,
            purchases: true,
            followers: true,
            following: true
          }
        }
      }
    });

    if (!user) return null;

    // Return a proper UserProfileEntity instance so methods like isCreator/isAdmin are available
    return new UserProfileEntity(
      user.id,
      user.username,
      user.role,
      user.avatar || undefined,
      user.bio || undefined,
      user.createdAt,
      {
        contentCount: user._count.contents,
        purchaseCount: user._count.purchases,
        followersCount: user._count.followers,
        followingCount: user._count.following
      },
      user.contents,
      user.banner || undefined,
      user.location || undefined
    );
  }

  async getUserStats(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            contents: true,
            purchases: true,
            followers: true,
            following: true,
            collections: {
              where: { isPublic: true }
            }
          }
        },
        contents: {
          select: {
            id: true
          }
        }
      }
    });

    if (!user) {
      return {
        contentCount: 0,
        purchaseCount: 0,
        followersCount: 0,
        followingCount: 0,
        collectionsCount: 0,
        totalLikes: 0
      };
    }

    // Contar likes de contenidos del usuario
    const contentIds = user.contents.map(c => c.id);
    const contentLikes = await prisma.like.count({
      where: {
        contentId: { in: contentIds }
      }
    });

    // Contar likes de comentarios del usuario
    const commentLikes = await prisma.comment.aggregate({
      where: {
        userId: userId
      },
      _sum: {
        likeCount: true
      }
    });

    const totalLikes = contentLikes + (commentLikes._sum.likeCount || 0);

    return {
      contentCount: user._count.contents,
      purchaseCount: user._count.purchases,
      followersCount: user._count.followers,
      followingCount: user._count.following,
      collectionsCount: user._count.collections,
      totalLikes: totalLikes
    };
  }

  async getUserCreations(userId: string): Promise<any[]> {
    const contents = await prisma.content.findMany({
      where: { authorId: userId },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return contents;
  }

  async getUserPurchases(userId: string): Promise<any[]> {
    const purchases = await prisma.purchase.findMany({
      where: { userId },
      include: { content: true },
      orderBy: { createdAt: 'desc' }
    });
    return purchases;
  }

  async getRecentUsers(limit: number): Promise<UserEntity[]> {
    const users = await prisma.user.findMany({
      where: {
        isActive: true,
        avatar: { not: null } // Only users with avatars
      },
      take: limit,
      orderBy: { createdAt: 'desc' }
    });

    return users.map(user => this.toEntity(user));
  }

  private toEntity(user: any): UserEntity {
    return new UserEntity(
      user.id,
      user.username,
      user.email,
      user.role,
      user.avatar,
      user.banner,
      user.bio,
      user.location,
      user.createdAt,
      user.updatedAt,
      user.isActive
    );
  }
}
