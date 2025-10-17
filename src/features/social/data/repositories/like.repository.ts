// Like Repository Factory
import { ILikeRepository } from '../../domain/repositories/like.repository.interface';
import { LikeRepositoryLocal } from './like.repository.local';
import { isLocalMode } from '@/shared/config/storage.config';

export function createLikeRepository(): ILikeRepository {
  const useLocal = isLocalMode();
  
  console.log(`🏭 LikeRepositoryFactory: Creando repository (modo: ${useLocal ? 'LOCAL' : 'MONGO'})`);
  
  if (useLocal) {
    return new LikeRepositoryLocal();
  }
  
  throw new Error('MongoDB repository for likes not implemented yet');
}

export { ILikeRepository } from '../../domain/repositories/like.repository.interface';

