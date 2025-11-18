// Content Repository Factory
import { IContentRepository } from '../../domain/repositories/content.repository.interface';
import { ContentRepositoryPrisma } from './content.repository.prisma';

export function createContentRepository(): IContentRepository {
  return new ContentRepositoryPrisma();
}

