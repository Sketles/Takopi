'use client';

import { useState, useEffect } from 'react';
import ProductMediaTabs from './ProductMediaTabs';
import PurchasePanel from './PurchasePanel';
import DescriptionClamp from './DescriptionClamp';
import CommentsSection from './CommentsSection';
import ProductEditModal from './ProductEditModal';

interface ProductModalProps {
  product: {
    id: string;
    title: string;
    description: string;
    shortDescription?: string;
    contentType: string;
    category: string;
    price: number;
    currency: string;
    isFree: boolean;
    license: string;
    customLicense?: string;
    visibility: string;
    status: string;
    author: string;
    authorAvatar?: string;
    authorId?: string;
    likes: number;
    views: number;
    files?: Array<{
      name: string;
      type: string;
      size: number;
      url: string;
      previewUrl?: string;
      isCover?: boolean;
    }>;
    coverImage?: string;
    additionalImages?: string[];
    tags: string[];
    customTags?: string[];
    createdAt: string;
    updatedAt: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  isOwner?: boolean;
  currentUserId?: string;
  onEdit?: (product: any) => void;
  onDelete?: (product: any, source?: string) => void;
  onBuy?: (product: any) => void;
  onAddToBox?: (product: any) => void;
  onLike?: (product: any) => void;
  source?: string; // 'explore' | 'profile' | 'user-profile'
  onSave?: (product: any) => void;
  onShare?: (product: any) => void;
}

export default function ProductModal({
  product,
  isOpen,
  onClose,
  isOwner = false,
  currentUserId,
  onEdit,
  onDelete,
  onBuy,
  onAddToBox,
  onLike,
  source = 'explore',
  onSave,
  onShare
}: ProductModalProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Cerrar modal con tecla Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const handleEdit = () => {
    setIsEditModalOpen(true);
    onEdit?.(product);
  };

  const handleDelete = async (productId: string) => {
    try {
      await onDelete?.(product, source);
      setIsEditModalOpen(false);
      onClose();
    } catch (error) {
      console.error('Error in handleDelete:', error);
      // No cerrar el modal si hay error
    }
  };

  const handleSaveProduct = async (updatedProduct: any) => {
    try {
      await onSave?.(updatedProduct);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error al guardar producto:', error);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.(product);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    onSave?.(product);
  };

  const handleShare = () => {
    onShare?.(product);
  };

  const handleBuy = () => {
    onBuy?.(product);
  };

  const handleAddToBox = () => {
    onAddToBox?.(product);
  };


  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative w-full max-w-6xl bg-gradient-to-br from-gray-900/95 to-purple-900/95 backdrop-blur-xl rounded-2xl border border-purple-500/30 shadow-2xl max-h-[90vh] overflow-hidden flex flex-col custom-scrollbar">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-purple-500/20">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-white truncate">{product.title || 'Sin título'}</h1>
              <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full border border-purple-500/30">
                {product.contentType || 'Sin tipo'}
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-gray-500/20 hover:bg-gray-500/30 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
              {/* Columna izquierda - Media */}
              <div className="lg:col-span-2 space-y-4">
                <ProductMediaTabs product={product} isOwner={isOwner} />
                
                {/* Descripción */}
                <div className="bg-gradient-to-br from-gray-800/40 to-purple-900/40 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                  <h3 className="text-base font-semibold text-white mb-3">Descripción</h3>
                  <DescriptionClamp
                    description={product.description || 'Sin descripción'}
                    shortDescription={product.shortDescription || product.description || 'Sin descripción'}
                    maxLines={3}
                    showViewMore={true}
                  />
                </div>

                {/* Archivos */}
                {product.files && product.files.length > 0 && (
                  <div className="bg-gradient-to-br from-gray-800/40 to-purple-900/40 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                    <h3 className="text-base font-semibold text-white mb-3">Archivos incluidos</h3>
                    <div className="space-y-2">
                      {product.files.slice(0, 3).map((file, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-gray-700/30 rounded-lg">
                          <span className="text-sm">
                            {file.type?.startsWith('image/') ? '🖼️' : 
                             file.type?.startsWith('video/') ? '🎬' :
                             file.type?.startsWith('audio/') ? '🎵' :
                             file.type?.includes('gltf') || file.type?.includes('glb') ? '🧩' : '📁'}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="text-white text-xs font-medium truncate">{file.name}</div>
                            <div className="text-gray-400 text-xs">
                              {file.type?.split('/')[1]?.toUpperCase()} • {file.size ? (file.size / 1024 / 1024).toFixed(1) : '0'} MB
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Comentarios */}
                <div className="bg-gradient-to-br from-gray-800/40 to-purple-900/40 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                  <h3 className="text-base font-semibold text-white mb-3">Comentarios</h3>
                  <CommentsSection
                    productId={product.id || ''}
                    isOwner={isOwner}
                    currentUserId={currentUserId}
                    onAddComment={(text) => console.log('Agregar comentario:', text)}
                    onLikeComment={(commentId) => console.log('Like comentario:', commentId)}
                  />
                </div>

                {/* Resumen compacto */}
                <div className="bg-gradient-to-br from-gray-800/40 to-purple-900/40 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                  <h3 className="text-base font-semibold text-white mb-3">Detalles</h3>
                  <div className="space-y-3">
                    {/* Tags */}
                    {((product.tags && product.tags.length > 0) || (product.customTags && product.customTags.length > 0)) && (
                      <div>
                        <h4 className="text-xs font-medium text-gray-400 mb-2">Etiquetas</h4>
                        <div className="flex flex-wrap gap-1">
                          {[...(product.tags || []), ...(product.customTags || [])].slice(0, 6).map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full border border-purple-500/30"
                            >
                              #{tag}
                            </span>
                          ))}
                          {([...(product.tags || []), ...(product.customTags || [])].length > 6) && (
                            <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded-full">
                              +{([...(product.tags || []), ...(product.customTags || [])].length - 6)}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Información adicional */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-gray-400">Creado:</span>
                        <span className="text-white ml-1">
                          {product.createdAt ? new Date(product.createdAt).toLocaleDateString('es-CL') : 'No disponible'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Actualizado:</span>
                        <span className="text-white ml-1">
                          {product.updatedAt ? new Date(product.updatedAt).toLocaleDateString('es-CL') : 'No disponible'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Columna derecha - Panel de compra */}
              <div className="lg:col-span-1">
                <div className="sticky top-4">
                  <PurchasePanel
                    product={product}
                    isOwner={isOwner}
                    onEdit={handleEdit}
                    onViewStats={() => console.log('Ver estadísticas')}
                    onManageFiles={() => console.log('Gestionar archivos')}
                    onBuy={handleBuy}
                    onAddToBox={handleAddToBox}
                    onLike={handleLike}
                    onSave={handleSave}
                    onShare={handleShare}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de edición */}
      {isEditModalOpen && product && (
        <ProductEditModal
          product={{
            ...product,
            files: (product.files || []) as any[]
          }}
          isOpen={isEditModalOpen}
          onSave={handleSaveProduct}
          onCancel={() => setIsEditModalOpen(false)}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}
