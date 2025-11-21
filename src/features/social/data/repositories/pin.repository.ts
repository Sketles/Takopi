// Pin Repository Factory
import { IPinRepository } from '../../domain/repositories/pin.repository.interface';
import { PinRepositoryPrisma } from './pin.repository.prisma';

export function createPinRepository(): IPinRepository {
  return new PinRepositoryPrisma();
}
