// Get User Purchases UseCase - Obtener compras del usuario
import { IUserRepository } from '../repositories/user.repository.interface';

export class GetUserPurchasesUseCase {
  constructor(private repository: IUserRepository) {}

  async execute(userId: string): Promise<any[]> {
    console.log('🎯 GetUserPurchasesUseCase: Obteniendo compras', userId);

    // Validaciones de negocio
    if (!userId || userId.trim().length === 0) {
      throw new Error('ID de usuario es requerido');
    }

    // Obtener compras del usuario
    const purchases = await this.repository.getUserPurchases(userId);

    console.log('✅ Compras obtenidas:', purchases.length);
    return purchases;
  }
}

