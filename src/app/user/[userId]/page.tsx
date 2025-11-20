'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Layout from '@/components/shared/Layout';
import { useToast } from '@/components/shared/Toast';
import ContentCard, { useContentCard } from '@/components/shared/ContentCard';
import ProductModal from '@/components/product/ProductModal';
import { useAuth } from '@/contexts/AuthContext';

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
  const { user } = useAuth();
  const { addToast } = useToast();
  const { createCardProps } = useContentCard();

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

  const handleFollow = async () => {
    const token = localStorage.getItem('takopi_token');
    if (!token) {
      addToast({ type: 'warning', title: 'Inicia sesión', message: 'Debes iniciar sesión para seguir usuarios' });
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
        addToast({ type: 'error', title: 'Error', message: result.error || 'Error al actualizar seguimiento' });
      }
    } catch (error) {
      console.error('Error following user:', error);
      addToast({ type: 'error', title: 'Error', message: 'Error al actualizar seguimiento' });
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
        <div className="min-h-screen bg-[#050505] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      </Layout>
    );
  }

  if (error || !userData) {
    return (
      <Layout>
        <div className="min-h-screen bg-[#050505] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Usuario no encontrado</h1>
            <p className="text-gray-400 mb-6">{error}</p>
            <button
              onClick={() => router.back()}
              className="px-6 py-2 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-colors"
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
      <div className="min-h-screen bg-[#050505] pb-20">
        {/* Banner Section - Full Width & Immersive */}
        <div className="relative h-[40vh] min-h-[300px] lg:h-[50vh] w-full overflow-hidden">
          {/* Banner Image */}
          <div className="absolute inset-0">
            {userData.banner ? (
              <img
                src={userData.banner}
                alt="Banner"
                className="w-full h-full object-cover object-center"
                draggable={false}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-900 via-black to-blue-900 animate-gradient-xy"></div>
            )}

            {/* Gradient Overlays for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#050505] pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent pointer-events-none"></div>
          </div>
        </div>

        {/* Profile Info Container - Overlapping Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-32 z-10">
          <div className="flex flex-col md:flex-row items-end gap-8 mb-8">
            {/* Avatar */}
            <div className="relative group shrink-0">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1 bg-[#050505]">
                <div className="w-full h-full rounded-full overflow-hidden relative bg-white/5 border border-white/10">
                  {userData.avatar ? (
                    <img
                      src={userData.avatar}
                      alt={userData.username}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600 text-white text-4xl font-bold">
                      {getInitial(userData.username)}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* User Info & Actions */}
            <div className="flex-1 w-full flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-4xl font-bold text-white tracking-tight">{userData.username}</h1>
                  {userData.role === 'Artist' && (
                    <span className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs" title="Artista Verificado">
                      ✓
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-white/60 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${userData.role === 'Artist' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' :
                    userData.role === 'Explorer' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                      'bg-white/5 border-white/10 text-white/60'
                    }`}>
                    {userData.role === 'Artist' ? 'Artista' :
                      userData.role === 'Explorer' ? 'Explorador' :
                        userData.role}
                  </span>
                  <span>•</span>
                  <span>{userData.location || 'Ubicación no especificada'}</span>
                  <span>•</span>
                  <span>Se unió en {new Date(userData.createdAt).getFullYear()}</span>
                </div>

                <p className="text-white/80 max-w-2xl text-lg leading-relaxed">
                  {userData.bio || 'Sin descripción'}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 shrink-0">
                <button
                  onClick={handleFollow}
                  disabled={isFollowLoading}
                  className={`px-6 py-2.5 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg ${isFollowing
                    ? 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                    : 'bg-white text-black hover:bg-gray-200 shadow-white/5'
                    } ${isFollowLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isFollowLoading ? 'Cargando...' : isFollowing ? 'Siguiendo' : 'Seguir'}
                </button>
                <button
                  onClick={() => router.back()}
                  className="px-4 py-2.5 bg-white/5 text-white rounded-xl font-medium hover:bg-white/10 transition-colors border border-white/10"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Stats Bar - Floating Glass */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-12">
            {[
              { label: 'Seguidores', value: userData.stats.followersCount },
              { label: 'Siguiendo', value: userData.stats.followingCount },
              { label: 'Creaciones', value: userData.stats.totalCreations },
              { label: 'Ventas', value: 0 }, // No disponible públicamente por ahora
              { label: 'Corazones', value: userData.stats.totalLikes },
              { label: 'Pines', value: 0 } // No disponible públicamente por ahora
            ].map((stat, idx) => (
              <div key={idx} className="bg-[#0f0f0f]/80 backdrop-blur-md border border-white/5 rounded-2xl p-4 text-center hover:bg-white/5 transition-colors group cursor-default">
                <div className="text-2xl font-bold text-white mb-1 group-hover:scale-110 transition-transform duration-300">
                  {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                </div>
                <div className="text-xs text-white/40 uppercase tracking-wider font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Content Section */}
          <div className="space-y-8">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-2xl font-bold text-white">Creaciones</h2>
              <div className="h-px flex-1 bg-white/10"></div>
            </div>

            {(!userData.content || userData.content.length === 0) ? (
              <div className="flex flex-col items-center justify-center py-20 bg-[#0f0f0f] border border-white/5 rounded-3xl">
                <div className="text-6xl mb-4 opacity-50">📦</div>
                <h3 className="text-xl font-semibold text-white mb-2">No hay contenido</h3>
                <p className="text-white/40">Este usuario aún no ha publicado contenido.</p>
              </div>
            ) : (() => {
              // Agrupar creaciones por tipo de contenido
              const groupedCreations = (userData.content || []).reduce((acc, creation) => {
                const type = creation.contentType;
                if (!acc[type]) {
                  acc[type] = [];
                }
                acc[type].push(creation);
                return acc;
              }, {} as Record<string, any[]>);

              // Mapeo de tipos de contenido a configuración de categorías
              const categoryConfig = {
                'avatares': { title: 'Avatares', icon: '👤', description: 'Personajes y avatares' },
                'modelos3d': { title: 'Modelos 3D', icon: '🎲', description: 'Objetos y assets 3D' },
                'musica': { title: 'Música', icon: '🎵', description: 'Pistas y efectos de sonido' },
                'texturas': { title: 'Texturas', icon: '🎨', description: 'Materiales y superficies' },
                'animaciones': { title: 'Animaciones', icon: '🎬', description: 'Clips y secuencias' },
                'OBS': { title: 'OBS', icon: '📺', description: 'Widgets y overlays' },
                'colecciones': { title: 'Colecciones', icon: '📦', description: 'Packs de contenido' }
              };

              const categoriesWithContent = Object.keys(groupedCreations).map(type => ({
                type,
                ...(categoryConfig[type as keyof typeof categoryConfig] || { title: type, icon: '📁', description: 'Contenido vario' }),
                creations: groupedCreations[type],
                count: groupedCreations[type].length
              }));

              return (
                <div className="space-y-12">
                  {categoriesWithContent.map((category) => (
                    <div key={category.type} className="space-y-6">
                      <div className="flex items-center gap-4 px-2">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-2xl border border-white/5">
                          {category.icon}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white">{category.title}</h3>
                          <p className="text-white/40 text-sm">{category.count} {category.count === 1 ? 'creación' : 'creaciones'}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {category.creations.map((creation: any, idx: number) => (
                          <ContentCard
                            key={creation.id || creation._id || `${category.type}-${idx}`}
                            {...createCardProps({
                              ...creation,
                              author: userData.username,
                              authorAvatar: userData.avatar,
                              authorId: userData.id
                            }, {
                              onClick: () => openContentModal(creation),
                              variant: 'default',
                              showPrice: true,
                              showStats: true,
                              showTags: false,
                              showAuthor: false,
                              showDescription: true
                            })}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>

        {/* Modal */}
        {selectedContent && (
          <ProductModal
            product={selectedContent}
            isOpen={isModalOpen}
            onClose={closeModal}
            isOwner={false}
            currentUserId={user?._id}
            source="public-profile"
          />
        )}
      </div>
    </Layout>
  );
}
