// Purchase Repository Factory - Crea la implementación correcta según el flag LOCAL
import { IPurchaseRepository } from '../../domain/repositories/purchase.repository.interface';
import { PurchaseRepositoryLocal } from './purchase.repository.local';
import { isLocalMode } from '@/shared/config/storage.config';

export function createPurchaseRepository(): IPurchaseRepository {
  const useLocal = isLocalMode();
  
  console.log(`🏭 PurchaseRepositoryFactory: Creando repository (modo: ${useLocal ? 'LOCAL' : 'MONGO'})`);
  
  if (useLocal) {
    return new PurchaseRepositoryLocal();
  }
  
  // TODO: Implementar PurchaseRepositoryMongo cuando se active MongoDB
  throw new Error('MongoDB repository for purchases not implemented yet');
}

// Export para facilitar el uso
export { IPurchaseRepository } from '../../domain/repositories/purchase.repository.interface';

