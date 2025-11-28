'use client';

import { useState, useRef, useCallback } from 'react';
import { useToast } from '@/components/shared/Toast';

interface FileItem {
  id: string;
  name: string;
  originalName: string;
  size: number;
  type: string;
  url: string;
  previewUrl?: string;
  isCover?: boolean;
  isUploading?: boolean;
  uploadProgress?: number;
  error?: string;
}

interface FileUploaderProps {
  files: FileItem[];
  onFilesChange: (files: FileItem[]) => void;
  onSetCover: (fileId: string) => void;
  onDeleteFile: (fileId: string) => void;
  onReorderFiles: (fromIndex: number, toIndex: number) => void;
  contentType: string;
  maxFileSize?: number; // en MB
  className?: string;
}

export default function FileUploader({
  files,
  onFilesChange,
  onSetCover,
  onDeleteFile,
  onReorderFiles,
  contentType,
  maxFileSize = 50,
  className = ''
}: FileUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  // Formatos permitidos según tipo de contenido
  const getAllowedFormats = (contentType: string) => {
    const formatMap: { [key: string]: string[] } = {
      'avatares': ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      'modelos3d': ['model/gltf-binary', 'model/gltf+json', 'application/octet-stream'],
      'musica': ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3'],
      'texturas': ['image/jpeg', 'image/png', 'image/tiff', 'image/webp'],
      'animaciones': ['video/mp4', 'video/webm', 'video/ogg', 'image/gif'],
      'OBS': ['application/json', 'text/plain', 'image/png', 'image/jpeg'],
      'colecciones': ['application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed']
    };
    return formatMap[contentType] || ['*/*'];
  };

  const allowedFormats = getAllowedFormats(contentType);
  const maxSizeBytes = maxFileSize * 1024 * 1024;

  const validateFile = (file: File): string | null => {
    // Validar tamaño
    if (file.size > maxSizeBytes) {
      return `El archivo es demasiado grande. Máximo ${maxFileSize}MB`;
    }

    // Validar tipo
    if (allowedFormats[0] !== '*/*' && !allowedFormats.includes(file.type)) {
      return `Formato no válido. Formatos permitidos: ${allowedFormats.map(f => f.split('/')[1]).join(', ')}`;
    }

    return null;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string | undefined): string => {
    if (!type) return '📁';
    if (type.startsWith('image/')) return '🖼️';
    if (type.startsWith('video/')) return '🎬';
    if (type.startsWith('audio/')) return '🎵';
    if (type.includes('gltf') || type.includes('glb')) return '🧩';
    if (type.includes('json')) return '📄';
    if (type.includes('zip') || type.includes('rar') || type.includes('7z')) return '📦';
    return '📁';
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    handleFiles(selectedFiles);
  };

  const handleFiles = async (newFiles: File[]) => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    // Validar archivos
    newFiles.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    // Mostrar errores si los hay
    if (errors.length > 0) {
      addToast({ type: 'error', title: 'Error de archivo', message: errors.join('\n') });
    }

    // Procesar archivos válidos
    for (const file of validFiles) {
      const fileId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      
      // Crear objeto de archivo
      const fileItem: FileItem = {
        id: fileId,
        name: file.name,
        originalName: file.name,
        size: file.size,
        type: file.type,
        url: '', // Se llenará después de la subida
        isUploading: true,
        uploadProgress: 0
      };

      // Agregar a la lista
      onFilesChange([...files, fileItem]);
      setUploadingFiles(prev => new Set([...prev, fileId]));

      // Simular subida (aquí iría la lógica real de subida)
      try {
        await simulateUpload(file, fileId, (progress) => {
          const updatedFiles = files.map(f =>
            f.id === fileId ? { ...f, uploadProgress: progress } : f
          );
          onFilesChange(updatedFiles);
        });

        // Marcar como completado
        const completedFiles = files.map(f =>
          f.id === fileId 
            ? { 
                ...f, 
                isUploading: false, 
                url: URL.createObjectURL(file),
                previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
              } 
            : f
        );
        onFilesChange(completedFiles);
      } catch (error) {
        // Marcar como error
        const errorFiles = files.map(f =>
          f.id === fileId 
            ? { 
                ...f, 
                isUploading: false, 
                error: 'Error al subir el archivo'
              } 
            : f
        );
        onFilesChange(errorFiles);
      } finally {
        setUploadingFiles(prev => {
          const newSet = new Set(prev);
          newSet.delete(fileId);
          return newSet;
        });
      }
    }
  };

  const simulateUpload = (file: File, fileId: string, onProgress: (progress: number) => void): Promise<void> => {
    return new Promise((resolve, reject) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          resolve();
        }
        onProgress(progress);
      }, 200);
    });
  };

  const handleSetCover = (fileId: string) => {
    // Quitar isCover de todos los archivos
    const updatedFiles = files.map(f => ({ ...f, isCover: false }));
    // Establecer el archivo seleccionado como portada
    const finalFiles = updatedFiles.map(f => 
      f.id === fileId ? { ...f, isCover: true } : f
    );
    onFilesChange(finalFiles);
    onSetCover(fileId);
  };

  const handleDeleteFile = (fileId: string) => {
    onFilesChange(files.filter(f => f.id !== fileId));
    onDeleteFile(fileId);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Zona de drop */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          isDragOver
            ? 'border-purple-400 bg-purple-500/10'
            : 'border-gray-600 hover:border-gray-500 bg-gray-800/30'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={allowedFormats.join(',')}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-2">
          <div className="text-4xl">📁</div>
          <div className="text-lg font-medium text-white">
            Arrastra archivos aquí o haz clic para seleccionar
          </div>
          <div className="text-sm text-gray-400">
            Formatos permitidos: {allowedFormats.map(f => f.split('/')[1]).join(', ')}
          </div>
          <div className="text-xs text-gray-500">
            Máximo {maxFileSize}MB por archivo
          </div>
        </div>
      </div>

      {/* Lista de archivos */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-white">
            Archivos ({files.length})
          </h4>
          
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={file.id || `file-${index}-${file.name}`}
                className="bg-gradient-to-br from-gray-800/40 to-purple-900/40 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50"
              >
                <div className="flex items-center gap-3">
                  {/* Icono del archivo */}
                  <div className="text-2xl flex-shrink-0">
                    {getFileIcon(file.type)}
                  </div>

                  {/* Información del archivo */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-white text-sm truncate">
                        {file.name}
                      </span>
                      {file.isCover && (
                        <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-xs rounded-full border border-purple-500/30">
                          Portada
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400">
                      {file.size > 0 ? formatFileSize(file.size) : 'Archivo existente'} • {file.type?.split('/')[1]?.toUpperCase() || 'ARCHIVO'}
                    </div>
                    
                    {/* Barra de progreso */}
                    {file.isUploading && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-700 rounded-full h-1.5">
                          <div
                            className="bg-purple-500 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${file.uploadProgress || 0}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Subiendo... {Math.round(file.uploadProgress || 0)}%
                        </div>
                      </div>
                    )}

                    {/* Error */}
                    {file.error && (
                      <div className="text-xs text-red-400 mt-1">
                        {file.error}
                      </div>
                    )}
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center gap-2">
                    {!file.isUploading && !file.error && (
                      <>
                        {file.type.startsWith('image/') && !file.isCover && (
                          <button
                            onClick={() => handleSetCover(file.id)}
                            className="p-1.5 text-purple-400 hover:text-purple-300 transition-colors"
                            title="Establecer como portada"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </button>
                        )}
                        
                        <button
                          onClick={() => window.open(file.url, '_blank')}
                          className="p-1.5 text-blue-400 hover:text-blue-300 transition-colors"
                          title="Ver preview"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </>
                    )}
                    
                    <button
                      onClick={() => handleDeleteFile(file.id)}
                      className="p-1.5 text-red-400 hover:text-red-300 transition-colors"
                      title="Eliminar archivo"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Placeholder cuando no hay archivos */}
      {files.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <div className="text-4xl mb-2">📁</div>
          <div className="text-lg font-medium mb-1">Aún no has subido archivos</div>
          <div className="text-sm">Arrastra archivos aquí o haz clic para seleccionar</div>
        </div>
      )}
    </div>
  );
}
