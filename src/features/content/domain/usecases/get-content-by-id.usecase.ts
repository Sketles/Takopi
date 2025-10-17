// Get Content By ID UseCase - Obtener contenido específico
import { ContentEntity } from '../entities/content.entity';
import { IContentRepository } from '../repositories/content.repository.interface';

export class GetContentByIdUseCase {
  constructor(private repository: IContentRepository) {}

  async execute(contentId: string): Promise<ContentEntity | null> {
    console.log('🎯 GetContentByIdUseCase: Obteniendo contenido ID:', contentId);
    
    if (!contentId || contentId.trim().length === 0) {
      throw new Error('ID de contenido es requerido');
    }

    const content = await this.repository.findById(contentId);
    
    if (!content) {
      console.log('⚠️  Contenido no encontrado:', contentId);
    }
    
    return content;
  }
}

