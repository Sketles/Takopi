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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onCancel}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl bg-gradient-to-br from-gray-900/95 to-purple-900/95 backdrop-blur-xl rounded-3xl border border-purple-500/30 shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-purple-500/20">
          <h2 className="text-2xl font-bold text-white">Editar Producto</h2>
          <button
            onClick={onCancel}
            className="w-10 h-10 bg-gray-500/20 hover:bg-gray-500/30 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-300 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-700/50">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-purple-600/20 text-purple-300 border-b-2 border-purple-400'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/30'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Título */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Título del producto"
                  maxLength={100}
                />
              </div>

              {/* Descripción breve */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Descripción breve
                </label>
                <textarea
                  value={formData.shortDescription}
                  onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                  className="w-full h-24 px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  placeholder="Descripción corta del producto"
                  maxLength={500}
                />
              </div>

              {/* Descripción completa */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Descripción completa *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full h-32 px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  placeholder="Descripción detallada del producto"
                  maxLength={2000}
                />
              </div>

              {/* Precio */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Precio
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                      className="w-full pl-8 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Moneda
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="CLP">CLP</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
                
                <div className="flex items-end">
                  <label className="flex items-center gap-2 text-white">
                    <input
                      type="checkbox"
                      checked={formData.isFree}
                      onChange={(e) => handleInputChange('isFree', e.target.checked)}
                      className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm font-medium">Gratis</span>
                  </label>
                </div>
              </div>

              {/* Licencia */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Licencia
                </label>
                <div className="space-y-3">
                  <select
                    value={formData.license}
                    onChange={(e) => handleInputChange('license', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Describe los términos de la licencia personalizada"
                    />
                  )}
                </div>
              </div>

              {/* Visibilidad */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Visibilidad
                </label>
                <select
                  value={formData.visibility}
                  onChange={(e) => handleInputChange('visibility', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="public">Público</option>
                  <option value="unlisted">No listado</option>
                  <option value="draft">Borrador</option>
                </select>
              </div>

              {/* Etiquetas */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Etiquetas
                </label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.newTag}
                      onChange={(e) => handleInputChange('newTag', e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      className="flex-1 px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Agregar etiqueta"
                    />
                    <button
                      onClick={handleAddTag}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Agregar
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full border border-purple-500/30"
                      >
                        #{tag}
                        <button
                          onClick={() => handleRemoveTag(index)}
                          className="text-purple-400 hover:text-purple-300"
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
            <FileUploader
              files={files}
              onFilesChange={handleFilesChange}
              onSetCover={handleSetCover}
              onDeleteFile={handleDeleteFile}
              onReorderFiles={handleReorderFiles}
              contentType={product.contentType}
              maxFileSize={50}
            />
          )}

          {activeTab === 'actions' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20">
                <h3 className="text-lg font-semibold text-white mb-2">Zona de Peligro</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Estas acciones son permanentes y no se pueden deshacer.
                </p>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Eliminar Producto
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-purple-500/20">
          <div className="text-sm text-gray-400">
            Los cambios se guardan automáticamente
          </div>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="px-6 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !formData.title.trim() || !formData.description.trim()}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
          <div className="relative bg-gradient-to-br from-gray-900/95 to-red-900/95 backdrop-blur-xl rounded-2xl border border-red-500/30 p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-2">¿Eliminar producto?</h3>
            <p className="text-gray-300 mb-6">
              Esta acción no se puede deshacer. Se eliminará permanentemente el producto y todos sus archivos.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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
