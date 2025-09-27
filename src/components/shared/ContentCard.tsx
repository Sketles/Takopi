'use client';

import { useState } from 'react';
import DefaultCover from './DefaultCover';

// Interfaces para tipado
interface ContentCardProps {
  // Datos del contenido
  id: string;
  title: string;
  author?: string;
  authorAvatar?: string;
  contentType: string;
  category: string;
  price?: string | number;
  isFree?: boolean;
  currency?: string;
  image?: string;
  coverImage?: string;
  
  // Metadatos
  description?: string;
  shortDescription?: string;
  tags?: string[];
  
  // Estadísticas
  likes?: number;
  views?: number;
  downloads?: number;
  favorites?: number;
  
  // Fechas
  createdAt?: string | Date;
  updatedAt?: string | Date;
  
  // Configuración de la tarjeta
  variant?: 'default' | 'compact' | 'featured';
  showPrice?: boolean;
  showStats?: boolean;
  showTags?: boolean;
  showAuthor?: boolean;
  showDescription?: boolean;
  
  // Eventos
  onClick?: () => void;
  onLike?: () => void;
  onSave?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  
  // Estados
  isLiked?: boolean;
  isSaved?: boolean;
  
  // Estilos personalizados
  className?: string;
  imageClassName?: string;
}

export default function ContentCard({
  id,
  title,
  author,
  authorAvatar,
  contentType,
  category,
  price = 0,
  isFree = false,
  currency = 'CLP',
  image,
  coverImage,
  description,
  shortDescription,
  tags = [],
  likes = 0,
  views = 0,
  downloads = 0,
  favorites = 0,
  createdAt,
  updatedAt,
  variant = 'default',
  showPrice = true,
  showStats = true,
  showTags = true,
  showAuthor = true,
  showDescription = false,
      onClick,
      onLike,
      onSave,
      onEdit,
      onDelete,
      isLiked = false,
      isSaved = false,
  className = '',
  imageClassName = ''
}: ContentCardProps) {
  const [imageError, setImageError] = useState(false);

  // Función para obtener el icono del tipo de contenido
  const getContentTypeIcon = (type: string) => {
    if (type === 'OBS') {
        return (
          <img
            src="/logos/OBS_Studio_logo.svg"
            alt="OBS"
            className="w-4 h-4 object-contain filter brightness-0 invert"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        );
    }

    const icons: { [key: string]: string } = {
      'avatares': '👤',
      'modelos3d': '🧩',
      'musica': '🎵',
      'texturas': '🖼️',
      'animaciones': '🎬',
      'colecciones': '📦'
    };
    return icons[type] || '📁';
  };

  // Función para obtener el nombre del tipo de contenido
  const getContentTypeName = (type: string) => {
    const names: { [key: string]: string } = {
      'avatares': 'Avatar',
      'modelos3d': 'Modelo 3D',
      'musica': 'Música',
      'texturas': 'Textura',
      'animaciones': 'Animación',
      'OBS': 'OBS Widget',
      'colecciones': 'Colección'
    };
    return names[type] || type;
  };

  // Función para formatear precio
  const formatPrice = (price: string | number, isFree: boolean, currency: string = 'CLP') => {
    // Si es gratis, mostrar GRATIS
    if (isFree) {
      return 'GRATIS';
    }
    
    // Convertir a número y validar
    const numPrice = typeof price === 'string' ? parseFloat(price) : Number(price);
    
    // Si el precio es 0 o no válido, mostrar "Precio no disponible"
    if (isNaN(numPrice) || numPrice <= 0) {
      return 'Precio no disponible';
    }
    
    // Formatear con separadores de miles
    return `$${numPrice.toLocaleString('es-CL')} ${currency}`;
  };

  // Función para obtener la imagen principal
  const getMainImage = () => {
    return coverImage || image;
  };

  // Configuración de variantes
  const variantClasses = {
    default: {
      container: 'group bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-md rounded-2xl border border-gray-700/40 hover:border-purple-500/60 transition-all duration-300 overflow-hidden hover:shadow-xl hover:shadow-purple-500/20 cursor-pointer',
      image: 'aspect-square',
      padding: 'p-4'
    },
    compact: {
      container: 'group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-md rounded-xl border border-gray-700/30 hover:border-purple-500/50 transition-all duration-300 overflow-hidden hover:shadow-lg hover:shadow-purple-500/15 cursor-pointer',
      image: 'aspect-video',
      padding: 'p-3'
    },
    featured: {
      container: 'group bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-lg rounded-2xl border border-purple-500/40 hover:border-purple-400/60 transition-all duration-300 overflow-hidden hover:shadow-2xl hover:shadow-purple-500/30 cursor-pointer transform hover:scale-105',
      image: 'aspect-video',
      padding: 'p-4'
    }
  };

  const currentVariant = variantClasses[variant];

  return (
    <div
      className={`group ${currentVariant.container} flex flex-col ${className}`}
      onClick={onClick}
    >
      {/* Imagen de la creación */}
      <div className={`${currentVariant.image} relative overflow-hidden ${imageClassName}`}>
        {/* Imagen principal o fallback */}
        {getMainImage() && !imageError && !getMainImage()?.includes('/placeholder-') ? (
          <img
            src={getMainImage()}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <DefaultCover
            contentType={contentType || 'modelos3d'}
            className="w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        )}

        {/* Overlay superior izquierdo - Tipo de contenido */}
        <div className="absolute top-3 left-3 px-3 py-1.5 bg-black/80 backdrop-blur-md rounded-xl text-white text-xs font-medium flex items-center gap-1.5 shadow-lg border border-white/10">
          <span>{getContentTypeIcon(contentType)}</span>
          <span>{getContentTypeName(contentType)}</span>
        </div>

        {/* Overlay inferior - Estadísticas (solo si showStats es true) */}
        {showStats && (
          <div className="absolute bottom-3 left-3 right-3">
            <div className="flex items-center justify-between text-white text-xs">
              <div className="flex items-center gap-4 bg-black/80 backdrop-blur-md rounded-xl px-3 py-2 shadow-lg border border-white/10">
                <div className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                  </svg>
                  <span>{likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>0</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>{views}</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Información de la creación */}
      <div className={`${currentVariant.padding} flex flex-col flex-1`}>
        {/* Título */}
        <h3 className="text-white font-semibold text-lg mb-3 group-hover:text-purple-300 transition-colors duration-300 flex-shrink-0 overflow-hidden" style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}>
          {title || 'Sin título'}
        </h3>

        {/* Descripción breve opcional */}
        {showDescription && shortDescription && (
          <p className="text-gray-300 text-sm mb-2 flex-shrink-0 overflow-hidden" style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}>
            {shortDescription}
          </p>
        )}

        {/* Spacer para empujar el precio hacia abajo */}
        <div className="flex-1"></div>

            {/* Información mínima - autor y precio (siempre en la parte inferior) */}
            <div className="flex items-center justify-between text-xs text-gray-400 flex-shrink-0">
              {/* Información del autor */}
              <div className="flex items-center gap-2">
                {/* Avatar del autor */}
                <div className="w-6 h-6 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  {authorAvatar ? (
                    <img
                      src={authorAvatar}
                      alt={author || 'Autor'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Si falla la imagen, mostrar la inicial
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  {author ? (
                    <span className={`text-white text-xs font-bold ${authorAvatar ? 'hidden' : ''}`}>
                      {author.charAt(0).toUpperCase()}
                    </span>
                  ) : (
                    <span className={`text-white text-xs font-bold ${authorAvatar ? 'hidden' : ''}`}>?</span>
                  )}
                </div>
                {/* Nombre de usuario */}
                <span className="text-gray-300 font-medium text-xs">
                  {author || 'Anónimo'}
                </span>
              </div>
              
              {/* Precio en la parte inferior derecha */}
              {showPrice && (
                <div className="px-3 py-1.5 bg-gradient-to-br from-slate-800/90 via-slate-700/90 to-slate-800/90 backdrop-blur-xl rounded-xl shadow-lg border border-slate-500/40 overflow-hidden group/price relative">
                  {/* Efecto de brillo animado */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover/price:translate-x-[100%] transition-transform duration-1000 ease-out"></div>

                  {/* Contenido del precio */}
                  <div className="relative flex items-center justify-center">
                    <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent font-bold text-xs tracking-wide drop-shadow-lg">
                      {formatPrice(price, isFree, currency)}
                    </span>

                    {/* Efecto de resplandor */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-300/30 via-blue-300/30 to-purple-300/30 rounded-lg blur-sm opacity-0 group-hover/price:opacity-100 transition-opacity duration-500"></div>
                  </div>

                  {/* Borde brillante */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/50 via-blue-400/50 to-purple-400/50 opacity-0 group-hover/price:opacity-100 transition-opacity duration-500 blur-[1px]"></div>
                </div>
              )}
            </div>
      </div>
    </div>
  );
}

// Hook personalizado para usar la tarjeta
export const useContentCard = () => {
  const createCardProps = (data: any, options: Partial<ContentCardProps> = {}) => {
    return {
      id: data.id || data._id,
      title: data.title,
      author: data.author || data.authorUsername,
      authorAvatar: data.authorAvatar,
      contentType: data.contentType,
      category: data.category,
      price: data.price,
      isFree: data.isFree,
      currency: data.currency,
      image: data.image || data.coverImage,
      coverImage: data.coverImage,
      description: data.description,
      shortDescription: data.shortDescription,
      tags: data.tags || [],
      likes: data.likes || 0,
      views: data.views || 0,
      downloads: data.downloads || 0,
      favorites: data.favorites || 0,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      ...options,
      showDescription: options.showDescription ?? false
    };
  };

  return { createCardProps };
};
