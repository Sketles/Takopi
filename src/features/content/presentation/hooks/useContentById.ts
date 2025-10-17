// useContentById Hook - Obtener contenido por ID
import { useState, useEffect, useCallback } from 'react';
import { ContentEntity } from '../../domain/entities/content.entity';
import { GetContentByIdUseCase } from '../../domain/usecases/get-content-by-id.usecase';
import { createContentRepository } from '../../data/repositories/content.repository';

export function useContentById(contentId: string | null) {
  const [content, setContent] = useState<ContentEntity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = useCallback(async () => {
    if (!contentId) {
      setContent(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('🎣 useContentById: Obteniendo contenido', contentId);

      const repository = createContentRepository();
      const usecase = new GetContentByIdUseCase(repository);

      const result = await usecase.execute(contentId);
      
      console.log('✅ useContentById: Contenido obtenido', result?.id);
      setContent(result);
    } catch (err) {
      console.error('❌ useContentById: Error', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [contentId]);

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

