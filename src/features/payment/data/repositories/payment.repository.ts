// Payment Repository Factory - Crea la implementación correcta según el flag LOCAL
import { IPaymentRepository } from '../../domain/repositories/payment.repository.interface';
import { PaymentRepositoryLocal } from './payment.repository.local';
import { isLocalMode } from '@/shared/config/storage.config';

export function createPaymentRepository(): IPaymentRepository {
  const useLocal = isLocalMode();
  
  console.log(`🏭 PaymentRepositoryFactory: Creando repository (modo: ${useLocal ? 'LOCAL' : 'MONGO'})`);
  
  if (useLocal) {
    return new PaymentRepositoryLocal();
  }
  
  // TODO: Implementar PaymentRepositoryMongo cuando se active MongoDB
  throw new Error('MongoDB repository for payments not implemented yet');
}

// Export para facilitar el uso
export { IPaymentRepository } from '../../domain/repositories/payment.repository.interface';

