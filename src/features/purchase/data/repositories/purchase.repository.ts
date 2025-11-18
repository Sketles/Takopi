// Purchase Repository Factory
import { IPurchaseRepository } from '../../domain/repositories/purchase.repository.interface';
import { PurchaseRepositoryPrisma } from './purchase.repository.prisma';

export function createPurchaseRepository(): IPurchaseRepository {
  return new PurchaseRepositoryPrisma();
}

