'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
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
  const [activeSection, setActiveSection] = useState<'details' | 'comments'>('details');

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

  const { user } = useAuth();
  const router = useRouter();
  const authUserId = user?._id;
  const authorProfileLink = product?.authorId ? `/user/${product.authorId}` : (product?.author && authUserId && product.author === user?.username ? '/profile' : undefined);

  const handleAuthorClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product) return;
    if (authorProfileLink) {
      router.push(authorProfileLink);
      onClose();
      return;
    }
    if (!product.author) return;
    try {
      const resp = await fetch(`/api/user/lookup?username=${encodeURIComponent(product.author)}`);
      if (resp.ok) {
        const data = await resp.json();
        if (data.success && data.data?.id) {
          onClose();
          router.push(`/user/${data.data.id}`);
        } else {
          alert('Usuario no encontrado');
        }
      } else {
        alert('Usuario no encontrado');
      }
    } catch (error) {
      console.error('Error looking up user by username:', error);
      alert('Error buscando usuario');
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop con blur intenso */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
          onClick={onClose}
        />

        {/* Modal Container */}
        <div className="relative w-full max-w-7xl bg-[#0f0f0f] rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col border border-white/5 animate-scale-in">

          {/* Header Minimalista */}
          <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-6 pointer-events-none">
            <div className="pointer-events-auto">
              {/* Espacio para breadcrumbs o back button si fuera necesario */}
            </div>
            <button
              onClick={onClose}
              className="pointer-events-auto w-10 h-10 bg-black/50 hover:bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white/70 hover:text-white transition-all duration-300 border border-white/5 hover:border-white/20 group"
            >
              <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content Grid */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-full">

              {/* Columna Izquierda: Media (7 columnas) */}
              <div className="lg:col-span-8 bg-[#050505] relative flex flex-col">
                <div className="flex-1 relative min-h-[400px] lg:min-h-[600px]">
                  <ProductMediaTabs product={product} isOwner={isOwner} className="h-full border-none rounded-none bg-transparent" />
                </div>
              </div>

              {/* Columna Derecha: Info & Actions (5 columnas) */}
              <div className="lg:col-span-4 bg-[#0f0f0f] border-l border-white/5 flex flex-col h-full max-h-[90vh] overflow-y-auto custom-scrollbar">

                {/* Scrollable Content */}
                <div className="p-6 space-y-8">

                  {/* Título y Autor */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-white/5 text-white/60 text-xs font-medium rounded-full border border-white/5 uppercase tracking-wider">
                        {product.contentType}
                      </span>
                      {product.isFree && (
                        <span className="px-3 py-1 bg-green-500/10 text-green-400 text-xs font-medium rounded-full border border-green-500/20 uppercase tracking-wider">
                          Gratis
                        </span>
                      )}
                    </div>

                    <h1 className="text-3xl font-bold text-white leading-tight">{product.title}</h1>

                    <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                      {authorProfileLink ? (
                        <button onClick={handleAuthorClick} title={product.author || 'Usuario'} className="flex items-center gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 p-[1px]">
                              <div className="w-full h-full rounded-full overflow-hidden bg-black">
                          <div className="w-full h-full rounded-full overflow-hidden bg-black">
                            {product.authorAvatar ? (
                              <img src={product.authorAvatar} alt={product.author} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white">
                                {product.author ? product.author.charAt(0).toUpperCase() : 'U'}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-white/40 leading-none mb-1">Creado por</span>
                          <span className="text-sm font-medium text-white hover:text-purple-400 transition-colors cursor-pointer">
                            {product.author || 'Usuario'}
                          </span>
                              </div>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm text-white/40 leading-none mb-1">Creado por</span>
                              <span className="text-sm font-medium text-white hover:text-purple-400 transition-colors cursor-pointer">
                                {product.author}
                              </span>
                            </div>
                          </div>
                        </button>
                      ) : (
                        <button onClick={handleAuthorClick} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 p-[1px]">
                            <div className="w-full h-full rounded-full overflow-hidden bg-black">
                              {product.authorAvatar ? (
                                <img src={product.authorAvatar} alt={product.author} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white">
                                  {product.author?.charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm text-white/40 leading-none mb-1">Creado por</span>
                            <span className="text-sm font-medium text-white hover:text-purple-400 transition-colors cursor-pointer">
                              {product.author}
                            </span>
                          </div>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Purchase Panel (Mobile/Desktop integrated) */}
                  <PurchasePanel
                    product={product}
                    isOwner={isOwner}
                    onEdit={handleEdit}
                    onBuy={onBuy}
                    onAddToBox={onAddToBox}
                    onLike={onLike}
                    onSave={onSave}
                    onShare={onShare}
                    className="bg-white/5 border border-white/5 rounded-2xl p-5 shadow-xl"
                  />

                  {/* Tabs: Detalles / Comentarios */}
                  <div className="space-y-4">
                    <div className="flex border-b border-white/10">
                      <button
                        onClick={() => setActiveSection('details')}
                        className={`pb-3 text-sm font-medium transition-colors relative ${activeSection === 'details' ? 'text-white' : 'text-white/40 hover:text-white/70'
                          }`}
                      >
                        Detalles
                        {activeSection === 'details' && (
                          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 rounded-full"></div>
                        )}
                      </button>
                      <button
                        onClick={() => setActiveSection('comments')}
                        className={`ml-6 pb-3 text-sm font-medium transition-colors relative ${activeSection === 'comments' ? 'text-white' : 'text-white/40 hover:text-white/70'
                          }`}
                      >
                        Comentarios
                        {activeSection === 'comments' && (
                          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 rounded-full"></div>
                        )}
                      </button>
                    </div>

                    {activeSection === 'details' ? (
                      <div className="space-y-6 animate-fade-in">
                        {/* Descripción */}
                        <div className="prose prose-invert prose-sm max-w-none text-gray-300">
                          <DescriptionClamp
                            description={product.description}
                            shortDescription={product.shortDescription || product.description}
                            maxLines={6}
                            showViewMore={true}
                          />
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                          {[...(product.tags || []), ...(product.customTags || [])].map((tag, i) => (
                            <span key={i} className="text-xs text-white/50 hover:text-white/80 transition-colors cursor-pointer">
                              #{tag}
                            </span>
                          ))}
                        </div>

                        {/* File Info */}
                        {product.files && product.files.length > 0 && (
                          <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                            <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">Archivos Incluidos</h3>
                            <div className="space-y-2">
                              {product.files.slice(0, 3).map((file, idx) => (
                                <div key={idx} className="flex items-center justify-between text-sm">
                                  <div className="flex items-center gap-2 text-white/80 truncate">
                                    <span className="opacity-50">📄</span>
                                    <span className="truncate">{file.name}</span>
                                  </div>
                                  <span className="text-white/30 text-xs whitespace-nowrap">
                                    {(file.size / 1024 / 1024).toFixed(1)} MB
                                  </span>
                                </div>
                              ))}
                              {product.files.length > 3 && (
                                <div className="text-xs text-white/30 pt-1">
                                  + {product.files.length - 3} archivos más
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="animate-fade-in">
                        <CommentsSection
                          productId={product.id}
                          isOwner={isOwner}
                          currentUserId={currentUserId}
                          onAddComment={(text) => console.log('Comment:', text)}
                          onLikeComment={(id) => console.log('Like:', id)}
                        />
                      </div>
                    )}
                  </div>

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
            files: (product.files || []) as any[],
            customTags: product.customTags || []
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
