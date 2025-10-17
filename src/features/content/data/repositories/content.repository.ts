// Content Repository Factory - Crea la implementación correcta según el flag LOCAL
import { IContentRepository } from '../../domain/repositories/content.repository.interface';
import { ContentRepositoryLocal } from './content.repository.local';
import { ContentRepositoryMongo } from './content.repository.mongo';
import { isLocalMode } from '@/shared/config/storage.config';

export function createContentRepository(): IContentRepository {
  const useLocal = isLocalMode();
  
  console.log(`🏭 ContentRepositoryFactory: Creando repository (modo: ${useLocal ? 'LOCAL' : 'MONGO'})`);
  
  if (useLocal) {
    return new ContentRepositoryLocal();
  }
  
  // TODO: Implementar MongoDB repository cuando se active MongoDB
  throw new Error('MongoDB repository not implemented yet. Use LOCAL=true for now.');
}

// Export para facilitar el uso
export { IContentRepository } from '../../domain/repositories/content.repository.interface';

