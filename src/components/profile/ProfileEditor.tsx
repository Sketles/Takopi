'use client';

import { useState, useRef, useEffect } from 'react';

interface ProfileEditorProps {
  userProfile: any;
  onSave: (updatedProfile: any) => void;
  onCancel: () => void;
  isOpen: boolean;
}

const roles = [
  { id: 'Explorer', label: 'Explorador', icon: '🔍', description: 'Explora y descubre contenido creativo' },
  { id: 'Artist', label: 'Artista', icon: '🎨', description: 'Crea y comparte arte digital' },
  { id: 'Buyer', label: 'Comprador', icon: '🛒', description: 'Adquiere contenido premium' },
  { id: 'Maker', label: 'Creador', icon: '🛠️', description: 'Desarrolla herramientas y soluciones' },
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
    console.log('🔍 ProfileEditor - Datos a enviar:', formData);
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl border border-purple-500/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-purple-500/20">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Editar Perfil</h2>
            <button
              onClick={onCancel}
              className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Banner Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Banner</label>
            <div
              className="relative h-32 bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600 rounded-xl overflow-hidden cursor-pointer group"
              onClick={() => bannerInputRef.current?.click()}
            >
              {bannerPreview ? (
                <img
                  src={bannerPreview}
                  alt="Banner preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-black/20"></div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="text-center text-white">
                  <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="text-sm">Cambiar Banner</span>
                </div>
              </div>
              <input
                ref={bannerInputRef}
                type="file"
                accept="image/*"
                onChange={handleBannerChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Avatar Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Foto de Perfil</label>
            <div className="flex items-center gap-4">
              <div
                className="relative w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full cursor-pointer group"
                onClick={() => avatarInputRef.current?.click()}
              >
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full flex items-center justify-center">
                    <span className="text-white text-xl font-bold">
                      {formData.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-400 mb-2">Haz clic en la imagen para cambiar tu foto de perfil</p>
                <p className="text-xs text-gray-500">Formatos soportados: JPG, PNG, GIF (máx. 5MB)</p>
              </div>
            </div>
          </div>

          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
              Nombre de Usuario
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              placeholder="Tu nombre de usuario"
            />
          </div>

          {/* Role Selection */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-2">Rol en la Comunidad</label>
            <button
              type="button"
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white text-left focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">
                  {roles.find(r => r.id === formData.role)?.icon}
                </span>
                <span>{roles.find(r => r.id === formData.role)?.label}</span>
              </div>
              <svg
                className={`w-5 h-5 transition-transform duration-200 ${isRoleDropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isRoleDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-600 rounded-xl shadow-2xl z-10 max-h-60 overflow-y-auto">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => handleRoleSelect(role.id)}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors ${formData.role === role.id ? 'bg-purple-600/20' : ''
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{role.icon}</span>
                      <div>
                        <div className="text-white font-medium">{role.label}</div>
                        <div className="text-sm text-gray-400">{role.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-2">
              Descripción
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none"
              placeholder="Cuéntanos sobre ti, tu arte y tu pasión creativa..."
            />
            <p className="text-xs text-gray-500 mt-2">{formData.bio.length}/500 caracteres</p>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-2">
              Ubicación
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              placeholder="Ciudad, País (ej: Madrid, España)"
            />
            <p className="text-xs text-gray-500 mt-2">{formData.location.length}/100 caracteres</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-purple-500/20 flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-6 py-3 bg-gray-700 text-white rounded-xl font-medium hover:bg-gray-600 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}
