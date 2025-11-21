// Get User Stats UseCase - Obtener estadísticas del usuario
import { IUserRepository } from '../repositories/user.repository.interface';

export interface UserStats {
  contentCount: number;
  purchaseCount: number;
  followersCount: number;
  followingCount: number;
  totalViews: number;
  totalLikes: number;
  totalDownloads: number;
  collectionsCount: number;
}

export class GetUserStatsUseCase {
  constructor(private repository: IUserRepository) {}

  async execute(userId: string): Promise<UserStats> {
    console.log('🎯 GetUserStatsUseCase: Obteniendo estadísticas', userId);

    // Validaciones de negocio
    if (!userId || userId.trim().length === 0) {
      throw new Error('ID de usuario es requerido');
    }

    // Obtener estadísticas básicas
    const basicStats = await this.repository.getUserStats(userId);

    // Calcular estadísticas adicionales
    const stats: UserStats = {
      contentCount: basicStats.contentCount,
      purchaseCount: basicStats.purchaseCount,
      followersCount: basicStats.followersCount,
      followingCount: basicStats.followingCount,
      collectionsCount: basicStats.collectionsCount,
      totalLikes: basicStats.totalLikes,
      totalViews: 0, // TODO: Calcular desde contenido
      totalDownloads: 0 // TODO: Calcular desde purchases
    };

    console.log('✅ Estadísticas obtenidas:', userId);
    return stats;
  }
}

