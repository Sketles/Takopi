// Update Profile UseCase - Actualizar perfil de usuario
import { UserEntity } from '../entities/user.entity';
import { IAuthRepository } from '../repositories/auth.repository.interface';

export interface UpdateProfileDTO {
  username?: string;
  bio?: string;
  role?: string;
  avatar?: string;
  banner?: string;
  location?: string;
}

export class UpdateProfileUseCase {
  constructor(private repository: IAuthRepository) {}

  async execute(userId: string, data: UpdateProfileDTO): Promise<UserEntity> {
    console.log('🎯 UpdateProfileUseCase: Actualizando perfil', userId);

    // Validaciones de negocio
    if (data.username !== undefined && data.username.length < 3) {
      throw new Error('El nombre de usuario debe tener al menos 3 caracteres');
    }

    if (data.bio && data.bio.length > 500) {
      throw new Error('La descripción no puede exceder 500 caracteres');
    }

    if (data.location && data.location.length > 100) {
      throw new Error('La ubicación no puede exceder 100 caracteres');
    }

    const validRoles = ['Explorer', 'Artist', 'Buyer', 'Maker', 'admin', 'creator', 'user'];
    if (data.role && !validRoles.includes(data.role)) {
      throw new Error('Rol inválido');
    }

    // Verificar si el username ya existe (si se está actualizando)
    if (data.username !== undefined) {
      const existingUser = await this.repository.findUserByUsername(data.username);
      if (existingUser && existingUser.id !== userId) {
        throw new Error('El nombre de usuario ya está en uso');
      }
    }

    // Actualizar perfil
    console.log('🎯 UpdateProfileUseCase: Ejecutando updateProfile...');
    const updatedUser = await this.repository.updateProfile(userId, data);

    if (!updatedUser) {
      console.log('❌ UpdateProfileUseCase: Usuario no encontrado después de actualizar');
      throw new Error('Usuario no encontrado');
    }

    console.log('✅ Perfil actualizado:', updatedUser.id);
    return updatedUser;
  }
}

