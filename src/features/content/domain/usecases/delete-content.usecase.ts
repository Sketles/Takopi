// Delete Content UseCase - Eliminar contenido
import { IContentRepository } from '../repositories/content.repository.interface';

export class DeleteContentUseCase {
  constructor(private repository: IContentRepository) { }

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

    // Verificar si el contenido tiene compras
    const hasPurchases = await this.repository.hasPurchases(contentId);

    let success: boolean;

    if (hasPurchases) {
      // BORRADO LÓGICO: El producto tiene compras, solo despublicar
      console.log('⚠️ Contenido tiene compras, aplicando borrado lógico');
      success = await this.repository.unlist(contentId);

      if (success) {
        console.log('✅ Contenido despublicado (borrado lógico):', contentId);
        console.log('   → El contenido ya no aparecerá en listados públicos');
        console.log('   → Los compradores mantienen acceso en su biblioteca');
      }
    } else {
      // BORRADO FÍSICO: No tiene compras, eliminar completamente
      console.log('✅ Contenido sin compras, aplicando borrado físico');
      success = await this.repository.delete(contentId);

      if (success) {
        console.log('✅ Contenido eliminado físicamente:', contentId);
      }
    }

    if (!success) {
      console.log('❌ Error eliminando contenido:', contentId);
    }

    return success;
  }
}
