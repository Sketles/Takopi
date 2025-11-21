// Delete Collection Use Case
import { ICollectionRepository } from '../repositories/collection.repository.interface';

export class DeleteCollectionUseCase {
  constructor(private repository: ICollectionRepository) {}

  async execute(collectionId: string, userId: string): Promise<boolean> {
    const collection = await this.repository.findById(collectionId);

    if (!collection) {
      throw new Error('Colección no encontrada');
    }

    if (!collection.isOwnedBy(userId)) {
      throw new Error('No tienes permiso para eliminar esta colección');
    }

    return await this.repository.delete(collectionId);
  }
}
