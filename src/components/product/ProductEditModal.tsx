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
    visibility: string;
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
    visibility: 'public',
    tags: [] as string[],
    customTags: [] as string[],
    newTag: '',
    newCustomTag: ''
  });

  const [files, setFiles] = useState<FileItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'files' | 'actions'>('details');

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
        visibility: product.visibility || 'public',
        tags: product.tags || [],
        customTags: product.customTags || [],
        newTag: '',
        newCustomTag: ''
      });
      setFiles(product.files || []);
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
        coverImage: files.find(f => f.isCover)?.url || files[0]?.url,
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

    try {
      await onDelete(product);
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
        className="absolute inset-0 bg-black/80 backdrop-blur-xl transition-opacity duration-300"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl bg-[#0a0a0a]/95 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] max-h-[90vh] overflow-hidden flex flex-col animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-2xl font-black text-white tracking-tight">Editar Producto</h2>
          <button
            onClick={onCancel}
            className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-all duration-300 border border-white/5 hover:border-white/20 group"
          >
            <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/5 px-6 pt-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 text-sm font-bold transition-all duration-300 relative ${activeTab === tab.id
                  ? 'text-white'
                  : 'text-white/40 hover:text-white/70'
                }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">{tab.icon}</span>
                {tab.label}
              </span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 rounded-t-full shadow-[0_-2px_10px_rgba(168,85,247,0.5)]"></div>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8">
          {activeTab === 'details' && (
            <div className="space-y-8 animate-fade-in">
              {/* Título */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-white/60 uppercase tracking-wider">
                  Título *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-0 focus:border-purple-500/50 transition-colors text-lg font-medium"
                  placeholder="Título del producto"
                  maxLength={100}
                />
              </div>

              {/* Descripción breve */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-white/60 uppercase tracking-wider">
                  Descripción breve
                </label>
                <textarea
                  value={formData.shortDescription}
                  onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                  className="w-full h-24 px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-0 focus:border-purple-500/50 transition-colors resize-none"
                  placeholder="Descripción corta del producto"
                  maxLength={500}
                />
              </div>

              {/* Descripción completa */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-white/60 uppercase tracking-wider">
                  Descripción completa *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full h-40 px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-0 focus:border-purple-500/50 transition-colors resize-none"
                  placeholder="Descripción detallada del producto"
                  maxLength={2000}
                />
              </div>

              {/* Precio */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-white/60 uppercase tracking-wider">
                    Precio
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 font-bold">$</span>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                      className="w-full pl-8 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-0 focus:border-purple-500/50 transition-colors font-mono"
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-white/60 uppercase tracking-wider">
                    Moneda
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-0 focus:border-purple-500/50 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="CLP">CLP</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>

                <div className="flex items-end pb-3">
                  <label className="flex items-center gap-3 text-white cursor-pointer group">
                    <div className={`w-6 h-6 rounded border flex items-center justify-center transition-all ${formData.isFree ? 'bg-purple-500 border-purple-500' : 'bg-transparent border-white/20 group-hover:border-white/40'}`}>
                      {formData.isFree && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.isFree}
                      onChange={(e) => handleInputChange('isFree', e.target.checked)}
                      className="hidden"
                    />
                    <span className="text-sm font-bold">Es Gratis</span>
                  </label>
                </div>
              </div>

              {/* Licencia */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-white/60 uppercase tracking-wider">
                  Licencia
                </label>
                <div className="space-y-3">
                  <select
                    value={formData.license}
                    onChange={(e) => handleInputChange('license', e.target.value)}
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-0 focus:border-purple-500/50 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="personal">Uso Personal</option>
                    <option value="commercial">Comercial</option>
                    <option value="streaming">Streaming</option>
                    <option value="royalty-free">Libre de Regalías</option>
                    <option value="custom">Personalizada</option>
                  </select>

                  {formData.license === 'custom' && (
                    <input
                      type="text"
                      value={formData.customLicense}
                      onChange={(e) => handleInputChange('customLicense', e.target.value)}
                      className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-0 focus:border-purple-500/50 transition-colors"
                      placeholder="Describe los términos de la licencia personalizada"
                    />
                  )}
                </div>
              </div>

              {/* Visibilidad */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-white/60 uppercase tracking-wider">
                  Visibilidad
                </label>
                <select
                  value={formData.visibility}
                  onChange={(e) => handleInputChange('visibility', e.target.value)}
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-0 focus:border-purple-500/50 transition-colors appearance-none cursor-pointer"
                >
                  <option value="public">Público</option>
                  <option value="unlisted">No listado</option>
                  <option value="draft">Borrador</option>
                </select>
              </div>

              {/* Etiquetas */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-white/60 uppercase tracking-wider">
                  Etiquetas
                </label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.newTag}
                      onChange={(e) => handleInputChange('newTag', e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      className="flex-1 px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-0 focus:border-purple-500/50 transition-colors"
                      placeholder="Agregar etiqueta"
                    />
                    <button
                      onClick={handleAddTag}
                      className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 hover:border-white/20 transition-all"
                    >
                      Agregar
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 text-purple-300 text-sm font-medium rounded-lg border border-purple-500/20"
                      >
                        #{tag}
                        <button
                          onClick={() => handleRemoveTag(index)}
                          className="text-purple-400 hover:text-white transition-colors"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
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
        <div className="flex items-center justify-between p-6 border-t border-white/5 bg-black/20">
          <div className="text-xs font-medium text-white/30 hidden sm:block">
            Los cambios se guardan automáticamente
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={onCancel}
              className="flex-1 sm:flex-none px-6 py-3 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !formData.title.trim() || !formData.description.trim()}
              className="flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Guardando...
                </>
              ) : (
                'Guardar Cambios'
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
