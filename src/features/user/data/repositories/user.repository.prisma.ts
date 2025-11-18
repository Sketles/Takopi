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

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      banner: user.banner,
      bio: user.bio,
      location: user.location,
      createdAt: user.createdAt.toISOString(),
      stats: {
        contentCount: user._count.contents,
        purchaseCount: user._count.purchases,
        followersCount: user._count.followers,
        followingCount: user._count.following
      }
    } as UserProfileEntity;
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
            following: true
          }
        }
      }
    });

    if (!user) {
      return {
        contentCount: 0,
        purchaseCount: 0,
        followersCount: 0,
        followingCount: 0
      };
    }

    return {
      contentCount: user._count.contents,
      purchaseCount: user._count.purchases,
      followersCount: user._count.followers,
      followingCount: user._count.following
    };
  }

  async getUserCreations(userId: string): Promise<any[]> {
    const contents = await prisma.content.findMany({
      where: { authorId: userId },
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

  private toEntity(user: any): UserEntity {
    return new UserEntity(
      user.id,
      user.username,
      user.email,
      user.role,
      user.avatar,
      user.bio,
      user.createdAt.toISOString()
    );
  }
}
