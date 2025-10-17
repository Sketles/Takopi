// useContent Hook - Custom hook para obtener contenido con Clean Architecture
import { useState, useEffect, useCallback } from 'react';
import { ContentEntity } from '../../domain/entities/content.entity';
import { GetContentUseCase } from '../../domain/usecases/get-content.usecase';
import { createContentRepository } from '../../data/repositories/content.repository';

export function useContent(category: string = 'all') {
  const [content, setContent] = useState<ContentEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🎣 useContent: Iniciando fetch de contenido', category);

      // Crear repository y usecase (Clean Architecture)
      const repository = createContentRepository();
      const usecase = new GetContentUseCase(repository);

      // Ejecutar caso de uso
      const result = await usecase.execute(category);
      
      console.log('✅ useContent: Contenido obtenido', result.length);
      setContent(result);
    } catch (err) {
      console.error('❌ useContent: Error', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return { 
    content, 
    loading, 
    error,
    refetch: fetchContent 
  };
}

