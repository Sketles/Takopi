'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/components/shared/Toast';
import { useAuth } from '@/contexts/AuthContext';
import PurchasedItemModal from './PurchasedItemModal';

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
  const [selectedPurchase, setSelectedPurchase] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToast } = useToast();

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

  // Abrir modal con la compra seleccionada
  const handleViewPurchase = (purchase: any) => {
    setSelectedPurchase(purchase);
    setIsModalOpen(true);
  };

  // Cerrar modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPurchase(null);
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
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {purchases.map((purchase) => {
              // Determinar si es una impresión 3D o contenido digital
              const is3DPrint = !purchase.contentId && purchase.contentSnapshot;
              const title = is3DPrint 
                ? 'Impresión 3D' 
                : (purchase.content?.title || 'Contenido no disponible');
              const coverImage = is3DPrint 
                ? '/placeholder-3d-print.jpg' 
                : (purchase.content?.coverImage || '/placeholder-content.jpg');
              const contentType = is3DPrint 
                ? '3d-print' 
                : (purchase.content?.contentType || '');
              
              return (
                <div
                  key={purchase.id}
                  className="group bg-[#0f0f0f] rounded-3xl border border-white/5 overflow-hidden transition-all duration-300 hover:border-white/20 hover:shadow-xl hover:shadow-white/5 hover:-translate-y-1 cursor-pointer"
                  onClick={() => handleViewPurchase(purchase)}
                >
                  {/* Imagen del contenido */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={coverImage}
                      alt={title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Overlay gradiente */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent opacity-80"></div>

                    {/* Badges superiores */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                        {getContentTypeIcon(contentType)}
                        <span className="capitalize">{is3DPrint ? 'Impresión 3D' : contentType}</span>
                      </span>
                      <span className="text-xs font-bold text-green-400 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                        {formatPrice(purchase.amount, purchase.currency)}
                      </span>
                    </div>

                    {/* Fecha en la parte inferior */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center gap-2 text-xs text-white/60">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{formatDate(purchase.purchaseDate)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Información del contenido */}
                  <div className="p-6">
                    <h4 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-purple-400 transition-colors">
                      {title}
                    </h4>

                    <div className="flex items-center justify-between text-xs text-white/40 mb-6">
                      <span className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        {purchase.seller?.username || 'Takopi'}
                      </span>
                      {!is3DPrint && (
                        <span className="flex items-center gap-1">
                          📥 {purchase.downloadCount || 0}
                        </span>
                      )}
                    </div>

                    {/* Botones de acción */}
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewPurchase(purchase);
                        }}
                        className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all duration-300 font-medium text-sm flex items-center justify-center gap-2 border border-white/5 hover:border-white/10"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Ver Detalles
                      </button>

                      {!is3DPrint && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(purchase.id, title);
                          }}
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
                      )}
                      {is3DPrint && (
                        <div className="px-4 py-2.5 bg-purple-500/10 text-purple-400 rounded-xl font-medium text-sm flex items-center justify-center gap-2 border border-purple-500/20">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          En Proceso
                        </div>
                      )}
                    </div>
                  </div>
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

      {/* Modal de Detalles de Compra */}
      {isModalOpen && selectedPurchase && (
        <PurchasedItemModal
          purchase={selectedPurchase}
          isOpen={isModalOpen}
          onClose={closeModal}
          onDownload={handleDownload}
          downloading={downloading}
        />
      )}
    </div>
  );
}
