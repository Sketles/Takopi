'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface FileItem {
  url: string;
  name: string;
  type: string;
  size?: number;
}

interface FileExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: {
    id: string;
    title: string;
    description: string;
    contentType: string;
    category: string;
    coverImage?: string;
    files: FileItem[];
    price: number;
    isFree: boolean;
    author: string;
  };
}

// Función para obtener el icono según el tipo de archivo
const getFileIcon = (fileName: string, fileType: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  // Archivos 3D
  if (['glb', 'gltf', 'obj', 'fbx', 'dae'].includes(extension || '')) {
    return '🎲';
  }
  
  // Archivos de audio
  if (['mp3', 'wav', 'ogg', 'm4a', 'aac'].includes(extension || '')) {
    return '🎵';
  }
  
  // Archivos de imagen
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(extension || '')) {
    return '🖼️';
  }
  
  // Archivos de video
  if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(extension || '')) {
    return '🎬';
  }
  
  // Archivos comprimidos
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension || '')) {
    return '📦';
  }
  
  // Archivos de texto
  if (['txt', 'md', 'doc', 'docx', 'pdf'].includes(extension || '')) {
    return '📄';
  }
  
  // Por defecto
  return '📁';
};

// Función para formatear el tamaño del archivo
const formatFileSize = (bytes?: number) => {
  if (!bytes) return 'N/A';
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

// Función para determinar el tipo de visor según el archivo
const getViewerType = (fileName: string, contentType: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  // Archivos 3D
  if (['glb', 'gltf', 'obj', 'fbx', 'dae'].includes(extension || '')) {
    return '3d';
  }
  
  // Archivos de audio
  if (['mp3', 'wav', 'ogg', 'm4a', 'aac'].includes(extension || '')) {
    return 'audio';
  }
  
  // Archivos de imagen
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(extension || '')) {
    return 'image';
  }
  
  // Archivos de video
  if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(extension || '')) {
    return 'video';
  }
  
  // Por defecto, usar el tipo de contenido
  return contentType === 'avatares' || contentType === 'modelos3d' ? '3d' : 
         contentType === 'musica' ? 'audio' : 'image';
};

export default function FileExplorerModal({ isOpen, onClose, content }: FileExplorerModalProps) {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [viewerType, setViewerType] = useState<string>('3d');

  // Resetear cuando se abre el modal
  useEffect(() => {
    if (isOpen && content.files.length > 0) {
      const firstFile = content.files[0];
      setSelectedFile(firstFile);
      setViewerType(getViewerType(firstFile.name, content.contentType));
    }
  }, [isOpen, content]);

  if (!isOpen) return null;

  const handleFileSelect = (file: FileItem) => {
    setSelectedFile(file);
    setViewerType(getViewerType(file.name, content.contentType));
  };

  const handleDownload = async (file: FileItem) => {
    try {
      const response = await fetch(file.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Error al descargar el archivo');
    }
  };

  // Renderizar el visor según el tipo
  const renderViewer = () => {
    if (!selectedFile) {
      return (
        <div className="h-full flex items-center justify-center bg-gray-800/50 rounded-lg">
          <div className="text-center text-gray-400">
            <div className="text-6xl mb-4">📁</div>
            <p>Selecciona un archivo para visualizar</p>
          </div>
        </div>
      );
    }

    switch (viewerType) {
      case '3d':
        return (
          <div className="h-full bg-gray-900 rounded-lg relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-8xl mb-4">🎲</div>
                <h3 className="text-2xl font-bold mb-2">{selectedFile.name}</h3>
                <p className="text-gray-400">Visor 3D - En desarrollo</p>
                <button
                  onClick={() => handleDownload(selectedFile)}
                  className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  📥 Descargar
                </button>
              </div>
            </div>
          </div>
        );

      case 'audio':
        return (
          <div className="h-full bg-gradient-to-br from-purple-900 to-blue-900 rounded-lg p-6">
            <div className="h-full flex flex-col items-center justify-center text-white">
              <div className="text-8xl mb-6">🎵</div>
              <h3 className="text-2xl font-bold mb-4">{selectedFile.name}</h3>
              <div className="w-full max-w-md">
                <audio
                  controls
                  className="w-full mb-4"
                  style={{ backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}
                >
                  <source src={selectedFile.url} type={`audio/${selectedFile.name.split('.').pop()}`} />
                  Tu navegador no soporta el elemento audio.
                </audio>
              </div>
              <button
                onClick={() => handleDownload(selectedFile)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                📥 Descargar
              </button>
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="h-full bg-gray-900 rounded-lg overflow-hidden">
            <div className="h-full flex items-center justify-center">
              <img
                src={selectedFile.url}
                alt={selectedFile.name}
                className="max-h-full max-w-full object-contain"
                style={{ maxHeight: '100%', maxWidth: '100%' }}
              />
            </div>
            <div className="absolute bottom-4 right-4">
              <button
                onClick={() => handleDownload(selectedFile)}
                className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-colors"
              >
                📥
              </button>
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="h-full bg-gray-900 rounded-lg p-4">
            <video
              controls
              className="w-full h-full object-contain"
              style={{ maxHeight: 'calc(100% - 2rem)' }}
            >
              <source src={selectedFile.url} type={`video/${selectedFile.name.split('.').pop()}`} />
              Tu navegador no soporta el elemento video.
            </video>
          </div>
        );

      default:
        return (
          <div className="h-full flex items-center justify-center bg-gray-800/50 rounded-lg">
            <div className="text-center text-gray-400">
              <div className="text-6xl mb-4">{getFileIcon(selectedFile.name, viewerType)}</div>
              <p>Vista previa no disponible</p>
              <button
                onClick={() => handleDownload(selectedFile)}
                className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                📥 Descargar
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl rounded-2xl border border-gray-700/50 w-full max-w-7xl h-[90vh] overflow-hidden">
        {/* Header del modal */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="text-3xl">
              {content.contentType === 'avatares' && '👤'}
              {content.contentType === 'modelos3d' && '🎲'}
              {content.contentType === 'musica' && '🎵'}
              {content.contentType === 'texturas' && '🖼️'}
              {content.contentType === 'animaciones' && '🎬'}
              {content.contentType === 'OBS' && '📺'}
              {content.contentType === 'colecciones' && '📦'}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">{content.title}</h3>
              <p className="text-sm text-gray-400">por {content.author}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700/50 rounded-xl transition-colors"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenido principal */}
        <div className="flex h-full">
          {/* Panel izquierdo - Lista de archivos */}
          <div className="w-80 bg-gray-800/50 border-r border-gray-700/50 flex flex-col">
            {/* Header del panel */}
            <div className="p-4 border-b border-gray-700/50">
              <h4 className="text-lg font-semibold text-white mb-2">📁 Archivos del Producto</h4>
              <p className="text-sm text-gray-400">{content.files.length} archivo(s)</p>
            </div>

            {/* Lista de archivos */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-2 space-y-1">
                {content.files.map((file, index) => (
                  <div
                    key={index}
                    onClick={() => handleFileSelect(file)}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-700/50 ${
                      selectedFile?.name === file.name 
                        ? 'bg-purple-600/20 border border-purple-500/50' 
                        : 'hover:bg-gray-700/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{getFileIcon(file.name, file.type)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{file.name}</p>
                        <p className="text-xs text-gray-400">
                          {formatFileSize(file.size)} • {file.type}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(file);
                        }}
                        className="p-1 hover:bg-gray-600/50 rounded transition-colors"
                        title="Descargar archivo"
                      >
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Panel derecho - Visor */}
          <div className="flex-1 p-6">
            <div className="h-full">
              {renderViewer()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
