'use client';

import { useState, useEffect } from 'react';
import ContentCard from '@/components/shared/ContentCard';
import { useAuth } from '@/contexts/AuthContext';
import FileExplorerModal from '@/components/product/FileExplorerModal';

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

  const loadPurchases = async (page: number = 1) => {
    if (!user) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('takopi_token');
      
      if (!token) {
        setError('No se encontró token de autenticación');
        return;
      }

      console.log('🔍 PurchasesSection - Token found:', token ? 'Yes' : 'No');
      console.log('🔍 PurchasesSection - Making request to purchases API');

      const response = await fetch(`/api/user/purchases?page=${page}&limit=20`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('🔍 PurchasesSection - Response status:', response.status);

      if (response.ok) {
        const result: PurchasesResponse = await response.json();
        setPurchases(result.data.purchases);
        setTotalPages(result.data.pagination.totalPages);
        setCurrentPage(result.data.pagination.currentPage);
        setError(null);
      } else {
        setError('Error al cargar las compras');
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

  const formatPrice = (amount: number, currency: string) => {
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {purchases.map((purchase) => (
              <div
                key={purchase.id}
                className="group bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden hover:border-purple-500/60 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 hover:scale-[1.02]"
              >
                {/* Imagen del contenido con overlay de información */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={purchase.content.coverImage || '/placeholder-content.jpg'}
                    alt={purchase.content.title}
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
                        {purchase.content.contentType === 'avatares' && '👤'}
                        {purchase.content.contentType === 'modelos3d' && '🎲'}
                        {purchase.content.contentType === 'musica' && '🎵'}
                        {purchase.content.contentType === 'texturas' && '🖼️'}
                        {purchase.content.contentType === 'animaciones' && '🎬'}
                        {purchase.content.contentType === 'OBS' && '📺'}
                        {purchase.content.contentType === 'colecciones' && '📦'}
                        {purchase.content.contentType || '📄'}
                      </span>
                    </div>

                    {/* Vendedor */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-300">por</span>
                        <span className="text-sm font-semibold text-purple-300 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">
                          {purchase.seller.username}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Información del contenido */}
                <div className="p-5">
                  <h4 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
                    {purchase.content.title}
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

                      {/* Botones de acción según el tipo de contenido */}
                      <div className="grid grid-cols-2 gap-2">
                        {/* Botón de ver detalles */}
                        <button
                          onClick={() => handleViewContent(purchase.content)}
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
                          onClick={() => handleDownload(purchase.id, purchase.content.title)}
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
              </div>
            ))}
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
