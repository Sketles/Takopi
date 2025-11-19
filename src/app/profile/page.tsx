'use client';

import Layout from '@/components/shared/Layout';
import { Suspense, useState, useEffect } from 'react';
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
  const { user } = useAuth();
  const { createCardProps } = useContentCard();
  const searchParams = useSearchParams();

  const isOwnProfile = user?.username === currentProfile.username;

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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
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
        alert('No hay token de autenticación. Por favor, inicia sesión nuevamente.');
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
        if (user) {
          const updatedUser = { ...user, ...data.user };
          localStorage.setItem('takopi_user', JSON.stringify(updatedUser));
        }

        setIsEditing(false);
      } else {
        console.error('❌ Error del servidor:', response.status, response.statusText);
        const errorData = await response.json().catch(() => ({ error: 'Error desconocido del servidor' }));
        alert(`Error del servidor (${response.status}): ${errorData.error}`);
      }
    } catch (error) {
      console.error('❌ Error al actualizar perfil:', error);

      if (error.name === 'AbortError') {
        alert('Error de conexión: La solicitud tardó demasiado tiempo. Verifica tu conexión a internet.');
      } else if (error instanceof TypeError && error.message === 'Failed to fetch') {
        alert('Error de conexión: No se pudo conectar con el servidor. Verifica que el servidor esté ejecutándose.');
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        alert(`Error al actualizar el perfil: ${errorMessage}`);
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

        // Actualizar el usuario en el contexto
        if (user) {
          const updatedUser = { ...user, avatar: data.user.avatar };
          localStorage.setItem('takopi_user', JSON.stringify(updatedUser));
        }
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      alert('Error al actualizar el avatar');
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

        // Actualizar el usuario en el contexto
        if (user) {
          const updatedUser = { ...user, banner: data.user.banner };
          localStorage.setItem('takopi_user', JSON.stringify(updatedUser));
        }

        setEditingType(null);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      alert('Error al actualizar el banner');
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

        // Actualizar el usuario en el contexto
        if (user) {
          const updatedUser = { ...user, role: data.user.role };
          localStorage.setItem('takopi_user', JSON.stringify(updatedUser));
        }
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      alert('Error al actualizar el rol');
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
        alert(`Error: ${errorMessage}`);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('❌ Error eliminando producto:', error);
      alert('Error al eliminar el producto');
      throw error;
    }
  };

  // Función para guardar cambios del producto
  const handleSaveProduct = async (updatedProduct: any) => {
    try {
      const token = localStorage.getItem('takopi_token');
      const response = await fetch(`/api/content/${updatedProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedProduct),
      });

      if (response.ok) {
        // Actualizar la lista de creaciones
        setUserCreations(prev =>
          prev.map(creation =>
            creation.id === updatedProduct.id ? updatedProduct : creation
          )
        );
        setIsProductEditorOpen(false);
        setProductToEdit(null);
        alert('Producto actualizado exitosamente');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      alert('Error al actualizar el producto');
    }
  };

  // Función para cancelar edición
  const handleCancelEdit = () => {
    setIsProductEditorOpen(false);
    setProductToEdit(null);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Banner Section */}
        <div className="relative h-80 overflow-hidden bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600">

          {/* Banner Background Mejorado */}
          <div
            className={`absolute inset-0 ${isOwnProfile ? 'cursor-pointer group' : ''}`}
            onClick={() => isOwnProfile && setEditingType('banner')}
          >
            {currentProfile.banner ? (
              <img
                src={currentProfile.banner}
                alt="Banner"
                className="w-full h-full object-cover object-center"
                style={{ objectPosition: 'center', minHeight: '100%', minWidth: '100%', maxHeight: 'none', maxWidth: 'none' }}
                draggable={false}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600"></div>
            )}
            <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>

            {/* Banner Edit Overlay */}
            {isOwnProfile && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="text-center text-white">
                  <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  <span className="text-sm">Editar Banner</span>
                </div>
              </div>
            )}
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
                  <div
                    className={`w-32 h-32 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center border-4 border-white/20 shadow-2xl ${isOwnProfile ? 'cursor-pointer' : ''}`}
                    onClick={() => isOwnProfile && setEditingType('avatar')}
                  >
                    {currentProfile.avatar ? (
                      <img
                        src={currentProfile.avatar}
                        alt={currentProfile.username}
                        className="w-full h-full rounded-full object-cover object-center"
                        style={{ objectPosition: 'center', minHeight: '100%', minWidth: '100%', maxHeight: 'none', maxWidth: 'none' }}
                        draggable={false}
                      />
                    ) : (
                      <span className="text-white text-4xl font-bold">
                        {currentProfile.username.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  {isOwnProfile && (
                    <button
                      onClick={() => setEditingType('avatar')}
                      className="absolute -bottom-2 -right-2 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors shadow-lg"
                    >
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 text-white">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                    <h1 className="text-4xl font-bold">{currentProfile.username}</h1>
                    <div className="flex items-center gap-2 relative">
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${currentProfile.role === 'Artist' ? 'bg-purple-500/80 text-white' :
                        currentProfile.role === 'Explorer' ? 'bg-green-500/80 text-white' :
                          currentProfile.role === 'Buyer' ? 'bg-blue-500/80 text-white' :
                            currentProfile.role === 'Maker' ? 'bg-orange-500/80 text-white' :
                              'bg-gray-500/80 text-white'
                        }`}>
                        {currentProfile.role === 'Artist' ? 'Artista' :
                          currentProfile.role === 'Explorer' ? 'Explorador' :
                            currentProfile.role === 'Buyer' ? 'Comprador' :
                              currentProfile.role === 'Maker' ? 'Creador' :
                                currentProfile.role}
                      </span>
                      {isOwnProfile && (
                        <button
                          onClick={() => setIsRoleSelectorOpen(!isRoleSelectorOpen)}
                          className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors shadow-lg"
                          title="Cambiar rol"
                        >
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                      )}

                      {/* Role Selector */}
                      {isOwnProfile && (
                        <RoleSelector
                          currentRole={currentProfile.role}
                          onSave={handleRoleUpdate}
                          onCancel={() => setIsRoleSelectorOpen(false)}
                          isOpen={isRoleSelectorOpen}
                        />
                      )}
                    </div>
                  </div>

                  <p className="text-gray-200 text-lg mb-4 max-w-2xl">{currentProfile.bio || 'No hay descripción disponible'}</p>

                  <div className="flex flex-wrap items-center gap-6 text-gray-300">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{currentProfile.location || 'Chile'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Se unió en {currentProfile.createdAt ? new Date(currentProfile.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' }) : 'Fecha no disponible'}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {isOwnProfile ? (
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="px-6 py-3 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-xl font-medium hover:bg-white/30 transition-all duration-300"
                    >
                      Editar Perfil
                    </button>
                  ) : (
                    <>
                      <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                        Seguir
                      </button>
                      <button className="px-6 py-3 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-xl font-medium hover:bg-white/30 transition-all duration-300">
                        Mensaje
                      </button>
                    </>
                  )}
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
                  {realStats ? realStats.followersCount.toLocaleString() : currentProfile.stats.followers.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Seguidores</div>
              </div>
              <div className="group cursor-pointer">
                <div className="text-3xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                  {realStats ? realStats.followingCount : currentProfile.stats.following}
                </div>
                <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Siguiendo</div>
              </div>
              <div className="group">
                <div className="text-3xl font-bold text-white mb-1 group-hover:text-green-400 transition-colors">
                  {realStats ? realStats.contentCount : currentProfile.stats.modelsPublished}
                </div>
                <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Creaciones</div>
              </div>
              <div className="group cursor-pointer">
                <div className="text-3xl font-bold text-white mb-1 group-hover:text-yellow-400 transition-colors">
                  {realStats ? realStats.purchaseCount : currentProfile.stats.totalSales}
                </div>
                <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Ventas</div>
              </div>
              <div className="group cursor-pointer">
                <div className="text-3xl font-bold text-white mb-1 group-hover:text-red-400 transition-colors">
                  {realStats ? realStats.totalLikes : currentProfile.stats.heartsReceived}
                </div>
                <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Corazones</div>
              </div>
              <div className="group cursor-pointer">
                <div className="text-3xl font-bold text-white mb-1 group-hover:text-pink-400 transition-colors">
                  {realStats ? realStats.totalDownloads : currentProfile.stats.pinsCreated}
                </div>
                <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Pines</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Mis Creaciones por Categorías */}
        {isOwnProfile && (
          <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Tabs de navegación */}
            <div className="mb-8">
              <div className="flex space-x-1 bg-gray-800/50 rounded-lg p-1 mb-6">
                <button
                  onClick={() => setActiveSection('creations')}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeSection === 'creations'
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                    }`}
                >
                  🎨 Mis Creaciones
                </button>
                <button
                  onClick={() => setActiveSection('purchases')}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeSection === 'purchases'
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                    }`}
                >
                  🛒 Mis Compras
                </button>
              </div>

              {/* Header dinámico */}
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  {activeSection === 'creations' ? 'Mis Creaciones' : 'Mis Compras'}
                </h2>
                <p className="text-gray-400">
                  {activeSection === 'creations'
                    ? (userCreations.length > 0
                      ? `${userCreations.length} ${userCreations.length === 1 ? 'creación' : 'creaciones'} publicadas`
                      : 'Aún no tienes creaciones publicadas')
                    : 'Contenido que has comprado y puedes descargar'
                  }
                </p>
              </div>
            </div>

            {/* Contenido dinámico según la sección activa */}
            {activeSection === 'creations' ? (
              loadingCreations ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
                  <span className="ml-3 text-gray-300">Cargando creaciones...</span>
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

                // Mapeo de tipos de contenido a configuración de categorías - Categorías finales
                const categoryConfig = {
                  'avatares': { title: 'Avatares', icon: '👤', description: 'Avatares y personajes' },
                  'modelos3d': { title: 'Modelos 3D', icon: '🧩', description: 'Modelos 3D y assets' },
                  'musica': { title: 'Música', icon: '🎵', description: 'Pistas y composiciones musicales' },
                  'texturas': { title: 'Texturas', icon: '✨', description: 'Texturas y materiales' },
                  'animaciones': { title: 'Animaciones', icon: '🎬', description: 'Animaciones y motion graphics' },
                  'OBS': { title: 'OBS', icon: '📺', description: 'Widgets para streaming' },
                  'colecciones': { title: 'Colecciones', icon: '📦', description: 'Colección de contenido creativo' }
                };

                // Obtener solo las categorías que tienen contenido
                const categoriesWithContent = Object.keys(groupedCreations).map(type => ({
                  type,
                  ...categoryConfig[type as keyof typeof categoryConfig],
                  creations: groupedCreations[type],
                  count: groupedCreations[type].length
                }));

                return categoriesWithContent.length > 0 ? (
                  <div className="space-y-12">
                    {categoriesWithContent.map((category) => (
                      <div key={category.type} className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8">
                        {/* Header de la categoría */}
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-xl flex items-center justify-center backdrop-blur-sm border border-purple-500/30">
                              {category.type === 'obs-widgets' || category.type === 'obs' || category.type === 'obs-widget' ? (
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
                              {/* Fallback emoji para OBS si falla la imagen */}
                              {category.type === 'obs-widgets' || category.type === 'obs' || category.type === 'obs-widget' ? (
                                <span className="text-3xl hidden">📺</span>
                              ) : null}
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

                        {/* Grid de tarjetas de creaciones usando ContentCard */}
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
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🎨</div>
                    <h3 className="text-xl font-semibold text-white mb-2">Aún no tienes creaciones</h3>
                    <p className="text-gray-400">Comienza compartiendo tu primera creación con la comunidad</p>
                  </div>
                );
              })()
            ) : (
              // Sección de Mis Compras
              <PurchasesSection />
            )}
          </div>
        )}
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
