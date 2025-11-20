'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/components/shared/Toast';

interface TextureViewerProps {
  files: Array<{
    name: string;
    type: string;
    size: number;
    url: string;
    originalName?: string;
  }>;
  title: string;
  coverImage?: string;
  className?: string;
  isOwner?: boolean;
}

export default function TextureViewer({ files, title, coverImage, className = '', isOwner = false }: TextureViewerProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageLoading, setImageLoading] = useState<boolean[]>([]);
  const { addToast } = useToast();

  // Filtrar solo archivos de imagen
  const imageFiles = files.filter(file => 
    file.type?.includes('image') || 
    file.name?.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i)
  );

  // Agregar la imagen de portada si existe
  const allImages = coverImage ? [
    { url: coverImage, originalName: 'Portada', name: 'cover', type: 'image', size: 0 },
    ...imageFiles
  ] : imageFiles;

  const currentImage = allImages[currentImageIndex];

  // Inicializar estados de carga
  useEffect(() => {
    setImageLoading(new Array(allImages.length).fill(true));
  }, [allImages.length]);

  // Atajos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevImage();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentImageIndex, allImages.length, isFullscreen]);

  const handleImageLoad = (index: number) => {
    setImageLoading(prev => {
      const newLoading = [...prev];
      newLoading[index] = false;
      return newLoading;
    });
  };

  const nextImage = () => {
    if (currentImageIndex < allImages.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    }
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return 'N/A';
    const mb = bytes / 1024 / 1024;
    return `${mb.toFixed(1)} MB`;
  };

  if (!currentImage) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-gray-900/50 rounded-xl ${className}`}>
        <div className="text-center text-gray-400">
          <div className="text-4xl mb-2">🖼️</div>
          <div className="text-lg font-medium">No hay imágenes disponibles</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full bg-gradient-to-br from-gray-900/90 to-purple-900/50 rounded-xl overflow-hidden ${className}`}>
      {/* Header con título y controles */}
      <div className="p-4 border-b border-gray-700/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white text-lg font-semibold">{title}</h3>
            <p className="text-gray-400 text-sm">
              {currentImageIndex + 1} de {allImages.length} imágenes
            </p>
          </div>
          <button
            onClick={toggleFullscreen}
            className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors"
            title="Pantalla completa"
          >
            <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Visor principal */}
      <div className="relative flex-1 min-h-[400px] bg-gray-800/30">
        {/* Imagen principal */}
        <div className="relative w-full h-full flex items-center justify-center p-4">
          {imageLoading[currentImageIndex] && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
            </div>
          )}
          
          <img
            src={currentImage.url}
            alt={currentImage.originalName || currentImage.name}
            className={`max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-opacity duration-300 ${
              imageLoading[currentImageIndex] ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => handleImageLoad(currentImageIndex)}
            onClick={toggleFullscreen}
            style={{ cursor: 'pointer' }}
          />

          {/* Botones de navegación */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                disabled={currentImageIndex === 0}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                title="Imagen anterior"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={nextImage}
                disabled={currentImageIndex === allImages.length - 1}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                title="Siguiente imagen"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Información de la imagen */}
          <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium truncate">
                  {currentImage.originalName || currentImage.name}
                </p>
                <p className="text-gray-300 text-sm">
                  {formatFileSize(currentImage.size)}
                </p>
              </div>
              {allImages.length > 1 && (
                <div className="flex items-center gap-2">
                  {isOwner ? (
                    <button
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = currentImage.url;
                        link.download = currentImage.originalName || currentImage.name;
                        link.click();
                      }}
                      className="p-2 bg-purple-600/50 hover:bg-purple-600/70 rounded-lg transition-colors"
                      title="Descargar imagen"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        addToast({ type: 'warning', title: 'Necesitas comprar', message: 'Debes comprar este contenido para poder descargar las imágenes.' });
                      }}
                      className="p-2 bg-gray-600/30 hover:bg-gray-600/50 rounded-lg transition-colors cursor-not-allowed opacity-50"
                      title="Comprar para descargar"
                      disabled
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Miniaturas */}
      {allImages.length > 1 && (
        <div className="p-4 border-t border-gray-700/50">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {allImages.map((image, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all ${
                  index === currentImageIndex
                    ? 'ring-2 ring-purple-400 scale-110'
                    : 'hover:scale-105 opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={image.url}
                  alt={image.originalName || image.name}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Modal de pantalla completa */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Botón cerrar */}
            <button
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 z-10 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
              title="Cerrar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Imagen en pantalla completa */}
            <img
              src={currentImage.url}
              alt={currentImage.originalName || currentImage.name}
              className="max-w-full max-h-full object-contain"
            />

            {/* Controles de navegación en pantalla completa */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  disabled={currentImageIndex === 0}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 p-4 bg-black/50 hover:bg-black/70 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  title="Imagen anterior"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <button
                  onClick={nextImage}
                  disabled={currentImageIndex === allImages.length - 1}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-4 bg-black/50 hover:bg-black/70 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  title="Siguiente imagen"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Contador en pantalla completa */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm rounded-lg px-4 py-2">
                  <span className="text-white text-sm">
                    {currentImageIndex + 1} / {allImages.length}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Atajos de teclado */}
      <div className="sr-only">
        <div>Usa las flechas izquierda/derecha para navegar</div>
        <div>Presiona Escape para cerrar pantalla completa</div>
        <div>Presiona F para pantalla completa</div>
      </div>
    </div>
  );
}
