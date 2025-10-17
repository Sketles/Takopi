// Auth Repository Factory - Crea la implementación correcta según el flag LOCAL
import { IAuthRepository } from '../../domain/repositories/auth.repository.interface';
import { AuthRepositoryLocal } from './auth.repository.local';
import { AuthRepositoryMongo } from './auth.repository.mongo';
import { isLocalMode } from '@/shared/config/storage.config';

export function createAuthRepository(): IAuthRepository {
  const useLocal = isLocalMode();
  
  console.log(`🏭 AuthRepositoryFactory: Creando repository (modo: ${useLocal ? 'LOCAL' : 'MONGO'})`);
  
  if (useLocal) {
    return new AuthRepositoryLocal();
  }
  
  // TODO: Implementar MongoDB repository cuando se active MongoDB
  throw new Error('MongoDB repository not implemented yet. Use LOCAL=true for now.');
}

// Export para facilitar el uso
export { IAuthRepository } from '../../domain/repositories/auth.repository.interface';

