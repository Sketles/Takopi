// User Repository Factory
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { UserRepositoryPrisma } from './user.repository.prisma';

export function createUserRepository(): IUserRepository {
  return new UserRepositoryPrisma();
}

