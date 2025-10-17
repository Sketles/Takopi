// Comment Repository Interface - Contrato para operaciones de comentarios
import { CommentEntity } from '../entities/comment.entity';

export interface CreateCommentDTO {
  contentId: string;
  userId: string;
  username: string;
  userAvatar?: string;
  text: string;
}

export interface ICommentRepository {
  // CRUD básico
  create(data: CreateCommentDTO): Promise<CommentEntity>;
  findById(id: string): Promise<CommentEntity | null>;
  findByContentId(contentId: string): Promise<CommentEntity[]>;
  update(id: string, data: Partial<CreateCommentDTO>): Promise<CommentEntity | null>;
  delete(id: string): Promise<boolean>;
  
  // Operaciones específicas
  toggleLike(commentId: string, userId: string): Promise<CommentEntity | null>;
  getCommentLikes(commentId: string): Promise<number>;
}
