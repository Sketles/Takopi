'use client';

import React from 'react';

interface DefaultCoverProps {
  contentType: string;
  className?: string;
}

const DefaultCover: React.FC<DefaultCoverProps> = ({ contentType, className = "" }) => {
  console.log('🎨 DefaultCover renderizando para:', contentType);

  const getCoverConfig = (type: string) => {
    const configs = {
      // Categorías finales definidas
      'avatares': {
        gradient: 'from-green-500 to-teal-500',
        icon: '👤',
        placeholder: '/placeholder-avatar.jpg'
      },
      'modelos3d': {
        gradient: 'from-blue-500 to-cyan-500',
        icon: '🧩',
        placeholder: '/placeholder-3d.jpg'
      },
      'musica': {
        gradient: 'from-purple-500 to-pink-500',
        icon: '🎵',
        placeholder: '/placeholder-music.jpg'
      },
      'texturas': {
        gradient: 'from-indigo-500 to-purple-500',
        icon: '🖼️',
        placeholder: '/placeholder-texture.jpg'
      },
      'animaciones': {
        gradient: 'from-orange-500 to-red-500',
        icon: '🎬',
        placeholder: '/placeholder-animation.jpg'
      },
      'OBS': {
        gradient: 'from-gray-500 to-blue-500',
        icon: '📺',
        placeholder: '/placeholder-widget.jpg',
        customLogo: '/logos/OBS_Studio_logo.png'
      },
      'colecciones': {
        gradient: 'from-yellow-500 to-orange-500',
        icon: '📦',
        placeholder: '/placeholder-collection.jpg'
      }
    };
    return configs[type] || configs['modelos3d'];
  };

  const config = getCoverConfig(contentType);
  console.log('🔧 Config obtenida:', config);

  if (config.customLogo) {
    console.log('🎯 Usando logo personalizado:', config.customLogo);
    return (
      <div className={`relative overflow-hidden bg-gradient-to-br ${config.gradient} ${className}`}>
        {/* Fondo con patrón sutil */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-4 left-4 w-8 h-8 border border-white/30 rounded-full"></div>
          <div className="absolute top-8 right-8 w-4 h-4 border border-white/30 rounded-full"></div>
          <div className="absolute bottom-8 left-1/4 w-6 h-6 border border-white/30 rounded-full"></div>
        </div>

        {/* Logo personalizado centrado */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={config.customLogo}
            alt={`${contentType} logo`}
            className="w-16 h-16 object-contain filter brightness-0 invert"
            onLoad={() => console.log('✅ Logo OBS cargado correctamente')}
            onError={(e) => {
              console.error('❌ Error cargando logo OBS:', e);
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
          {/* Fallback icono emoji */}
          <span className="text-6xl opacity-80 hidden">{config.icon}</span>
        </div>
      </div>
    );
  }

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