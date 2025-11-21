// Collection Repository Factory
import { ICollectionRepository } from '../../domain/repositories/collection.repository.interface';
import { CollectionRepositoryPrisma } from './collection.repository.prisma';

export function createCollectionRepository(): ICollectionRepository {
  return new CollectionRepositoryPrisma();
}
