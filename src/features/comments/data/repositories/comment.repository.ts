// Comment Repository Factory
import { ICommentRepository } from '../../domain/repositories/comment.repository.interface';
import { CommentRepositoryLocal } from './comment.repository.local';

export function createCommentRepository(): ICommentRepository {
  return new CommentRepositoryLocal();
}
