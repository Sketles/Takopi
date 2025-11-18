// Like Repository Factory
import { ILikeRepository } from '../../domain/repositories/like.repository.interface';
import { LikeRepositoryPrisma } from './like.repository.prisma';

export function createLikeRepository(): ILikeRepository {
  return new LikeRepositoryPrisma();
}

