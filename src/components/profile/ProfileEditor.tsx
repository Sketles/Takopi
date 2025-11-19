'use client';

import { useState, useRef, useEffect } from 'react';

interface ProfileEditorProps {
  userProfile: any;
  onSave: (updatedProfile: any) => void;
  onCancel: () => void;
  isOpen: boolean;
}

const roles = [
  { id: 'Explorer', label: 'Explorador', icon: '🔍', description: 'Explora y descubre contenido creativo', color: 'from-green-500 to-emerald-600' },
  { id: 'Artist', label: 'Artista', icon: '🎨', description: 'Crea y comparte arte digital', color: 'from-purple-500 to-pink-600' },
  { id: 'Buyer', label: 'Comprador', icon: '🛒', description: 'Adquiere contenido premium', color: 'from-blue-500 to-cyan-600' },
  { id: 'Maker', label: 'Creador', icon: '🛠️', description: 'Desarrolla herramientas y soluciones', color: 'from-orange-500 to-red-600' },
];

export default function ProfileEditor({ userProfile, onSave, onCancel, isOpen }: ProfileEditorProps) {
  const [formData, setFormData] = useState({
    username: userProfile.username || '',
    bio: userProfile.bio || '',
    role: userProfile.role || 'Explorer',
    avatar: userProfile.avatar || '',
    banner: userProfile.banner || '',
    location: userProfile.location || '',
  });

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(userProfile.avatar || '');
  const [bannerPreview, setBannerPreview] = useState(userProfile.banner || '');
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // Actualizar los valores cuando cambie el userProfile o se abra el modal
  useEffect(() => {
    if (isOpen) {
      setFormData({
        username: userProfile.username || '',
        bio: userProfile.bio || '',
        role: userProfile.role || 'Explorer',
        avatar: userProfile.avatar || '',
        banner: userProfile.banner || '',
        location: userProfile.location || '',
      });
      setAvatarPreview(userProfile.avatar || '');
      setBannerPreview(userProfile.banner || '');
    }
  }, [isOpen, userProfile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleSelect = (role: string) => {
    setFormData(prev => ({
      ...prev,
      role
    }));
    setIsRoleDropdownOpen(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('El archivo es demasiado grande. Máximo 5MB permitido.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
        setFormData(prev => ({
          ...prev,
          avatar: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('El archivo es demasiado grande. Máximo 5MB permitido.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setBannerPreview(e.target?.result as string);
        setFormData(prev => ({
          ...prev,
          banner: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave(formData);
  };

  if (!isOpen) return null;

  const selectedRole = roles.find(r => r.id === formData.role);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-start sm:items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl border border-purple-500/30 max-w-4xl w-full max-h-[calc(100vh-2rem)] pb-6 overflow-hidden shadow-2xl shadow-purple-500/20 animate-in zoom-in-95 duration-300">

        {/* Header con Banner Preview */}
        <div className="relative h-48 overflow-visible">
          {/* Banner Preview */}
          <div className="absolute inset-0">
            {bannerPreview ? (
              <img
                src={bannerPreview}
                alt="Banner preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600"></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
          </div>

          {/* Banner Edit Button */}
          <button
            onClick={() => bannerInputRef.current?.click()}
            className="absolute top-4 right-4 px-4 py-2 bg-black/50 backdrop-blur-md border border-white/20 text-white rounded-xl font-medium hover:bg-black/70 transition-all duration-300 flex items-center gap-2 group z-10"
          >
            <svg className="w-4 h-4 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Cambiar Banner
          </button>
          <input
            ref={bannerInputRef}
            type="file"
            accept="image/*"
            onChange={handleBannerChange}
            className="hidden"
          />

          {/* Close Button */}
          <button
            onClick={onCancel}
            className="absolute top-4 left-4 w-10 h-10 bg-black/50 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center hover:bg-black/70 transition-all duration-300 group z-10"
          >
            <svg className="w-5 h-5 text-white group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Avatar Preview - Dentro del header pero con z-index alto */}
          <div className="absolute -bottom-16 left-8 z-30">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-slate-900 overflow-hidden bg-gradient-to-br from-purple-500 to-blue-500 shadow-xl">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-full h-full object-cover object-center"
                    style={{ objectPosition: 'center', minHeight: '100%', minWidth: '100%' }}
                    draggable={false}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-white text-4xl font-bold">
                      {formData.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={() => avatarInputRef.current?.click()}
                className="absolute bottom-2 right-2 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-all duration-300 shadow-lg group-hover:scale-110"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 pt-20 overflow-y-auto max-h-[calc(100vh-18rem)]">
          <div className="space-y-6">
            {/* Username & Location Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Username */}
              <div className="group">
                <label htmlFor="username" className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                  <span className="text-purple-400">@</span>
                  Nombre de Usuario
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 backdrop-blur-sm"
                    placeholder="tu_nombre"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                </div>
              </div>

              {/* Location */}
              <div className="group">
                <label htmlFor="location" className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Ubicación
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 backdrop-blur-sm"
                    placeholder="Santiago, Chile"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                </div>
                <p className="text-xs text-gray-500 mt-1.5">{formData.location.length}/100</p>
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Tu Rol en la Comunidad
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => handleRoleSelect(role.id)}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-300 group overflow-hidden ${formData.role === role.id
                      ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20'
                      : 'border-slate-700/50 bg-slate-800/30 hover:border-slate-600 hover:bg-slate-800/50'
                      }`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                    <div className="relative text-center">
                      <div className="text-3xl mb-2">{role.icon}</div>
                      <div className="text-sm font-semibold text-white mb-1">{role.label}</div>
                      <div className="text-xs text-gray-400 line-clamp-2">{role.description}</div>
                    </div>
                    {formData.role === role.id && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div className="group">
              <label htmlFor="bio" className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                Sobre Ti
              </label>
              <div className="relative">
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  maxLength={500}
                  className="w-full px-4 py-3.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 resize-none backdrop-blur-sm"
                  placeholder="Cuéntanos sobre ti, tu arte y tu pasión creativa... ✨"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              </div>
              <div className="flex justify-between items-center mt-1.5">
                <p className="text-xs text-gray-500">Comparte tu historia con la comunidad</p>
                <p className={`text-xs font-medium ${formData.bio.length > 450 ? 'text-orange-400' : 'text-gray-500'}`}>
                  {formData.bio.length}/500
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-sm flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-6 py-3 bg-slate-700/50 text-white rounded-xl font-medium hover:bg-slate-700 transition-all duration-300 border border-slate-600/50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/30 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}
