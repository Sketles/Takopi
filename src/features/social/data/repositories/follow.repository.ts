// Follow Repository Factory - Crea la implementación correcta según el flag LOCAL
import { IFollowRepository } from '../../domain/repositories/follow.repository.interface';
import { FollowRepositoryLocal } from './follow.repository.local';
import { isLocalMode } from '@/shared/config/storage.config';

export function createFollowRepository(): IFollowRepository {
  const useLocal = isLocalMode();
  
  console.log(`🏭 FollowRepositoryFactory: Creando repository (modo: ${useLocal ? 'LOCAL' : 'MONGO'})`);
  
  if (useLocal) {
    return new FollowRepositoryLocal();
  }
  
  // TODO: Implementar FollowRepositoryMongo cuando se active MongoDB
  throw new Error('MongoDB repository for follows not implemented yet');
}

// Export para facilitar el uso
export { IFollowRepository } from '../../domain/repositories/follow.repository.interface';

