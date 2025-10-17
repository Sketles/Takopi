// Toggle Follow UseCase - Seguir/dejar de seguir usuario
import { FollowEntity } from '../entities/follow.entity';
import { IFollowRepository } from '../repositories/follow.repository.interface';

export class ToggleFollowUseCase {
  constructor(private repository: IFollowRepository) {}

  async execute(followerId: string, followingId: string): Promise<{ isFollowing: boolean; follow?: FollowEntity }> {
    console.log('🎯 ToggleFollowUseCase: Toggle follow', { followerId, followingId });

    // Validaciones de negocio
    if (!followerId || followerId.trim().length === 0) {
      throw new Error('ID del seguidor es requerido');
    }

    if (!followingId || followingId.trim().length === 0) {
      throw new Error('ID del usuario a seguir es requerido');
    }

    if (followerId === followingId) {
      throw new Error('No puedes seguirte a ti mismo');
    }

    // Verificar si ya existe el follow
    const existingFollow = await this.repository.findByUsers(followerId, followingId);

    if (existingFollow) {
      // Si existe, eliminarlo (dejar de seguir)
      const deleted = await this.repository.delete(existingFollow.id);
      if (deleted) {
        console.log('✅ Follow eliminado (dejar de seguir)');
        return { isFollowing: false };
      } else {
        throw new Error('Error al dejar de seguir');
      }
    } else {
      // Si no existe, crearlo (seguir)
      const newFollow = await this.repository.create({
        followerId,
        followingId,
        createdAt: new Date()
      });

      if (!newFollow) {
        throw new Error('Error al seguir usuario');
      }

      console.log('✅ Follow creado (seguir)');
      return { isFollowing: true, follow: newFollow };
    }
  }
}

