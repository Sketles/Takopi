'use client';

import { useState, useEffect } from 'react';
import FileUploader from './FileUploader';

interface FileItem {
  id: string;
  name: string;
  originalName: string;
  size: number;
  type: string;
  url: string;
  previewUrl?: string;
  isCover?: boolean;
}

interface ProductEditModalProps {
  product: {
    id: string;
    title: string;
    description: string;
    shortDescription?: string;
    contentType: string;
    category: string;
    price: number;
    currency: string;
    isFree: boolean;
    license: string;
    customLicense?: string;
    isListed: boolean;
    tags: string[];
    customTags: string[];
    files: FileItem[];
    coverImage?: string;
    additionalImages?: string[];
  } | null;
  isOpen: boolean;
  onSave: (updatedProduct: any) => void;
  onCancel: () => void;
  onDelete?: (productId: string) => void;
}

export default function ProductEditModal({
  product,
  isOpen,
  onSave,
  onCancel,
  onDelete
}: ProductEditModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    price: 0,
    currency: 'CLP',
    isFree: true,
    license: 'personal',
    customLicense: '',
    isListed: true,
    tags: [] as string[],
    customTags: [] as string[],
    newTag: '',
    newCustomTag: ''
  });

  const [files, setFiles] = useState<FileItem[]>([]);
  const [coverImage, setCoverImage] = useState<string>('');
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'files' | 'actions'>('details');

  // Función auxiliar para inferir MIME type desde URL o extensión
  const inferMimeType = (url: string): string => {
    const ext = url.split('.').pop()?.toLowerCase() || '';
    const mimeMap: Record<string, string> = {
      'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 'png': 'image/png',
      'webp': 'image/webp', 'gif': 'image/gif', 'avif': 'image/avif',
      'mp3': 'audio/mpeg', 'wav': 'audio/wav', 'ogg': 'audio/ogg',
      'glb': 'model/gltf-binary', 'gltf': 'model/gltf+json',
      'mp4': 'video/mp4', 'webm': 'video/webm',
      'zip': 'application/zip', 'rar': 'application/x-rar-compressed',
      'json': 'application/json', 'pdf': 'application/pdf'
    };
    return mimeMap[ext] || 'application/octet-stream';
  };

  // Función para extraer nombre de archivo desde URL
  const extractFileName = (url: string): string => {
    try {
      const urlParts = url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      // Remover timestamp y hash del nombre (ej: 1234567890-abc123-filename.mp3 -> filename.mp3)
      const cleanName = fileName.replace(/^\d+-[a-z0-9]+-/, '');
      return decodeURIComponent(cleanName) || 'archivo';
    } catch {
      return 'archivo';
    }
  };

  // Inicializar datos del formulario
  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || '',
        description: product.description || '',
        shortDescription: product.shortDescription || '',
        price: product.price || 0,
        currency: product.currency || 'CLP',
        isFree: product.isFree ?? true,
        license: product.license || 'personal',
        customLicense: product.customLicense || '',
        isListed: product.isListed ?? true,
        tags: product.tags || [],
        customTags: product.customTags || [],
        newTag: '',
        newCustomTag: ''
      });
      
      // Establecer cover image actual
      setCoverImage(product.coverImage || '');
      
      // Transformar URLs a FileItems si vienen como strings
      const rawFiles = product.files || [];
      const transformedFiles: FileItem[] = rawFiles.map((file: any, index: number) => {
        // Si ya es un FileItem completo, devolverlo
        if (typeof file === 'object' && file.id && file.name) {
          return file;
        }
        // Si es una URL (string), transformar a FileItem
        const url = typeof file === 'string' ? file : file?.url || '';
        const fileName = extractFileName(url);
        const mimeType = inferMimeType(url);
        
        return {
          id: `existing-${index}-${Date.now()}`,
          name: fileName,
          originalName: fileName,
          size: 0, // No tenemos el tamaño real desde la URL
          type: mimeType,
          url: url,
          previewUrl: mimeType.startsWith('image/') ? url : undefined,
          isCover: index === 0 && mimeType.startsWith('image/')
        };
      });
      
      setFiles(transformedFiles);
    }
  }, [product]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddTag = () => {
    if (formData.newTag.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, prev.newTag.trim().toLowerCase()],
        newTag: ''
      }));
    }
  };

  const handleRemoveTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const handleAddCustomTag = () => {
    if (formData.newCustomTag.trim()) {
      setFormData(prev => ({
        ...prev,
        customTags: [...prev.customTags, prev.newCustomTag.trim().toLowerCase()],
        newCustomTag: ''
      }));
    }
  };

  const handleRemoveCustomTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      customTags: prev.customTags.filter((_, i) => i !== index)
    }));
  };

  const handleFilesChange = (newFiles: FileItem[]) => {
    setFiles(newFiles);
  };

  // Manejar upload de cover image
  const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar que sea imagen
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida (JPG, PNG, WEBP, etc.)');
      return;
    }

    // Validar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no puede superar los 5MB');
      return;
    }

    // Obtener token de autenticación
    const token = localStorage.getItem('takopi_token');
    if (!token) {
      alert('Debes estar logueado para subir imágenes');
      return;
    }

    setIsUploadingCover(true);
    try {
      const formData = new FormData();
      formData.append('files', file);
      formData.append('contentType', 'texturas'); // Usamos texturas para imágenes

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Error al subir la imagen');
      }

      const data = await response.json();
      // El endpoint devuelve data.data.files[0].url o data.data.coverImage
      const uploadedUrl = data.data?.files?.[0]?.url || data.data?.coverImage;
      if (uploadedUrl) {
        setCoverImage(uploadedUrl);
      } else {
        throw new Error('No se recibió URL de la imagen');
      }
    } catch (error) {
      console.error('Error uploading cover image:', error);
      alert(error instanceof Error ? error.message : 'Error al subir la imagen. Intenta de nuevo.');
    } finally {
      setIsUploadingCover(false);
    }
  };

  const handleSetCover = (fileId: string) => {
    const updatedFiles = files.map(f => ({ ...f, isCover: f.id === fileId }));
    setFiles(updatedFiles);
  };

  const handleDeleteFile = (fileId: string) => {
    setFiles(files.filter(f => f.id !== fileId));
  };

  const handleReorderFiles = (fromIndex: number, toIndex: number) => {
    const newFiles = [...files];
    const [movedFile] = newFiles.splice(fromIndex, 1);
    newFiles.splice(toIndex, 0, movedFile);
    setFiles(newFiles);
  };

  const handleSave = async () => {
    if (!product) return;

    setIsSaving(true);
    try {
      const updatedProduct = {
        ...product,
        ...formData,
        files,
        // Usar coverImage del estado si se cambió, sino buscar en archivos o mantener el original
        coverImage: coverImage || files.find(f => f.isCover)?.url || files[0]?.url || product.coverImage,
        additionalImages: files
          .filter(f => f.type.startsWith('image/') && !f.isCover)
          .map(f => f.url)
      };

      await onSave(updatedProduct);
    } catch (error) {
      console.error('Error al guardar producto:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!product || !onDelete) return;

    // Validar que el producto tenga un ID válido
    if (!product.id) {
      console.error('❌ El producto no tiene un ID válido:', product);
      alert('Error: El producto no tiene un ID válido');
      return;
    }

    try {
      // Llamar onDelete con el ID del producto en lugar del objeto completo
      await onDelete(product.id);
      setShowDeleteConfirm(false);
      onCancel(); // Cerrar el modal después de eliminar
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  };

  if (!isOpen || !product) return null;

  const tabs = [
    { id: 'details' as const, label: 'Datos Principales', icon: '📝' },
    { id: 'files' as const, label: 'Archivos', icon: '📁' },
    { id: 'actions' as const, label: 'Acciones', icon: '⚙️' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl bg-[#0a0a0a] rounded-3xl border border-white/10 shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white">Editar Producto</h2>
          <button
            onClick={onCancel}
            className="w-10 h-10 bg-black/60 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 hover:scale-105 transition-all duration-300 group shadow-[0_0_20px_rgba(168,85,247,0.2)]"
          >
            <svg className="w-5 h-5 text-white group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 px-6 pt-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 text-sm font-bold transition-all duration-300 relative ${activeTab === tab.id
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white'
                }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">{tab.icon}</span>
                {tab.label}
              </span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 rounded-t-full"></div>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8">
          {activeTab === 'details' && (
            <div className="space-y-6 animate-fade-in">
              {/* Row 1: Imagen + Título lado a lado */}
              <div className="flex gap-6">
                {/* Imagen de Vista Previa - Compacta */}
                <div className="shrink-0">
                  <label className="block text-xs font-medium text-gray-400 mb-2">Portada</label>
                  <div className="relative group">
                    <div className="w-28 h-28 rounded-xl overflow-hidden bg-black/40 border border-white/10 flex items-center justify-center">
                      {coverImage ? (
                        <img src={coverImage} alt="Vista previa" className="w-full h-full object-cover" />
                      ) : (
                        <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>
                    {/* Overlay de acciones */}
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
                      <label className="cursor-pointer p-2 bg-purple-500/80 rounded-lg hover:bg-purple-500 transition-colors">
                        <input type="file" accept="image/*" onChange={handleCoverImageUpload} className="hidden" disabled={isUploadingCover} />
                        {isUploadingCover ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        )}
                      </label>
                      {coverImage && (
                        <button onClick={() => setCoverImage('')} className="p-2 bg-red-500/80 rounded-lg hover:bg-red-500 transition-colors">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Título y Descripción breve */}
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-2">Título *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                      placeholder="Título del producto"
                      maxLength={100}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-2">Descripción breve</label>
                    <input
                      type="text"
                      value={formData.shortDescription}
                      onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                      className="w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                      placeholder="Breve descripción para las cards"
                      maxLength={150}
                    />
                  </div>
                </div>
              </div>

              {/* Descripción completa */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Descripción completa *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full h-28 px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors resize-none text-sm"
                  placeholder="Descripción detallada del producto"
                  maxLength={2000}
                />
              </div>

              {/* Row: Precio + Gratis + Licencia */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Precio (CLP)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                      disabled={formData.isFree}
                      className="w-full pl-7 pr-3 py-2.5 bg-black/30 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500 transition-colors disabled:opacity-40"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Tipo</label>
                  <button
                    type="button"
                    onClick={() => handleInputChange('isFree', !formData.isFree)}
                    className={`w-full py-2.5 px-4 rounded-lg text-sm font-medium transition-all border ${
                      formData.isFree 
                        ? 'bg-green-500/20 border-green-500/40 text-green-400' 
                        : 'bg-purple-500/20 border-purple-500/40 text-purple-400'
                    }`}
                  >
                    {formData.isFree ? '✨ Gratis' : '💰 De Pago'}
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Licencia</label>
                  <select
                    value={formData.license}
                    onChange={(e) => handleInputChange('license', e.target.value)}
                    className="w-full px-3 py-2.5 bg-black/30 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="personal">Personal</option>
                    <option value="commercial">Comercial</option>
                    <option value="streaming">Streaming</option>
                    <option value="royalty-free">Libre de Regalías</option>
                    <option value="custom">Personalizada</option>
                  </select>
                </div>
              </div>

              {formData.license === 'custom' && (
                <input
                  type="text"
                  value={formData.customLicense}
                  onChange={(e) => handleInputChange('customLicense', e.target.value)}
                  className="w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                  placeholder="Términos de la licencia personalizada"
                />
              )}

              {/* Row: Visibilidad + Etiquetas */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Visibilidad</label>
                  <button
                    type="button"
                    onClick={() => handleInputChange('isListed', !formData.isListed)}
                    className={`w-full py-2.5 px-4 rounded-lg text-sm font-medium transition-all border ${
                      formData.isListed 
                        ? 'bg-green-500/20 border-green-500/40 text-green-400' 
                        : 'bg-gray-500/20 border-gray-500/40 text-gray-400'
                    }`}
                  >
                    {formData.isListed ? '👁️ Público' : '🔒 Privado'}
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Agregar etiqueta</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.newTag}
                      onChange={(e) => handleInputChange('newTag', e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      className="flex-1 px-3 py-2.5 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                      placeholder="Nueva etiqueta"
                    />
                    <button
                      onClick={handleAddTag}
                      className="px-4 py-2.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 font-medium rounded-lg border border-purple-500/30 transition-all text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Tags display */}
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 text-purple-300 text-xs font-medium rounded-full border border-purple-500/20"
                    >
                      #{tag}
                      <button onClick={() => handleRemoveTag(index)} className="text-purple-400 hover:text-white transition-colors">×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'files' && (
            <div className="animate-fade-in">
              <FileUploader
                files={files}
                onFilesChange={handleFilesChange}
                onSetCover={handleSetCover}
                onDeleteFile={handleDeleteFile}
                onReorderFiles={handleReorderFiles}
                contentType={product.contentType}
                maxFileSize={50}
              />
            </div>
          )}

          {activeTab === 'actions' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-red-500/5 backdrop-blur-sm rounded-2xl p-8 border border-red-500/10">
                <h3 className="text-lg font-bold text-red-400 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  Zona de Peligro
                </h3>
                <p className="text-white/60 text-sm mb-6 leading-relaxed">
                  Estas acciones son permanentes y no se pueden deshacer. Si eliminas este producto, se perderán todos los archivos, comentarios y estadísticas asociados.
                </p>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-6 py-3 bg-red-500/10 text-red-400 font-bold rounded-xl border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 transition-all w-full sm:w-auto"
                >
                  Eliminar Producto
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-white/10 bg-[#0f0f0f]/80 backdrop-blur-md">
          <div className="text-xs font-medium text-gray-400 hidden sm:block">
            Los cambios se guardan automáticamente
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={onCancel}
              className="flex-1 sm:flex-none px-6 py-3 bg-white/5 border border-white/10 text-white font-medium rounded-xl hover:bg-white/10 transition-all duration-300"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !formData.title.trim() || !formData.description.trim()}
              className="flex-1 sm:flex-none px-8 py-3 bg-purple-500 text-white font-bold rounded-xl hover:bg-purple-600 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Confirmación de eliminación */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md animate-fade-in" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative bg-[#0a0a0a] rounded-2xl border border-red-500/20 p-8 max-w-md w-full shadow-[0_0_50px_rgba(220,38,38,0.2)] animate-scale-in">
            <h3 className="text-xl font-black text-white mb-3">¿Eliminar producto?</h3>
            <p className="text-white/60 mb-8 leading-relaxed">
              Esta acción no se puede deshacer. Se eliminará permanentemente el producto y todos sus archivos.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-3 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
