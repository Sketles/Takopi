// Pin Repository Prisma Implementation
import { IPinRepository } from '../../domain/repositories/pin.repository.interface';
import { PinEntity } from '../../domain/entities/pin.entity';
import prisma from '@/lib/prisma';

export class PinRepositoryPrisma implements IPinRepository {
  async findByUserAndContent(userId: string, contentId: string): Promise<PinEntity | null> {
    const pin = await prisma.pin.findUnique({
      where: {
        userId_contentId: {
          userId,
          contentId
        }
      }
    });

    return pin ? this.toEntity(pin) : null;
  }

  async countByContent(contentId: string): Promise<number> {
    return await prisma.pin.count({
      where: { contentId }
    });
  }

  async countByUser(userId: string, isPublicOnly: boolean = false): Promise<number> {
    return await prisma.pin.count({
      where: {
        userId,
        ...(isPublicOnly && { isPublic: true })
      }
    });
  }

  async create(userId: string, contentId: string, isPublic: boolean = true): Promise<PinEntity> {
    const pin = await prisma.pin.create({
      data: {
        userId,
        contentId,
        isPublic
      }
    });

    return this.toEntity(pin);
  }

  async delete(userId: string, contentId: string): Promise<boolean> {
    try {
      await prisma.pin.delete({
        where: {
          userId_contentId: {
            userId,
            contentId
          }
        }
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async findByUser(userId: string, isPublicOnly: boolean = false): Promise<PinEntity[]> {
    const pins = await prisma.pin.findMany({
      where: {
        userId,
        ...(isPublicOnly && { isPublic: true })
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return pins.map(pin => this.toEntity(pin));
  }

  private toEntity(pin: any): PinEntity {
    return new PinEntity(
      pin.id,
      pin.contentId,
      pin.userId,
      pin.isPublic,
      pin.createdAt instanceof Date ? pin.createdAt : new Date(pin.createdAt)
    );
  }
}
