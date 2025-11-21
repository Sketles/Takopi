// Create Collection Use Case
import { ICollectionRepository } from '../repositories/collection.repository.interface';
import { CollectionEntity } from '../entities/collection.entity';

export class CreateCollectionUseCase {
  constructor(private repository: ICollectionRepository) {}

  async execute(userId: string, title: string, description: string | null, isPublic: boolean): Promise<CollectionEntity> {
    if (!title || title.trim().length === 0) {
      throw new Error('El título es obligatorio');
    }

    if (title.length > 50) {
      throw new Error('El título no puede tener más de 50 caracteres');
    }

    if (description && description.length > 200) {
      throw new Error('La descripción no puede tener más de 200 caracteres');
    }

    return await this.repository.create(userId, title.trim(), description?.trim() || null, isPublic);
  }
}
