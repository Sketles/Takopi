// Toggle Comment Like UseCase - Dar/quitar like a comentario
import { CommentEntity } from '../entities/comment.entity';
import { ICommentRepository } from '../repositories/comment.repository.interface';

export class ToggleCommentLikeUseCase {
  constructor(private repository: ICommentRepository) {}

  async execute(commentId: string, userId: string): Promise<CommentEntity | null> {
    // Validaciones de negocio
    if (!commentId || commentId.trim().length === 0) {
      throw new Error('ID de comentario es requerido');
    }

    if (!userId || userId.trim().length === 0) {
      throw new Error('ID de usuario es requerido');
    }

    // Toggle like
    const updatedComment = await this.repository.toggleLike(commentId, userId);

    if (!updatedComment) {
      throw new Error('Comentario no encontrado');
    }

    return updatedComment;
  }
}
