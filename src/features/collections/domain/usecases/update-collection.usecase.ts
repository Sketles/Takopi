// Update Collection Use Case
import { ICollectionRepository } from '../repositories/collection.repository.interface';
import { CollectionEntity } from '../entities/collection.entity';

export class UpdateCollectionUseCase {
  constructor(private repository: ICollectionRepository) {}

  async execute(
    collectionId: string,
    userId: string,
    data: { title?: string; description?: string | null; isPublic?: boolean }
  ): Promise<CollectionEntity> {
    const collection = await this.repository.findById(collectionId);

    if (!collection) {
      throw new Error('Colección no encontrada');
    }

    if (!collection.isOwnedBy(userId)) {
      throw new Error('No tienes permiso para editar esta colección');
    }

    if (data.title !== undefined) {
      if (!data.title || data.title.trim().length === 0) {
        throw new Error('El título es obligatorio');
      }
      if (data.title.length > 50) {
        throw new Error('El título no puede tener más de 50 caracteres');
      }
    }

    if (data.description !== undefined && data.description && data.description.length > 200) {
      throw new Error('La descripción no puede tener más de 200 caracteres');
    }

    const updated = await this.repository.update(collectionId, data);

    if (!updated) {
      throw new Error('Error al actualizar la colección');
    }

    return updated;
  }
}
