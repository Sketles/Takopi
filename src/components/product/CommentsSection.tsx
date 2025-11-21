'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/components/shared/Toast';

interface Comment {
  id: string;
  author: string;
  avatar?: string;
  userId?: string;
  text: string;
  time: string;
  likes: number;
  isLiked?: boolean;
  parentId?: string | null;
  replies?: Comment[];
  replyCount?: number;
}

interface CommentsSectionProps {
  productId: string;
  isOwner?: boolean;
  currentUserId?: string;
  className?: string;
}

export default function CommentsSection({
  productId,
  isOwner = false,
  currentUserId,
  className = ''
}: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [viewReplies, setViewReplies] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    loadComments();
  }, [productId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('takopi_token');
      const headers: HeadersInit = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`/api/comments?contentId=${productId}`, { headers });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Organizar comentarios en estructura de árbol
          const commentsMap = new Map<string, Comment>();
          const rootComments: Comment[] = [];

          result.data.forEach((comment: any) => {
            const formattedComment: Comment = {
              id: comment.id,
              author: comment.username,
              avatar: comment.userAvatar,
              userId: comment.userId,
              text: comment.text,
              time: formatTimeAgo(comment.createdAt),
              likes: comment.likes,
              isLiked: comment.isLiked,
              parentId: comment.parentId,
              replies: [],
              replyCount: 0
            };
            commentsMap.set(comment.id, formattedComment);
          });

          // Construir árbol de comentarios
          commentsMap.forEach(comment => {
            if (comment.parentId) {
              const parent = commentsMap.get(comment.parentId);
              if (parent) {
                parent.replies = parent.replies || [];
                parent.replies.push(comment);
                parent.replyCount = (parent.replyCount || 0) + 1;
              }
            } else {
              rootComments.push(comment);
            }
          });

          setComments(rootComments);
        }
      }
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string): string => {
    const now = new Date();
    const commentDate = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - commentDate.getTime()) / 1000);

    if (diffInSeconds < 60) return 'ahora';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} h`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} d`;
    
    return commentDate.toLocaleDateString('es-CL', { month: 'short', day: 'numeric' });
  };

  const handleSubmitComment = async (e: React.FormEvent, parentId?: string) => {
    e.preventDefault();
    
    const text = parentId ? replyText : newComment;
    if (!text.trim() || isSubmitting) return;

    const token = localStorage.getItem('takopi_token');
    if (!token) {
      addToast({ type: 'warning', title: 'Inicia sesión', message: 'Debes iniciar sesión para comentar.' });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          contentId: productId,
          text: text.trim(),
          parentId: parentId || null
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          await loadComments();
          if (parentId) {
            setReplyText('');
            setReplyingTo(null);
            setViewReplies(prev => new Set(prev).add(parentId));
          } else {
            setNewComment('');
          }
        } else {
          addToast({ type: 'error', title: 'Error', message: result.error || 'Error al crear comentario' });
        }
      }
    } catch (error) {
      console.error('Error al agregar comentario:', error);
      addToast({ type: 'error', title: 'Error', message: 'Error al crear comentario' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    const token = localStorage.getItem('takopi_token');
    if (!token) {
      addToast({ type: 'warning', title: 'Inicia sesión', message: 'Debes iniciar sesión para dar like.' });
      return;
    }

    try {
      const response = await fetch(`/api/comments/${commentId}/like`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        await loadComments();
      }
    } catch (error) {
      console.error('Error al dar like:', error);
    }
  };

  const toggleViewReplies = (commentId: string) => {
    setViewReplies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => {
    const showReplies = viewReplies.has(comment.id);

    return (
      <div className={`${isReply ? 'ml-12' : ''}`}>
        <div className="flex gap-3 group">
          {/* Avatar */}
          <button
            onClick={() => comment.userId && window.open(`/user/${comment.userId}`, '_blank')}
            className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0 hover:scale-110 transition-transform"
          >
            {comment.avatar ? (
              <img src={comment.avatar} alt={comment.author} className="w-full h-full object-cover" />
            ) : (
              <span className="text-white font-bold text-xs">{comment.author?.charAt(0).toUpperCase()}</span>
            )}
          </button>

          {/* Contenido */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <p className="text-sm text-white leading-relaxed">
                  <button
                    onClick={() => comment.userId && window.open(`/user/${comment.userId}`, '_blank')}
                    className="font-semibold hover:text-purple-300 transition-colors mr-2"
                  >
                    {comment.author}
                  </button>
                  <span className="text-gray-300">{comment.text}</span>
                </p>

                {/* Acciones */}
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                  <span>{comment.time}</span>
                  {comment.likes > 0 && (
                    <span className="font-medium">{comment.likes} me gusta</span>
                  )}
                  <button
                    onClick={() => {
                      setReplyingTo(comment.id);
                      setReplyText('');
                    }}
                    className="font-medium hover:text-white transition-colors"
                  >
                    Responder
                  </button>
                </div>

                {/* Ver respuestas */}
                {!isReply && comment.replyCount! > 0 && (
                  <button
                    onClick={() => toggleViewReplies(comment.id)}
                    className="flex items-center gap-2 mt-3 text-xs font-medium text-gray-400 hover:text-white transition-colors"
                  >
                    <div className="w-6 h-px bg-gray-600"></div>
                    {showReplies ? 'Ocultar' : `Ver ${comment.replyCount}`} {comment.replyCount === 1 ? 'respuesta' : 'respuestas'}
                  </button>
                )}
              </div>

              {/* Like button */}
              <button
                onClick={() => handleLikeComment(comment.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
              >
                {comment.isLiked ? (
                  <svg className="w-3 h-3 text-red-500 fill-current" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                ) : (
                  <svg className="w-3 h-3 text-gray-400 hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                  </svg>
                )}
              </button>
            </div>

            {/* Formulario de respuesta */}
            {replyingTo === comment.id && (
              <form onSubmit={(e) => handleSubmitComment(e, comment.id)} className="mt-3 flex items-center gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Responder a ${comment.author}...`}
                  className="flex-1 px-3 py-2 bg-transparent border-b border-gray-600 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  autoFocus
                  disabled={isSubmitting}
                />
                <button
                  type="submit"
                  disabled={!replyText.trim() || isSubmitting}
                  className="text-purple-400 font-semibold text-sm hover:text-purple-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Publicar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyText('');
                  }}
                  className="text-gray-400 text-sm hover:text-white"
                >
                  Cancelar
                </button>
              </form>
            )}

            {/* Respuestas */}
            {showReplies && comment.replies && comment.replies.length > 0 && (
              <div className="mt-4 space-y-4">
                {comment.replies.map(reply => (
                  <CommentItem key={reply.id} comment={reply} isReply={true} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`${className}`}>
      {/* Formulario principal */}
      <form onSubmit={(e) => handleSubmitComment(e)} className="border-b border-gray-700/50 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Agrega un comentario..."
            className="flex-1 px-0 py-2 bg-transparent border-none text-white text-sm placeholder-gray-500 focus:outline-none"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={!newComment.trim() || isSubmitting}
            className="text-purple-400 font-semibold text-sm hover:text-purple-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Publicando...' : 'Publicar'}
          </button>
        </div>
      </form>

      {/* Lista de comentarios */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-8 text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-2"></div>
            <div className="text-sm">Cargando comentarios...</div>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-3">💬</div>
            <div className="text-base font-medium mb-1">Aún no hay comentarios</div>
            <div className="text-sm">Sé el primero en comentar</div>
          </div>
        ) : (
          comments.map(comment => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        )}
      </div>
    </div>
  );
}
