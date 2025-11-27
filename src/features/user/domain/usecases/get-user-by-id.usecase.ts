// Get User By ID UseCase - Obtener perfil público de usuario
import { UserProfileEntity } from '../entities/user-profile.entity';
import { IUserRepository } from '../repositories/user.repository.interface';
import { logger } from '@/lib/logger';

export class GetUserByIdUseCase {
  constructor(private repository: IUserRepository) {}

  async execute(userId: string): Promise<UserProfileEntity | null> {
    console.log('🎯 GetUserByIdUseCase: Obteniendo perfil público', userId);

    // Validaciones de negocio
    if (!userId || userId.trim().length === 0) {
      throw new Error('ID de usuario es requerido');
    }

    // Obtener perfil público
    const profile = await this.repository.getPublicProfile(userId);

    if (!profile) {
      console.log('⚠️  Usuario no encontrado:', userId);
      return null;
    }

    console.log('✅ Perfil obtenido:', profile.id);
    return profile;
  }
}

