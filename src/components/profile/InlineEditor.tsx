'use client';

import { useState, useRef, useEffect } from 'react';

interface InlineEditorProps {
  type: 'avatar' | 'banner';
  currentValue?: string;
  onSave: (newValue: string) => void;
  onCancel: () => void;
  isOpen: boolean;
}

export default function InlineEditor({ type, currentValue, onSave, onCancel, isOpen }: InlineEditorProps) {
  const [preview, setPreview] = useState(currentValue || '');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Actualizar preview cuando cambie currentValue
  useEffect(() => {
    setPreview(currentValue || '');
  }, [currentValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tamaño del archivo (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        alert('El archivo es demasiado grande. Máximo 5MB permitido.');
        return;
      }

      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        alert('Solo se permiten archivos de imagen.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSave(preview);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl border border-purple-500/20 max-w-md w-full p-6">
        <div className="text-center">
          <h3 className="text-xl font-bold text-white mb-4">
            Cambiar {type === 'avatar' ? 'Foto de Perfil' : 'Banner'}
          </h3>

          <div
            className={`mb-4 cursor-pointer group ${type === 'avatar'
              ? 'w-32 h-32 mx-auto rounded-full overflow-hidden'
              : 'w-full h-32 rounded-xl overflow-hidden'
              }`}
            onClick={() => fileInputRef.current?.click()}
          >
            {preview ? (
              <img
                src={preview}
                alt={`${type} preview`}
                className={`w-full h-full object-cover ${type === 'avatar' ? 'rounded-full' : 'rounded-xl'
                  }`}
              />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center ${type === 'avatar' ? 'rounded-full' : 'rounded-xl'
                }`}>
                <div className="text-center text-white">
                  <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="text-sm">Seleccionar {type === 'avatar' ? 'foto' : 'banner'}</span>
                </div>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <p className="text-sm text-gray-400 mb-6">
            Formatos soportados: JPG, PNG, GIF (máx. 5MB)
          </p>

          <div className="flex gap-3 justify-center">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
