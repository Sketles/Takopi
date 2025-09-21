'use client';

import { useState } from 'react';
import DefaultCover from './shared/DefaultCover';

interface CardPreviewProps {
  title: string;
  description?: string;
  shortDescription?: string;
  contentType: string;
  category: string;
  price: string;
  isFree: boolean;
  coverImage?: File | null;
  tags: string[];
}

export default function CardPreview({
  title,
  description,
  shortDescription,
  contentType,
  category,
  price,
  isFree,
  coverImage,
  tags
}: CardPreviewProps) {
  const [imageError, setImageError] = useState(false);

  // Función para obtener el icono del tipo de contenido
  const getContentTypeIcon = (type: string) => {
    if (type === 'OBS') {
      return (
        <img
          src="/logos/OBS_Studio_logo.png"
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

  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Imagen de la creación */}
      <div className="aspect-square relative overflow-hidden">
        {coverImage && !imageError ? (
          <img
            src={URL.createObjectURL(coverImage)}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <DefaultCover
            contentType={contentType || 'modelos3d'}
            className="w-full h-full"
          />
        )}

        {/* Overlay con tipo de contenido */}
        <div className="absolute top-3 left-3 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-lg text-white text-xs font-medium flex items-center gap-1">
          <span>{getContentTypeIcon(contentType)}</span>
          <span>{getContentTypeName(contentType)}</span>
        </div>

        {/* Precio */}
        <div className="absolute top-3 right-3 px-4 py-2.5 bg-gradient-to-br from-slate-800/90 via-slate-700/90 to-slate-800/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-500/40 overflow-hidden group/price">
          {/* Efecto de brillo animado */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover/price:translate-x-[100%] transition-transform duration-1000 ease-out"></div>

          {/* Contenido del precio */}
          <div className="relative flex items-center justify-center">
            <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent font-black text-sm tracking-wider drop-shadow-lg animate-pulse">
              {isFree ? 'GRATIS' : `$${parseInt(price || '0').toLocaleString('es-CL')}`}
            </span>

            {/* Efecto de resplandor */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-300/30 via-blue-300/30 to-purple-300/30 rounded-lg blur-sm opacity-0 group-hover/price:opacity-100 transition-opacity duration-500"></div>
          </div>

          {/* Borde brillante */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400/50 via-blue-400/50 to-purple-400/50 opacity-0 group-hover/price:opacity-100 transition-opacity duration-500 blur-[1px]"></div>
        </div>

        {/* Stats overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-3 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1">
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
              </svg>
              <span>0</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Información de la creación */}
      <div className="p-4">
        <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
          {title || 'Sin título'}
        </h3>

        {/* Mostrar descripción breve si existe, sino descripción normal */}
        {(shortDescription || description) && (
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
            {shortDescription || description}
          </p>
        )}

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs border border-purple-500/30"
              >
                #{tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            {new Date().toLocaleDateString('es-CL', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </span>
          <span className="capitalize">{category}</span>
        </div>
      </div>
    </div>
  );
}
