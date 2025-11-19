'use client';

import { useState, useEffect, memo, useMemo, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DefaultCover from './DefaultCover';

// Interfaces para tipado
interface ContentCardProps {
  // Datos del contenido
  id: string;
  title: string;
  author?: string;
  authorId?: string;
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

const ContentCard = memo(function ContentCard({
  id,
  title,
  author,
  authorId,
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

  // Estados para el sistema de likes
  const [currentLikes, setCurrentLikes] = useState(likes);
  const [currentIsLiked, setCurrentIsLiked] = useState(isLiked);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  // Función para manejar el like
  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar que se abra el modal

    const token = localStorage.getItem('takopi_token');
    if (!token) {
      alert('Debes iniciar sesión para dar like');
      return;
    }

    setIsLikeLoading(true);
    try {
      const action = currentIsLiked ? 'unlike' : 'like';
      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          contentId: id,
          action
        })
      });

      const result = await response.json();
      if (result.success) {
        setCurrentIsLiked(!currentIsLiked);
        setCurrentLikes(prev => currentIsLiked ? prev - 1 : prev + 1);

        // Llamar al callback si existe
        if (onLike) {
          onLike();
        }
      } else {
        alert(result.error || 'Error al actualizar like');
      }
    } catch (error) {
      console.error('Error liking content:', error);
      alert('Error al actualizar like');
    } finally {
      setIsLikeLoading(false);
    }
  };

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
      'OBS': 'OBS',
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

  // Función para formatear precio simple y elegante (memoizada)
  const formatPrice = useCallback((price: string | number, isFree: boolean, currency: string = 'CLP') => {
    if (isFree) return 'GRATIS';

    const numPrice = typeof price === 'string' ? parseFloat(price) : Number(price);

    if (isNaN(numPrice) || numPrice <= 0) {
      return 'Consultar';
    }

    return `$${numPrice.toLocaleString('es-CL')}`;
  }, []);

  // Función para obtener la imagen principal (memoizada)
  const getMainImage = useMemo(() => {
    return coverImage || image;
  }, [coverImage, image]);

  const { user } = useAuth();
  const currentUserId = user?._id;
  const displayAuthor = author || (authorId && currentUserId && authorId === currentUserId ? user.username : 'Anónimo');
  const router = useRouter();
  const authorProfileLink = authorId
    ? (currentUserId && authorId === currentUserId ? '/profile' : `/user/${authorId}`)
    : (currentUserId && author === user?.username ? '/profile' : undefined);

  const handleAuthorClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (authorProfileLink) {
      router.push(authorProfileLink);
      return;
    }
    if (!author) return;
    try {
      const resp = await fetch(`/api/user/lookup?username=${encodeURIComponent(author)}`);
      if (resp.ok) {
        const data = await resp.json();
        if (data.success && data.data?.id) {
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
    <div
      className={`group relative flex flex-col bg-[#0f0f0f] border border-white/5 rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(168,85,247,0.2)] hover:border-purple-500/30 ${className}`}
      onClick={onClick}
    >
      {/* Imagen de la creación */}
      <div className={`relative aspect-[4/3] overflow-hidden ${imageClassName}`}>
        {/* Overlay gradiente al hacer hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>

        {/* Imagen principal o fallback */}
        {getMainImage && !imageError && !getMainImage?.includes('/placeholder-') ? (
          <img
            src={getMainImage}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
        ) : (
          <DefaultCover
            contentType={contentType || 'modelos3d'}
            className="w-full h-full transition-transform duration-700 group-hover:scale-110"
          />
        )}

        {/* Badge de Tipo de Contenido (Flotante) */}
        <div className="absolute top-4 left-4 z-20">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-full shadow-lg">
            <span className="text-sm">{getContentTypeIcon(contentType)}</span>
            <span className="text-xs font-medium text-white/90 capitalize">{contentType}</span>
          </div>
        </div>

        {/* Botón de Like (Flotante) */}
        <button
          onClick={handleLike}
          disabled={isLikeLoading}
          className={`absolute top-4 right-4 z-20 p-2 rounded-full backdrop-blur-md border transition-all duration-300 ${currentIsLiked
              ? 'bg-red-500/20 border-red-500/50 text-red-500'
              : 'bg-black/40 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
            }`}
        >
          {isLikeLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <svg
              className={`w-5 h-5 transition-transform duration-300 ${currentIsLiked ? 'fill-current scale-110' : 'fill-none stroke-current'}`}
              viewBox="0 0 24 24" strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
          )}
        </button>
      </div>

      {/* Contenido de la tarjeta */}
      <div className="flex flex-col flex-1 p-5 relative">
        {/* Título */}
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-purple-400 transition-colors">
          {title || 'Sin título'}
        </h3>

        {/* Descripción */}
        {showDescription && (
          <p className="text-sm text-gray-400 line-clamp-2 mb-4 leading-relaxed">
            {description || shortDescription || 'Sin descripción disponible.'}
          </p>
        )}

        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between gap-4">
          {/* Autor */}
          <div className="flex items-center gap-2 min-w-0">
            {authorProfileLink ? (
              <button onClick={handleAuthorClick} className="flex items-center gap-2 min-w-0" title={displayAuthor}>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 p-[1px]">
                  <div className="w-full h-full rounded-full overflow-hidden bg-[#0f0f0f]">
                    {authorAvatar ? (
                      <img src={authorAvatar} alt={author} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white">
                        {author?.[0]?.toUpperCase() || '?'}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col truncate">
                  <span className="text-xs text-gray-400">Creado por</span>
                  <span className="text-xs font-medium text-white truncate hover:text-purple-400 transition-colors">
                    {author || 'Anónimo'}
                  </span>
                </div>
              </button>
            ) : (
              <button onClick={handleAuthorClick} className="flex items-center gap-2 min-w-0" title={displayAuthor}>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 p-[1px]">
                  <div className="w-full h-full rounded-full overflow-hidden bg-[#0f0f0f]">
                    {authorAvatar ? (
                      <img src={authorAvatar} alt={author} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white">
                        {author?.[0]?.toUpperCase() || '?'}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col truncate">
                  <span className="text-xs text-gray-400">Creado por</span>
                  <span className="text-xs font-medium text-white truncate hover:text-purple-400 transition-colors">
                    {displayAuthor}
                  </span>
                </div>
              </button>
            )}
          </div>

          {/* Precio (Espectacular) */}
          {showPrice && (
            <div className={`flex-shrink-0 px-4 py-1.5 rounded-lg font-bold text-sm shadow-lg transition-all duration-300 ${isFree
                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                : 'bg-white text-black group-hover:bg-purple-500 group-hover:text-white group-hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]'
              }`}>
              {formatPrice(price, isFree, currency)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default ContentCard;

// Hook personalizado para usar la tarjeta (optimizado)
export const useContentCard = () => {
  const createCardProps = useCallback((data: any, options: Partial<ContentCardProps> = {}) => {
    return {
      id: data.id || data._id,
      title: data.title,
      author: data.author || data.authorUsername,
      authorId: data.authorId,
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
      isLiked: data.isLiked || false,
      ...options,
      showDescription: options.showDescription ?? true // Default to showing description in new design
    };
  }, []);

  return { createCardProps };
};
