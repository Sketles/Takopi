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
    customTags: string[];
    createdAt: string;
    updatedAt: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  isOwner?: boolean;
  onEdit?: (product: any) => void;
  onDelete?: (product: any) => void;
  onBuy?: (product: any) => void;
  onAddToBox?: (product: any) => void;
  onLike?: (product: any) => void;
  onSave?: (product: any) => void;
  onShare?: (product: any) => void;
}

export default function ProductModal({
  product,
  isOpen,
  onClose,
  isOwner = false,
  onEdit,
  onDelete,
  onBuy,
  onAddToBox,
  onLike,
  onSave,
  onShare
}: ProductModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'comments'>('overview');
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

  const handleDelete = (productId: string) => {
    onDelete?.(product);
    setIsEditModalOpen(false);
    onClose();
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

  const handleViewMore = () => {
    // Navegar a PDP
    window.open(`/contenido/${product.id}`, '_blank');
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
        <div className="relative w-full max-w-7xl bg-gradient-to-br from-gray-900/95 to-purple-900/95 backdrop-blur-xl rounded-3xl border border-purple-500/30 shadow-2xl max-h-[95vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-purple-500/20">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-white">{product.title}</h1>
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full border border-purple-500/30">
                {product.contentType}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleViewMore}
                className="px-4 py-2 bg-gray-600/50 text-gray-300 rounded-xl hover:bg-gray-600 transition-colors text-sm"
              >
                Ver página completa
              </button>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-gray-500/20 hover:bg-gray-500/30 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6">
              {/* Columna izquierda - Media */}
              <div className="lg:col-span-2 space-y-6">
                <ProductMediaTabs product={product} isOwner={isOwner} />
                
                {/* Descripción */}
                <div className="bg-gradient-to-br from-gray-800/40 to-purple-900/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                  <h3 className="text-lg font-semibold text-white mb-4">Descripción</h3>
                  <DescriptionClamp
                    description={product.description}
                    shortDescription={product.shortDescription}
                    maxLines={5}
                    showViewMore={true}
                    onViewMore={handleViewMore}
                  />
                </div>

                {/* Archivos */}
                {product.files && product.files.length > 0 && (
                  <div className="bg-gradient-to-br from-gray-800/40 to-purple-900/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                    <h3 className="text-lg font-semibold text-white mb-4">Archivos incluidos</h3>
                    <div className="space-y-2">
                      {product.files.slice(0, 3).map((file, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                          <span className="text-lg">
                            {file.type.startsWith('image/') ? '🖼️' : 
                             file.type.startsWith('video/') ? '🎬' :
                             file.type.startsWith('audio/') ? '🎵' :
                             file.type.includes('gltf') || file.type.includes('glb') ? '🧩' : '📁'}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="text-white text-sm font-medium truncate">{file.name}</div>
                            <div className="text-gray-400 text-xs">
                              {file.type.split('/')[1]?.toUpperCase()} • {(file.size / 1024 / 1024).toFixed(1)} MB
                            </div>
                          </div>
                        </div>
                      ))}
                      {product.files.length > 3 && (
                        <button
                          onClick={handleViewMore}
                          className="w-full py-2 text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
                        >
                          Ver todos los archivos ({product.files.length})
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Comentarios */}
                <div className="bg-gradient-to-br from-gray-800/40 to-purple-900/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                  <div className="flex items-center gap-4 mb-4">
                    <button
                      onClick={() => setActiveTab('overview')}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        activeTab === 'overview'
                          ? 'bg-purple-600/20 text-purple-300'
                          : 'text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      Resumen
                    </button>
                    <button
                      onClick={() => setActiveTab('comments')}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        activeTab === 'comments'
                          ? 'bg-purple-600/20 text-purple-300'
                          : 'text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      Comentarios
                    </button>
                  </div>

                  {activeTab === 'overview' && (
                    <div className="space-y-4">
                      {/* Tags */}
                      {(product.tags.length > 0 || product.customTags.length > 0) && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-400 mb-2">Etiquetas</h4>
                          <div className="flex flex-wrap gap-2">
                            {[...product.tags, ...product.customTags].map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full border border-purple-500/30"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Información adicional */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Creado:</span>
                          <span className="text-white ml-2">
                            {new Date(product.createdAt).toLocaleDateString('es-CL')}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">Actualizado:</span>
                          <span className="text-white ml-2">
                            {new Date(product.updatedAt).toLocaleDateString('es-CL')}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'comments' && (
                    <CommentsSection
                      productId={product.id}
                      isOwner={isOwner}
                      onAddComment={(text) => console.log('Agregar comentario:', text)}
                      onLikeComment={(commentId) => console.log('Like comentario:', commentId)}
                    />
                  )}
                </div>
              </div>

              {/* Columna derecha - Panel de compra */}
              <div className="lg:col-span-1">
                <div className="sticky top-6">
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
      {isEditModalOpen && (
        <ProductEditModal
          product={product}
          isOpen={isEditModalOpen}
          onSave={handleSaveProduct}
          onCancel={() => setIsEditModalOpen(false)}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}
