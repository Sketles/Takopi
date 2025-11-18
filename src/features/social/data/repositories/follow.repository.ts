// Follow Repository Factory
import { IFollowRepository } from '../../domain/repositories/follow.repository.interface';
import { FollowRepositoryPrisma } from './follow.repository.prisma';

export function createFollowRepository(): IFollowRepository {
  return new FollowRepositoryPrisma();
}

