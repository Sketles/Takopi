// Comment Repository Factory - Selecciona implementación según configuración
import { ICommentRepository } from '../../domain/repositories/comment.repository.interface';
import { CommentRepositoryLocal } from './comment.repository.local';
import { isLocalMode } from '@/shared/config/storage.config';

export function createCommentRepository(): ICommentRepository {
  const useLocal = isLocalMode();

  console.log(`🏭 CommentRepositoryFactory: Creando repository (modo: ${useLocal ? 'LOCAL' : 'MONGO'})`);

  if (useLocal) {
    return new CommentRepositoryLocal();
  }

  // TODO: Implementar MongoDB repository cuando se active MongoDB
  throw new Error('MongoDB repository not implemented yet. Use LOCAL=true for now.');
}

// Export para facilitar el uso
export { ICommentRepository } from '../../domain/repositories/comment.repository.interface';
