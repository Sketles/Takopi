// Toggle Like UseCase - Dar o quitar like
import { LikeEntity } from '../entities/like.entity';
import { ILikeRepository } from '../repositories/like.repository.interface';

export class ToggleLikeUseCase {
  constructor(private repository: ILikeRepository) {}

  async execute(userId: string, contentId: string): Promise<{ liked: boolean; likesCount: number }> {
    console.log('🎯 ToggleLikeUseCase: Toggle like', { userId, contentId });

    // Validaciones
    if (!userId || !contentId) {
      throw new Error('Usuario y contenido son requeridos');
    }

    // Verificar si ya existe el like
    const existingLike = await this.repository.findByUserAndContent(userId, contentId);

    if (existingLike) {
      // Quitar like
      await this.repository.delete(existingLike.id);
      const likesCount = await this.repository.countByContent(contentId);
      console.log('✅ Like removido');
      return { liked: false, likesCount };
    } else {
      // Agregar like
      await this.repository.create({ userId, contentId });
      const likesCount = await this.repository.countByContent(contentId);
      console.log('✅ Like agregado');
      return { liked: true, likesCount };
    }
  }
}

