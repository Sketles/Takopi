'use client';

import { useState, useEffect, useRef } from 'react';
import { ModelViewerModal } from './ModelViewer3D';
import DefaultCover from './shared/DefaultCover';

interface ProductDetailProfileProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (product: any) => void;
  onDelete?: (product: any) => void;
}

export default function ProductDetailProfile({ product, isOpen, onClose, onEdit, onDelete }: ProductDetailProfileProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likes, setLikes] = useState(product?.likes || 0);
  const [newComment, setNewComment] = useState('');
  const [imageError, setImageError] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [comments, setComments] = useState([
    {
      id: 1,
      author: 'Usuario1',
      avatar: '/placeholders/placeholder-avatar.jpg',
      text: '¡Excelente producto! Muy buena calidad.',
      time: 'hace 2 horas',
      likes: 3
    },
    {
      id: 2,
      author: 'Usuario2',
      avatar: '/placeholders/placeholder-avatar.jpg',
      text: 'Justo lo que estaba buscando. Recomendado 100%.',
      time: 'hace 5 horas',
      likes: 1
    }
  ]);
  const commentsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Función para manejar like
  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes((prev: number) => isLiked ? prev - 1 : prev + 1);
  };

  // Función para manejar guardar
  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  // Función para scrollear a comentarios
  const scrollToComments = () => {
    commentsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Función para enviar comentario
  const handleSubmitComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: comments.length + 1,
        author: 'Tú',
        avatar: '/placeholders/placeholder-avatar.jpg',
        text: newComment.trim(),
        time: 'ahora',
        likes: 0
      };
      setComments(prev => [comment, ...prev]);
      setNewComment('');
    }
  };

  // Función para editar producto
  const handleEdit = () => {
    onEdit?.(product);
    onClose();
  };

  // Función para confirmar eliminación
  const handleDeleteConfirm = () => {
    setShowDeleteConfirm(true);
  };

  // Función para cancelar eliminación
  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  // Función para eliminar producto
  const handleDelete = () => {
    onDelete?.(product);
    setShowDeleteConfirm(false);
    onClose();
  };

  // Utilidad: detectar si una URL apunta probablemente a una imagen
  const isLikelyImageUrl = (url?: string): boolean => {
    if (!url) return false;
    const lowered = url.toLowerCase();
    return (
      lowered.endsWith('.jpg') ||
      lowered.endsWith('.jpeg') ||
      lowered.endsWith('.png') ||
      lowered.endsWith('.webp') ||
      lowered.endsWith('.gif') ||
      lowered.startsWith('data:image/')
    );
  };

  // Buscar un archivo 3D válido dentro de los files
  const getModelUrl = (): string | null => {
    const files = product?.files || [];
    console.log('🧩 Archivos recibidos para el modal de perfil:', files);
    console.log('🧩 Product completo:', product);

    const model = files.find((f: any) => {
      const name: string = (f?.name || '').toLowerCase();
      const type: string = (f?.type || '').toLowerCase();
      const isModel = (
        name.endsWith('.glb') ||
        name.endsWith('.gltf') ||
        type.includes('gltf') ||
        type.includes('glb')
      );
      console.log('🔍 Verificando archivo:', { name, type, isModel });
      return isModel;
    });

    const url = model?.url || null;
    console.log('🎯 Modelo encontrado:', model);
    console.log('🎯 URL de modelo detectada:', url);
    return url;
  };

  // Detectar si hay audio para mostrar UI de música
  const hasAudio = (): boolean => {
    const files = product?.files || [];
    return files.some((f: any) => {
      const name: string = (f?.name || '').toLowerCase();
      const type: string = (f?.type || '').toLowerCase();
      return (
        type.startsWith('audio/') ||
        name.endsWith('.mp3') ||
        name.endsWith('.wav') ||
        name.endsWith('.ogg') ||
        name.endsWith('.m4a')
      );
    });
  };

  if (!isOpen || !product) return null;

  return (
    <div
      className="fixed inset-0 z-50"
      onClick={onClose}
    >
      {/* Modal */}
      <div className="relative h-dvh flex items-center justify-center p-4">
        <div
          className="w-full max-w-7xl bg-gradient-to-br from-gray-900/95 to-purple-900/95 backdrop-blur-xl rounded-3xl border border-purple-500/30 shadow-2xl max-h-[95dvh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header con botón cerrar */}
          <div className="flex items-center justify-between p-6 border-b border-purple-500/20">
            <h1 className="text-2xl font-bold text-white">{product.title}</h1>
            <div className="flex items-center gap-3">
              {onEdit && (
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
                >
                  Editar Producto
                </button>
              )}
              {onDelete && (
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Eliminar
                </button>
              )}
              <button
                onClick={onClose}
                className="w-10 h-10 bg-gray-500/20 hover:bg-gray-500/30 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Contenido scrolleable */}
          <div className="flex-1 overflow-y-auto">
            {/* Hero Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
              {/* Columna izquierda - Preview del producto */}
              <div className="space-y-4">
                <div className="aspect-square bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-2xl overflow-hidden border border-purple-500/30 relative">
                  {/* Priorizar visor 3D si hay archivo .glb/.gltf, aunque exista cover */}
                  {getModelUrl() ? (
                    <ModelViewerModal
                      src={getModelUrl() as string}
                      alt={product.title}
                      width="100%"
                      height="100%"
                      autoRotate={true}
                      cameraControls={true}
                    />
                  ) : hasAudio() || product.contentType === 'musica' ? (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                      <div className="text-center space-y-4">
                        <DefaultCover contentType="music" className="w-32 h-32 mx-auto rounded-2xl" />
                        <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <p className="text-white text-sm">Reproductor de música</p>
                        </div>
                      </div>
                    </div>
                  ) : product.image && isLikelyImageUrl(product.image) && !imageError ? (
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <DefaultCover contentType={product.contentType || 'modelos3d'} className="w-full h-full" />
                  )}
                </div>
              </div>

              {/* Columna derecha - Información y acciones */}
              <div className="space-y-6">
                {/* Información básica */}
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">{product.title}</h2>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-gray-400">por</span>
                    <a href={`/profile/${product.author}`} className="text-purple-400 hover:text-purple-300 font-medium">
                      {product.author}
                    </a>
                  </div>

                  {/* Chips de categoría y licencia */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30">
                      {product.category}
                    </span>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-500/30">
                      {product.license}
                    </span>
                  </div>
                </div>

                {/* Precio y botón de gestión */}
                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm rounded-2xl p-6 border border-green-500/20">
                  <div className="text-center">
                    <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-4">
                      {product.isFree ? 'GRATIS' : (product.price || '0')}
                    </div>
                    <div className="space-y-3">
                      <button
                        onClick={handleEdit}
                        className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
                      >
                        Editar Producto
                      </button>
                      <button className="w-full py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl font-medium hover:from-gray-700 hover:to-gray-800 transition-all duration-300">
                        Ver Estadísticas
                      </button>
                    </div>
                  </div>
                </div>

                {/* Barra social */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${isLiked
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-gray-800/50 text-gray-300 border border-gray-600 hover:bg-gray-700/50'
                      }`}
                  >
                    <svg className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>{likes}</span>
                  </button>

                  <button
                    onClick={handleSave}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${isSaved
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-gray-800/50 text-gray-300 border border-gray-600 hover:bg-gray-700/50'
                      }`}
                  >
                    <svg className="w-5 h-5" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    <span>{isSaved ? 'Guardado' : 'Guardar'}</span>
                  </button>

                  <button
                    onClick={scrollToComments}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 text-gray-300 border border-gray-600 rounded-xl font-medium hover:bg-gray-700/50 transition-all duration-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>{comments.length}</span>
                  </button>
                </div>

                {/* Información adicional */}
                <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl p-4 border border-blue-500/20">
                  <h4 className="font-bold text-white mb-3">Información del Producto</h4>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex justify-between">
                      <span>Estado:</span>
                      <span className="text-green-400">Publicado</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Creado:</span>
                      <span>{new Date(product.createdAt).toLocaleDateString('es-CL')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Última actualización:</span>
                      <span>{new Date(product.updatedAt || product.createdAt).toLocaleDateString('es-CL')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ID del producto:</span>
                      <span className="text-xs text-gray-400">{product.id}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contenido medio */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 border-t border-purple-500/20">
              {/* Columna izquierda - Descripción (70%) */}
              <div className="lg:col-span-8">
                <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
                  <h3 className="text-xl font-bold text-white mb-4">Descripción</h3>
                  <div className="prose prose-invert max-w-none leading-relaxed space-y-4">
                    <p className="text-gray-300 leading-relaxed">
                      {product.description || 'No hay descripción disponible para este producto.'}
                    </p>
                    {product.shortDescription && (
                      <p className="text-gray-300 leading-relaxed">
                        <strong>Descripción breve:</strong> {product.shortDescription}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Columna derecha - Stats y tags (30%) */}
              <div className="lg:col-span-4 space-y-6">
                {/* Estadísticas */}
                <div className="bg-gradient-to-br from-gray-800/40 to-purple-900/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                  <h4 className="font-bold text-white mb-4">Estadísticas</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-300">Likes</span>
                      </div>
                      <span className="text-white font-bold">{likes}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-300">Descargas</span>
                      </div>
                      <span className="text-white font-bold">{product.downloads || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-300">Vistas</span>
                      </div>
                      <span className="text-white font-bold">{product.views || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Tags/Hashtags */}
                {product.tags && product.tags.length > 0 && (
                  <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
                    <h4 className="font-bold text-white mb-4">Etiquetas</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag: string, index: number) => (
                        <button
                          key={index}
                          className="px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-full text-sm border border-purple-500/30 transition-colors"
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sección de comentarios */}
            <div ref={commentsRef} className="p-6 border-t border-purple-500/20">
              <h3 className="text-2xl font-bold text-white mb-6">Comentarios ({comments.length})</h3>

              {/* Lista de comentarios */}
              <div className="space-y-6 mb-8">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-gradient-to-br from-gray-800/40 to-purple-900/40 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50">
                    <div className="flex items-start gap-3">
                      <img
                        src={comment.avatar}
                        alt={comment.author}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-white">{comment.author}</span>
                          <span className="text-gray-400 text-sm">{comment.time}</span>
                        </div>
                        <p className="text-gray-300 leading-relaxed mb-3">{comment.text}</p>
                        <div className="flex items-center gap-4">
                          <button className="flex items-center gap-1 text-gray-400 hover:text-red-400 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span className="text-sm">{comment.likes}</span>
                          </button>
                          <button className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                            Responder
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input de comentario */}
              <div className="bg-gradient-to-br from-gray-800/40 to-purple-900/40 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50">
                <div className="flex gap-3">
                  <img
                    src="/placeholders/placeholder-avatar.jpg"
                    alt="Tu avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Escribe tu comentario..."
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-purple-500 transition-colors"
                      rows={3}
                    />
                    <div className="flex justify-end mt-3">
                      <button
                        onClick={handleSubmitComment}
                        disabled={!newComment.trim()}
                        className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 ${newComment.trim()
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transform hover:scale-105'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          }`}
                      >
                        Enviar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-gradient-to-br from-gray-900/95 to-red-900/95 backdrop-blur-xl rounded-2xl border border-red-500/30 shadow-2xl">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Eliminar Producto</h3>
                  <p className="text-sm text-gray-400">Esta acción no se puede deshacer</p>
                </div>
              </div>

              <p className="text-gray-300 mb-6">
                ¿Estás seguro de que quieres eliminar <strong className="text-white">"{product.title}"</strong>?
                Esta acción eliminará permanentemente el producto y todos sus archivos asociados.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={handleDeleteCancel}
                  className="flex-1 py-3 bg-gray-600 text-white rounded-xl font-medium hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
