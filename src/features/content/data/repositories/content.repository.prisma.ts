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
        status: 'published'
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
            comments: true
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
            comments: true
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
        status: 'published'
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
            comments: true
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
            comments: true
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
        status: 'published'
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
            comments: true
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
        category: data.category,
        files: data.files || [],
        coverImage: data.coverImage,
        additionalImages: data.additionalImages || [],
        price: data.price || 0,
        currency: data.currency || 'CLP',
        isFree: data.isFree || false,
        license: data.license || 'personal',
        customLicense: data.customLicense,
        visibility: data.visibility || 'public',
        status: data.status || 'draft',
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
            comments: true
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
    if (data.category !== undefined) updateData.category = data.category;
    if (data.files !== undefined) updateData.files = data.files;
    if (data.coverImage !== undefined) updateData.coverImage = data.coverImage;
    if (data.additionalImages !== undefined) updateData.additionalImages = data.additionalImages;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.currency !== undefined) updateData.currency = data.currency;
    if (data.isFree !== undefined) updateData.isFree = data.isFree;
    if (data.license !== undefined) updateData.license = data.license;
    if (data.customLicense !== undefined) updateData.customLicense = data.customLicense;
    if (data.visibility !== undefined) updateData.visibility = data.visibility;
    if (data.status !== undefined) updateData.status = data.status;
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
            comments: true
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
      if (filter.category) where.category = filter.category;
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
              comments: true
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

  // Helper para convertir modelo Prisma a Entity
  private toEntity(content: any): ContentEntity {
    return {
      id: content.id,
      title: content.title,
      description: content.description,
      shortDescription: content.shortDescription,
      contentType: content.contentType,
      category: content.category,
      files: content.files as any[],
      coverImage: content.coverImage,
      additionalImages: content.additionalImages as string[],
      price: content.price,
      currency: content.currency,
      isFree: content.isFree,
      license: content.license,
      customLicense: content.customLicense,
      visibility: content.visibility,
      status: content.status,
      isPublished: content.isPublished,
      tags: content.tags,
      customTags: content.customTags,
      views: content.views,
      downloads: content.downloads,
      createdAt: content.createdAt.toISOString(),
      updatedAt: content.updatedAt.toISOString(),
      publishedAt: content.publishedAt?.toISOString(),
      author: content.author?.username || 'Unknown',
      authorId: content.authorId,
      authorAvatar: content.author?.avatar,
      likes: content._count?.likes || 0,
      comments: content._count?.comments || 0
    } as ContentEntity;
  }
}
