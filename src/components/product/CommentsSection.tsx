'use client';

import { useState, useRef, useEffect } from 'react';

interface Comment {
  id: string;
  author: string;
  avatar?: string;
  text: string;
  time: string;
  likes: number;
  isLiked?: boolean;
}

interface CommentsSectionProps {
  productId: string;
  comments?: Comment[];
  isOwner?: boolean;
  onAddComment?: (text: string) => void;
  onLikeComment?: (commentId: string) => void;
  className?: string;
}

export default function CommentsSection({
  productId,
  comments = [],
  isOwner = false,
  onAddComment,
  onLikeComment,
  className = ''
}: CommentsSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [localComments, setLocalComments] = useState<Comment[]>(comments);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Datos de ejemplo si no hay comentarios
  const defaultComments: Comment[] = [
    {
      id: '1',
      author: 'Usuario1',
      avatar: '/placeholders/placeholder-avatar.svg',
      text: '¡Excelente producto! Muy buena calidad.',
      time: 'hace 2 horas',
      likes: 3,
      isLiked: false
    },
    {
      id: '2',
      author: 'Usuario2',
      text: 'Perfecto para mi proyecto. Lo recomiendo.',
      time: 'hace 5 horas',
      likes: 1,
      isLiked: true
    }
  ];

  const displayComments = localComments.length > 0 ? localComments : defaultComments;

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);

    // Crear comentario optimista
    const optimisticComment: Comment = {
      id: Date.now().toString(),
      author: 'Tú',
      text: newComment,
      time: 'ahora',
      likes: 0,
      isLiked: false
    };

    setLocalComments(prev => [optimisticComment, ...prev]);
    setNewComment('');

    try {
      if (onAddComment) {
        await onAddComment(newComment);
      }
    } catch (error) {
      // Revertir comentario optimista en caso de error
      setLocalComments(prev => prev.filter(comment => comment.id !== optimisticComment.id));
      console.error('Error al agregar comentario:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeComment = (commentId: string) => {
    setLocalComments(prev =>
      prev.map(comment =>
        comment.id === commentId
          ? {
              ...comment,
              isLiked: !comment.isLiked,
              likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
            }
          : comment
      )
    );

    if (onLikeComment) {
      onLikeComment(commentId);
    }
  };

  const getAuthorInitial = (author: string | null | undefined) => {
    if (!author || typeof author !== 'string') return '?';
    return author.charAt(0).toUpperCase();
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Formulario de nuevo comentario */}
      {!isOwner && (
        <div className="bg-gradient-to-br from-gray-800/40 to-purple-900/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <h4 className="text-lg font-semibold text-white mb-4">Deja un comentario</h4>
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <div>
              <textarea
                ref={textareaRef}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Comparte tu opinión sobre este producto..."
                className="w-full h-24 px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                disabled={isSubmitting}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!newComment.trim() || isSubmitting}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Comentar
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de comentarios */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-white">
            Comentarios ({displayComments.length})
          </h4>
          {displayComments.length > 3 && (
            <button className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors">
              Ver todos
            </button>
          )}
        </div>

        {displayComments.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <div className="text-4xl mb-2">💬</div>
            <div className="text-lg font-medium mb-1">No hay comentarios aún</div>
            <div className="text-sm">Sé el primero en comentar</div>
          </div>
        ) : (
          <div className="space-y-4">
            {displayComments.slice(0, 3).map((comment) => (
              <div
                key={comment.id}
                className="bg-gradient-to-br from-gray-800/40 to-purple-900/40 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50"
              >
                <div className="flex gap-3">
                  {/* Avatar del autor */}
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                    {comment.avatar ? (
                      <img
                        src={comment.avatar}
                        alt={comment.author}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <span className={`text-white font-bold text-xs ${comment.avatar ? 'hidden' : ''}`}>
                      {getAuthorInitial(comment.author)}
                    </span>
                  </div>

                  {/* Contenido del comentario */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-white text-sm">{comment.author}</span>
                      <span className="text-gray-400 text-xs">{comment.time}</span>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed mb-2">{comment.text}</p>
                    
                    {/* Acciones del comentario */}
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLikeComment(comment.id)}
                        className={`flex items-center gap-1 text-xs transition-colors ${
                          comment.isLiked
                            ? 'text-red-400'
                            : 'text-gray-400 hover:text-red-400'
                        }`}
                      >
                        <svg 
                          className="w-3 h-3" 
                          fill={comment.isLiked ? 'currentColor' : 'none'} 
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
                        <span>{comment.likes}</span>
                      </button>
                      
                      <button className="text-gray-400 hover:text-gray-300 text-xs transition-colors">
                        Responder
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
