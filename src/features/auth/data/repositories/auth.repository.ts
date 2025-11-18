// Auth Repository Factory
import { IAuthRepository } from '../../domain/repositories/auth.repository.interface';
import { AuthRepositoryLocal } from './auth.repository.local';

export function createAuthRepository(): IAuthRepository {
  return new AuthRepositoryLocal();
}

