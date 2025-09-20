'use client';

import Layout from '@/components/shared/Layout';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProfileEditor from '@/components/profile/ProfileEditor';
import InlineEditor from '@/components/profile/InlineEditor';
import RoleSelector from '@/components/profile/RoleSelector';

// Datos de ejemplo para el perfil
const userProfile = {
  username: "Sushipan",
  email: "sushipan@takopi.com",
  role: "Artist",
  avatar: null,
  banner: null,
  bio: "Artista digital especializado en modelos 3D futuristas, música experimental y diseño industrial. Explorando los límites de la creatividad digital.",
  location: "Santiago, Chile",
  joinedDate: "Enero 2024",
  stats: {
    followers: 2847,
    following: 156,
    modelsPublished: 24,
    totalSales: 156,
    heartsReceived: 342,
    pinsCreated: 8
  },
  collections: [
    { id: 1, title: "Colección", type: "collection", size: "large" },
    { id: 2, title: "Música", type: "music", size: "medium" },
    { id: 3, title: "Modelos 3D", type: "3d", size: "large" },
    { id: 4, title: "Imágenes", type: "images", size: "small" },
    { id: 5, title: "Texturas", type: "textures", size: "medium" },
    { id: 6, title: "Animaciones", type: "animations", size: "small" },
    { id: 7, title: "Efectos", type: "effects", size: "large" },
    { id: 8, title: "Scripts", type: "scripts", size: "small" },
  ]
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('all');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentProfile, setCurrentProfile] = useState(userProfile);
  const [editingType, setEditingType] = useState<'avatar' | 'banner' | null>(null);
  const [isRoleSelectorOpen, setIsRoleSelectorOpen] = useState(false);
  const { user } = useAuth();

  const isOwnProfile = user?.username === currentProfile.username;

  // Función para cargar el perfil del usuario
  const loadUserProfile = async () => {
    if (!user) return;

    try {
      const token = localStorage.getItem('takopi_token');
      const response = await fetch('/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentProfile(prev => ({
          ...prev,
          ...data.user,
          stats: prev.stats, // Mantener las stats de ejemplo por ahora
          collections: prev.collections, // Mantener las colecciones de ejemplo por ahora
        }));
      }
    } catch (error) {
      console.error('Error al cargar perfil:', error);
    }
  };

  // Función para guardar cambios del perfil
  const handleSaveProfile = async (updatedProfile: any) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('takopi_token');
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedProfile),
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentProfile(prev => ({
          ...prev,
          ...data.user,
          stats: prev.stats,
          collections: prev.collections,
        }));
        setIsEditing(false);

        // Actualizar el usuario en el contexto
        if (user) {
          const updatedUser = {
            ...user,
            username: data.user.username,
            bio: data.user.bio,
            role: data.user.role,
            avatar: data.user.avatar,
          };
          localStorage.setItem('takopi_user', JSON.stringify(updatedUser));
        }
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      alert('Error al actualizar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadUserProfile();
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
      console.error('Error al actualizar avatar:', error);
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
        setEditingType(null);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error al actualizar el banner:', error);
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
      console.error('Error al actualizar rol:', error);
      alert('Error al actualizar el rol');
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Banner Section */}
        <div className="relative h-80 overflow-hidden">
          {/* Banner Background */}
          <div
            className={`absolute inset-0 ${isOwnProfile ? 'cursor-pointer group' : ''}`}
            onClick={() => isOwnProfile && setEditingType('banner')}
          >
            {currentProfile.banner ? (
              <img
                src={currentProfile.banner}
                alt="Banner"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600"></div>
            )}
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

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
                        className="w-full h-full rounded-full object-cover"
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
                      <span>{currentProfile.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Se unió en {currentProfile.joinedDate}</span>
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
                  {currentProfile.stats.followers.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Seguidores</div>
              </div>
              <div className="group cursor-pointer">
                <div className="text-3xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                  {currentProfile.stats.following}
                </div>
                <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Siguiendo</div>
              </div>
              <div className="group cursor-pointer">
                <div className="text-3xl font-bold text-white mb-1 group-hover:text-green-400 transition-colors">
                  {currentProfile.stats.modelsPublished}
                </div>
                <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Modelos</div>
              </div>
              <div className="group cursor-pointer">
                <div className="text-3xl font-bold text-white mb-1 group-hover:text-yellow-400 transition-colors">
                  {currentProfile.stats.totalSales}
                </div>
                <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Ventas</div>
              </div>
              <div className="group cursor-pointer">
                <div className="text-3xl font-bold text-white mb-1 group-hover:text-red-400 transition-colors">
                  {currentProfile.stats.heartsReceived}
                </div>
                <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Corazones</div>
              </div>
              <div className="group cursor-pointer">
                <div className="text-3xl font-bold text-white mb-1 group-hover:text-pink-400 transition-colors">
                  {currentProfile.stats.pinsCreated}
                </div>
                <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Pines</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-6xl mx-auto px-8 py-8">
          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {[
              { id: 'all', label: 'Todo', icon: '🎨' },
              { id: 'collections', label: 'Colecciones', icon: '📦' },
              { id: 'music', label: 'Música', icon: '🎵' },
              { id: 'models', label: 'Modelos 3D', icon: '🎯' },
              { id: 'images', label: 'Imágenes', icon: '🖼️' },
              { id: 'textures', label: 'Texturas', icon: '✨' },
              { id: 'animations', label: 'Animaciones', icon: '🎬' },
              { id: 'effects', label: 'Efectos', icon: '⚡' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                  : 'bg-black/40 border border-purple-500/20 text-gray-300 hover:bg-purple-500/20 hover:text-white'
                  }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {currentProfile.collections.map((item, index) => (
              <div
                key={item.id}
                className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 cursor-pointer ${item.size === 'large' ? 'md:col-span-2 md:row-span-2' :
                  item.size === 'medium' ? 'md:col-span-1 md:row-span-2' :
                    'md:col-span-1 md:row-span-1'
                  }`}
                style={{
                  animationDelay: `${index * 100}ms`,
                  aspectRatio: item.size === 'large' ? '2/1' : item.size === 'medium' ? '1/1.5' : '1/1'
                }}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-4 left-4 w-8 h-8 border border-purple-400/30 rounded-full"></div>
                  <div className="absolute bottom-4 right-4 w-6 h-6 border border-blue-400/30 rounded-full"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 border border-pink-400/20 rounded-full"></div>
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-between p-6">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-xl flex items-center justify-center backdrop-blur-sm border border-purple-500/30">
                      {item.type === 'collection' && <span className="text-2xl">📦</span>}
                      {item.type === 'music' && <span className="text-2xl">🎵</span>}
                      {item.type === '3d' && <span className="text-2xl">🎯</span>}
                      {item.type === 'images' && <span className="text-2xl">🖼️</span>}
                      {item.type === 'textures' && <span className="text-2xl">✨</span>}
                      {item.type === 'animations' && <span className="text-2xl">🎬</span>}
                      {item.type === 'effects' && <span className="text-2xl">⚡</span>}
                      {item.type === 'scripts' && <span className="text-2xl">💻</span>}
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="w-8 h-8 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="text-white">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-purple-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {item.type === 'collection' && 'Colección de contenido creativo'}
                      {item.type === 'music' && 'Pistas y composiciones musicales'}
                      {item.type === '3d' && 'Modelos 3D y assets'}
                      {item.type === 'images' && 'Galería de imágenes'}
                      {item.type === 'textures' && 'Texturas y materiales'}
                      {item.type === 'animations' && 'Animaciones y motion graphics'}
                      {item.type === 'effects' && 'Efectos visuales y shaders'}
                      {item.type === 'scripts' && 'Scripts y herramientas'}
                    </p>
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {currentProfile.collections.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-4xl">🎨</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Tu espacio creativo está vacío</h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Comienza a crear y compartir tu arte. Sube tus primeros modelos, música o imágenes.
              </p>
              <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25">
                Crear Contenido
              </button>
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
        currentValue={currentProfile.avatar}
        onSave={handleAvatarUpdate}
        onCancel={() => setEditingType(null)}
        isOpen={editingType === 'avatar'}
      />

      {/* Inline Banner Editor */}
      <InlineEditor
        type="banner"
        currentValue={currentProfile.banner}
        onSave={handleBannerUpdate}
        onCancel={() => setEditingType(null)}
        isOpen={editingType === 'banner'}
      />
    </Layout>
  );
}
