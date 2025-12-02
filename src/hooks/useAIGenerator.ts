/**
 * useAIGenerator - Hook para generación de modelos 3D con IA
 * 
 * Uso simple:
 * const { generate, task, isGenerating, error } = useAIGenerator();
 * await generate({ prompt: 'Un robot samurai' });
 */
'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch';

// Types
export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'SUCCEEDED' | 'FAILED' | 'CANCELED';
export type TaskType = 'text-to-3d' | 'image-to-3d' | 'text-to-3d-refine' | 'retexture';

export interface GenerationTask {
  id: string;
  taskId: string;
  taskType: TaskType;
  status: TaskStatus;
  progress: number;
  prompt?: string;
  modelUrl?: string;
  thumbnailUrl?: string;
  artStyle?: string;
  aiModel?: string;  // Modelo AI usado (meshy-4, meshy-6, etc)
  errorMessage?: string;
  createdAt: string;
  completedAt?: string;
  // Nuevos campos para texturas
  mode?: 'preview' | 'refine';
  enablePbr?: boolean;
  texturePrompt?: string;
  previewTaskId?: string;
  hasTextures?: boolean;
}

export interface GenerateOptions {
  type?: TaskType;
  prompt?: string;
  imageUrl?: string;
  artStyle?: 'realistic' | 'sculpture';
  aiModel?: 'meshy-4' | 'meshy-5' | 'latest';
  // Opciones de textura
  enablePbr?: boolean;
  texturePrompt?: string;
  // Para refine
  previewTaskId?: string;
}

interface UseAIGeneratorReturn {
  // Estado actual
  task: GenerationTask | null;
  isGenerating: boolean;
  error: string | null;

  // Acciones
  generate: (options: GenerateOptions) => Promise<void>;
  refine: (taskId: string, options?: { enablePbr?: boolean; texturePrompt?: string; aiModel?: string }) => Promise<void>;
  poll: (id: string) => Promise<GenerationTask | null>;
  cancel: () => void;
  reset: () => void;

  // Historial
  history: GenerationTask[];
  loadHistory: () => Promise<void>;
  isLoadingHistory: boolean;

  // Balance
  balance: number | null;
  loadBalance: () => Promise<void>;
}

const POLL_INTERVAL = 3000; // 3 segundos
const MAX_POLL_TIME = 10 * 60 * 1000; // 10 minutos

export function useAIGenerator(): UseAIGeneratorReturn {
  const { authFetch, authPost } = useAuthenticatedFetch();

  // Estado
  const [task, setTask] = useState<GenerationTask | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<GenerationTask[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);

  // Refs para polling
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  // Limpiar polling al desmontar
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  // Consultar estado de una tarea
  const poll = useCallback(async (id: string): Promise<GenerationTask | null> => {
    try {
      const { data, error } = await authFetch<GenerationTask>(`/api/ai/tasks/${id}`);
      if (error || !data) {
        console.log('❌ Poll error:', error);
        return null;
      }
      console.log('📊 Poll:', data.taskType, data.status, data.progress + '%');
      return data;
    } catch {
      return null;
    }
  }, [authFetch]);

  // Referencia para loadHistory (evitar dependencia circular)
  const loadHistoryRef = useRef<(() => Promise<void>) | null>(null);

  // Iniciar polling automático
  const startPolling = useCallback((id: string) => {
    startTimeRef.current = Date.now();

    const doPoll = async () => {
      // Timeout de seguridad
      if (Date.now() - startTimeRef.current > MAX_POLL_TIME) {
        setError('La generación tardó demasiado. Intenta de nuevo.');
        setIsGenerating(false);
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        return;
      }

      const result = await poll(id);
      if (!result) return;

      setTask(result);

      // Si terminó, detener polling
      if (['SUCCEEDED', 'FAILED', 'CANCELED'].includes(result.status)) {
        setIsGenerating(false);
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
        }

        if (result.status === 'FAILED') {
          setError(result.errorMessage || 'La generación falló');
        }

        // Recargar historial cuando termine la generación
        if (result.status === 'SUCCEEDED' && loadHistoryRef.current) {
          loadHistoryRef.current();
        }
      }
    };

    // Poll inmediato + intervalo
    doPoll();
    pollIntervalRef.current = setInterval(doPoll, POLL_INTERVAL);
  }, [poll]);

  // Generar nuevo modelo
  const generate = useCallback(async (options: GenerateOptions) => {
    setError(null);
    setIsGenerating(true);
    setTask(null);

    try {
      const { data, error: fetchError } = await authPost<{ id: string; taskId: string }>('/api/ai/generate', {
        type: options.type || 'text-to-3d',
        prompt: options.prompt,
        imageUrl: options.imageUrl,
        artStyle: options.artStyle || 'realistic',
        aiModel: options.aiModel || 'latest',
        enablePbr: options.enablePbr,
        texturePrompt: options.texturePrompt,
        previewTaskId: options.previewTaskId,
      });

      if (fetchError || !data) {
        throw new Error(fetchError || 'Error al crear generación');
      }

      // Crear tarea inicial
      const newTask: GenerationTask = {
        id: data.id,
        taskId: data.taskId,
        taskType: options.type || 'text-to-3d',
        status: 'PENDING',
        progress: 0,
        prompt: options.prompt,
        artStyle: options.artStyle,
        createdAt: new Date().toISOString(),
      };

      setTask(newTask);
      startPolling(data.id);
    } catch (err) {
      setIsGenerating(false);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  }, [authPost, startPolling]);

  // Refinar modelo existente (agregar texturas)
  const refine = useCallback(async (previewTaskId: string, options?: { enablePbr?: boolean; texturePrompt?: string; aiModel?: string }) => {
    setError(null);
    setIsGenerating(true);
    // NO limpiar task aquí - mantener el preview visible hasta que el refine task esté listo

    try {
      const { data, error: fetchError } = await authPost<{ id: string; taskId: string }>('/api/ai/generate', {
        type: 'text-to-3d-refine',
        previewTaskId,
        enablePbr: options?.enablePbr ?? true,
        texturePrompt: options?.texturePrompt,
        aiModel: options?.aiModel,  // Debe coincidir con el modelo usado en preview
      });

      if (fetchError || !data) {
        throw new Error(fetchError || 'Error al refinar modelo');
      }

      // Crear tarea inicial
      const newTask: GenerationTask = {
        id: data.id,
        taskId: data.taskId,
        taskType: 'text-to-3d-refine',
        status: 'PENDING',
        progress: 0,
        createdAt: new Date().toISOString(),
      };

      setTask(newTask);
      startPolling(data.id);
    } catch (err) {
      setIsGenerating(false);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  }, [authPost, startPolling]);

  // Cancelar generación actual
  const cancel = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    setIsGenerating(false);
  }, []);

  // Reset estado
  const reset = useCallback(() => {
    cancel();
    setTask(null);
    setError(null);
  }, [cancel]);

  // Cargar historial
  const loadHistory = useCallback(async () => {
    setIsLoadingHistory(true);
    try {
      const { data, error: apiError } = await authFetch<GenerationTask[]>('/api/ai/generate?limit=20');
      if (apiError) {
        setError(`Error cargando historial: ${apiError}`);
      } else if (data) {
        setHistory(data);
      }
    } catch {
      setError('Error de conexión al cargar historial');
    } finally {
      setIsLoadingHistory(false);
    }
  }, [authFetch]);

  // Actualizar referencia para que startPolling pueda recargar historial
  useEffect(() => {
    loadHistoryRef.current = loadHistory;
  }, [loadHistory]);

  // Cargar balance
  const loadBalance = useCallback(async () => {
    try {
      const { data, error } = await authFetch<{ balance: number }>('/api/ai/balance');
      if (!error && data) {
        setBalance(data.balance);
      }
    } catch {
      // Silenciar errores de balance
    }
  }, [authFetch]);

  return {
    task,
    isGenerating,
    error,
    generate,
    refine,
    poll,
    cancel,
    reset,
    history,
    loadHistory,
    isLoadingHistory,
    balance,
    loadBalance,
  };
}

export default useAIGenerator;
