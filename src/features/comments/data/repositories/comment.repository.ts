// Comment Repository Factory
import { ICommentRepository } from '../../domain/repositories/comment.repository.interface';
import { CommentRepositoryPrisma } from './comment.repository.prisma';

export function createCommentRepository(): ICommentRepository {
  return new CommentRepositoryPrisma();
}
