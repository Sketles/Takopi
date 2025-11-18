// Like Repository Factory
import { ILikeRepository } from '../../domain/repositories/like.repository.interface';
import { LikeRepositoryLocal } from './like.repository.local';

export function createLikeRepository(): ILikeRepository {
  return new LikeRepositoryLocal();
}

