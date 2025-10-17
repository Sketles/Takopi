// User Repository Factory - Crea la implementación correcta según el flag LOCAL
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { UserRepositoryLocal } from './user.repository.local';
import { isLocalMode } from '@/shared/config/storage.config';

export function createUserRepository(): IUserRepository {
  const useLocal = isLocalMode();
  
  console.log(`🏭 UserRepositoryFactory: Creando repository (modo: ${useLocal ? 'LOCAL' : 'MONGO'})`);
  
  if (useLocal) {
    return new UserRepositoryLocal();
  }
  
  // TODO: Implementar UserRepositoryMongo cuando se active MongoDB
  throw new Error('MongoDB repository for users not implemented yet');
}

// Export para facilitar el uso
export { IUserRepository } from '../../domain/repositories/user.repository.interface';

