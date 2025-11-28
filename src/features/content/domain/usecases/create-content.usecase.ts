// Create Content UseCase - Crear nuevo contenido
import { ContentEntity } from '../entities/content.entity';
import { IContentRepository } from '../repositories/content.repository.interface';

export interface CreateContentDTO {
  title: string;
  description: string;
  author: string;
  authorUsername: string;
  price: number;
  currency: string;
  contentType: string;
  tags: string[];
  coverImage?: string;
  files?: string[];
}

export class CreateContentUseCase {
  constructor(private repository: IContentRepository) {}

  async execute(data: CreateContentDTO): Promise<ContentEntity> {
    console.log('🎯 CreateContentUseCase: Creando contenido');
    
    // Validaciones de negocio
    if (!data.title || data.title.trim().length < 3) {
      throw new Error('El título debe tener al menos 3 caracteres');
    }

    if (data.price < 0) {
      throw new Error('El precio no puede ser negativo');
    }

    if (!data.contentType || data.contentType.trim().length === 0) {
      throw new Error('El tipo de contenido es requerido');
    }

    if (!data.author || data.author.trim().length === 0) {
      throw new Error('El autor es requerido');
    }

    // Crear contenido
    const content = await this.repository.create({
      ...data,
      isPublished: true,
      likes: 0,
      views: 0,
      downloads: 0
    });

    console.log('✅ Contenido creado:', content.id);
    return content;
  }
}

