// User Repository Factory
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { UserRepositoryLocal } from './user.repository.local';

export function createUserRepository(): IUserRepository {
  return new UserRepositoryLocal();
}

