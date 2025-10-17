// Get User Creations UseCase - Obtener contenido creado por usuario
import { IUserRepository } from '../repositories/user.repository.interface';

export class GetUserCreationsUseCase {
  constructor(private repository: IUserRepository) {}

  async execute(userId: string): Promise<any[]> {
    console.log('🎯 GetUserCreationsUseCase: Obteniendo creaciones', userId);

    // Validaciones de negocio
    if (!userId || userId.trim().length === 0) {
      throw new Error('ID de usuario es requerido');
    }

    // Obtener creaciones del usuario
    const creations = await this.repository.getUserCreations(userId);

    console.log('✅ Creaciones obtenidas:', creations.length);
    return creations;
  }
}

