// Delete Content UseCase - Eliminar contenido
import { IContentRepository } from '../repositories/content.repository.interface';

export class DeleteContentUseCase {
  constructor(private repository: IContentRepository) {}

  async execute(contentId: string, userId: string): Promise<boolean> {
    console.log('🎯 DeleteContentUseCase: Eliminando contenido ID:', contentId);
    
    if (!contentId || contentId.trim().length === 0) {
      throw new Error('ID de contenido es requerido');
    }

    // Verificar que el contenido existe y pertenece al usuario
    const content = await this.repository.findById(contentId);
    
    if (!content) {
      throw new Error('Contenido no encontrado');
    }

    if (!content.isOwnedBy(userId)) {
      throw new Error('No tienes permisos para eliminar este contenido');
    }

    // Eliminar
    const success = await this.repository.delete(contentId);
    
    if (success) {
      console.log('✅ Contenido eliminado:', contentId);
    } else {
      console.log('❌ Error eliminando contenido:', contentId);
    }

    return success;
  }
}

