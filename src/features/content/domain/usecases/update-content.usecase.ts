// Update Content UseCase - Actualizar contenido existente
import { ContentEntity } from '../entities/content.entity';
import { IContentRepository } from '../repositories/content.repository.interface';

export interface UpdateContentDTO {
  title?: string;
  description?: string;
  price?: number;
  currency?: string;
  contentType?: string;
  category?: string;
  tags?: string[];
  coverImage?: string;
  files?: string[];
  isPublished?: boolean;
}

export class UpdateContentUseCase {
  constructor(private repository: IContentRepository) {}

  async execute(contentId: string, userId: string, data: UpdateContentDTO): Promise<ContentEntity> {
    console.log('🎯 UpdateContentUseCase: Actualizando contenido', contentId);

    // Validaciones de negocio
    if (!contentId || contentId.trim().length === 0) {
      throw new Error('ID de contenido es requerido');
    }

    if (!userId || userId.trim().length === 0) {
      throw new Error('ID de usuario es requerido');
    }

    // Verificar que el contenido existe y pertenece al usuario
    const existingContent = await this.repository.findById(contentId);
    if (!existingContent) {
      throw new Error('Contenido no encontrado');
    }

    if (!existingContent.isOwnedBy(userId)) {
      throw new Error('No tienes permisos para actualizar este contenido');
    }

    // Validaciones de datos
    if (data.title !== undefined && data.title.trim().length < 3) {
      throw new Error('El título debe tener al menos 3 caracteres');
    }

    if (data.price !== undefined && data.price < 0) {
      throw new Error('El precio no puede ser negativo');
    }

    if (data.contentType !== undefined && data.contentType.trim().length === 0) {
      throw new Error('El tipo de contenido es requerido');
    }

    // Actualizar contenido
    const updatedContent = await this.repository.update(contentId, data);

    if (!updatedContent) {
      throw new Error('Error al actualizar el contenido');
    }

    console.log('✅ Contenido actualizado:', updatedContent.id);
    return updatedContent;
  }
}

