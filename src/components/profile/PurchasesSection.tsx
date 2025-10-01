'use client';

import { useState, useEffect } from 'react';
import ContentCard from '@/components/shared/ContentCard';
import { useAuth } from '@/contexts/AuthContext';

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
                className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-600/40 overflow-hidden hover:border-purple-500/50 transition-all duration-300"
              >
                {/* Header con información de compra */}
                <div className="p-4 border-b border-gray-600/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">
                      Comprado el {formatDate(purchase.purchaseDate)}
                    </span>
                    <span className="text-sm font-semibold text-green-400">
                      {formatPrice(purchase.amount, purchase.currency)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Vendedor:</span>
                    <span className="text-sm text-purple-300 font-medium">
                      {purchase.seller.username}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>📥 {purchase.downloadCount} descargas</span>
                    {purchase.lastDownloadDate && (
                      <span>Última: {formatDate(purchase.lastDownloadDate)}</span>
                    )}
                  </div>
                </div>

                {/* Contenido de la compra */}
                <div className="p-4">
                  <ContentCard
                    id={purchase.content.id}
                    title={purchase.content.title}
                    author={purchase.content.author}
                    contentType={purchase.content.contentType}
                    category={purchase.content.category}
                    image={purchase.content.coverImage}
                    price={purchase.content.price}
                    isFree={purchase.content.isFree}
                    currency={purchase.content.currency}
                    likes={0}
                    comments={0}
                    visits={0}
                    license={purchase.content.license}
                    tags={purchase.content.tags}
                    createdAt={purchase.content.createdAt}
                    showPrice={false}
                    showStats={false}
                    className="h-[280px]"
                  />
                </div>

                {/* Botones de acción */}
                <div className="p-4 border-t border-gray-600/40">
                  <button
                    onClick={() => handleDownload(purchase.id, purchase.content.title)}
                    disabled={downloading === purchase.id}
                    className="w-full px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg transition-all duration-300 font-medium flex items-center justify-center gap-2"
                  >
                    {downloading === purchase.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Procesando...
                      </>
                    ) : (
                      <>
                        📥 Descargar Contenido
                      </>
                    )}
                  </button>
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
    </div>
  );
}
