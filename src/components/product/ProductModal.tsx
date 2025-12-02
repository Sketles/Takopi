'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/shared/Toast';
import Link from 'next/link';
import ProductMediaTabs from './ProductMediaTabs';
import PurchasePanel from './PurchasePanel';
import DescriptionClamp from './DescriptionClamp';
import CommentsSection from './CommentsSection';
import ProductEditModal from './ProductEditModal';

/**
 * ProductModalProps - Props para el modal de detalles de producto
 * @interface ProductModalProps
 * @property {Object} product - Datos del contenido/producto
 * @property {string} product.id - ID único del contenido
 * @property {string} product.title - Título del contenido
 * @property {string} product.description - Descripción larga
 * @property {string} product.contentType - Tipo de contenido (MODEL_3D, MUSIC, etc)
 * @property {number} product.price - Precio en moneda indicada
 * @property {boolean} product.isFree - Si es contenido gratuito
 * @property {string} product.author - Nombre del autor
 * @property {boolean} isOpen - Si el modal está visible
 * @property {() => void} onClose - Callback para cerrar el modal
 * @property {(item: any) => void} [onAddToCart] - Callback al agregar al carrito
 */
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
    isPublished: boolean;
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
  const { addToast } = useToast();
  const router = useRouter();
  const authUserId = user?._id;
  const authorProfileLink = product?.authorId
    ? (authUserId && product.authorId === authUserId ? '/profile' : `/user/${product.authorId}`)
    : (product?.author && authUserId && product.author === user?.username ? '/profile' : undefined);

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
          addToast({ type: 'error', title: 'Usuario no encontrado', message: 'No hemos podido localizar al usuario solicitado.' });
        }
      } else {
        addToast({ type: 'error', title: 'Usuario no encontrado', message: 'No encontramos al usuario solicitado.' });
      }
    } catch (error) {
      console.error('Error looking up user by username:', error);
      addToast({ type: 'error', title: 'Error', message: 'Error buscando usuario. Inténtalo nuevamente.' });
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-3 sm:pt-16 lg:p-4 lg:pt-20">
        {/* Backdrop con blur intenso y oscuro */}
        <div
          className="absolute inset-0 bg-black/90 backdrop-blur-xl transition-opacity duration-500"
          onClick={onClose}
        />

        {/* Modal Container */}
        <div className="relative w-full max-w-7xl bg-[#0a0a0a] rounded-none sm:rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] h-[100dvh] sm:h-[calc(100vh-5rem)] sm:max-h-[90vh] overflow-hidden flex flex-col border-0 sm:border border-white/10 animate-scale-in">

          {/* Header Fijo - Siempre visible en móvil */}
          <div className="sticky top-0 left-0 right-0 z-30 flex items-center justify-between p-3 sm:p-4 bg-gradient-to-b from-black/80 via-black/60 to-transparent backdrop-blur-sm lg:absolute lg:bg-transparent lg:backdrop-blur-none">
            {/* Botón Volver (solo móvil) */}
            <button
              onClick={onClose}
              className="lg:hidden flex items-center gap-2 text-white/70 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-medium">Volver</span>
            </button>
            
            {/* Espacio vacío en desktop */}
            <div className="hidden lg:block"></div>
            
            {/* Botón X */}
            <button
              onClick={onClose}
              className="w-9 h-9 sm:w-10 sm:h-10 bg-black/60 hover:bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white/70 hover:text-white transition-all duration-300 border border-white/10 hover:border-white/20 group shadow-lg"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content - Scroll completo en móvil, grid en desktop */}
          <div className="flex-1 overflow-y-auto lg:overflow-hidden bg-[#0a0a0a]">
            
            {/* MÓVIL: Layout vertical scrolleable */}
            <div className="lg:hidden">
              {/* Visor 3D - se scrollea con el contenido */}
              <div className="relative bg-gradient-to-b from-black/80 to-[#0a0a0a] px-4 pt-4 pb-8">
                <div className="h-[45vh] min-h-[320px] max-h-[400px] flex items-center justify-center">
                  <div className="w-full h-full max-w-[92%] mx-auto flex items-center justify-center">
                    <ProductMediaTabs product={product} isOwner={isOwner} className="max-h-full w-auto max-w-full object-contain shadow-2xl rounded-xl" />
                  </div>
                </div>
                {/* Degradado inferior para transición suave */}
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none"></div>
              </div>
              
              {/* Info móvil - scrolleable */}
              <div className="p-4 pb-12 space-y-5 relative z-10">

                {/* Título y Autor - MÓVIL */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-white/5 text-white/60 text-[10px] font-bold rounded-full border border-white/10 uppercase tracking-wider">
                      {product.contentType}
                    </span>
                    {product.isFree && (
                      <span className="px-2.5 py-1 bg-green-500/10 text-green-400 text-[10px] font-bold rounded-full border border-green-500/20 uppercase">
                        Gratis
                      </span>
                    )}
                  </div>

                  <h1 className="text-2xl font-black text-white leading-tight tracking-tight">
                    {product.title}
                  </h1>

                  <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                    <button onClick={handleAuthorClick} className="flex items-center gap-2.5 group">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 p-[2px] flex-shrink-0">
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
                      <div className="flex flex-col text-left">
                        <span className="text-[10px] text-white/40">Creado por</span>
                        <span className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">
                          {product.author}
                        </span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Purchase Panel - MÓVIL */}
                <PurchasePanel
                  product={product}
                  isOwner={isOwner}
                  onEdit={handleEdit}
                  onBuy={onBuy}
                  onAddToBox={onAddToBox}
                  onLike={onLike}
                  onSave={onSave}
                  onShare={onShare}
                  className="bg-white/[0.02] border border-white/5 rounded-xl p-4 shadow-xl"
                />

                {/* Tabs: Detalles / Comentarios - MÓVIL */}
                <div className="space-y-4">
                  <div className="flex border-b border-white/10">
                    <button
                      onClick={() => setActiveSection('details')}
                      className={`pb-3 text-xs font-bold transition-colors relative px-3 ${activeSection === 'details' ? 'text-white' : 'text-white/40'}`}
                    >
                      Detalles
                      {activeSection === 'details' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 rounded-t-full"></div>
                      )}
                    </button>
                    <button
                      onClick={() => setActiveSection('comments')}
                      className={`pb-3 text-xs font-bold transition-colors relative px-3 ${activeSection === 'comments' ? 'text-white' : 'text-white/40'}`}
                    >
                      Comentarios
                      {activeSection === 'comments' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 rounded-t-full"></div>
                      )}
                    </button>
                  </div>

                  {activeSection === 'details' ? (
                    <div className="space-y-5">
                      <div className="prose prose-invert prose-sm max-w-none text-gray-400 text-sm leading-relaxed">
                        <DescriptionClamp
                          description={product.description}
                          shortDescription={product.shortDescription || product.description}
                          maxLines={4}
                          showViewMore={true}
                        />
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {[...(product.tags || []), ...(product.customTags || [])].map((tag, i) => (
                          <span key={i} className="px-2.5 py-1 bg-white/5 text-[10px] font-medium text-white/60 rounded-lg border border-white/5">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {product.files && product.files.length > 0 && (
                        <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                          <h3 className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            Archivos Incluidos
                          </h3>
                          <div className="space-y-2">
                            {product.files.map((file, idx) => (
                              <div key={idx} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2 text-gray-300 truncate max-w-[70%]">
                                  <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center text-white/40 flex-shrink-0">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                  </div>
                                  <span className="truncate">{file.name}</span>
                                </div>
                                <span className="text-white/30 text-[10px] bg-white/5 px-1.5 py-0.5 rounded">
                                  {(file.size / 1024 / 1024).toFixed(1)} MB
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <CommentsSection
                      productId={product.id}
                      isOwner={isOwner}
                      currentUserId={currentUserId}
                      onAddComment={(text) => console.log('Comment:', text)}
                      onLikeComment={(id) => console.log('Like:', id)}
                    />
                  )}
                </div>

              </div>
            </div>

            {/* DESKTOP: Grid de 2 columnas */}
            <div className="hidden lg:grid lg:grid-cols-12 h-full">

              {/* Columna Izquierda: Media (8 columnas) */}
              <div className="lg:col-span-8 relative flex flex-col items-center justify-center bg-black/40 h-full overflow-hidden p-8 pt-12">
                <div className="w-full h-full flex items-center justify-center">
                  <ProductMediaTabs product={product} isOwner={isOwner} className="max-h-full w-auto max-w-full object-contain shadow-2xl rounded-lg" />
                </div>
              </div>

              {/* Columna Derecha: Info & Actions (4 columnas) - SCROLLABLE */}
              <div className="lg:col-span-4 border-l border-white/5 flex flex-col h-full overflow-y-auto custom-scrollbar relative z-10 bg-[#0a0a0a]">

                {/* Scrollable Content */}
                <div className="p-6 space-y-6">

                  {/* Título y Autor */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-white/5 text-white/60 text-xs font-bold rounded-full border border-white/10 uppercase tracking-wider">
                        {product.contentType}
                      </span>
                      {product.isFree && (
                        <span className="px-3 py-1 bg-green-500/10 text-green-400 text-xs font-bold rounded-full border border-green-500/20 uppercase tracking-wider shadow-[0_0_10px_rgba(74,222,128,0.1)]">
                          Gratis
                        </span>
                      )}
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight tracking-tight break-words">
                      {product.title}
                    </h1>

                    <div className="flex items-center gap-3 pb-6 border-b border-white/5">
                      {authorProfileLink ? (
                        <button onClick={handleAuthorClick} title={product.author || 'Usuario'} className="flex items-center gap-3 group">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 p-[2px] flex-shrink-0 shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-all duration-300">
                            <div className="w-full h-full rounded-full overflow-hidden bg-black">
                              {product.authorAvatar ? (
                                <img src={product.authorAvatar} alt={product.author} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-sm font-bold text-white">
                                  {product.author ? product.author.charAt(0).toUpperCase() : 'U'}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col justify-center text-left">
                            <span className="text-xs text-white/40 leading-tight mb-0.5">Creado por</span>
                            <span className="text-base font-bold text-white group-hover:text-purple-400 transition-colors leading-tight">
                              {product.author || 'Usuario'}
                            </span>
                          </div>
                        </button>
                      ) : (
                        <button onClick={handleAuthorClick} className="flex items-center gap-3 group">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 p-[2px] flex-shrink-0 shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-all duration-300">
                            <div className="w-full h-full rounded-full overflow-hidden bg-black">
                              {product.authorAvatar ? (
                                <img src={product.authorAvatar} alt={product.author} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-sm font-bold text-white">
                                  {product.author?.charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col justify-center text-left">
                            <span className="text-xs text-white/40 leading-tight mb-0.5">Creado por</span>
                            <span className="text-base font-bold text-white group-hover:text-purple-400 transition-colors leading-tight">
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
                    className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 shadow-xl backdrop-blur-sm hover:bg-white/[0.04] transition-colors"
                  />

                  {/* Tabs: Detalles / Comentarios */}
                  <div className="space-y-6">
                    <div className="flex border-b border-white/10">
                      <button
                        onClick={() => setActiveSection('details')}
                        className={`pb-4 text-sm font-bold transition-colors relative px-4 ${activeSection === 'details' ? 'text-white' : 'text-white/40 hover:text-white/70'
                          }`}
                      >
                        Detalles
                        {activeSection === 'details' && (
                          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 rounded-t-full shadow-[0_-2px_10px_rgba(168,85,247,0.5)]"></div>
                        )}
                      </button>
                      <button
                        onClick={() => setActiveSection('comments')}
                        className={`pb-4 text-sm font-bold transition-colors relative px-4 ${activeSection === 'comments' ? 'text-white' : 'text-white/40 hover:text-white/70'
                          }`}
                      >
                        Comentarios
                        {activeSection === 'comments' && (
                          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 rounded-t-full shadow-[0_-2px_10px_rgba(168,85,247,0.5)]"></div>
                        )}
                      </button>
                    </div>

                    {activeSection === 'details' ? (
                      <div className="space-y-8 animate-fade-in">
                        {/* Descripción */}
                        <div className="prose prose-invert prose-sm max-w-none text-gray-400 leading-relaxed break-words">
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
                            <span key={i} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-xs font-medium text-white/60 hover:text-white rounded-lg border border-white/5 transition-all cursor-pointer">
                              #{tag}
                            </span>
                          ))}
                        </div>

                        {/* File Info */}
                        {product.files && product.files.length > 0 && (
                          <div className="bg-black/40 rounded-xl p-5 border border-white/5">
                            <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-4 flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                              Archivos Incluidos
                            </h3>
                            <div className="space-y-3">
                              {product.files.slice(0, 3).map((file, idx) => (
                                <div key={idx} className="flex items-center justify-between text-sm group">
                                  <div className="flex items-center gap-3 text-gray-300 truncate max-w-[70%]">
                                    <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-white/40 group-hover:text-purple-400 group-hover:bg-purple-500/10 transition-colors flex-shrink-0">
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                    </div>
                                    <span className="truncate font-medium group-hover:text-white transition-colors">{file.name}</span>
                                  </div>
                                  <span className="text-white/30 text-xs whitespace-nowrap bg-white/5 px-2 py-1 rounded flex-shrink-0">
                                    {(file.size / 1024 / 1024).toFixed(1)} MB
                                  </span>
                                </div>
                              ))}
                              {product.files.length > 3 && (
                                <div className="text-xs text-center text-white/30 pt-2 border-t border-white/5 mt-2">
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
