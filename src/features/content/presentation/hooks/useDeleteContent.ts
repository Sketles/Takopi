// useDeleteContent Hook - Eliminar contenido
import { useState } from 'react';
import { DeleteContentUseCase } from '../../domain/usecases/delete-content.usecase';
import { createContentRepository } from '../../data/repositories/content.repository';

export function useDeleteContent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const deleteContent = async (contentId: string, userId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      console.log('🎣 useDeleteContent: Eliminando contenido', contentId);

      const repository = createContentRepository();
      const usecase = new DeleteContentUseCase(repository);

      const result = await usecase.execute(contentId, userId);
      
      console.log('✅ useDeleteContent: Contenido eliminado', result);
      setSuccess(result);
      return result;
    } catch (err) {
      console.error('❌ useDeleteContent: Error', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { 
    deleteContent, 
    loading, 
    error, 
    success 
  };
}

