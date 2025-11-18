// Follow Repository Factory
import { IFollowRepository } from '../../domain/repositories/follow.repository.interface';
import { FollowRepositoryLocal } from './follow.repository.local';

export function createFollowRepository(): IFollowRepository {
  return new FollowRepositoryLocal();
}

