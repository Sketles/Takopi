'use client';

import Layout from '@/components/shared/Layout';
import { Suspense, useState, useEffect } from 'react';
import { useToast } from '@/components/shared/Toast';
import { useAuth } from '@/contexts/AuthContext';
import { useSearchParams } from 'next/navigation';
import ProfileEditor from '@/components/profile/ProfileEditor';
import InlineEditor from '@/components/profile/InlineEditor';
import RoleSelector from '@/components/profile/RoleSelector';
import ContentCard, { useContentCard } from '@/components/shared/ContentCard';
import ProductModal from '@/components/product/ProductModal';
import ProductEditModal from '@/components/product/ProductEditModal';
import PurchasesSection from '@/components/profile/PurchasesSection';

// Evitar pre-render estático
export const dynamic = 'force-dynamic';

// Datos de ejemplo para el perfil (solo para estadísticas por defecto)
const defaultStats = {
  followers: 0,
  following: 0,
  modelsPublished: 0,
  totalSales: 0,
  heartsReceived: 0,
  pinsCreated: 0
};

function ProfileContent() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentProfile, setCurrentProfile] = useState({
    username: "Cargando...",
    email: "",
    role: "Explorer",
    avatar: null as string | null,
    banner: null as string | null,
    bio: "",
    location: "",
    createdAt: "",
    stats: defaultStats
  });
  const [editingType, setEditingType] = useState<'avatar' | 'banner' | null>(null);
  const [isRoleSelectorOpen, setIsRoleSelectorOpen] = useState(false);
  const [realStats, setRealStats] = useState<any>(null);
  const [userCreations, setUserCreations] = useState<any[]>([]);
  const [loadingCreations, setLoadingCreations] = useState(false);
  const [isProductEditorOpen, setIsProductEditorOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'creations' | 'purchases'>('creations');
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();
  const { createCardProps } = useContentCard();
  const searchParams = useSearchParams();

  const isOwnProfile = user?._id === (currentProfile as any).id || user?._id === (currentProfile as any)._id;

  // Manejar parámetro de pestaña desde la URL
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'purchases') {
      setActiveSection('purchases');
    } else {
      setActiveSection('creations');
    }
  }, [searchParams]);

  // Función para cargar las estadísticas reales del usuario
  const loadUserStats = async () => {
    if (!user) return;

    try {
      const token = localStorage.getItem('takopi_token');
      if (!token) return;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos timeout

      const response = await fetch('/api/user/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const result = await response.json();
        setRealStats(result.data);
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Stats request timeout - using default values');
      } else {
        console.log('Stats request failed - using default values');
      }
    }
  };

  const loadUserCreations = async () => {
    if (!user) return;

    setLoadingCreations(true);
    try {
      const token = localStorage.getItem('takopi_token');
      if (!token) return;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos timeout

      const response = await fetch('/api/user/creations', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const result = await response.json();
        setUserCreations(result.data.creations);
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Creations request timeout');
      } else {
        console.log('Creations request failed');
      }
    } finally {
      setLoadingCreations(false);
    }
  };

  // Función para cargar el perfil del usuario
  const loadUserProfile = async () => {
    if (!user) return;

    try {
      const token = localStorage.getItem('takopi_token');
      if (!token) return;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos timeout

      const response = await fetch('/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        setCurrentProfile(prev => ({
          ...prev,
          ...data.user,
          stats: prev.stats, // Mantener las stats por defecto
        }));

        // Ya no auto-actualizamos la ubicación
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Profile request timeout');
      } else {
        console.log('Profile request failed');
      }
    }
  };


  // Función para guardar cambios del perfil
  const handleSaveProfile = async (updatedProfile: any) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('takopi_token');

      if (!token) {
        addToast({ type: 'warning', title: 'No autenticado', message: 'No hay token de autenticación. Por favor, inicia sesión nuevamente.' });
        return;
      }

      console.log('🔄 Enviando datos al servidor:', updatedProfile);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 segundos timeout

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedProfile),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      console.log('📡 Respuesta del servidor:', response.status, response.statusText);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Datos recibidos del servidor:', data);

        setCurrentProfile(prev => ({
          ...prev,
          ...data.user,
          banner: data.user.banner || null,
          location: data.user.location || '',
          stats: prev.stats,
        }));

        // Actualizar el usuario en el contexto
        if (user && updateUser) {
          const updatedUser = { ...user, ...data.user };
          updateUser(updatedUser as any);
        }

        setIsEditing(false);
      } else {
        console.error('❌ Error del servidor:', response.status, response.statusText);
        const errorData = await response.json().catch(() => ({ error: 'Error desconocido del servidor' }));
        addToast({ type: 'error', title: `Error del servidor (${response.status})`, message: errorData.error });
      }
    } catch (error: any) {
      console.error('❌ Error al actualizar perfil:', error);

      if (error.name === 'AbortError') {
        addToast({ type: 'warning', title: 'Tiempo agotado', message: 'La solicitud tardó demasiado. Verifica tu conexión a internet.' });
      } else if (error instanceof TypeError && error.message === 'Failed to fetch') {
        addToast({ type: 'error', title: 'Conexión fallida', message: 'No se pudo conectar con el servidor. Verifica que el servidor esté ejecutándose.' });
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        addToast({ type: 'error', title: 'Error', message: `Error al actualizar el perfil: ${errorMessage}` });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      // Actualizar currentProfile con los datos del usuario
      setCurrentProfile(prev => ({
        ...prev,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar || null,
        banner: user.banner || null,
        bio: user.bio || '',
        location: user.location || ''
      }));

      // Load all data in parallel for better performance
      Promise.all([
        loadUserProfile(),
        loadUserStats(),
        loadUserCreations()
      ]).catch(error => {
        console.error('Error loading user data:', error);
      });
    }
  }, [user]);



  // Función para actualizar avatar individualmente
  const handleAvatarUpdate = async (newAvatar: string) => {
    try {
      const token = localStorage.getItem('takopi_token');
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ avatar: newAvatar }),
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentProfile(prev => ({
          ...prev,
          avatar: data.user.avatar
        }));
        setEditingType(null);

        // Actualizar el usuario en el contexto y localStorage
        if (user && updateUser) {
          const updatedUser = { ...user, avatar: data.user.avatar };
          updateUser(updatedUser as any);
        } else if (user) {
          const updatedUser = { ...user, avatar: data.user.avatar };
          localStorage.setItem('takopi_user', JSON.stringify(updatedUser));
        }
      } else {
        const errorData = await response.json();
        addToast({ type: 'error', title: 'Error', message: errorData.error });
      }
    } catch (error) {
      addToast({ type: 'error', title: 'Error', message: 'Error al actualizar el avatar' });
    }
  };

  // Función para actualizar banner individualmente
  const handleBannerUpdate = async (newBanner: string) => {
    try {
      const token = localStorage.getItem('takopi_token');
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ banner: newBanner }),
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentProfile(prev => ({
          ...prev,
          banner: data.user.banner
        }));

        // Actualizar el usuario en el contexto y localStorage
        if (user && updateUser) {
          const updatedUser = { ...user, banner: data.user.banner };
          updateUser(updatedUser as any);
        } else if (user) {
          const updatedUser = { ...user, banner: data.user.banner };
          localStorage.setItem('takopi_user', JSON.stringify(updatedUser));
        }

        setEditingType(null);
      } else {
        const errorData = await response.json();
        addToast({ type: 'error', title: 'Error', message: errorData.error });
      }
    } catch (error) {
      addToast({ type: 'error', title: 'Error', message: 'Error al actualizar el banner' });
    }
  };

  // Función para actualizar rol individualmente
  const handleRoleUpdate = async (newRole: string) => {
    try {
      const token = localStorage.getItem('takopi_token');
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentProfile(prev => ({
          ...prev,
          role: data.user.role
        }));
        setIsRoleSelectorOpen(false);

        // Actualizar el usuario en el contexto y localStorage
        if (user && updateUser) {
          const updatedUser = { ...user, role: data.user.role };
          updateUser(updatedUser as any);
        } else if (user) {
          const updatedUser = { ...user, role: data.user.role };
          localStorage.setItem('takopi_user', JSON.stringify(updatedUser));
        }
      } else {
        const errorData = await response.json();
        addToast({ type: 'error', title: 'Error', message: errorData.error });
      }
    } catch (error) {
      addToast({ type: 'error', title: 'Error', message: 'Error al actualizar el rol' });
    }
  };

  // Función para transformar datos de creación a formato de ProductModal
  const transformCreationToModal = (creation: any) => {
    // Asegurar que el ID sea un string válido
    const contentId = creation.id || creation._id;
    const validId = typeof contentId === 'string' ? contentId : contentId?.toString();

    console.log('🔍 Transformando creación:', {
      originalId: creation.id,
      mongoId: creation._id,
      finalId: validId,
      type: typeof validId
    });

    return {
      id: validId,
      title: creation.title || creation.provisionalName,
      description: creation.description || '',
      shortDescription: creation.shortDescription,
      contentType: creation.contentType,
      category: creation.category,
      price: typeof creation.price === 'string' ? parseFloat(creation.price) || 0 : creation.price,
      currency: creation.currency || 'CLP',
      isFree: creation.isFree,
      license: creation.license || 'personal',
      customLicense: creation.customLicense,
      visibility: creation.visibility || 'public',
      status: creation.status || 'published',
      author: creation.author || creation.authorUsername || 'Anónimo',
      authorAvatar: creation.authorAvatar,
      authorId: creation.authorId,
      likes: creation.likes || 0,
      views: creation.views || 0,
      files: creation.files || [], // Usar los archivos reales
      coverImage: creation.coverImage || creation.image,
      additionalImages: creation.additionalImages || [],
      tags: creation.tags || [],
      customTags: creation.customTags || [],
      createdAt: creation.createdAt,
      updatedAt: creation.updatedAt || creation.createdAt
    };
  };

  // Función para abrir el modal del producto
  const handleProductClick = (product: any) => {
    setSelectedProduct(transformCreationToModal(product));
    setIsProductModalOpen(true);
  };

  // Función para cerrar el modal del producto
  const handleCloseProductModal = () => {
    setIsProductModalOpen(false);
    setSelectedProduct(null);
  };


  // Función para editar producto
  const handleEditProduct = (product: any) => {
    setProductToEdit(product);
    setIsProductEditorOpen(true);
  };

  // Función para eliminar producto
  const handleDeleteProduct = async (product: any, source?: string) => {
    try {
      const token = localStorage.getItem('takopi_token');

      // Debug: verificar el ID que se está enviando
      console.log('🔍 Eliminando producto con ID:', product.id);
      console.log('🔍 Fuente:', source);

      const response = await fetch(`/api/content/${product.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Remover el producto de la lista de creaciones solo si estamos en el perfil
        if (source === 'profile') {
          setUserCreations(prev =>
            prev.filter(creation => creation.id !== product.id)
          );
        }

        // No mostrar alert - eliminación silenciosa y profesional
        // El modal se cerrará automáticamente por el ProductModal
        return { success: true };
      } else {
        console.error('❌ Error response status:', response.status);
        console.error('❌ Error response statusText:', response.statusText);

        let errorMessage = 'Error desconocido';
        try {
          const errorData = await response.json();
          console.error('❌ Error eliminando producto:', errorData);
          errorMessage = errorData.error || errorData.message || 'Error al eliminar el producto';
        } catch (jsonError) {
          console.error('❌ Error parsing JSON:', jsonError);
          errorMessage = `Error ${response.status}: ${response.statusText}`;
        }

        // Solo mostrar error en caso de fallo
        addToast({ type: 'error', title: 'Error', message: `${errorMessage}` });
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('❌ Error eliminando producto:', error);
      addToast({ type: 'error', title: 'Error', message: 'Error al eliminar el producto' });
      throw error;
    }
  };

  // Función para guardar cambios del producto
  const handleSaveProduct = async (updatedProduct: any) => {
    try {
      console.log('💾 Guardando producto:', updatedProduct);
      
      const token = localStorage.getItem('takopi_token');
      if (!token) {
        addToast({ type: 'error', title: 'Error', message: 'No estás autenticado' });
        return;
      }

      const response = await fetch(`/api/content/${updatedProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedProduct),
      });

      const data = await response.json();
      console.log('📥 Respuesta del servidor:', data);

      if (response.ok) {
        // Actualizar la lista de creaciones con los datos actualizados del servidor
        setUserCreations(prev =>
          prev.map(creation =>
            creation.id === updatedProduct.id ? { ...creation, ...data.data } : creation
          )
        );
        
        setIsProductEditorOpen(false);
        setProductToEdit(null);
        
        // Recargar los datos del perfil para asegurar que todo esté actualizado
        await fetchUserProfile();
        
        addToast({ type: 'success', title: 'Éxito', message: 'Producto actualizado exitosamente' });
      } else {
        console.error('❌ Error del servidor:', data);
        addToast({ type: 'error', title: 'Error', message: data.error || 'Error al actualizar el producto' });
      }
    } catch (error) {
      console.error('❌ Error al actualizar producto:', error);
      addToast({ type: 'error', title: 'Error', message: 'Error al actualizar el producto' });
    }
  };

  // Función para cancelar edición
  const handleCancelEdit = () => {
    setIsProductEditorOpen(false);
    setProductToEdit(null);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[#050505] pb-20">
        {/* Banner Section - Full Width & Immersive */}
        <div className="relative h-[40vh] min-h-[300px] lg:h-[50vh] w-full overflow-hidden">
          {/* Banner Image */}
          <div
            className={`absolute inset-0 ${isOwnProfile ? 'cursor-pointer group' : ''}`}
            onClick={() => isOwnProfile && setEditingType('banner')}
          >
            {currentProfile.banner ? (
              <img
                src={currentProfile.banner}
                alt="Banner"
                className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                draggable={false}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-900 via-black to-blue-900 animate-gradient-xy"></div>
            )}

            {/* Gradient Overlays for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#050505] pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent pointer-events-none"></div>

            {/* Banner Edit Overlay */}
            {isOwnProfile && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                <div className="flex flex-col items-center gap-2 text-white">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="font-medium tracking-wide">Cambiar Portada</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Profile Info Container - Overlapping Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-32 z-10">
          <div className="flex flex-col md:flex-row items-end gap-8 mb-8">
            {/* Avatar */}
            <div className="relative group shrink-0">
              <div
                className={`w-32 h-32 md:w-40 md:h-40 rounded-full p-1 bg-[#050505] ${isOwnProfile ? 'cursor-pointer' : ''}`}
                onClick={() => isOwnProfile && setEditingType('avatar')}
              >
                <div className="w-full h-full rounded-full overflow-hidden relative bg-white/5 border border-white/10">
                  {currentProfile.avatar ? (
                    <img
                      src={currentProfile.avatar}
                      alt={currentProfile.username}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600 text-white text-4xl font-bold">
                      {currentProfile.username.charAt(0).toUpperCase()}
                    </div>
                  )}

                  {/* Avatar Edit Overlay */}
                  {isOwnProfile && (
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* User Info & Actions */}
            <div className="flex-1 w-full flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-4xl font-bold text-white tracking-tight">{currentProfile.username}</h1>
                  {currentProfile.role === 'Artist' && (
                    <span className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs" title="Artista Verificado">
                      ✓
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-white/60 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${currentProfile.role === 'Artist' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' :
                    currentProfile.role === 'Explorer' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                      'bg-white/5 border-white/10 text-white/60'
                    }`}>
                    {currentProfile.role === 'Artist' ? 'Artista' :
                      currentProfile.role === 'Explorer' ? 'Explorador' :
                        currentProfile.role}
                  </span>
                  {/* link to change role removed */}
                  {isOwnProfile && (
                    <RoleSelector
                      currentRole={currentProfile.role}
                      onSave={handleRoleUpdate}
                      onCancel={() => setIsRoleSelectorOpen(false)}
                      isOpen={isRoleSelectorOpen}
                    />
                  )}
                  <span>•</span>
                  <span>{currentProfile.location || 'Ubicación no especificada'}</span>
                  <span>•</span>
                  <span>Se unió en {currentProfile.createdAt ? new Date(currentProfile.createdAt).getFullYear() : '2024'}</span>
                </div>

                <p className="text-white/80 max-w-2xl text-lg leading-relaxed">
                  {currentProfile.bio || 'Sin descripción'}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 shrink-0">
                {isOwnProfile ? (
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-6 py-2.5 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-white/5"
                  >
                    Editar Perfil
                  </button>
                ) : (
                  <>
                    <button className="px-6 py-2.5 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-white/5">
                      Seguir
                    </button>
                    <button className="px-4 py-2.5 bg-white/5 text-white rounded-xl font-medium hover:bg-white/10 transition-colors border border-white/10">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Stats Bar - Floating Glass */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-12">
            {[
              { label: 'Seguidores', value: realStats ? realStats.followersCount : currentProfile.stats.followers },
              { label: 'Siguiendo', value: realStats ? realStats.followingCount : currentProfile.stats.following },
              { label: 'Creaciones', value: realStats ? realStats.contentCount : currentProfile.stats.modelsPublished },
              { label: 'Ventas', value: realStats ? realStats.purchaseCount : currentProfile.stats.totalSales },
              { label: 'Corazones', value: realStats ? realStats.totalLikes : currentProfile.stats.heartsReceived },
              { label: 'Pines', value: realStats ? realStats.totalDownloads : currentProfile.stats.pinsCreated }
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
          {isOwnProfile && (
            <div className="space-y-8">
              {/* Tabs */}
              <div className="flex justify-center">
                <div className="bg-[#0f0f0f] border border-white/5 rounded-full p-1 inline-flex">
                  <button
                    onClick={() => setActiveSection('creations')}
                    className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${activeSection === 'creations'
                      ? 'bg-white text-black shadow-lg'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    Mis Creaciones
                  </button>
                  <button
                    onClick={() => setActiveSection('purchases')}
                    className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${activeSection === 'purchases'
                      ? 'bg-white text-black shadow-lg'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    Mis Compras
                  </button>
                </div>
              </div>

              {/* Dynamic Content */}
              <div className="animate-fade-in">
                {activeSection === 'creations' ? (
                  loadingCreations ? (
                    <div className="flex flex-col items-center justify-center py-20">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
                      <span className="text-white/40">Cargando creaciones...</span>
                    </div>
                  ) : (() => {
                    // Agrupar creaciones por tipo de contenido
                    const groupedCreations = userCreations.reduce((acc, creation) => {
                      const type = creation.contentType;
                      if (!acc[type]) {
                        acc[type] = [];
                      }
                      acc[type].push(creation);
                      return acc;
                    }, {});

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

                    return categoriesWithContent.length > 0 ? (
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
                                  {...createCardProps(creation, {
                                    onClick: () => handleProductClick(creation),
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
                    ) : (
                      <div className="text-center py-20 bg-[#0f0f0f] rounded-3xl border border-white/5">
                        <div className="text-6xl mb-6 opacity-20">🎨</div>
                        <h3 className="text-2xl font-bold text-white mb-2">Aún no tienes creaciones</h3>
                        <p className="text-white/40 max-w-md mx-auto mb-8">
                          Comparte tu talento con el mundo subiendo tu primera creación al marketplace.
                        </p>
                        <button
                          onClick={() => window.location.href = '/upload'}
                          className="px-8 py-3 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-colors"
                        >
                          Subir Contenido
                        </button>
                      </div>
                    );
                  })()
                ) : (
                  <PurchasesSection />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Profile Editor Modal */}
      <ProfileEditor
        userProfile={currentProfile}
        onSave={handleSaveProfile}
        onCancel={() => setIsEditing(false)}
        isOpen={isEditing}
      />

      {/* Inline Avatar Editor */}
      <InlineEditor
        type="avatar"
        currentValue={currentProfile.avatar || undefined}
        onSave={handleAvatarUpdate}
        onCancel={() => setEditingType(null)}
        isOpen={editingType === 'avatar'}
      />

      {/* Inline Banner Editor */}
      <InlineEditor
        type="banner"
        currentValue={currentProfile.banner || undefined}
        onSave={handleBannerUpdate}
        onCancel={() => setEditingType(null)}
        isOpen={editingType === 'banner'}
      />

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={isProductModalOpen}
          onClose={handleCloseProductModal}
          isOwner={isOwnProfile}
          currentUserId={user?._id}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
          onBuy={() => { }}
          onAddToBox={() => { }}
          onLike={() => { }}
          onSave={() => { }}
          onShare={() => { }}
          source="profile"
        />
      )}

      {/* Product Editor Modal */}
      <ProductEditModal
        product={productToEdit}
        isOpen={isProductEditorOpen}
        onSave={handleSaveProduct}
        onCancel={handleCancelEdit}
        onDelete={handleDeleteProduct}
      />

    </Layout>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div>Cargando perfil...</div>}>
      <ProfileContent />
    </Suspense>
  );
}
