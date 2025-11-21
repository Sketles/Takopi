'use client';

import React from 'react';

interface DefaultCoverProps {
  contentType: string;
  className?: string;
}

const DefaultCover: React.FC<DefaultCoverProps> = ({ contentType, className = "" }) => {

  const getCoverConfig = (type: string) => {
    const configs: Record<string, { gradient: string; icon: string; placeholder: string }> = {
      // Categorías finales definidas
      'avatares': {
        gradient: 'from-green-500 to-teal-500',
        icon: '👤',
        placeholder: '/placeholders/placeholder-avatar.svg'
      },
      'modelos3d': {
        gradient: 'from-blue-500 to-cyan-500',
        icon: '🧩',
        placeholder: '/placeholders/placeholder-3d.svg'
      },
      'musica': {
        gradient: 'from-purple-500 to-pink-500',
        icon: '🎵',
        placeholder: '/placeholders/placeholder-music.svg'
      },
      'texturas': {
        gradient: 'from-indigo-500 to-purple-500',
        icon: '🖼️',
        placeholder: '/placeholders/placeholder-texture.svg'
      },
      'animaciones': {
        gradient: 'from-orange-500 to-red-500',
        icon: '🎬',
        placeholder: '/placeholders/placeholder-animation.svg'
      },
      'OBS': {
        gradient: 'from-gray-500 to-blue-500',
        icon: '📺',
        placeholder: '/placeholders/placeholder-widget.svg'
      },
      'colecciones': {
        gradient: 'from-yellow-500 to-orange-500',
        icon: '📦',
        placeholder: '/placeholders/placeholder-collection.svg'
      }
    };
    return configs[type] || configs['modelos3d'];
  };

  const config = getCoverConfig(contentType);

  // Siempre usar emoji/gradiente (sin logo externo)

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${config.gradient} ${className}`}>
      {/* Fondo con patrón sutil */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-4 left-4 w-8 h-8 border border-white/30 rounded-full"></div>
        <div className="absolute top-8 right-8 w-4 h-4 border border-white/30 rounded-full"></div>
        <div className="absolute bottom-8 left-1/4 w-6 h-6 border border-white/30 rounded-full"></div>
      </div>

      {/* Icono centrado */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-6xl opacity-80">{config.icon}</span>
      </div>
    </div>
  );
};

export default DefaultCover;