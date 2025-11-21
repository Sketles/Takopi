// User Repository Interface - Contrato para operaciones de usuario
import { UserEntity } from '@/features/auth/domain/entities/user.entity';
import { UserProfileEntity } from '../entities/user-profile.entity';

export interface IUserRepository {
  // Operaciones básicas (heredadas de Auth)
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  
  // Operaciones específicas de User
  getPublicProfile(userId: string): Promise<UserProfileEntity | null>;
  getUserStats(userId: string): Promise<{
    contentCount: number;
    purchaseCount: number;
    followersCount: number;
    followingCount: number;
    collectionsCount: number;
    totalLikes: number;
  }>;
  getUserCreations(userId: string): Promise<any[]>;
  getUserPurchases(userId: string): Promise<any[]>;
}

