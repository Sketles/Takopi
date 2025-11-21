// Comment Repository Prisma Implementation
import { ICommentRepository } from '../../domain/repositories/comment.repository.interface';
import { CommentEntity } from '../../domain/entities/comment.entity';
import prisma from '@/lib/prisma';

export class CommentRepositoryPrisma implements ICommentRepository {
  async create(data: any): Promise<CommentEntity> {
    console.log('🗄️ CommentRepositoryPrisma: create');
    
    const comment = await prisma.comment.create({
      data: {
        text: data.text,
        contentId: data.contentId,
        userId: data.userId
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        }
      }
    });

    return this.toEntity(comment);
  }

  async findById(id: string): Promise<CommentEntity | null> {
    console.log('🗄️ CommentRepositoryPrisma: findById', id);
    
    const comment = await prisma.comment.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        }
      }
    });

    return comment ? this.toEntity(comment) : null;
  }

  async findByContentId(contentId: string): Promise<CommentEntity[]> {
    console.log('🗄️ CommentRepositoryPrisma: findByContentId', contentId);
    
    const comments = await prisma.comment.findMany({
      where: { contentId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return comments.map(c => this.toEntity(c));
  }

  async update(id: string, data: any): Promise<CommentEntity | null> {
    console.log('🗄️ CommentRepositoryPrisma: update', id);
    
    const comment = await prisma.comment.update({
      where: { id },
      data: {
        text: data.text
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        }
      }
    });

    return this.toEntity(comment);
  }

  async delete(id: string): Promise<boolean> {
    console.log('🗄️ CommentRepositoryPrisma: delete', id);
    
    try {
      await prisma.comment.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      console.error('Error deleting comment:', error);
      return false;
    }
  }

  async toggleLike(commentId: string, userId: string): Promise<CommentEntity | null> {
    console.log('🗄️ CommentRepositoryPrisma: toggleLike', commentId, userId);
    
    const comment = await prisma.comment.findUnique({
      where: { id: commentId }
    });

    if (!comment) return null;

    const likedBy = comment.likedBy || [];
    const hasLiked = likedBy.includes(userId);

    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: {
        likedBy: hasLiked
          ? likedBy.filter(id => id !== userId)
          : [...likedBy, userId],
        likeCount: hasLiked ? comment.likeCount - 1 : comment.likeCount + 1
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        }
      }
    });

    return this.toEntity(updatedComment);
  }

  async getCommentLikes(commentId: string): Promise<number> {
    console.log('🗄️ CommentRepositoryPrisma: getCommentLikes', commentId);
    
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { likeCount: true }
    });

    return comment?.likeCount || 0;
  }

  private toEntity(comment: any): CommentEntity {
    return {
      id: comment.id,
      text: comment.text,
      contentId: comment.contentId,
      userId: comment.userId,
      username: comment.user?.username || 'Unknown',
      userAvatar: comment.user?.avatar,
      likeCount: comment.likeCount,
      likedBy: comment.likedBy,
      createdAt: comment.createdAt instanceof Date ? comment.createdAt : new Date(comment.createdAt),
      updatedAt: comment.updatedAt instanceof Date ? comment.updatedAt : new Date(comment.updatedAt)
    } as CommentEntity;
  }
}
