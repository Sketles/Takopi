// Get User Purchases UseCase - Obtener compras del usuario
import { IUserRepository } from '../repositories/user.repository.interface';
import { UserPurchase } from '@/types/cart';
import { logger } from '@/lib/logger';

export class GetUserPurchasesUseCase {
  constructor(private repository: IUserRepository) {}

  async execute(userId: string): Promise<UserPurchase[]> {
    logger.info('GetUserPurchasesUseCase: Obteniendo compras', { userId });

    // Validaciones de negocio
    if (!userId || userId.trim().length === 0) {
      throw new Error('ID de usuario es requerido');
    }

    // Obtener compras del usuario
    const purchases = await this.repository.getUserPurchases(userId);

    logger.info('Compras obtenidas', { count: purchases.length });
    return purchases;
  }
}

