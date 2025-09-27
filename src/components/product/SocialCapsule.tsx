'use client';

import { useState } from 'react';

interface SocialCapsuleProps {
  likes: number;
  comments: number;
  views: number;
  isLiked?: boolean;
  isSaved?: boolean;
  isOwner?: boolean;
  onLike?: () => void;
  onSave?: () => void;
  onShare?: () => void;
  className?: string;
}

export default function SocialCapsule({
  likes,
  comments,
  views,
  isLiked = false,
  isSaved = false,
  isOwner = false,
  onLike,
  onSave,
  onShare,
  className = ''
}: SocialCapsuleProps) {
  const [localLikes, setLocalLikes] = useState(likes);
  const [localIsLiked, setLocalIsLiked] = useState(isLiked);
  const [localIsSaved, setLocalIsSaved] = useState(isSaved);

  const handleLike = () => {
    if (isOwner) return;
    
    setLocalIsLiked(!localIsLiked);
    setLocalLikes(prev => localIsLiked ? prev - 1 : prev + 1);
    
    if (onLike) {
      onLike();
    }
  };

  const handleSave = () => {
    if (isOwner) return;
    
    setLocalIsSaved(!localIsSaved);
    
    if (onSave) {
      onSave();
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare();
    } else {
      // Compartir por defecto
      if (navigator.share) {
        navigator.share({
          title: document.title,
          url: window.location.href
        });
      } else {
        // Fallback: copiar al portapapeles
        navigator.clipboard.writeText(window.location.href);
        // Aquí podrías mostrar un toast de confirmación
      }
    }
  };

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* Métricas principales */}
      <div className="flex items-center gap-4 bg-black/40 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10">
        <div className="flex items-center gap-1.5 text-gray-300">
          <span className="text-sm">❤️</span>
          <span className="text-sm font-medium">{localLikes}</span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-300">
          <span className="text-sm">💬</span>
          <span className="text-sm font-medium">{comments}</span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-300">
          <span className="text-sm">👁️</span>
          <span className="text-sm font-medium">{views}</span>
        </div>
      </div>

      {/* Botones de acción social */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleLike}
          disabled={isOwner}
          className={`p-2 rounded-lg transition-all duration-300 ${
            isOwner
              ? 'text-gray-500 cursor-not-allowed'
              : localIsLiked
              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
              : 'bg-gray-800/50 text-gray-300 border border-gray-600 hover:bg-gray-700/50'
          }`}
          title={isOwner ? 'No disponible para el autor' : localIsLiked ? 'Quitar me gusta' : 'Me gusta'}
        >
          <svg 
            className="w-4 h-4" 
            fill={localIsLiked ? 'currentColor' : 'none'} 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
            />
          </svg>
        </button>

        <button
          onClick={handleSave}
          disabled={isOwner}
          className={`p-2 rounded-lg transition-all duration-300 ${
            isOwner
              ? 'text-gray-500 cursor-not-allowed'
              : localIsSaved
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              : 'bg-gray-800/50 text-gray-300 border border-gray-600 hover:bg-gray-700/50'
          }`}
          title={isOwner ? 'No disponible para el autor' : localIsSaved ? 'Quitar de guardados' : 'Guardar'}
        >
          <svg 
            className="w-4 h-4" 
            fill={localIsSaved ? 'currentColor' : 'none'} 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" 
            />
          </svg>
        </button>

        <button
          onClick={handleShare}
          className="p-2 rounded-lg bg-gray-800/50 text-gray-300 border border-gray-600 hover:bg-gray-700/50 transition-all duration-300"
          title="Compartir"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" 
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
