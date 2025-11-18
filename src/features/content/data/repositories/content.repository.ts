// Content Repository Factory
import { IContentRepository } from '../../domain/repositories/content.repository.interface';
import { ContentRepositoryLocal } from './content.repository.local';

export function createContentRepository(): IContentRepository {
  return new ContentRepositoryLocal();
}

