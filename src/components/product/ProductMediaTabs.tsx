'use client';

import { useState, useEffect } from 'react';
import { ModelViewerModal } from '../ModelViewer3D';
import DefaultCover from '../shared/DefaultCover';

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
    }>;
  };
  isOwner?: boolean;
  className?: string;
}

export default function ProductMediaTabs({ product, isOwner = false, className = '' }: ProductMediaTabsProps) {
  const [activeTab, setActiveTab] = useState<'viewer' | 'files'>('viewer');
  const [loadedTabs, setLoadedTabs] = useState<Set<string>>(new Set(['viewer']));

  // Determinar qué contenido está disponible
  const has3D = product.files?.some(file => 
    file.type?.includes('gltf') || 
    file.type?.includes('glb') || 
    file.type?.includes('application/octet-stream') || // Para archivos .glb
    file.name?.endsWith('.glb') || 
    file.name?.endsWith('.gltf') ||
    file.name?.endsWith('.vrm')
  );

  // Debug: Log para verificar detección de modelos 3D
  useEffect(() => {
    console.log('🔍 ProductMediaTabs - Product files:', product.files);
    console.log('🔍 ProductMediaTabs - Has 3D:', has3D);
    console.log('🔍 ProductMediaTabs - 3D Model URL:', get3DModelUrl());
  }, [product.files, has3D]);
  
  const hasImages = product.coverImage || (product.additionalImages && product.additionalImages.length > 0);
  
  const hasVideo = product.files?.some(file => 
    file.type?.includes('video') || 
    file.name?.match(/\.(mp4|webm|ogg|avi|mov)$/i)
  );

  const hasAudio = product.files?.some(file => 
    file.type?.includes('audio') || 
    file.name?.match(/\.(mp3|wav|ogg|flac|m4a)$/i)
  );

  // Establecer tab inicial
  useEffect(() => {
    setActiveTab('viewer');
  }, []);

  const handleTabChange = (tab: 'viewer' | 'files') => {
    setActiveTab(tab);
    setLoadedTabs(prev => new Set([...prev, tab]));
  };

  const get3DModelUrl = () => {
    const modelFile = product.files?.find(file => 
      file.type?.includes('gltf') || 
      file.type?.includes('glb') || 
      file.type?.includes('application/octet-stream') || // Para archivos .glb
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

  const tabs = [
    {
      id: 'viewer' as const,
      label: 'Visor',
      icon: has3D ? '🧩' : hasVideo ? '🎬' : hasImages ? '🖼️' : '📁',
      available: true,
      description: has3D ? 'Modelo 3D interactivo' : hasVideo ? 'Reproductor de vídeo' : hasImages ? 'Galería de imágenes' : 'Vista previa'
    },
    {
      id: 'files' as const,
      label: 'Archivos',
      icon: '📁',
      available: true,
      count: product.files?.length || 0
    }
  ];

  return (
    <div className={`bg-gradient-to-br from-gray-900/50 to-purple-900/30 rounded-2xl border border-gray-700/50 overflow-hidden ${className}`}>
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-700/50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-all duration-300 flex flex-col items-center justify-center gap-1 ${
              activeTab === tab.id
                ? 'bg-purple-600/20 text-purple-300 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/30'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{tab.icon}</span>
              <span className="font-semibold">{tab.label}</span>
              {tab.count > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-gray-700/50 text-xs rounded-full">
                  {tab.count}
                </span>
              )}
            </div>
            {tab.description && (
              <span className="text-xs opacity-75">{tab.description}</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="relative min-h-[520px] bg-gradient-to-br from-gray-800/30 to-purple-900/30">
        {activeTab === 'viewer' && (
          <div className="w-full h-full">
            {loadedTabs.has('viewer') ? (
              // Mostrar el contenido principal basado en el tipo - PRIORIDAD: 3D > Video > Imágenes
              has3D ? (
                get3DModelUrl() ? (
                  <div className="w-full h-full">
                    <ModelViewerModal
                      src={get3DModelUrl()!}
                      alt={product.title}
                      className="w-full h-full"
                      autoRotate={true}
                      cameraControls={true}
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <div className="text-4xl mb-2">🧩</div>
                      <div className="text-lg font-medium">Modelo 3D no disponible</div>
                      <div className="text-sm">No se pudo cargar el modelo</div>
                    </div>
                  </div>
                )
              ) : hasVideo ? (
                getVideoUrl() ? (
                  <video
                    src={getVideoUrl()}
                    controls
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <div className="text-4xl mb-2">🎬</div>
                      <div className="text-lg font-medium">Vídeo no disponible</div>
                    </div>
                  </div>
                )
              ) : hasImages ? (
                <div className="w-full h-full relative">
                  <img
                    src={getAllImages()[0]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden w-full h-full flex items-center justify-center">
                    <DefaultCover
                      contentType={product.contentType}
                      className="w-full h-full"
                    />
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <div className="text-4xl mb-2">📁</div>
                    <div className="text-lg font-medium">Sin vista previa</div>
                    <div className="text-sm">Revisa la pestaña Archivos para ver el contenido</div>
                  </div>
                </div>
              )
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-2"></div>
                  <div className="text-sm">Cargando visor...</div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'files' && (
          <div className="w-full h-full p-6">
            {loadedTabs.has('files') ? (
              product.files && product.files.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-xl">📁</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Archivos incluidos</h3>
                      <p className="text-sm text-gray-400">{product.files.length} archivo{product.files.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  
                  <div className="grid gap-3">
                    {product.files.map((file, index) => (
                      <div
                        key={index}
                        className="group bg-gradient-to-r from-gray-800/40 to-purple-900/20 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-700/50 rounded-lg flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                            <span className="text-2xl">{getFileIcon(file)}</span>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-white font-medium truncate">{file.originalName || file.name}</h4>
                              <span className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full">
                                {getFileTypeLabel(file)}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                              <span>{formatFileSize(file.size)}</span>
                              <span>•</span>
                              <span className="font-mono text-xs">{file.name}</span>
                            </div>
                          </div>
                          
                        <div className="flex items-center gap-2">
                          {/* Botón "Ver en visor" - siempre visible */}
                          <button
                            onClick={() => {
                              // Si es un modelo 3D, cambiar al tab visor
                              if (file.type === 'model/gltf-binary' || file.type === 'model/gltf+json' || 
                                  file.type === 'application/octet-stream' || file.name.toLowerCase().includes('.glb') || 
                                  file.name.toLowerCase().includes('.gltf') || file.name.toLowerCase().includes('.vrm')) {
                                setActiveTab('viewer');
                              } else {
                                // Para otros archivos, abrir en nueva ventana
                                window.open(file.url, '_blank');
                              }
                            }}
                            className="px-3 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 rounded-lg text-sm font-medium transition-colors"
                          >
                            Ver en visor
                          </button>
                          
                          {/* Botón "Descargar" - solo si es el dueño */}
                          {isOwner && (
                            <button
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = file.url;
                                link.download = file.originalName || file.name;
                                link.click();
                              }}
                              className="px-3 py-2 bg-gray-600/20 hover:bg-gray-600/30 text-gray-300 rounded-lg text-sm font-medium transition-colors"
                            >
                              Descargar
                            </button>
                          )}
                        </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <div className="text-4xl mb-2">📁</div>
                    <div className="text-lg font-medium">No hay archivos</div>
                    <div className="text-sm">Aún no se han subido archivos</div>
                  </div>
                </div>
              )
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-2"></div>
                  <div className="text-sm">Cargando archivos...</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
