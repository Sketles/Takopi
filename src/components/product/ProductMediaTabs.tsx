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
      originalName?: string;
    }>;
  };
  isOwner?: boolean;
  className?: string;
}

export default function ProductMediaTabs({ product, isOwner = false, className = '' }: ProductMediaTabsProps) {
  const [activeTab, setActiveTab] = useState<'viewer' | 'files'>('viewer');
  const [loadedTabs, setLoadedTabs] = useState<Set<string>>(new Set(['viewer']));

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

    // También cerrar al hacer scroll
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
              {tab.count && tab.count > 0 && (
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
                      width="100%"
                      height="520px"
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
        <div className="w-full h-full p-6 overflow-visible">
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
                
                <div className="grid gap-3 overflow-visible">
                  {product.files.map((file, index) => (
                    <div
                      key={index}
                      className="group bg-gradient-to-r from-gray-800/40 to-purple-900/20 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300 relative"
                      style={{ zIndex: 10 - index }}
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
                          
                        <div className="flex items-center gap-3">
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
                          
                          {/* Menú de tres puntos - solo si es el dueño */}
                          {isOwner && (
                            <div className="relative" style={{ zIndex: 999999 }}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  console.log('🔧 Click en botón de tres puntos');
                                  const menu = e.currentTarget.nextElementSibling as HTMLElement;
                                  console.log('🔧 Menu encontrado:', menu);
                                  
                                  // Cerrar otros menús abiertos primero
                                  document.querySelectorAll('.file-menu').forEach(otherMenu => {
                                    if (otherMenu !== menu) {
                                      otherMenu.classList.add('hidden');
                                    }
                                  });
                                  
                                  // Toggle del menú actual
                                  if (menu) {
                                    menu.classList.toggle('hidden');
                                    console.log('🔧 Menu toggle:', menu.classList.contains('hidden') ? 'oculto' : 'visible');
                                  }
                                }}
                                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors relative z-50"
                                title="Más opciones"
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                </svg>
                              </button>
                              
                              {/* Menú dropdown */}
                              <div className="file-menu absolute right-0 top-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-2xl min-w-[140px] hidden"
                                   style={{ 
                                     zIndex: 999999
                                   }}>
                                <div className="py-1">
                                  <button
                                    onClick={() => {
                                      const link = document.createElement('a');
                                      link.href = file.url;
                                      link.download = file.originalName || file.name;
                                      link.click();
                                      // Cerrar menú
                                      const menu = document.querySelector('.file-menu') as HTMLElement;
                                      menu?.classList.add('hidden');
                                    }}
                                    className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-2"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Descargar
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (confirm(`¿Estás seguro de que quieres eliminar "${file.originalName || file.name}"?`)) {
                                        // TODO: Implementar eliminación de archivo
                                        console.log('Eliminar archivo:', file);
                                        alert('Funcionalidad de eliminación pendiente de implementar');
                                      }
                                      // Cerrar menú
                                      const menu = document.querySelector('.file-menu') as HTMLElement;
                                      menu?.classList.add('hidden');
                                    }}
                                    className="w-full px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors flex items-center gap-2"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Eliminar
                                  </button>
                                </div>
                              </div>
                            </div>
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
