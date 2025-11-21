// Get Comments UseCase - Obtener comentarios de un contenido
import { CommentEntity } from '../entities/comment.entity';
import { ICommentRepository } from '../repositories/comment.repository.interface';

export class GetCommentsUseCase {
  constructor(private repository: ICommentRepository) {}

  async execute(contentId: string, userId?: string): Promise<CommentEntity[]> {
    // Validaciones de negocio
    if (!contentId || contentId.trim().length === 0) {
      throw new Error('ID de contenido es requerido');
    }

    // Obtener comentarios
    const comments = await this.repository.findByContentId(contentId);

    // Marcar comentarios como "liked" por el usuario actual si userId está presente
    const enrichedComments = comments.map(comment => {
      if (userId && comment.likedBy.includes(userId)) {
        return new CommentEntity(
          comment.id,
          comment.contentId,
          comment.userId,
          comment.username,
          comment.text,
          comment.likes,
          comment.likedBy,
          true, // isLiked = true
          comment.parentId,
          comment.createdAt,
          comment.updatedAt,
          comment.userAvatar
        );
      }
      return comment;
    });

    // Ordenar por fecha de creación (más recientes primero)
    return enrichedComments.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
}
