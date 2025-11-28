'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { ModelViewerModal } from '../ModelViewer3D';
import MusicPlayer from '../product/MusicPlayer';
import TextureViewer from '../product/TextureViewer';

interface PurchasedItemModalProps {
  purchase: any;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (purchaseId: string, contentTitle: string) => void;
  downloading: boolean;
}

export default function PurchasedItemModal({
  purchase,
  isOpen,
  onClose,
  onDownload,
  downloading,
}: PurchasedItemModalProps) {
  if (!isOpen || !purchase) return null;
  
  // Validar estructura de purchase
  const amount = purchase.amount ?? 0;
  const currency = purchase.currency || 'CLP';

  const is3DPrint = purchase.contentSnapshot?.type === '3d_print';
  const content = purchase.content || purchase.contentSnapshot;
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (amount: number | undefined, currency: string) => {
    if (!amount || isNaN(amount)) return 'Precio no disponible';
    return `$${amount.toLocaleString('es-CL')} ${currency}`;
  };

  // Renderizar visor integrado según tipo de contenido
  const renderContentViewer = () => {
    if (is3DPrint) {
      return (
        <div className="w-full h-full bg-[#0a0a0a] rounded-2xl flex items-center justify-center border border-white/10">
          <div className="text-center p-8">
            <div className="text-6xl mb-4">🖨️</div>
            <h3 className="text-xl font-bold text-white mb-2">Orden de Impresión 3D</h3>
            <p className="text-gray-400 text-sm">
              Tu pedido de impresión está en proceso
            </p>
          </div>
        </div>
      );
    }

    if (!content || !content.files || content.files.length === 0) {
      return (
        <div className="w-full h-full bg-[#0a0a0a] rounded-2xl flex items-center justify-center border border-white/10">
          <div className="text-center text-gray-400">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2-2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p>No hay contenido disponible</p>
          </div>
        </div>
      );
    }

    // Detectar tipo de archivo
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

    if (has3D) {
      const modelFile = content.files.find((file: any) =>
        file.name?.endsWith('.glb') || file.name?.endsWith('.gltf')
      );

      if (modelFile?.url) {
        return (
          <div className="w-full h-full bg-[#0a0a0a] rounded-2xl overflow-hidden">
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

    if (hasAudio) {
      return (
        <div className="w-full h-full bg-[#0a0a0a] rounded-2xl p-6">
          <MusicPlayer
            files={content.files}
            title={content.title}
            coverImage={content.coverImage}
          />
        </div>
      );
    }

    if (hasImages) {
      return (
        <div className="w-full h-full bg-[#0a0a0a] rounded-2xl overflow-hidden">
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
      <div className="w-full h-full bg-[#0a0a0a] rounded-2xl overflow-hidden">
        <img
          src={content.coverImage || '/placeholder-content.jpg'}
          alt={content.title}
          className="w-full h-full object-cover"
        />
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-7xl max-h-[90vh] bg-[#0a0a0a] rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-50 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 transition-colors flex items-center justify-center"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 h-full max-h-[90vh]">
          {/* Left: Preview (7/12) */}
          <div className="lg:col-span-7 bg-black p-8 flex items-center justify-center">
            <div className="w-full h-[520px]">
              {renderContentViewer()}
            </div>
          </div>

          {/* Right: Details (5/12) */}
          <div className="lg:col-span-5 p-8 overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold uppercase tracking-wider mb-4">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Comprado
              </div>
              
              <h1 className="text-3xl font-bold text-white mb-2">
                {is3DPrint ? 'Impresión 3D' : content?.title || 'Contenido'}
              </h1>
              
              <p className="text-gray-400 text-sm mb-4">
                {is3DPrint 
                  ? 'Servicio de impresión 3D personalizado'
                  : content?.shortDescription || content?.description || ''}
              </p>
            </div>

            {/* Purchase Info */}
            <div className="bg-[#0f0f0f] rounded-2xl p-6 border border-white/10 mb-6">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Información de Compra
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-white/5">
                  <span className="text-gray-400 text-sm">Precio Pagado</span>
                  <span className="text-white font-bold text-lg">
                    {formatPrice(amount, currency)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center pb-3 border-b border-white/5">
                  <span className="text-gray-400 text-sm">Fecha de Compra</span>
                  <span className="text-white text-sm">
                    {formatDate(purchase.purchaseDate || purchase.createdAt || new Date().toISOString())}
                  </span>
                </div>

                {!is3DPrint && purchase.seller && (
                  <div className="flex justify-between items-center pb-3 border-b border-white/5">
                    <span className="text-gray-400 text-sm">Vendedor</span>
                    <span className="text-white text-sm flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-xs font-bold text-purple-400">
                        {purchase.seller.username?.charAt(0).toUpperCase()}
                      </div>
                      {purchase.seller.username}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center pb-3 border-b border-white/5">
                  <span className="text-gray-400 text-sm">Estado</span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                    {purchase.status === 'completed' ? 'Completado' : purchase.status}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">ID de Transacción</span>
                  <span className="text-white/60 text-xs font-mono">
                    {purchase.id.slice(0, 12)}...
                  </span>
                </div>
              </div>
            </div>

            {/* 3D Print Details */}
            {is3DPrint && purchase.contentSnapshot && (
              <div className="bg-[#0f0f0f] rounded-2xl p-6 border border-white/10 mb-6">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                  Detalles de Impresión
                </h3>
                
                <div className="space-y-3 text-sm">
                  {purchase.contentSnapshot.material && (
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-gray-400">Material</span>
                      <span className="text-white">{purchase.contentSnapshot.material}</span>
                    </div>
                  )}
                  {purchase.contentSnapshot.color && (
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-gray-400">Color</span>
                      <span className="text-white">{purchase.contentSnapshot.color}</span>
                    </div>
                  )}
                  {purchase.contentSnapshot.shippingMethod && (
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-gray-400">Envío</span>
                      <span className="text-white capitalize">{purchase.contentSnapshot.shippingMethod}</span>
                    </div>
                  )}
                  {purchase.contentSnapshot.transbankData?.authorizationCode && (
                    <div className="flex justify-between py-2">
                      <span className="text-gray-400">Código Autorización</span>
                      <span className="text-white font-mono text-xs">
                        {purchase.contentSnapshot.transbankData.authorizationCode}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Files Section (only for digital content) */}
            {!is3DPrint && content?.files && content.files.length > 0 && (
              <div className="bg-[#0f0f0f] rounded-2xl p-6 border border-white/10 mb-6">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Archivos Incluidos ({content.files.length})
                </h3>
                
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {content.files.map((file: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-black/40 flex items-center justify-center text-xl flex-shrink-0">
                        {file.type?.includes('image') ? '🖼️' :
                          file.type?.includes('audio') ? '🎵' :
                            file.name?.endsWith('.glb') || file.name?.endsWith('.gltf') ? '🎲' : '📁'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{file.name}</p>
                        <p className="text-gray-400 text-xs">
                          {file.size ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Tamaño desconocido'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            {!is3DPrint && (
              <button
                onClick={() => onDownload(purchase.id, content?.title || 'Contenido')}
                disabled={downloading}
                className="w-full px-6 py-4 bg-white text-black rounded-xl font-bold text-lg hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {downloading ? (
                  <>
                    <div className="w-5 h-5 border-4 border-black/30 border-t-black rounded-full animate-spin"></div>
                    Descargando...
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Descargar Archivos
                  </>
                )}
              </button>
            )}

            {is3DPrint && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="text-blue-400 font-bold text-sm mb-1">Estado del Pedido</h4>
                    <p className="text-white/60 text-xs">
                      Te notificaremos por correo cuando tu impresión esté lista y en camino.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
