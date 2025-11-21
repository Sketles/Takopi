// Toggle Pin UseCase
import { IPinRepository } from '../repositories/pin.repository.interface';

export class TogglePinUseCase {
  constructor(private repository: IPinRepository) {}

  async execute(userId: string, contentId: string, isPublic: boolean = true): Promise<{
    pinned: boolean;
    pinsCount: number;
  }> {
    console.log('🎯 TogglePinUseCase:', { userId, contentId, isPublic });

    // Validaciones
    if (!userId || !contentId) {
      throw new Error('userId y contentId son requeridos');
    }

    // Verificar si ya existe el pin
    const existingPin = await this.repository.findByUserAndContent(userId, contentId);

    let pinned: boolean;

    if (existingPin) {
      // Si existe, eliminarlo (deshacer pin)
      await this.repository.delete(userId, contentId);
      pinned = false;
      console.log('✅ Pin eliminado');
    } else {
      // Si no existe, crearlo
      await this.repository.create(userId, contentId, isPublic);
      pinned = true;
      console.log('✅ Pin creado');
    }

    // Obtener conteo actualizado
    const pinsCount = await this.repository.countByContent(contentId);

    return {
      pinned,
      pinsCount
    };
  }
}
