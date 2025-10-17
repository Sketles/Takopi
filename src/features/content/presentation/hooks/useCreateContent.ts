// useCreateContent Hook - Crear nuevo contenido
import { useState } from 'react';
import { ContentEntity } from '../../domain/entities/content.entity';
import { CreateContentUseCase, CreateContentDTO } from '../../domain/usecases/create-content.usecase';
import { createContentRepository } from '../../data/repositories/content.repository';

export function useCreateContent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createContent = async (data: CreateContentDTO): Promise<ContentEntity | null> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      console.log('🎣 useCreateContent: Creando contenido');

      const repository = createContentRepository();
      const usecase = new CreateContentUseCase(repository);

      const result = await usecase.execute(data);
      
      console.log('✅ useCreateContent: Contenido creado', result.id);
      setSuccess(true);
      return result;
    } catch (err) {
      console.error('❌ useCreateContent: Error', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { 
    createContent, 
    loading, 
    error, 
    success 
  };
}

