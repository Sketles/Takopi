// Purchase Repository Factory
import { IPurchaseRepository } from '../../domain/repositories/purchase.repository.interface';
import { PurchaseRepositoryLocal } from './purchase.repository.local';

export function createPurchaseRepository(): IPurchaseRepository {
  return new PurchaseRepositoryLocal();
}

