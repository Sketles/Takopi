'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/components/shared/Toast';
import ContentCard from '@/components/shared/ContentCard';
import { useAuth } from '@/contexts/AuthContext';
import FileExplorerModal from '@/components/product/FileExplorerModal';
import { ModelViewerModal } from '../ModelViewer3D';
import MusicPlayer from '../product/MusicPlayer';
import TextureViewer from '../product/TextureViewer';

interface PurchaseItem {
  id: string;
  purchaseDate: string;
  amount: number;
  currency: string;
  downloadCount: number;
  lastDownloadDate?: string;
  content: {
    id: string;
    title: string;
    description: string;
    contentType: string;
    category: string;
    coverImage: string;
    files: any[];
    price: string;
    isFree: boolean;
    license: string;
    tags: string[];
    createdAt: string;
    author: string;
  };
  seller: {
    id: string;
    username: string;
    avatar: string;
  };
}

interface PurchasesResponse {
  data: {
    purchases: PurchaseItem[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

export default function PurchasesSection() {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState<PurchaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const { addToast } = useToast();
  const [showFileExplorer, setShowFileExplorer] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const loadPurchases = async (page: number = 1) => {
    if (!user) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('takopi_token');

      if (!token) {
        setError('No se encontró token de autenticación');
        return;
      }


      const response = await fetch(`/api/user/purchases?page=${page}&limit=20`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });


      if (response.ok) {
        const result: PurchasesResponse = await response.json();
        setPurchases(result.data.purchases);
        setTotalPages(result.data.pagination.totalPages);
        setCurrentPage(result.data.pagination.currentPage);
        setError(null);
      } else {
        // Solo mostrar error si es un error real del servidor (500, 401, etc.)
        // Si es 404 o la respuesta está vacía, no es un error
        if (response.status >= 500) {
          setError('Error al cargar las compras');
        } else {
          // No es un error, simplemente no hay compras
          setPurchases([]);
          setTotalPages(1);
          setCurrentPage(1);
          setError(null);
        }
      }
    } catch (error) {
      setError('Error al cargar las compras');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (purchaseId: string, contentTitle: string) => {
    try {
      setDownloading(purchaseId);
      const token = localStorage.getItem('takopi_token');

      const response = await fetch(`/api/user/purchases/${purchaseId}/download`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        const { files } = result.data.content;

        // Crear un archivo ZIP con todos los archivos
        if (files && files.length > 0) {
          // Por ahora, descargar el primer archivo disponible
          // En el futuro se puede implementar un ZIP con todos los archivos
          const firstFile = files[0];
          if (firstFile && firstFile.url) {
            const link = document.createElement('a');
            link.href = firstFile.url;
            link.download = firstFile.originalName || firstFile.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Actualizar la lista de compras para reflejar el nuevo contador de descargas
            loadPurchases(currentPage);
          }
        }
      } else {
        addToast({ type: 'error', title: 'Error', message: 'Error al procesar la descarga' });
      }
    } catch (error) {
      addToast({ type: 'error', title: 'Error', message: 'Error al procesar la descarga' });
    } finally {
      setDownloading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (amount: number | undefined, currency: string) => {
    if (!amount || isNaN(amount)) return 'Precio no disponible';
    return `$${amount.toLocaleString('es-CL')} ${currency}`;
  };

  // Función para obtener el icono según el tipo de contenido
  const getContentTypeIcon = (contentType: string) => {
    switch (contentType) {
      case 'avatares':
        return '👤';
      case 'modelos3d':
        return '🎲';
      case 'musica':
        return '🎵';
      case 'texturas':
        return '🖼️';
      case 'animaciones':
        return '🎬';
      case 'OBS':
        return '📺';
      case 'colecciones':
        return '📦';
      default:
        return '📄';
    }
  };

  // Función para obtener la acción según el tipo de contenido
  const getContentTypeAction = (contentType: string) => {
    switch (contentType) {
      case 'avatares':
      case 'modelos3d':
        return 'Ver en Visor';
      case 'musica':
        return 'Reproducir';
      case 'texturas':
      case 'animaciones':
        return 'Ver Galería';
      case 'OBS':
        return 'Ver Widget';
      case 'colecciones':
        return 'Ver Colección';
      default:
        return 'Ver Contenido';
    }
  };

  // Función para manejar la visualización del contenido
  const handleViewContent = (content: any) => {
    setSelectedContent(content);
    setShowFileExplorer(true);
  };

  // Función para cerrar el explorador de archivos
  const closeFileExplorer = () => {
    setShowFileExplorer(false);
    setSelectedContent(null);
  };

  // Función para alternar la expansión de una tarjeta
  const toggleCardExpansion = (purchaseId: string) => {
    setExpandedCard(expandedCard === purchaseId ? null : purchaseId);
  };

  // Función para renderizar el visor integrado según el tipo de contenido
  const renderIntegratedViewer = (content: any) => {
    if (!content || !content.files || content.files.length === 0) {
      return (
        <div className="w-full h-64 bg-[#050505] rounded-xl flex items-center justify-center border border-white/5">
          <div className="text-center text-white/40">
            <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p>No hay archivos disponibles</p>
          </div>
        </div>
      );
    }

    // Detectar tipo de archivo principal
    const has3D = content.files.some((file: any) =>
      file.type?.includes('gltf') ||
      file.type?.includes('glb') ||
      file.name?.endsWith('.glb') ||
      file.name?.endsWith('.gltf')
    );

    const hasAudio = content.files.some((file: any) =>
      file.type?.includes('audio') ||
      file.name?.match(/\.(mp3|wav|ogg|flac|m4a)$/i)
    );

    const hasImages = content.files.some((file: any) =>
      file.type?.includes('image') ||
      file.name?.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i)
    );

    // Renderizar visor según tipo de contenido
    if (has3D && content.contentType === 'modelos3d') {
      const modelFile = content.files.find((file: any) =>
        file.name?.endsWith('.glb') || file.name?.endsWith('.gltf')
      );

      if (modelFile?.url) {
        return (
          <div className="w-full h-64 bg-[#050505] rounded-xl overflow-hidden border border-white/5">
            <ModelViewerModal
              src={modelFile.url}
              alt={content.title}
              width="100%"
              height="100%"
              autoRotate={true}
              cameraControls={true}
            />
          </div>
        );
      }
    }

    if (hasAudio && content.contentType === 'musica') {
      return (
        <div className="w-full h-64 bg-[#050505] rounded-xl p-4 border border-white/5">
          <MusicPlayer
            files={content.files}
            title={content.title}
            coverImage={content.coverImage}
          />
        </div>
      );
    }

    if (hasImages && content.contentType === 'texturas') {
      return (
        <div className="w-full h-64 bg-[#050505] rounded-xl overflow-hidden border border-white/5">
          <TextureViewer
            files={content.files}
            title={content.title}
            isOwner={true}
          />
        </div>
      );
    }

    // Fallback: mostrar imagen de portada
    return (
      <div className="w-full h-64 bg-[#050505] rounded-xl overflow-hidden border border-white/5">
        <img
          src={content.coverImage || '/placeholder-content.jpg'}
          alt={content.title}
          className="w-full h-full object-cover"
        />
      </div>
    );
  };

  useEffect(() => {
    loadPurchases();
  }, [user]);

  if (loading) {
    return (
      <div className="bg-[#0f0f0f] rounded-3xl p-8 border border-white/5">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
          <span className="ml-3 text-white/40">Cargando compras...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#0f0f0f] rounded-3xl p-8 border border-white/5 text-center">
        <div className="text-red-500 text-xl mb-4">⚠️</div>
        <p className="text-white/60 mb-6">{error}</p>
        <button
          onClick={() => loadPurchases()}
          className="px-6 py-2 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {purchases.length === 0 ? (
        <div className="text-center py-20 bg-[#0f0f0f] rounded-3xl border border-white/5">
          <div className="text-6xl mb-6 opacity-20">🛒</div>
          <h3 className="text-2xl font-bold text-white mb-2">No tienes compras aún</h3>
          <p className="text-white/40 max-w-md mx-auto mb-8">
            Explora el marketplace y descubre contenido increíble para tus proyectos.
          </p>
          <button
            onClick={() => window.location.href = '/explore'}
            className="px-8 py-3 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-all duration-300 shadow-lg shadow-white/5"
          >
            Explorar Marketplace
          </button>
        </div>
      ) : (
        <>
          <div className={`grid gap-6 transition-all duration-500 ${expandedCard ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
            {purchases.map((purchase) => {
              const isExpanded = expandedCard === purchase.id;
              return (
                <div
                  key={purchase.id}
                  className={`group bg-[#0f0f0f] rounded-3xl border border-white/5 overflow-hidden transition-all duration-500 ${isExpanded
                    ? 'ring-2 ring-white/20 shadow-2xl shadow-black/50'
                    : 'hover:border-white/20 hover:shadow-xl hover:shadow-white/5 hover:-translate-y-1'
                    }`}
                >
                  {/* Estado Colapsado */}
                  {!isExpanded && (
                    <>
                      {/* Imagen del contenido con overlay de información */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={purchase.content?.coverImage || '/placeholder-content.jpg'}
                          alt={purchase.content?.title || 'Contenido eliminado'}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />

                        {/* Overlay con información de compra */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent opacity-80"></div>

                        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                            {getContentTypeIcon(purchase.content?.contentType || '')}
                            <span className="capitalize">{purchase.content?.contentType || 'Contenido'}</span>
                          </span>
                          <span className="text-xs font-bold text-green-400 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                            {formatPrice(purchase.amount, purchase.currency)}
                          </span>
                        </div>

                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex items-center gap-2 text-xs text-white/60">
                            <span>Comprado el {formatDate(purchase.purchaseDate)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Información del contenido */}
                      <div className="p-6">
                        <h4 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-purple-400 transition-colors">
                          {purchase.content?.title || 'Contenido no disponible'}
                        </h4>

                        <div className="flex items-center justify-between text-xs text-white/40 mb-6">
                          <span className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            {purchase.seller?.username || 'Usuario eliminado'}
                          </span>
                          <span className="flex items-center gap-1">
                            📥 {purchase.downloadCount} descargas
                          </span>
                        </div>

                        {/* Botones de acción */}
                        <div className="grid grid-cols-2 gap-3">
                          {/* Botón de expandir */}
                          <button
                            onClick={() => toggleCardExpansion(purchase.id)}
                            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all duration-300 font-medium text-sm flex items-center justify-center gap-2 border border-white/5 hover:border-white/10"
                          >
                            Ver Detalles
                          </button>

                          {/* Botón de descarga */}
                          <button
                            onClick={() => handleDownload(purchase.id, purchase.content?.title || 'Contenido')}
                            disabled={downloading === purchase.id}
                            className="px-4 py-2.5 bg-white text-black hover:bg-gray-200 disabled:bg-gray-600 disabled:text-gray-400 rounded-xl transition-all duration-300 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-white/5"
                          >
                            {downloading === purchase.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                            ) : (
                              <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Descargar
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Estado Expandido */}
                  {isExpanded && (
                    <div className="p-8">
                      {/* Header de la tarjeta expandida */}
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => toggleCardExpansion(purchase.id)}
                            className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/5"
                          >
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                          <div>
                            <h3 className="text-2xl font-bold text-white">
                              {purchase.content?.title || 'Contenido no disponible'}
                            </h3>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white/60 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                                {getContentTypeIcon(purchase.content?.contentType || '')}
                                <span className="capitalize">{purchase.content?.contentType || 'Contenido'}</span>
                              </span>
                              <span className="text-xs text-white/40">
                                Comprado el {formatDate(purchase.purchaseDate)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-400">
                            {formatPrice(purchase.amount, purchase.currency)}
                          </div>
                          <div className="text-xs text-white/20 font-mono mt-1">
                            ID: {purchase.id.slice(0, 8)}...
                          </div>
                        </div>
                      </div>

                      {/* Layout de 2 columnas */}
                      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        {/* Columna izquierda - Visor (60%) */}
                        <div className="lg:col-span-3">
                          <div className="bg-[#050505] rounded-2xl p-1 border border-white/5">
                            <div className="bg-[#0f0f0f] rounded-xl overflow-hidden">
                              {renderIntegratedViewer(purchase.content)}
                            </div>
                          </div>
                        </div>

                        {/* Columna derecha - Información y archivos (40%) */}
                        <div className="lg:col-span-2 space-y-6">
                          {/* Información del producto */}
                          <div className="bg-[#050505] rounded-2xl p-6 border border-white/5">
                            <h4 className="text-sm font-bold text-white/40 uppercase tracking-wider mb-4 flex items-center gap-2">
                              Información del Producto
                            </h4>
                            <div className="space-y-4 text-sm">
                              <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="text-white/60">Vendedor</span>
                                <span className="text-white font-medium flex items-center gap-2">
                                  <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px]">
                                    {purchase.seller?.username?.charAt(0).toUpperCase()}
                                  </div>
                                  {purchase.seller?.username || 'Usuario eliminado'}
                                </span>
                              </div>
                              <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="text-white/60">Categoría</span>
                                <span className="text-white">{purchase.content?.category || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="text-white/60">Descargas</span>
                                <span className="text-white">{purchase.downloadCount}</span>
                              </div>
                              {purchase.lastDownloadDate && (
                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                  <span className="text-white/60">Última descarga</span>
                                  <span className="text-white">{formatDate(purchase.lastDownloadDate)}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Archivos incluidos */}
                          <div className="bg-[#050505] rounded-2xl p-6 border border-white/5">
                            <h4 className="text-sm font-bold text-white/40 uppercase tracking-wider mb-4 flex items-center gap-2">
                              Archivos Incluidos ({purchase.content?.files?.length || 0})
                            </h4>
                            <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                              {purchase.content?.files?.length ? (
                                purchase.content.files.map((file: any, index: number) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors group/file"
                                  >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                      <div className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center text-lg">
                                        {file.type?.includes('image') ? '🖼️' :
                                          file.type?.includes('audio') ? '🎵' :
                                            file.name?.endsWith('.glb') || file.name?.endsWith('.gltf') ? '🎲' : '📁'}
                                      </div>
                                      <div className="min-w-0">
                                        <p className="text-white text-sm font-medium truncate">{file.name}</p>
                                        <p className="text-white/40 text-xs">
                                          {file.size ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'N/A'}
                                        </p>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => handleDownload(purchase.id, file.name)}
                                      className="p-2 bg-white/5 hover:bg-white text-white hover:text-black rounded-lg transition-all opacity-0 group-hover/file:opacity-100"
                                      title="Descargar archivo"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                      </svg>
                                    </button>
                                  </div>
                                ))
                              ) : (
                                <div className="text-center text-white/40 py-4">
                                  <p>No hay archivos disponibles</p>
                                </div>
                              )}
                            </div>
                            <div className="mt-6 flex gap-3">
                              <button
                                onClick={() => handleDownload(purchase.id, purchase.content?.title || 'Contenido')}
                                disabled={downloading === purchase.id}
                                className="flex-1 px-4 py-3 bg-white text-black hover:bg-gray-200 disabled:bg-gray-600 disabled:text-gray-400 rounded-xl transition-all duration-300 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-white/5"
                              >
                                {downloading === purchase.id ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                                ) : (
                                  <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    Descargar Todo
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => handleViewContent(purchase.content)}
                                className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all duration-300 font-medium text-sm flex items-center justify-center gap-2 border border-white/5 hover:border-white/10"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                Ver Más
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center mt-12 gap-2">
              <button
                onClick={() => loadPurchases(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-[#0f0f0f] border border-white/5 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
              >
                Anterior
              </button>
              <span className="px-4 py-2 text-white/60">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => loadPurchases(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-[#0f0f0f] border border-white/5 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal del Explorador de Archivos */}
      {showFileExplorer && selectedContent && (
        <FileExplorerModal
          isOpen={showFileExplorer}
          onClose={closeFileExplorer}
          content={selectedContent}
        />
      )}
    </div>
  );
}
