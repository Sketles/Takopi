// Purchase Repository Prisma Implementation
import { IPurchaseRepository } from '../../domain/repositories/purchase.repository.interface';
import { PurchaseEntity } from '../../domain/entities/purchase.entity';
import prisma from '@/lib/prisma';

export class PurchaseRepositoryPrisma implements IPurchaseRepository {
  async findAll(): Promise<PurchaseEntity[]> {
    const purchases = await prisma.purchase.findMany({
      include: {
        content: true,
        user: true
      }
    });
    return purchases.map((p: any) => this.toEntity(p));
  }

  async findById(id: string): Promise<PurchaseEntity | null> {
    const purchase = await prisma.purchase.findUnique({
      where: { id },
      include: {
        content: true,
        user: true
      }
    });
    return purchase ? this.toEntity(purchase) : null;
  }

  async findByUser(userId: string): Promise<PurchaseEntity[]> {
    const purchases = await prisma.purchase.findMany({
      where: { userId },
      include: {
        content: true,
        user: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return purchases.map((p: any) => this.toEntity(p));
  }

  async findByContent(contentId: string): Promise<PurchaseEntity[]> {
    const purchases = await prisma.purchase.findMany({
      where: { contentId },
      include: {
        content: true,
        user: true
      }
    });
    return purchases.map((p: any) => this.toEntity(p));
  }

  async findByUserAndContent(userId: string, contentId: string): Promise<PurchaseEntity | null> {
    const purchase = await prisma.purchase.findFirst({
      where: {
        userId,
        contentId
      },
      include: {
        content: true,
        user: true
      }
    });
    return purchase ? this.toEntity(purchase) : null;
  }

  async create(data: any): Promise<PurchaseEntity> {
    // Obtener el contenido completo para crear el snapshot
    const content = await prisma.content.findUnique({
      where: { id: data.contentId }
    });

    if (!content) {
      throw new Error('Contenido no encontrado');
    }

    // Crear snapshot del contenido al momento de la compra
    const contentSnapshot = {
      title: content.title,
      description: content.description,
      shortDescription: content.shortDescription,
      contentType: content.contentType,
      category: content.category,
      files: content.files, // URLs de Vercel Blob
      coverImage: content.coverImage,
      additionalImages: content.additionalImages,
      price: content.price,
      currency: content.currency,
      license: content.license,
      customLicense: content.customLicense,
      tags: content.tags,
      authorId: content.authorId
    };

    const purchase = await prisma.purchase.create({
      data: {
        userId: data.userId,
        contentId: data.contentId,
        contentSnapshot, // Guardar snapshot
        price: data.price || 0,
        currency: data.currency || 'CLP',
        status: data.status || 'pending',
        transactionId: data.transactionId
      },
      include: {
        content: true,
        user: true
      }
    });
    return this.toEntity(purchase);
  }

  async update(id: string, data: any): Promise<PurchaseEntity | null> {
    const purchase = await prisma.purchase.update({
      where: { id },
      data: {
        status: data.status,
        completedAt: data.completedAt
      },
      include: {
        content: true,
        user: true
      }
    });
    return this.toEntity(purchase);
  }

  async paginate(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [purchases, total] = await Promise.all([
      prisma.purchase.findMany({
        where: { userId },
        include: {
          content: true,
          user: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.purchase.count({ where: { userId } })
    ]);

    return {
      items: purchases.map((p: any) => this.toEntity(p)),
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  private toEntity(purchase: any): PurchaseEntity {
    return {
      id: purchase.id,
      userId: purchase.userId,
      contentId: purchase.contentId,
      price: purchase.price,
      currency: purchase.currency,
      status: purchase.status,
      createdAt: purchase.createdAt.toISOString(),
      updatedAt: purchase.updatedAt.toISOString(),
      completedAt: purchase.completedAt?.toISOString(),
      content: purchase.content,
      user: purchase.user
    } as PurchaseEntity;
  }
}
