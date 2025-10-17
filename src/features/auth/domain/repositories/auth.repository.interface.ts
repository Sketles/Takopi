// Auth Repository Interface - Contrato para autenticación
import { UserEntity } from '../entities/user.entity';

export interface LoginResult {
  user: UserEntity;
  token: string;
}

export interface IAuthRepository {
  login(email: string, password: string): Promise<LoginResult>;
  register(username: string, email: string, password: string, role: string): Promise<LoginResult>;
  verifyToken(token: string): Promise<UserEntity | null>;
  findUserByEmail(email: string): Promise<UserEntity | null>;
  findUserByUsername(username: string): Promise<UserEntity | null>;
  findUserById(id: string): Promise<UserEntity | null>;
  updateProfile(userId: string, data: any): Promise<UserEntity | null>;
}

