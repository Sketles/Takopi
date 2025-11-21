'use client';

import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/components/shared/Toast';
import { useRouter } from 'next/navigation';

interface PurchasePanelProps {
  product: {
    id: string;
    title: string;
    price: number;
    currency: string;
    isFree: boolean;
    contentType: string;
    license: string;
    customLicense?: string;
    files?: Array<{
      name: string;
      type: string;
      size: number;
      url: string;
    }>;
    author: string;
    authorAvatar?: string;
    authorId?: string;
    likes: number;
    views: number;
    status: string;
    visibility: string;
    coverImage?: string;
  };
  isOwner?: boolean;
  onEdit?: () => void;
  onViewStats?: () => void;
  onManageFiles?: () => void;
  onBuy?: (product: any) => void;
  onAddToBox?: (product: any) => void;
  onLike?: (product: any) => void;
  onSave?: (product: any) => void;
  onShare?: (product: any) => void;
  className?: string;
}

export default function PurchasePanel({
  product,
  isOwner = false,
  onEdit,
  onViewStats,
  onManageFiles,
  onBuy,
  onAddToBox,
  onLike,
  onSave,
  onShare,
  className = ''
}: PurchasePanelProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const { addProductToCart, isProductInCart } = useCart();
  const { addToast } = useToast();
  const router = useRouter();

  const formatPrice = (price: number | undefined, isFree: boolean, currency: string) => {
    if (isFree) return 'GRATIS';
    if (!price || isNaN(price)) return 'Precio no disponible';
    return `$${price.toLocaleString('es-CL')} ${currency}`;
  };

  const handleAddToBox = async () => {
    if (isAddingToCart) return;

    setIsAddingToCart(true);

    try {
      if (isProductInCart(product.id)) {
        addToast({
          type: 'warning',
          title: 'Ya está en tu Box',
          message: 'Este producto ya está en tu carrito'
        });
        return;
      }

      const result = addProductToCart({
        ...product,
        author: product.author || 'Usuario',
        authorUsername: typeof product.author === 'string' ? product.author : 'Usuario',
        coverImage: product.coverImage || '/placeholder-content.jpg'
      });

      if (result.success) {
        addToast({
          type: 'success',
          title: 'Agregado a tu Box',
          message: result.message
        });
        onAddToBox?.(product);
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          message: result.message
        });
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'No se pudo agregar al carrito'
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handlePrint3D = () => {
    // Buscar archivo 3D
    const modelFile = product.files?.find(f =>
      f.name.toLowerCase().endsWith('.stl') ||
      f.name.toLowerCase().endsWith('.obj') ||
      f.name.toLowerCase().endsWith('.glb') ||
      f.name.toLowerCase().endsWith('.gltf')
    ) || product.files?.[0];

    console.log('🖨️ Preparando impresión 3D:', {
      productId: product.id,
      modelFile: modelFile,
      allFiles: product.files
    });

    const params = new URLSearchParams();
    params.set('productId', product.id);
    params.set('productTitle', product.title);
    if (modelFile?.url) {
      params.set('modelUrl', modelFile.url);
      params.set('fileName', modelFile.name);
    }

    router.push(`/impresion-3d/configurar?${params.toString()}`);
  };

  const isInCart = isProductInCart(product.id);
  const canBePrinted = product.contentType === 'modelos3d' || 
                       product.contentType === '3d' || 
                       product.contentType === 'model' || 
                       product.contentType === 'avatares' ||
                       product.contentType === 'avatar';

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

  return (
    <div className={`flex flex-col gap-6 ${className}`}>

      {/* Price Section */}
      <div className="text-center space-y-1">
        <div className={`text-5xl font-black tracking-tight ${product.isFree
          ? 'text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]'
          : 'bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-600 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(168,85,247,0.4)]'
          }`}>
          {formatPrice(product.price, product.isFree, product.currency)}
        </div>
        {!product.isFree && (
          <p className="text-xs text-white/40 uppercase tracking-widest">Pago Único</p>
        )}
      </div>

      {/* Main Actions */}
      <div className="space-y-3">
        {isOwner ? (
          <>
            <button
              onClick={onEdit}
              className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>✏️</span> Editar Producto
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button className="py-3 bg-black/30 hover:bg-black/50 text-white/70 hover:text-white rounded-xl text-sm font-medium transition-all">
                Estadísticas
              </button>
              <button className="py-3 bg-black/30 hover:bg-black/50 text-white/70 hover:text-white rounded-xl text-sm font-medium transition-all">
                Archivos
              </button>
            </div>
          </>
        ) : (
          <>
            <button
              onClick={() => {
                const checkoutItem = {
                  id: product.id,
                  title: product.title,
                  price: product.price || 0,
                  currency: product.currency,
                  contentType: product.contentType,
                  author: product.author || 'Anónimo',
                  coverImage: product.coverImage
                };
                const checkoutUrl = `/checkout?items=${encodeURIComponent(JSON.stringify([checkoutItem]))}&total=${product.price || 0}`;
                window.location.href = checkoutUrl;
              }}
              className="group relative w-full py-4 bg-white text-black rounded-xl font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
              <span className="relative flex items-center justify-center gap-2">
                {product.isFree ? 'DESCARGAR AHORA' : 'COMPRAR AHORA'}
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </span>
            </button>

            {/* Botón Imprimir y Comprar (Solo para modelos 3D y Avatares) */}
            {canBePrinted && (
              <button
                onClick={handlePrint3D}
                className="group relative w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(6,182,212,0.3)] overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                <span className="relative flex items-center justify-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" /></svg>
                  IMPRIMIR Y COMPRAR
                </span>
              </button>
            )}

            <button
              onClick={handleAddToBox}
              disabled={isAddingToCart || isInCart}
              className={`w-full py-4 rounded-xl font-bold text-sm tracking-wide uppercase transition-all duration-300 flex items-center justify-center gap-2 border ${isInCart
                ? 'bg-green-500/10 border-green-500/30 text-green-400 cursor-default'
                : 'bg-transparent border-white/20 text-white hover:bg-white/5 hover:border-white/40'
                }`}
            >
              {isAddingToCart ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
              ) : isInCart ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  En tu Box
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                  Agregar a Box
                </>
              )}
            </button>
          </>
        )}
      </div>

      {/* Social Actions */}
      <div className="flex items-center justify-between px-2 pt-4 border-t border-white/5">
        <button
          onClick={handleLike}
          className={`flex flex-col items-center gap-1 text-xs font-medium transition-colors ${isLiked ? 'text-red-500' : 'text-white/40 hover:text-white'}`}
        >
          <svg className={`w-6 h-6 ${isLiked ? 'fill-current' : 'stroke-current fill-none'}`} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span>{product.likes + (isLiked ? 1 : 0)}</span>
        </button>

        <button
          onClick={handleSave}
          className={`flex flex-col items-center gap-1 text-xs font-medium transition-colors ${isSaved ? 'text-purple-500' : 'text-white/40 hover:text-white'}`}
        >
          <svg className={`w-6 h-6 ${isSaved ? 'fill-current' : 'stroke-current fill-none'}`} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <span>Guardar</span>
        </button>

        <button
          onClick={handleShare}
          className="flex flex-col items-center gap-1 text-xs font-medium text-white/40 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6 stroke-current fill-none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          <span>Compartir</span>
        </button>
      </div>

      {/* License Info */}
      <div className="bg-black/20 rounded-lg p-3 text-center">
        <p className="text-xs text-white/30">
          Licencia: <span className="text-white/60 font-medium">{product.license === 'commercial' ? 'Comercial' : 'Personal'}</span>
        </p>
      </div>

    </div>
  );
}
