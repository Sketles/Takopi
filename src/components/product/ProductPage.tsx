'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/shared/Toast';
import ProductMediaTabs from './ProductMediaTabs';
import PurchasePanel from './PurchasePanel';
import DescriptionClamp from './DescriptionClamp';
import CommentsSection from './CommentsSection';
import ProductEditModal from './ProductEditModal';

interface ProductPageProps {
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
  isOwner?: boolean;
  onEdit?: (product: any) => void;
  onDelete?: (product: any) => void;
  onBuy?: (product: any) => void;
  onAddToBox?: (product: any) => void;
  onLike?: (product: any) => void;
  onSave?: (product: any) => void;
  onShare?: (product: any) => void;
}

export default function ProductPage({
  product,
  isOwner = false,
  onEdit,
  onDelete,
  onBuy,
  onAddToBox,
  onLike,
  onSave,
  onShare
}: ProductPageProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'comments'>('overview');
  const router = useRouter();
  const { addToast } = useToast();

  const handleEdit = () => {
    setIsEditModalOpen(true);
    onEdit?.(product);
  };

  const handleDelete = (productId: string) => {
    onDelete?.(product);
    setIsEditModalOpen(false);
    router.push('/profile');
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

  const handleBack = () => {
    router.back();
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">😞</div>
          <div className="text-2xl font-bold mb-2">Producto no encontrado</div>
          <div className="text-gray-400 mb-6">El producto que buscas no existe o ha sido eliminado</div>
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
          >
            Volver atrás
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900/80 to-purple-900/80 backdrop-blur-xl border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver
            </button>
            
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full border border-purple-500/30">
                {product.contentType}
              </span>
              {isOwner && (
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors text-sm"
                >
                  Editar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna izquierda - Media y descripción */}
          <div className="lg:col-span-2 space-y-8">
            {/* Media */}
            <ProductMediaTabs product={product} />
            
            {/* Descripción completa */}
            <div className="bg-gradient-to-br from-gray-800/40 to-purple-900/40 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
              <h2 className="text-2xl font-bold text-white mb-6">Descripción</h2>
              <div className="prose prose-invert max-w-none">
                <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {product.description}
                </div>
              </div>
            </div>

            {/* Archivos detallados */}
            {product.files && product.files.length > 0 && (
              <div className="bg-gradient-to-br from-gray-800/40 to-purple-900/40 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
                <h2 className="text-2xl font-bold text-white mb-6">Archivos incluidos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.files.map((file, index) => (
                    <div key={index} className="bg-gray-700/30 rounded-xl p-4 hover:bg-gray-700/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl flex-shrink-0">
                          {file.type.startsWith('image/') ? '🖼️' : 
                           file.type.startsWith('video/') ? '🎬' :
                           file.type.startsWith('audio/') ? '🎵' :
                           file.type.includes('gltf') || file.type.includes('glb') ? '🧩' : '📁'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-medium mb-1 truncate">{file.name}</div>
                          <div className="text-gray-400 text-sm mb-2">
                            {file.type.split('/')[1]?.toUpperCase()} • {(file.size / 1024 / 1024).toFixed(1)} MB
                          </div>
                          {isOwner ? (
                            <button
                              onClick={() => window.open(file.url, '_blank')}
                              className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
                            >
                              Ver archivo
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                addToast({ type: 'warning', title: 'Compra necesaria', message: 'Debes comprar este contenido para poder ver y descargar los archivos.' });
                              }}
                              className="text-gray-500 text-sm font-medium cursor-not-allowed"
                              disabled
                            >
                              🔒 Comprar para ver
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comentarios */}
            <div className="bg-gradient-to-br from-gray-800/40 to-purple-900/40 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
              <div className="flex items-center gap-4 mb-6">
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
                <div className="space-y-6">
                  {/* Tags */}
                  {(product.tags.length > 0 || (product.customTags && product.customTags.length > 0)) && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Etiquetas</h3>
                      <div className="flex flex-wrap gap-2">
                        {[...product.tags, ...(product.customTags || [])].map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full border border-purple-500/30"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Información técnica */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Información técnica</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Tipo de contenido:</span>
                        <span className="text-white">{product.contentType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Categoría:</span>
                        <span className="text-white">{product.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Licencia:</span>
                        <span className="text-white">
                          {product.license === 'custom' && product.customLicense 
                            ? product.customLicense 
                            : product.license}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Visibilidad:</span>
                        <span className="text-white">
                          {product.visibility === 'public' ? 'Público' :
                           product.visibility === 'unlisted' ? 'No listado' : 'Borrador'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Creado:</span>
                        <span className="text-white">
                          {new Date(product.createdAt).toLocaleDateString('es-CL')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Actualizado:</span>
                        <span className="text-white">
                          {new Date(product.updatedAt).toLocaleDateString('es-CL')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'comments' && (
                <CommentsSection
                  productId={product.id}
                  isOwner={isOwner}
                />
              )}
            </div>
          </div>

          {/* Columna derecha - Panel de compra */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
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

      {/* Modal de edición */}
      {isEditModalOpen && (
        <ProductEditModal
          product={{
            ...product,
            customTags: product.customTags || [],
            files: (product.files || []).map((file: any) => ({
              id: file.id || '',
              name: file.name || '',
              originalName: file.originalName || file.name || '',
              size: file.size || 0,
              type: file.type || '',
              url: file.url || '',
              previewUrl: file.previewUrl,
              isCover: file.isCover
            })),
            license: (product as any).license || 'cc-by-4.0',
            customLicense: (product as any).customLicense,
            visibility: (product as any).visibility || 'public',
            additionalImages: (product as any).additionalImages || []
          }}
          isOpen={isEditModalOpen}
          onSave={handleSaveProduct}
          onCancel={() => setIsEditModalOpen(false)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
