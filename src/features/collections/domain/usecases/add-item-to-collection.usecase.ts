// Add Item to Collection Use Case
import { ICollectionRepository } from '../repositories/collection.repository.interface';
import { CollectionItemEntity } from '../entities/collection-item.entity';

export class AddItemToCollectionUseCase {
  constructor(private repository: ICollectionRepository) {}

  async execute(collectionId: string, contentId: string, userId: string): Promise<CollectionItemEntity> {
    const collection = await this.repository.findById(collectionId);

    if (!collection) {
      throw new Error('Colección no encontrada');
    }

    if (!collection.isOwnedBy(userId)) {
      throw new Error('No tienes permiso para modificar esta colección');
    }

    // Check if item already exists
    const exists = await this.repository.isItemInCollection(collectionId, contentId);
    if (exists) {
      throw new Error('Este producto ya está en la colección');
    }

    return await this.repository.addItem(collectionId, contentId);
  }
}
