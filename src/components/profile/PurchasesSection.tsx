'use client';

import { useState, useEffect } from 'react';
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
  purchases: PurchaseItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
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
        alert('Error al procesar la descarga');
      }
    } catch (error) {
      alert('Error al procesar la descarga');
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
        <div className="w-full h-64 bg-gray-800/50 rounded-xl flex items-center justify-center">
          <div className="text-center text-gray-400">
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
      return (
        <div className="w-full h-64 bg-gray-900/50 rounded-xl overflow-hidden">
          <ModelViewerModal
            isOpen={true}
            onClose={() => {}}
            modelUrl={modelFile?.url || ''}
            modelTitle={content.title}
            inline={true}
          />
        </div>
      );
    }

    if (hasAudio && content.contentType === 'musica') {
      const audioFile = content.files.find((file: any) => 
        file.type?.includes('audio') || file.name?.match(/\.(mp3|wav|ogg)$/i)
      );
      return (
        <div className="w-full h-64 bg-gray-900/50 rounded-xl p-4">
          <MusicPlayer
            audioUrl={audioFile?.url || ''}
            title={content.title}
            artist={content.seller?.username || 'Artista'}
            coverImage={content.coverImage}
          />
        </div>
      );
    }

    if (hasImages && content.contentType === 'texturas') {
      const imageFiles = content.files.filter((file: any) => 
        file.type?.includes('image') || file.name?.match(/\.(jpg|jpeg|png|gif|webp)$/i)
      );
      return (
        <div className="w-full h-64 bg-gray-900/50 rounded-xl overflow-hidden">
          <TextureViewer
            images={imageFiles.map((file: any) => ({
              url: file.url,
              name: file.name,
              alt: file.name
            }))}
            title={content.title}
            inline={true}
          />
        </div>
      );
    }

    // Fallback: mostrar imagen de portada
    return (
      <div className="w-full h-64 bg-gray-900/50 rounded-xl overflow-hidden">
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
      <div className="bg-gradient-to-br from-gray-800/40 to-purple-900/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">Mis Compras</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          <span className="ml-3 text-gray-400">Cargando compras...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-gray-800/40 to-purple-900/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">Mis Compras</h3>
        <div className="text-center py-8">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => loadPurchases()}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-800/40 to-purple-900/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Mis Compras</h3>
        <span className="text-sm text-gray-400">
          {purchases.length} {purchases.length === 1 ? 'compra' : 'compras'}
        </span>
      </div>

      {purchases.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🛒</div>
          <h4 className="text-xl font-semibold text-white mb-2">No tienes compras aún</h4>
          <p className="text-gray-400 mb-6">Explora el marketplace y compra contenido increíble</p>
          <button
            onClick={() => window.location.href = '/explore'}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
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
                  className={`group bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden transition-all duration-500 ${
                    isExpanded 
                      ? 'border-purple-500/60 shadow-2xl shadow-purple-500/30' 
                      : 'hover:border-purple-500/60 hover:shadow-2xl hover:shadow-purple-500/20 hover:scale-[1.02]'
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
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        
                        {/* Overlay con información de compra */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                          <div className="absolute top-3 left-3 right-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-gray-300 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">
                                {formatDate(purchase.purchaseDate)}
                              </span>
                              <span className="text-sm font-bold text-green-400 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">
                                {formatPrice(purchase.amount, purchase.currency)}
                              </span>
                            </div>
                          </div>
                          
                          {/* Tipo de contenido */}
                          <div className="absolute top-3 left-3 mt-8">
                            <span className="inline-flex items-center gap-1 text-xs text-white bg-purple-600/80 backdrop-blur-sm px-2 py-1 rounded-full">
                              {getContentTypeIcon(purchase.content?.contentType || '')}
                            </span>
                          </div>

                          {/* Vendedor */}
                          <div className="absolute bottom-3 left-3 right-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-300">por</span>
                              <span className="text-sm font-semibold text-purple-300 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">
                                {purchase.seller?.username || 'Usuario eliminado'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Información del contenido */}
                      <div className="p-5">
                        <h4 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
                          {purchase.content?.title || 'Contenido no disponible'}
                        </h4>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                          <span className="flex items-center gap-1">
                            📥 {purchase.downloadCount} descargas
                          </span>
                          {purchase.lastDownloadDate && (
                            <span className="flex items-center gap-1">
                              🕒 {formatDate(purchase.lastDownloadDate)}
                            </span>
                          )}
                        </div>

                        {/* Botones de acción */}
                        <div className="grid grid-cols-2 gap-2">
                          {/* Botón de expandir */}
                          <button
                            onClick={() => toggleCardExpansion(purchase.id)}
                            className="px-3 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl transition-all duration-300 font-medium text-sm flex items-center justify-center gap-2 group/btn"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Ver Detalles
                          </button>

                          {/* Botón de descarga */}
                          <button
                            onClick={() => handleDownload(purchase.id, purchase.content?.title || 'Contenido')}
                            disabled={downloading === purchase.id}
                            className="px-3 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-xl transition-all duration-300 font-medium text-sm flex items-center justify-center gap-2 group/btn"
                          >
                            {downloading === purchase.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                              <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
                    <div className="p-6">
                      {/* Header de la tarjeta expandida */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => toggleCardExpansion(purchase.id)}
                            className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-xl transition-colors"
                          >
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                          <div>
                            <h3 className="text-xl font-bold text-white">
                              {purchase.content?.title || 'Contenido no disponible'}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="inline-flex items-center gap-1 text-xs text-white bg-purple-600/80 px-2 py-1 rounded-full">
                                {getContentTypeIcon(purchase.content?.contentType || '')}
                                {purchase.content?.contentType || 'Contenido'}
                              </span>
                              <span className="text-xs text-gray-400">
                                Comprado el {formatDate(purchase.purchaseDate)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-400">
                            {formatPrice(purchase.amount, purchase.currency)}
                          </div>
                          <div className="text-xs text-gray-400">
                            ID: {purchase.id.slice(0, 8)}...
                          </div>
                        </div>
                      </div>

                      {/* Layout de 2 columnas */}
                      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        {/* Columna izquierda - Visor (60%) */}
                        <div className="lg:col-span-3">
                          <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/50">
                            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              Visor
                            </h4>
                            {renderIntegratedViewer(purchase.content)}
                          </div>
                        </div>

                        {/* Columna derecha - Información y archivos (40%) */}
                        <div className="lg:col-span-2 space-y-6">
                          {/* Información del producto */}
                          <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/50">
                            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Información del Producto
                            </h4>
                            <div className="space-y-3 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-400">Vendedor:</span>
                                <span className="text-purple-300 font-medium">
                                  {purchase.seller?.username || 'Usuario eliminado'}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Categoría:</span>
                                <span className="text-white">{purchase.content?.category || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Descargas:</span>
                                <span className="text-white">{purchase.downloadCount}</span>
                              </div>
                              {purchase.lastDownloadDate && (
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Última descarga:</span>
                                  <span className="text-white">{formatDate(purchase.lastDownloadDate)}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Archivos incluidos */}
                          <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/50">
                            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                              </svg>
                              Archivos Incluidos ({purchase.content?.files?.length || 0})
                            </h4>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                              {purchase.content?.files?.length ? (
                                purchase.content.files.map((file: any, index: number) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/30"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="text-lg">
                                        {file.type?.includes('image') ? '🖼️' : 
                                         file.type?.includes('audio') ? '🎵' :
                                         file.name?.endsWith('.glb') || file.name?.endsWith('.gltf') ? '🎲' : '📁'}
                                      </div>
                                      <div>
                                        <p className="text-white text-sm font-medium">{file.name}</p>
                                        <p className="text-gray-400 text-xs">
                                          {file.size ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'N/A'}
                                        </p>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => handleDownload(purchase.id, file.name)}
                                      className="p-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-lg transition-colors"
                                      title="Descargar archivo"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3" />
                                      </svg>
                                    </button>
                                  </div>
                                ))
                              ) : (
                                <div className="text-center text-gray-400 py-4">
                                  <p>No hay archivos disponibles</p>
                                </div>
                              )}
                            </div>
                            <div className="mt-4 flex gap-2">
                              <button
                                onClick={() => handleDownload(purchase.id, purchase.content?.title || 'Contenido')}
                                disabled={downloading === purchase.id}
                                className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-xl transition-all duration-300 font-medium text-sm flex items-center justify-center gap-2"
                              >
                                {downloading === purchase.id ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                ) : (
                                  <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3" />
                                    </svg>
                                    Descargar Todo
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => handleViewContent(purchase.content)}
                                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl transition-all duration-300 font-medium text-sm flex items-center justify-center gap-2"
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
            <div className="flex items-center justify-center mt-8 gap-2">
              <button
                onClick={() => loadPurchases(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-lg transition-colors"
              >
                Anterior
              </button>
              <span className="px-4 py-2 text-white">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => loadPurchases(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-lg transition-colors"
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
