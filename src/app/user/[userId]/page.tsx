'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Layout from '@/components/shared/Layout';
import ContentCard from '@/components/shared/ContentCard';
import ProductModal from '@/components/product/ProductModal';

interface UserData {
  id: string;
  username: string;
  avatar?: string;
  banner?: string;
  bio?: string;
  role?: string;
  location?: string;
  createdAt: string;
  stats: {
    totalCreations: number;
    totalLikes: number;
    totalViews: number;
    followersCount: number;
    followingCount: number;
    contentByType: Record<string, any>;
  };
  content: Array<{
    id: string;
    title: string;
    description: string;
    contentType: string;
    category: string;
    price: number;
    isFree: boolean;
    likes: number;
    views: number;
    createdAt: string;
    files: any[];
    coverImage?: string;
  }>;
}

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;
  
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/user/${userId}`);
      const result = await response.json();

      if (result.success) {
        setUserData(result.data);
        
        // Verificar estado de seguimiento
        const token = localStorage.getItem('takopi_token');
        if (token) {
          try {
            const followResponse = await fetch(`/api/follow?userId=${userId}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            const followResult = await followResponse.json();
            if (followResult.success) {
              setIsFollowing(followResult.data.isFollowing);
            }
          } catch (error) {
            console.error('Error checking follow status:', error);
          }
        }
      } else {
        setError(result.error || 'Usuario no encontrado');
      }
    } catch (err) {
      setError('Error al cargar el perfil del usuario');
    } finally {
      setLoading(false);
    }
  };

  const openContentModal = (content: any) => {
    const transformedContent = {
      ...content,
      author: userData?.username || 'Anónimo',
      authorAvatar: userData?.avatar,
      authorId: userData?.id,
      currency: 'CLP',
      license: 'personal',
      customLicense: '',
      visibility: 'public',
      status: 'published',
      additionalImages: [],
      tags: [],
      customTags: [],
      updatedAt: content.createdAt
    };
    
    setSelectedContent(transformedContent);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedContent(null);
  };

  // Función para manejar eliminación de contenido
  const handleDeleteContent = async (product: any, source?: string) => {
    try {
      const token = localStorage.getItem('takopi_token');
      
      console.log('🔍 Eliminando contenido con ID:', product.id);
      
      const response = await fetch(`/api/content/${product.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Remover el contenido de la lista si estamos en user-profile
        if (source === 'user-profile' && userData) {
          setUserData(prev => prev ? {
            ...prev,
            content: prev.content.filter(item => item.id !== product.id)
          } : null);
        }
        
        // El modal se cerrará automáticamente por el ProductModal
        return { success: true };
      } else {
        console.error('❌ Error eliminando contenido:', response.status);
        const errorData = await response.json().catch(() => ({}));
        alert(`Error: ${errorData.error || 'Error al eliminar el contenido'}`);
        throw new Error(errorData.error || 'Error al eliminar el contenido');
      }
    } catch (error) {
      console.error('❌ Error eliminando contenido:', error);
      alert('Error al eliminar el contenido');
      throw error;
    }
  };

  const handleFollow = async () => {
    const token = localStorage.getItem('takopi_token');
    if (!token) {
      alert('Debes iniciar sesión para seguir usuarios');
      return;
    }

    setIsFollowLoading(true);
    try {
      const action = isFollowing ? 'unfollow' : 'follow';
      const response = await fetch('/api/follow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          followingId: userId,
          action
        })
      });

      const result = await response.json();
      if (result.success) {
        setIsFollowing(!isFollowing);
        // Actualizar contadores
        if (userData) {
          setUserData(prev => prev ? {
            ...prev,
            stats: {
              ...prev.stats,
              followersCount: prev.stats.followersCount + (isFollowing ? -1 : 1)
            }
          } : null);
        }
      } else {
        alert(result.error || 'Error al actualizar seguimiento');
      }
    } catch (error) {
      console.error('Error following user:', error);
      alert('Error al actualizar seguimiento');
    } finally {
      setIsFollowLoading(false);
    }
  };

  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
        </div>
      </Layout>
    );
  }

  if (error || !userData) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Usuario no encontrado</h1>
            <p className="text-gray-400 mb-6">{error}</p>
            <button
              onClick={() => router.back()}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Volver
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Banner Section */}
        <div className="relative h-80 overflow-hidden">
          {/* Banner Background */}
          <div className="absolute inset-0">
            {userData.banner ? (
              <img
                src={userData.banner}
                alt="Banner"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600"></div>
            )}
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          </div>

          {/* Banner Pattern Overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 border border-white/20 rounded-full"></div>
            <div className="absolute top-20 right-20 w-24 h-24 border border-white/20 rounded-full"></div>
            <div className="absolute bottom-20 left-1/4 w-16 h-16 border border-white/20 rounded-full"></div>
          </div>

          {/* Profile Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row items-end gap-6">
                {/* Avatar */}
                <div className="relative group">
                  <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center border-4 border-white/20 shadow-2xl">
                    {userData.avatar ? (
                      <img
                        src={userData.avatar}
                        alt={userData.username}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-4xl font-bold">
                        {getInitial(userData.username)}
                      </span>
                    )}
                  </div>
                </div>

                {/* User Info */}
                <div className="flex-1 text-white">
                  <div className="flex items-center gap-4 mb-2">
                    <h1 className="text-4xl font-bold">{userData.username}</h1>
                    {userData.role && (
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full border border-purple-500/30">
                        {userData.role}
                      </span>
                    )}
                  </div>
                  {userData.bio && (
                    <p className="text-gray-300 text-lg mb-3 max-w-2xl">{userData.bio}</p>
                  )}
                  <div className="flex items-center gap-6 text-sm text-gray-400">
                    {userData.location && (
                      <div className="flex items-center gap-2">
                        <span>📍</span>
                        <span>{userData.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span>📅</span>
                      <span>Se unió el {formatDate(userData.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={handleFollow}
                    disabled={isFollowLoading}
                    className={`px-6 py-3 rounded-xl backdrop-blur-sm border transition-all font-medium ${
                      isFollowing 
                        ? 'bg-black/40 hover:bg-black/60 text-white border-white/20 hover:border-white/30' 
                        : 'bg-purple-600/80 hover:bg-purple-600 text-white border-purple-500/50 hover:border-purple-400'
                    } ${isFollowLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isFollowLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Cargando...</span>
                      </div>
                    ) : isFollowing ? (
                      'Siguiendo'
                    ) : (
                      'Seguir'
                    )}
                  </button>
                  <button
                    onClick={() => router.back()}
                    className="px-6 py-3 bg-black/40 hover:bg-black/60 text-white rounded-xl backdrop-blur-sm border border-white/20 transition-all hover:border-white/30"
                  >
                    Volver
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-black/40 backdrop-blur-md border-b border-purple-500/20">
          <div className="max-w-6xl mx-auto px-8 py-6">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-8 text-center">
              <div className="group cursor-pointer">
                <div className="text-3xl font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">
                  {userData.stats.followersCount.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Seguidores</div>
              </div>
              <div className="group cursor-pointer">
                <div className="text-3xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                  {userData.stats.followingCount.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Siguiendo</div>
              </div>
              <div className="group">
                <div className="text-3xl font-bold text-white mb-1 group-hover:text-green-400 transition-colors">
                  {userData.stats.totalCreations}
                </div>
                <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Creaciones</div>
              </div>
              <div className="group cursor-pointer">
                <div className="text-3xl font-bold text-white mb-1 group-hover:text-yellow-400 transition-colors">
                  0
                </div>
                <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Ventas</div>
              </div>
              <div className="group cursor-pointer">
                <div className="text-3xl font-bold text-white mb-1 group-hover:text-red-400 transition-colors">
                  {userData.stats.totalLikes}
                </div>
                <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Corazones</div>
              </div>
              <div className="group cursor-pointer">
                <div className="text-3xl font-bold text-white mb-1 group-hover:text-pink-400 transition-colors">
                  0
                </div>
                <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Pines</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Contenido publicado</h2>
            <p className="text-gray-400">
              {userData.content.length > 0
                ? `${userData.content.length} ${userData.content.length === 1 ? 'creación' : 'creaciones'} publicadas`
                : 'Aún no hay contenido publicado'
              }
            </p>
          </div>

          {userData.content.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-white mb-2">No hay contenido</h3>
              <p className="text-gray-400">Este usuario aún no ha publicado contenido.</p>
            </div>
          ) : (() => {
            // Agrupar contenido por tipo
            const groupedContent = userData.content.reduce((acc, item) => {
              const type = item.contentType;
              if (!acc[type]) {
                acc[type] = [];
              }
              acc[type].push(item);
              return acc;
            }, {} as Record<string, any[]>);

            // Configuración de categorías
            const categoryConfig = {
              'avatares': { title: 'Avatares', icon: '👤', description: 'Avatares y personajes' },
              'modelos3d': { title: 'Modelos 3D', icon: '🧩', description: 'Modelos 3D y assets' },
              'musica': { title: 'Música', icon: '🎵', description: 'Pistas y composiciones musicales' },
              'texturas': { title: 'Texturas', icon: '✨', description: 'Texturas y materiales' },
              'animaciones': { title: 'Animaciones', icon: '🎬', description: 'Animaciones y motion graphics' },
              'OBS': { title: 'OBS', icon: '📺', description: 'Widgets para streaming' },
              'colecciones': { title: 'Colecciones', icon: '📦', description: 'Colección de contenido creativo' }
            };

            const categoriesWithContent = Object.keys(groupedContent).map(type => ({
              type,
              ...categoryConfig[type as keyof typeof categoryConfig],
              content: groupedContent[type],
              count: groupedContent[type].length
            }));

            return (
              <div className="space-y-12">
                {categoriesWithContent.map((category) => (
                  <div key={category.type} className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8">
                    {/* Header de la categoría */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-xl flex items-center justify-center backdrop-blur-sm border border-purple-500/30">
                          {category.type === 'OBS' ? (
                            <img
                              src="/logos/OBS_Studio_logo.png"
                              alt="OBS"
                              className="w-10 h-10 object-contain filter brightness-0 invert"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                          ) : (
                            <span className="text-3xl">{category.icon}</span>
                          )}
                          <span className="text-3xl hidden">📺</span>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white">{category.title}</h3>
                          <p className="text-gray-400">{category.description}</p>
                        </div>
                      </div>
                      <div className="bg-black/40 rounded-lg px-3 py-1 backdrop-blur-sm border border-white/20">
                        <span className="text-white text-sm font-medium">{category.count} {category.count === 1 ? 'creación' : 'creaciones'}</span>
                      </div>
                    </div>

                    {/* Grid de contenido */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {category.content.map((item) => (
                        <ContentCard
                          key={item.id}
                          content={{
                            id: item.id,
                            title: item.title,
                            description: item.description,
                            contentType: item.contentType,
                            category: item.category,
                            price: item.price,
                            isFree: item.isFree,
                            currency: 'CLP',
                            likes: item.likes,
                            views: item.views,
                            author: userData.username,
                            authorAvatar: userData.avatar,
                            authorId: userData.id,
                            createdAt: item.createdAt,
                            image: item.coverImage,
                            files: item.files
                          }}
                          onClick={() => openContentModal(item)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>

        {/* Modal */}
        {selectedContent && (
          <ProductModal
            product={selectedContent}
            isOpen={isModalOpen}
            onClose={closeModal}
            isOwner={false}
            onDelete={handleDeleteContent}
            source="user-profile"
          />
        )}
      </div>
    </Layout>
  );
}
