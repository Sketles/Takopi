'use client';

import { useState } from 'react';
import MetaChips from './MetaChips';
import SocialCapsule from './SocialCapsule';

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
      type: string;
      size: number;
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
  onBuy?: () => void;
  onAddToBox?: () => void;
  onLike?: () => void;
  onSave?: () => void;
  onShare?: () => void;
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

  const formatPrice = (price: number, isFree: boolean, currency: string) => {
    if (isFree) return 'GRATIS';
    return `$${price.toLocaleString('es-CL')} ${currency}`;
  };

  const getAuthorInitial = (author: string | object | null | undefined) => {
    if (!author) return '?';
    
    // Si es un objeto, extraer username
    if (typeof author === 'object' && 'username' in author) {
      const username = (author as any).username;
      return username && typeof username === 'string' ? username.charAt(0).toUpperCase() : '?';
    }
    
    // Si es string, usar directamente
    if (typeof author === 'string') {
      return author.charAt(0).toUpperCase();
    }
    
    return '?';
  };

  const isDraft = product.status === 'draft';
  const isPrivate = product.visibility === 'unlisted';

  return (
    <div className={`bg-gradient-to-br from-gray-900/80 to-purple-900/40 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 ${className}`}>
      {/* Banner de estado (solo para propietario) */}
      {isOwner && (isDraft || isPrivate) && (
        <div className={`mb-4 p-3 rounded-xl border ${
          isDraft 
            ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' 
            : 'bg-orange-500/20 text-orange-300 border-orange-500/30'
        }`}>
          <div className="flex items-center gap-2">
            <span className="text-lg">{isDraft ? '📝' : '🔒'}</span>
            <span className="font-medium">
              {isDraft ? 'Borrador' : 'Privado'}
            </span>
          </div>
        </div>
      )}

      {/* Precio */}
      <div className="text-center mb-6">
        <div className={`text-4xl font-bold mb-2 ${
          product.isFree 
            ? 'bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent' 
            : 'text-white'
        }`}>
          {formatPrice(product.price, product.isFree, product.currency)}
        </div>
        {!product.isFree && (
          <div className="text-sm text-gray-400">
            Precio final • Sin impuestos adicionales
          </div>
        )}
      </div>

      {/* CTAs principales */}
      <div className="space-y-3 mb-6">
        {isOwner ? (
          // CTAs para propietario
          <>
            <button
              onClick={onEdit}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
            >
              <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Editar Producto
            </button>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={onViewStats}
                className="py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl font-medium hover:from-gray-700 hover:to-gray-800 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Estadísticas
              </button>
              
              <button
                onClick={onManageFiles}
                className="py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                Archivos
              </button>
            </div>
          </>
        ) : (
          // CTAs para visitante
          <>
            <button
              onClick={() => {
                // Para TODOS los productos (gratuitos y de pago), redirigir al checkout
                const checkoutItem = {
                  id: product.id,
                  title: product.title,
                  price: product.price,
                  currency: product.currency,
                  contentType: product.contentType,
                  author: typeof product.author === 'string' ? product.author : product.author?.username || 'Anónimo',
                  coverImage: product.coverImage
                };
                
                const checkoutUrl = `/checkout?items=${encodeURIComponent(JSON.stringify([checkoutItem]))}&total=${product.price}`;
                window.location.href = checkoutUrl;
              }}
              className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/25"
            >
              <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
              {product.isFree ? 'Obtener Gratis' : 'Comprar con Webpay'}
            </button>
            
            <button
              onClick={onAddToBox}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Agregar a Box
            </button>
          </>
        )}
      </div>

      {/* Métricas sociales */}
      <div className="mb-6">
        <SocialCapsule
          likes={product.likes}
          comments={0} // TODO: Implementar contador de comentarios
          views={product.views}
          isLiked={isLiked}
          isSaved={isSaved}
          isOwner={isOwner}
          onLike={() => {
            setIsLiked(!isLiked);
            onLike?.();
          }}
          onSave={() => {
            setIsSaved(!isSaved);
            onSave?.();
          }}
          onShare={onShare}
        />
      </div>

      {/* Chips de metadatos */}
      <div className="mb-6">
        <MetaChips
          contentType={product.contentType}
          license={product.license}
          customLicense={product.customLicense}
          files={product.files}
        />
      </div>

      {/* Información del autor */}
      <div className="border-t border-gray-700/50 pt-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            {product.authorAvatar ? (
              <img
                src={product.authorAvatar}
                alt={typeof product.author === 'string' ? product.author : product.author?.username || 'Autor'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <span className={`text-white font-bold text-sm ${product.authorAvatar ? 'hidden' : ''}`}>
              {getAuthorInitial(product.author)}
            </span>
          </div>
          <div className="flex-1">
            <div className="text-sm text-gray-400">por</div>
            <div className="text-white font-medium">
              {typeof product.author === 'string' ? product.author : product.author?.username || 'Anónimo'}
            </div>
          </div>
          {product.authorId && (
            <button 
              onClick={() => window.open(`/user/${product.authorId}`, '_blank')}
              className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
            >
              Ver perfil
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
