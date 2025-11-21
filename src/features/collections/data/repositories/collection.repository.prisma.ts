// Collection Repository Prisma Implementation
import { ICollectionRepository } from '../../domain/repositories/collection.repository.interface';
import { CollectionEntity } from '../../domain/entities/collection.entity';
import { CollectionItemEntity } from '../../domain/entities/collection-item.entity';
import prisma from '@/lib/prisma';

export class CollectionRepositoryPrisma implements ICollectionRepository {
  async create(userId: string, title: string, description: string | null, isPublic: boolean): Promise<CollectionEntity> {
    const collection = await prisma.collection.create({
      data: {
        userId,
        title,
        description,
        isPublic
      },
      include: {
        _count: {
          select: {
            items: true
          }
        }
      }
    });

    return this.toEntity(collection);
  }

  async findById(id: string): Promise<CollectionEntity | null> {
    const collection = await prisma.collection.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            items: true
          }
        }
      }
    });

    return collection ? this.toEntity(collection) : null;
  }

  async findByUser(userId: string): Promise<CollectionEntity[]> {
    const collections = await prisma.collection.findMany({
      where: { userId },
      include: {
        _count: {
          select: {
            items: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    return collections.map(c => this.toEntity(c));
  }

  async update(id: string, data: { title?: string; description?: string | null; isPublic?: boolean }): Promise<CollectionEntity | null> {
    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.isPublic !== undefined) updateData.isPublic = data.isPublic;

    const collection = await prisma.collection.update({
      where: { id },
      data: updateData,
      include: {
        _count: {
          select: {
            items: true
          }
        }
      }
    });

    return this.toEntity(collection);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.collection.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      console.error('Error deleting collection:', error);
      return false;
    }
  }

  async addItem(collectionId: string, contentId: string): Promise<CollectionItemEntity> {
    const item = await prisma.collectionItem.create({
      data: {
        collectionId,
        contentId
      }
    });

    // Update collection's updatedAt
    await prisma.collection.update({
      where: { id: collectionId },
      data: { updatedAt: new Date() }
    });

    return this.toItemEntity(item);
  }

  async removeItem(collectionId: string, contentId: string): Promise<boolean> {
    try {
      await prisma.collectionItem.deleteMany({
        where: {
          collectionId,
          contentId
        }
      });

      // Update collection's updatedAt
      await prisma.collection.update({
        where: { id: collectionId },
        data: { updatedAt: new Date() }
      });

      return true;
    } catch (error) {
      console.error('Error removing item from collection:', error);
      return false;
    }
  }

  async getItems(collectionId: string): Promise<CollectionItemEntity[]> {
    const items = await prisma.collectionItem.findMany({
      where: { collectionId },
      orderBy: {
        addedAt: 'desc'
      }
    });

    return items.map(item => this.toItemEntity(item));
  }

  async isItemInCollection(collectionId: string, contentId: string): Promise<boolean> {
    const item = await prisma.collectionItem.findFirst({
      where: {
        collectionId,
        contentId
      }
    });

    return item !== null;
  }

  async countByUser(userId: string): Promise<number> {
    return await prisma.collection.count({
      where: { userId }
    });
  }

  private toEntity(collection: any): CollectionEntity {
    return new CollectionEntity(
      collection.id,
      collection.userId,
      collection.title,
      collection.description,
      collection.isPublic,
      collection._count?.items || 0,
      collection.createdAt,
      collection.updatedAt
    );
  }

  private toItemEntity(item: any): CollectionItemEntity {
    return new CollectionItemEntity(
      item.id,
      item.collectionId,
      item.contentId,
      item.addedAt
    );
  }
}
