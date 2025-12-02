'use client';

import { upload } from '@vercel/blob/client';
import { useState, useCallback } from 'react';

export interface UploadedFile {
  name: string;
  originalName: string;
  size: number;
  type: string;
  url: string;
  previewUrl?: string;
}

export interface UseClientUploadOptions {
  onProgress?: (progress: number) => void;
  onError?: (error: Error) => void;
  onSuccess?: (files: UploadedFile[]) => void;
}

export interface UseClientUploadReturn {
  uploadFiles: (files: File[], contentType: string) => Promise<UploadedFile[]>;
  uploadSingleFile: (file: File, folder: string) => Promise<UploadedFile>;
  isUploading: boolean;
  progress: number;
  error: string | null;
}

/**
 * Hook para uploads directos a Vercel Blob desde el cliente
 * 
 * Evita el límite de 4.5MB de las Serverless Functions
 * permitiendo uploads de hasta 500MB directamente al Blob Storage.
 */
export function useClientUpload(options?: UseClientUploadOptions): UseClientUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const getToken = useCallback(() => {
    return localStorage.getItem('takopi_token');
  }, []);

  const uploadSingleFile = useCallback(async (file: File, folder: string): Promise<UploadedFile> => {
    const token = getToken();
    if (!token) {
      throw new Error('No hay sesión activa. Por favor, inicia sesión.');
    }

    const pathname = `${folder}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    const blob = await upload(pathname, file, {
      access: 'public',
      handleUploadUrl: '/api/upload/client',
      clientPayload: JSON.stringify({ folder, token }), // Pasar token en payload
      onUploadProgress: (progressEvent) => {
        const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
        setProgress(percent);
        options?.onProgress?.(percent);
      },
    });

    return {
      name: blob.pathname.split('/').pop() || blob.pathname,
      originalName: file.name,
      size: file.size,
      type: file.type || 'application/octet-stream',
      url: blob.url,
      previewUrl: file.type.startsWith('image/') ? blob.url : undefined,
    };
  }, [getToken, options]);

  const uploadFiles = useCallback(async (files: File[], contentType: string): Promise<UploadedFile[]> => {
    const token = getToken();
    if (!token) {
      throw new Error('No hay sesión activa. Por favor, inicia sesión.');
    }

    setIsUploading(true);
    setError(null);
    setProgress(0);

    const uploadedFiles: UploadedFile[] = [];
    const totalFiles = files.length;

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const folder = `content/${contentType}`;
        
        // Generar nombre de archivo seguro
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const pathname = `${folder}/${Date.now()}-${safeName}`;

        const blob = await upload(pathname, file, {
          access: 'public',
          handleUploadUrl: '/api/upload/client',
          clientPayload: JSON.stringify({ contentType, fileIndex: i, token }), // Pasar token
          onUploadProgress: (progressEvent) => {
            // Calcular progreso total considerando todos los archivos
            const fileProgress = (progressEvent.loaded / progressEvent.total);
            const totalProgress = Math.round(((i + fileProgress) / totalFiles) * 100);
            setProgress(totalProgress);
            options?.onProgress?.(totalProgress);
          },
        });

        uploadedFiles.push({
          name: blob.pathname.split('/').pop() || blob.pathname,
          originalName: file.name,
          size: file.size,
          type: file.type || 'application/octet-stream',
          url: blob.url,
          previewUrl: file.type.startsWith('image/') ? blob.url : undefined,
        });

        console.log(`✅ Archivo ${i + 1}/${totalFiles} subido: ${file.name}`);
      }

      setProgress(100);
      options?.onSuccess?.(uploadedFiles);
      return uploadedFiles;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al subir archivos';
      setError(errorMessage);
      options?.onError?.(err instanceof Error ? err : new Error(errorMessage));
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, [getToken, options]);

  return {
    uploadFiles,
    uploadSingleFile,
    isUploading,
    progress,
    error,
  };
}
