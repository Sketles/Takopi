// Remove Item from Collection Use Case
import { ICollectionRepository } from '../repositories/collection.repository.interface';

export class RemoveItemFromCollectionUseCase {
  constructor(private repository: ICollectionRepository) {}

  async execute(collectionId: string, contentId: string, userId: string): Promise<boolean> {
    const collection = await this.repository.findById(collectionId);

    if (!collection) {
      throw new Error('Colección no encontrada');
    }

    if (!collection.isOwnedBy(userId)) {
      throw new Error('No tienes permiso para modificar esta colección');
    }

    return await this.repository.removeItem(collectionId, contentId);
  }
}
