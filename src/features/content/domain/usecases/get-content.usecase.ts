// Get Content UseCase - Caso de uso para obtener contenido
import { ContentEntity } from '../entities/content.entity';
import { IContentRepository } from '../repositories/content.repository.interface';

export class GetContentUseCase {
  constructor(private repository: IContentRepository) {}

  async execute(category: string = 'all'): Promise<ContentEntity[]> {
    console.log('🎯 GetContentUseCase: Obteniendo contenido, categoría:', category);
    
    if (category === 'all') {
      return await this.repository.findPublished();
    }
    
    return await this.repository.findByCategory(category);
  }
}

