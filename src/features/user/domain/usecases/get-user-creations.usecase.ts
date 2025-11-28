// Get User Creations UseCase - Obtener contenido creado por usuario
import { IUserRepository } from '../repositories/user.repository.interface';
import { UserCreation } from '@/types/cart';
import { logger } from '@/lib/logger';

export class GetUserCreationsUseCase {
  constructor(private repository: IUserRepository) {}

  async execute(userId: string): Promise<UserCreation[]> {
    logger.info('GetUserCreationsUseCase: Obteniendo creaciones', { userId });

    // Validaciones de negocio
    if (!userId || userId.trim().length === 0) {
      throw new Error('ID de usuario es requerido');
    }

    // Obtener creaciones del usuario
    const creations = await this.repository.getUserCreations(userId);

    logger.info('Creaciones obtenidas', { count: creations.length });
    return creations;
  }
}

