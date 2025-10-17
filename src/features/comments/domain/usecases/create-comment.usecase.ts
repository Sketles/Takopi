// Create Comment UseCase - Crear comentario
import { CommentEntity } from '../entities/comment.entity';
import { ICommentRepository, CreateCommentDTO } from '../repositories/comment.repository.interface';

export class CreateCommentUseCase {
  constructor(private repository: ICommentRepository) {}

  async execute(data: CreateCommentDTO): Promise<CommentEntity> {
    // Validaciones de negocio
    if (!data.contentId || data.contentId.trim().length === 0) {
      throw new Error('ID de contenido es requerido');
    }

    if (!data.userId || data.userId.trim().length === 0) {
      throw new Error('ID de usuario es requerido');
    }

    if (!data.username || data.username.trim().length === 0) {
      throw new Error('Nombre de usuario es requerido');
    }

    if (!data.text || data.text.trim().length === 0) {
      throw new Error('El texto del comentario es requerido');
    }

    if (data.text.length > 1000) {
      throw new Error('El comentario no puede exceder 1000 caracteres');
    }

    // Crear comentario
    const comment = await this.repository.create({
      contentId: data.contentId,
      userId: data.userId,
      username: data.username,
      userAvatar: data.userAvatar,
      text: data.text.trim()
    });

    return comment;
  }
}
