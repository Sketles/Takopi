// Auth Repository Factory
import { IAuthRepository } from '../../domain/repositories/auth.repository.interface';
import { AuthRepositoryPrisma } from './auth.repository.prisma';

export function createAuthRepository(): IAuthRepository {
  return new AuthRepositoryPrisma();
}

