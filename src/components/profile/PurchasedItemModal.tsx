'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { ModelViewerModal } from '../ModelViewer3D';
import MusicPlayer from '../product/MusicPlayer';
import TextureViewer from '../product/TextureViewer';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  
  if (!isOpen || !purchase) return null;
  
  // Validar estructura de purchase
  const is3DPrint = purchase.contentSnapshot?.type === '3d_print';
  const content = purchase.content || purchase.contentSnapshot;
  
  // Obtener datos del autor/vendedor
  const seller = purchase.seller || content?.author;
  const sellerUsername = seller?.username || content?.authorUsername || 'Vendedor';
  const sellerAvatar = seller?.avatar || content?.authorAvatar;
  
  // Detectar si el contenido es un modelo 3D que se puede imprimir
  const contentType = content?.contentType || purchase.contentSnapshot?.contentType;
  const canBePrinted = !is3DPrint && (
    contentType === 'modelos3d' || 
    contentType === '3d' || 
    contentType === 'model' || 
    contentType === 'avatares' ||
    contentType === 'avatar'
  );
  
  // Handler para ir a imprimir el modelo
  const handlePrint3D = () => {
    // Buscar archivo 3D en los archivos del contenido
    const modelFile = content?.files?.find((f: any) =>
      f.name?.toLowerCase().endsWith('.stl') ||
      f.name?.toLowerCase().endsWith('.obj') ||
      f.name?.toLowerCase().endsWith('.glb') ||
      f.name?.toLowerCase().endsWith('.gltf')
    ) || content?.files?.[0];

    const params = new URLSearchParams();
    params.set('productId', content?.id || purchase.contentId || purchase.id);
    params.set('productTitle', content?.title || 'Modelo 3D');
    // Agregar imagen del producto para el snapshot de compra
    if (content?.coverImage) {
      params.set('productImage', content.coverImage);
    }
    if (modelFile?.url) {
      params.set('modelUrl', modelFile.url);
      params.set('fileName', modelFile.name);
    }

    onClose(); // Cerrar el modal
    router.push(`/impresion-3d/configurar?${params.toString()}`);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Renderizar visor integrado según tipo de contenido
  const renderContentViewer = () => {
    // Para impresiones 3D, intentar mostrar el modelo si tiene archivos
    // Si no tiene archivos, mostrar la imagen del producto
    if (is3DPrint) {
      const printImage = purchase.contentSnapshot?.coverImage || content?.coverImage;
      const printTitle = purchase.contentSnapshot?.title || content?.title || 'Modelo 3D';
      const files = content?.files || purchase.contentSnapshot?.files;
      
      // Si tiene archivos 3D, mostrar el visor
      if (files && files.length > 0) {
        const modelFile = files.find((file: any) =>
          file.name?.endsWith('.glb') || file.name?.endsWith('.gltf')
        );
        
        if (modelFile?.url) {
          return (
            <div className="w-full h-full bg-[#0a0a0a] rounded-2xl overflow-hidden">
              <ModelViewerModal
                src={modelFile.url}
                alt={printTitle}
                width="100%"
                height="100%"
                autoRotate={true}
                cameraControls={true}
              />
            </div>
          );
        }
      }
      
      // Si tiene imagen de portada, mostrarla grande
      if (printImage && !printImage.includes('placeholder')) {
        return (
          <div className="w-full h-full bg-[#0a0a0a] rounded-2xl overflow-hidden">
            <img 
              src={printImage} 
              alt={printTitle}
              className="w-full h-full object-contain"
            />
          </div>
        );
      }
      
      // Fallback: placeholder
      return (
        <div className="w-full h-full bg-[#0a0a0a] rounded-2xl flex items-center justify-center border border-white/10">
          <div className="text-center p-8">
            <div className="text-6xl mb-4">🎲</div>
            <h3 className="text-xl font-bold text-white mb-2">{printTitle}</h3>
            <p className="text-gray-400 text-sm">Vista previa no disponible</p>
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
                {content?.title || purchase.contentSnapshot?.title || 'Modelo 3D'}
              </h1>
              
              <p className="text-gray-400 text-sm mb-4">
                {content?.shortDescription || content?.description || (is3DPrint ? 'Modelo 3D con servicio de impresión' : '')}
              </p>
            </div>

            {/* Purchase Info */}
            <div className="bg-[#0f0f0f] rounded-2xl p-4 sm:p-6 border border-white/10 mb-6">
              <h3 className="text-xs sm:text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Detalles de Compra
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-gray-400 text-xs sm:text-sm">Fecha</span>
                  <span className="text-white text-xs sm:text-sm">
                    {formatDate(purchase.purchaseDate || purchase.createdAt || new Date().toISOString())}
                  </span>
                </div>

                {!is3DPrint && (
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-gray-400 text-xs sm:text-sm">Creador</span>
                    <div className="flex items-center gap-2">
                      {sellerAvatar ? (
                        <img 
                          src={sellerAvatar} 
                          alt={sellerUsername}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white">
                          {sellerUsername.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="text-white text-xs sm:text-sm font-medium">{sellerUsername}</span>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400 text-xs sm:text-sm">ID</span>
                  <span className="text-white/60 text-xs font-mono">
                    #{purchase.id.slice(-8).toUpperCase()}
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
              <div className="space-y-3">
                {/* Botones en fila */}
                <div className="flex gap-2">
                  {/* Botón Descargar */}
                  <button
                    onClick={() => onDownload(purchase.id, content?.title || 'Contenido')}
                    disabled={downloading}
                    className={`${canBePrinted ? 'flex-1' : 'w-full'} px-4 py-2.5 bg-white text-black rounded-xl font-semibold text-sm hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                  >
                    {downloading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                        <span>Descargando...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span>Descargar Archivos</span>
                      </>
                    )}
                  </button>

                  {/* Botón Imprimir 3D - Solo para modelos 3D */}
                  {canBePrinted && (
                    <button
                      onClick={handlePrint3D}
                      className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                      <span>Imprimir en 3D</span>
                    </button>
                  )}
                </div>

                {/* Info de impresión 3D */}
                {canBePrinted && (
                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3 sm:p-4">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <h4 className="text-purple-400 font-bold text-xs sm:text-sm mb-0.5 sm:mb-1">¿Quieres tenerlo físico?</h4>
                        <p className="text-white/60 text-[10px] sm:text-xs leading-relaxed">
                          Imprime este modelo en 3D con nuestro servicio. Elige material, color y te lo enviamos a tu casa.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {is3DPrint && (
              <div className="space-y-4">
                {/* Botón para ver estado de impresión */}
                <button
                  onClick={() => {
                    onClose();
                    router.push('/profile?tab=prints');
                  }}
                  className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <span>🖨️</span>
                  <span>Ver Estado de Impresión</span>
                </button>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h4 className="text-blue-400 font-bold text-sm mb-1">Impresión 3D Solicitada</h4>
                      <p className="text-white/60 text-xs">
                        Este modelo tiene una orden de impresión activa. Ve a "Mis Impresiones" para ver el tracking completo.
                      </p>
                    </div>
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
