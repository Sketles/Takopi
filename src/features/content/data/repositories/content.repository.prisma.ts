// Content Repository Prisma Implementation
import { IContentRepository } from '../../domain/repositories/content.repository.interface';
import { ContentEntity } from '../../domain/entities/content.entity';
import prisma from '@/lib/prisma';

export class ContentRepositoryPrisma implements IContentRepository {
  // Throttle map for view increments to reduce DB writes
  private static viewThrottleMap = new Map<string, number>();
  private static readonly VIEW_THROTTLE_MS = 60000; // 1 minute throttle

  async findAll(): Promise<ContentEntity[]> {
    if (process.env.NODE_ENV !== 'production') {
      console.log('🗄️ ContentRepositoryPrisma: findAll');
    }

    // Add limit to prevent loading too many records
    const contents = await prisma.content.findMany({
      where: {
        isPublished: true,
        isListed: true
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true,
            pins: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 100 // Limit to 100 most recent
    });

    return contents.map(c => this.toEntity(c));
  }

  async findById(id: string): Promise<ContentEntity | null> {
    if (process.env.NODE_ENV !== 'production') {
      console.log('🗄️ ContentRepositoryPrisma: findById', id);
    }

    const content = await prisma.content.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true,
            pins: true
          }
        }
      }
    });

    if (!content) return null;

    // Throttle view increments to reduce DB writes
    this.incrementViewsThrottled(id);

    return this.toEntity(content);
  }

  // Throttled view increment to reduce DB load
  private incrementViewsThrottled(contentId: string): void {
    const now = Date.now();
    const lastIncrement = ContentRepositoryPrisma.viewThrottleMap.get(contentId);

    // Only increment if more than VIEW_THROTTLE_MS has passed
    if (!lastIncrement || now - lastIncrement > ContentRepositoryPrisma.VIEW_THROTTLE_MS) {
      ContentRepositoryPrisma.viewThrottleMap.set(contentId, now);

      // Asynchronous increment without blocking
      prisma.content.update({
        where: { id: contentId },
        data: { views: { increment: 1 } }
      }).catch(error => {
        console.error('Error incrementing views:', error);
      });
    }
  }

  async findByCategory(category: string): Promise<ContentEntity[]> {
    if (process.env.NODE_ENV !== 'production') {
      console.log('🗄️ ContentRepositoryPrisma: findByCategory', category);
    }

    const contents = await prisma.content.findMany({
      where: {
        contentType: category,
        isPublished: true,
        isListed: true
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true,
            pins: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return contents.map(c => this.toEntity(c));
  }

  async findByAuthor(authorId: string): Promise<ContentEntity[]> {
    if (process.env.NODE_ENV !== 'production') {
      console.log('🗄️ ContentRepositoryPrisma: findByAuthor', authorId);
    }

    const contents = await prisma.content.findMany({
      where: { authorId },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true,
            pins: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return contents.map(c => this.toEntity(c));
  }

  async findPublished(): Promise<ContentEntity[]> {
    if (process.env.NODE_ENV !== 'production') {
      console.log('🗄️ ContentRepositoryPrisma: findPublished');
    }

    const contents = await prisma.content.findMany({
      where: {
        isPublished: true,
        isListed: true
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true,
            pins: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return contents.map(c => this.toEntity(c));
  }

  async create(data: any): Promise<ContentEntity> {
    if (process.env.NODE_ENV !== 'production') {
      console.log('🗄️ ContentRepositoryPrisma: create');
    }

    const content = await prisma.content.create({
      data: {
        title: data.title,
        description: data.description,
        shortDescription: data.shortDescription,
        contentType: data.contentType,
        files: data.files || [],
        coverImage: data.coverImage,
        additionalImages: data.additionalImages || [],
        price: data.price || 0,
        currency: data.currency || 'CLP',
        isFree: data.isFree || false,
        license: data.license || 'personal',
        customLicense: data.customLicense,
        isPublished: data.isPublished || false,
        tags: data.tags || [],
        customTags: data.customTags || [],
        authorId: data.authorId,
        publishedAt: data.isPublished ? new Date() : null
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true,
            pins: true
          }
        }
      }
    });

    return this.toEntity(content);
  }

  async update(id: string, data: any): Promise<ContentEntity | null> {
    if (process.env.NODE_ENV !== 'production') {
      console.log('🗄️ ContentRepositoryPrisma: update', id);
    }

    const updateData: any = {};

    // Solo actualizar campos que existen
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.shortDescription !== undefined) updateData.shortDescription = data.shortDescription;
    if (data.contentType !== undefined) updateData.contentType = data.contentType;
    if (data.files !== undefined) updateData.files = data.files;
    if (data.coverImage !== undefined) updateData.coverImage = data.coverImage;
    if (data.additionalImages !== undefined) updateData.additionalImages = data.additionalImages;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.currency !== undefined) updateData.currency = data.currency;
    if (data.isFree !== undefined) updateData.isFree = data.isFree;
    if (data.license !== undefined) updateData.license = data.license;
    if (data.customLicense !== undefined) updateData.customLicense = data.customLicense;
    if (data.isPublished !== undefined) {
      updateData.isPublished = data.isPublished;
      updateData.publishedAt = data.isPublished ? new Date() : null;
    }
    if (data.tags !== undefined) updateData.tags = data.tags;
    if (data.customTags !== undefined) updateData.customTags = data.customTags;

    const content = await prisma.content.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true,
            pins: true
          }
        }
      }
    });

    return this.toEntity(content);
  }

  async delete(id: string): Promise<boolean> {
    if (process.env.NODE_ENV !== 'production') {
      console.log('🗄️ ContentRepositoryPrisma: delete', id);
    }

    try {
      await prisma.content.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      console.error('Error deleting content:', error);
      return false;
    }
  }

  async paginate(page: number, limit: number, filter?: any) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('🗄️ ContentRepositoryPrisma: paginate', { page, limit, filter });
    }

    const skip = (page - 1) * limit;

    const where: any = {};

    if (filter) {
      if (filter.contentType) where.contentType = filter.contentType;
      if (filter.authorId) where.authorId = filter.authorId;
      if (filter.isPublished !== undefined) where.isPublished = filter.isPublished;
      if (filter.status) where.status = filter.status;
      if (filter.search) {
        where.OR = [
          { title: { contains: filter.search, mode: 'insensitive' } },
          { description: { contains: filter.search, mode: 'insensitive' } }
        ];
      }
    }

    const [contents, total] = await Promise.all([
      prisma.content.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              avatar: true
            }
          },
          _count: {
            select: {
              likes: true,
              comments: true,
              pins: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.content.count({ where })
    ]);

    return {
      items: contents.map(c => this.toEntity(c)),
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async hasPurchases(contentId: string): Promise<boolean> {
    if (process.env.NODE_ENV !== 'production') {
      console.log('🗄️ ContentRepositoryPrisma: hasPurchases', contentId);
    }

    const purchaseCount = await prisma.purchase.count({
      where: {
        contentId,
        status: 'completed' // Solo contar compras completadas
      }
    });

    return purchaseCount > 0;
  }

  async unlist(id: string): Promise<boolean> {
    if (process.env.NODE_ENV !== 'production') {
      console.log('🗄️ ContentRepositoryPrisma: unlist (borrado lógico)', id);
    }

    try {
      await prisma.content.update({
        where: { id },
        data: {
          isListed: false,
          deletedAt: new Date()
        }
      });
      return true;
    } catch (error) {
      console.error('Error unlisting content:', error);
      return false;
    }
  }

  // Helper para convertir modelo Prisma a Entity
  private toEntity(content: any): ContentEntity {
    return new ContentEntity(
      content.id,                           // id
      content.title,                        // title
      content.description,                  // description
      content.authorId,                     // author (ID del autor)
      content.author?.username || 'Unknown', // authorUsername
      content.price,                        // price
      content.currency,                     // currency
      content.contentType,                  // contentType
      content.tags || [],                   // tags
      content.isPublished,                  // isPublished
      content.coverImage,                   // coverImage (opcional)
      content.files as string[],            // files (opcional)
      content._count?.likes || 0,           // likes (opcional)
      content.views || 0,                   // views (opcional)
      content.downloads || 0,               // downloads (opcional)
      content._count?.pins || 0,            // pins (opcional)
      content.author?.avatar,               // authorAvatar (opcional)
      content.authorId,                     // authorId (opcional)
      content.shortDescription,             // shortDescription (opcional)
      content.createdAt,                    // createdAt (opcional)
      content.updatedAt                     // updatedAt (opcional)
    );
  }
}
