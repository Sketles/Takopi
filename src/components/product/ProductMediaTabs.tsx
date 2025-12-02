'use client';

import { useState, useEffect } from 'react';
import { ModelViewerModal } from '../ModelViewer3D';
import DefaultCover from '../shared/DefaultCover';
import MusicPlayer from './MusicPlayer';
import TextureViewer from './TextureViewer';

interface ProductMediaTabsProps {
  product: {
    id: string;
    title: string;
    contentType: string;
    coverImage?: string;
    additionalImages?: string[];
    files?: Array<{
      name: string;
      type: string;
      size: number;
      url: string;
      previewUrl?: string;
      isCover?: boolean;
      originalName?: string;
    }>;
  };
  isOwner?: boolean;
  className?: string;
}

export default function ProductMediaTabs({ product, isOwner = false, className = '' }: ProductMediaTabsProps) {
  const [activeTab, setActiveTab] = useState<'viewer' | 'files'>('viewer');
  const [loadedTabs, setLoadedTabs] = useState<Set<string>>(new Set(['viewer']));
  const [selectedFileForViewer, setSelectedFileForViewer] = useState<string | null>(null);

  // Cerrar menús al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.file-menu') && !target.closest('[title="Más opciones"]')) {
        document.querySelectorAll('.file-menu').forEach(menu => {
          menu.classList.add('hidden');
        });
      }
    };

    const handleScroll = () => {
      document.querySelectorAll('.file-menu').forEach(menu => {
        menu.classList.add('hidden');
      });
    };

    document.addEventListener('click', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, []);

  // Determinar qué contenido está disponible
  const has3D = product.files?.some(file =>
    file.type?.includes('gltf') ||
    file.type?.includes('glb') ||
    file.type?.includes('application/octet-stream') ||
    file.name?.endsWith('.glb') ||
    file.name?.endsWith('.gltf') ||
    file.name?.endsWith('.vrm')
  );

  const hasImages = product.coverImage || (product.additionalImages && product.additionalImages.length > 0);

  const hasVideo = product.files?.some(file =>
    file.type?.includes('video') ||
    file.name?.match(/\.(mp4|webm|ogg|avi|mov)$/i)
  );

  const hasAudio = product.files?.some(file =>
    file.type?.includes('audio') ||
    file.name?.match(/\.(mp3|wav|ogg|flac|m4a)$/i)
  );

  const hasTextures = product.files?.some(file =>
    file.type?.includes('image') ||
    file.name?.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i)
  );

  useEffect(() => {
    setActiveTab('viewer');
  }, []);

  const handleTabChange = (tab: 'viewer' | 'files') => {
    setActiveTab(tab);
    setLoadedTabs(prev => new Set([...prev, tab]));
  };

  const get3DModelUrl = () => {
    if (selectedFileForViewer) return selectedFileForViewer;

    const modelFile = product.files?.find(file =>
      file.type?.includes('gltf') ||
      file.type?.includes('glb') ||
      file.type?.includes('application/octet-stream') ||
      file.name?.endsWith('.glb') ||
      file.name?.endsWith('.gltf') ||
      file.name?.endsWith('.vrm')
    );

    return modelFile?.previewUrl || modelFile?.url;
  };

  const getVideoUrl = () => {
    const videoFile = product.files?.find(file =>
      file.type?.includes('video') ||
      file.name?.match(/\.(mp4|webm|ogg|avi|mov)$/i)
    );
    return videoFile?.url;
  };

  const getAllImages = () => {
    const images = [];
    if (product.coverImage) images.push(product.coverImage);
    if (product.additionalImages) images.push(...product.additionalImages);
    return images;
  };

  const getFileIcon = (file: any) => {
    if (file.type?.includes('gltf') || file.type?.includes('glb') || file.type?.includes('application/octet-stream') ||
      file.name?.endsWith('.glb') || file.name?.endsWith('.gltf') || file.name?.endsWith('.vrm')) {
      return '🧩';
    }
    if (file.type?.startsWith('image/')) return '🖼️';
    if (file.type?.startsWith('video/')) return '🎬';
    if (file.type?.startsWith('audio/')) return '🎵';
    if (file.type?.includes('text/') || file.name?.match(/\.(html|css|js|json)$/i)) return '📄';
    if (file.type?.includes('application/zip') || file.name?.match(/\.(zip|rar|7z)$/i)) return '📦';
    return '📁';
  };

  const getFileTypeLabel = (file: any) => {
    if (file.type?.includes('gltf') || file.type?.includes('glb') || file.type?.includes('application/octet-stream') ||
      file.name?.endsWith('.glb') || file.name?.endsWith('.gltf') || file.name?.endsWith('.vrm')) {
      return 'Modelo 3D';
    }
    if (file.type?.startsWith('image/')) return 'Imagen';
    if (file.type?.startsWith('video/')) return 'Vídeo';
    if (file.type?.startsWith('audio/')) return 'Audio';
    if (file.type?.includes('text/') || file.name?.match(/\.(html|css|js|json)$/i)) return 'Código';
    if (file.type?.includes('application/zip') || file.name?.match(/\.(zip|rar|7z)$/i)) return 'Archivo comprimido';
    return 'Archivo';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className={`flex flex-col h-full min-h-[280px] sm:min-h-[350px] w-full relative ${className}`}>

      {/* Floating Tab Switcher - Centered at top */}
      <div className="absolute top-2 sm:top-4 lg:top-6 left-1/2 -translate-x-1/2 z-30">
        <div className="flex bg-black/70 backdrop-blur-md rounded-full p-0.5 sm:p-1 border border-white/10 shadow-lg">
          <button
            onClick={() => handleTabChange('viewer')}
            className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 ${activeTab === 'viewer'
              ? 'bg-white text-black shadow-sm'
              : 'text-white/60 hover:text-white'
              }`}
          >
            Vista Previa
          </button>
          <button
            onClick={() => handleTabChange('files')}
            className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-1.5 sm:gap-2 ${activeTab === 'files'
              ? 'bg-white text-black shadow-sm'
              : 'text-white/60 hover:text-white'
              }`}
          >
            <span className="hidden sm:inline">Archivos</span>
            <span className="sm:hidden">Files</span>
            <span className={`text-[10px] sm:text-xs px-1 sm:px-1.5 py-0.5 rounded-full ${activeTab === 'files' ? 'bg-black/10 text-black' : 'bg-white/10 text-white'}`}>
              {product.files?.length || 0}
            </span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 relative w-full h-full overflow-hidden bg-transparent">
        {activeTab === 'viewer' && (
          <div className="w-full h-full animate-fade-in">
            {loadedTabs.has('viewer') ? (
              product.contentType === 'musica' && hasAudio ? (
                <div className="w-full h-full pt-10 sm:pt-12 overflow-y-auto">
                  <MusicPlayer
                    files={product.files || []}
                    title={product.title}
                    coverImage={product.coverImage}
                    className="w-full h-full"
                  />
                </div>
              ) : product.contentType === 'texturas' && hasTextures ? (
                <div className="w-full h-full pt-10 sm:pt-12">
                  <TextureViewer
                    files={product.files || []}
                    title={product.title}
                    coverImage={product.coverImage}
                    className="h-full w-full"
                    isOwner={isOwner}
                  />
                </div>
              ) : has3D ? (
                get3DModelUrl() ? (
                  <div className="w-full h-full">
                    <ModelViewerModal
                      src={get3DModelUrl()!}
                      alt={product.title}
                      width="100%"
                      height="100%"
                      autoRotate={true}
                      cameraControls={true}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4 text-white/30">
                    <span className="text-6xl">🧩</span>
                    <p>Modelo 3D no disponible</p>
                  </div>
                )
              ) : hasVideo ? (
                getVideoUrl() ? (
                  <video
                    src={getVideoUrl()}
                    controls
                    className="w-full h-full object-contain"
                    preload="metadata"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-4 text-white/30">
                    <span className="text-6xl">🎬</span>
                    <p>Vídeo no disponible</p>
                  </div>
                )
              ) : hasImages ? (
                <img
                  src={getAllImages()[0]}
                  alt={product.title}
                  className="w-full h-full object-contain"
                  loading="eager"
                />
              ) : (
                <div className="flex flex-col items-center gap-4 text-white/30">
                  <span className="text-6xl">📁</span>
                  <p>Sin vista previa</p>
                </div>
              )
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'files' && (
          <div className="w-full h-full p-8 pt-24 overflow-y-auto custom-scrollbar animate-fade-in bg-black/20 backdrop-blur-sm">
            <div className="max-w-3xl mx-auto space-y-3">
              {product.files && product.files.length > 0 ? (
                product.files.map((file, index) => (
                  <div
                    key={index}
                    className="group bg-white/5 hover:bg-white/10 rounded-xl p-4 border border-white/5 hover:border-white/20 transition-all duration-300 flex items-center gap-4"
                  >
                    <div className="w-12 h-12 bg-black/40 rounded-lg flex items-center justify-center text-2xl">
                      {getFileIcon(file)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-white font-medium truncate">{file.originalName || file.name}</h4>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-white/40">
                        <span className="bg-white/5 px-2 py-0.5 rounded">{getFileTypeLabel(file)}</span>
                        <span>{formatFileSize(file.size)}</span>
                      </div>
                    </div>

                    {isOwner && (
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = file.url;
                            link.download = file.originalName || file.name;
                            link.click();
                          }}
                          className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors"
                          title="Descargar"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center text-white/30 py-12">
                  No hay archivos disponibles
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
