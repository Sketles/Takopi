'use client';

import { useState, useEffect } from 'react';

interface ProductEditorProps {
  product: any;
  isOpen: boolean;
  onSave: (updatedProduct: any) => void;
  onCancel: () => void;
}

export default function ProductEditor({ product, isOpen, onSave, onCancel }: ProductEditorProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    price: '',
    isFree: true,
    tags: [] as string[],
    license: '',
    category: '',
    subcategory: ''
  });

  const [currentTagInput, setCurrentTagInput] = useState('');

  useEffect(() => {
    if (product && isOpen) {
      setFormData({
        title: product.title || '',
        description: product.description || '',
        shortDescription: product.shortDescription || '',
        price: product.price || '0',
        isFree: product.isFree !== false,
        tags: product.tags || [],
        license: product.license || '',
        category: product.category || '',
        subcategory: product.subcategory || ''
      });
    }
  }, [product, isOpen]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTagAdd = () => {
    const tag = currentTagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setCurrentTagInput('');
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleTagAdd();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedProduct = {
      ...product,
      ...formData,
      updatedAt: new Date().toISOString()
    };

    onSave(updatedProduct);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-gradient-to-br from-gray-900/95 to-purple-900/95 backdrop-blur-xl rounded-3xl border border-purple-500/30 shadow-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-purple-500/20">
          <h2 className="text-2xl font-bold text-white">Editar Producto</h2>
          <button
            onClick={onCancel}
            className="w-10 h-10 bg-red-500/20 hover:bg-red-500/30 rounded-full flex items-center justify-center text-red-400 hover:text-red-300 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Título */}
          <div>
            <label className="block text-white font-medium mb-2">Título *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
              placeholder="Nombre del producto"
              required
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-white font-medium mb-2">Descripción *</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors resize-none"
              placeholder="Describe tu producto en detalle..."
              rows={4}
              required
            />
          </div>

          {/* Descripción breve */}
          <div>
            <label className="block text-white font-medium mb-2">Descripción breve</label>
            <textarea
              value={formData.shortDescription}
              onChange={(e) => handleInputChange('shortDescription', e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors resize-none"
              placeholder="Descripción corta para vista previa..."
              rows={2}
            />
          </div>

          {/* Precio */}
          <div>
            <label className="block text-white font-medium mb-2">Precio</label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => handleInputChange('isFree', !formData.isFree)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${formData.isFree
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                  }`}
              >
                {formData.isFree ? 'Gratis' : 'De pago'}
              </button>
              {!formData.isFree && (
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  className="flex-1 bg-gray-800/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="0"
                  min="0"
                />
              )}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-white font-medium mb-2">Etiquetas</label>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentTagInput}
                  onChange={(e) => setCurrentTagInput(e.target.value)}
                  onKeyPress={handleTagInputKeyPress}
                  className="flex-1 bg-gray-800/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="Escribe una etiqueta y presiona Enter o coma..."
                />
                <button
                  type="button"
                  onClick={handleTagAdd}
                  className="px-4 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors"
                >
                  Agregar
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleTagRemove(tag)}
                        className="text-purple-400 hover:text-red-400 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Licencia */}
          <div>
            <label className="block text-white font-medium mb-2">Licencia</label>
            <select
              value={formData.license}
              onChange={(e) => handleInputChange('license', e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
            >
              <option value="">Seleccionar licencia</option>
              <option value="personal">Personal</option>
              <option value="comercial">Comercial</option>
              <option value="creative-commons">Creative Commons</option>
              <option value="mit">MIT</option>
              <option value="apache">Apache</option>
            </select>
          </div>

          {/* Botones */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 bg-gray-600 text-white rounded-xl font-medium hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
