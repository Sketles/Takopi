'use client';

import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  XMarkIcon,
  PlusIcon,
  PhotoIcon,
  EllipsisVerticalIcon,
  TrashIcon,
  PencilIcon,
  LockClosedIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { Menu } from '@headlessui/react';
import CollectionDetailModal from './CollectionDetailModal';
import { useToast } from '@/components/shared/Toast';

interface Collection {
  id: string;
  title: string;
  description?: string;
  isPublic: boolean;
  coverImage?: string;
  itemCount: number;
  createdAt: Date;
  updatedAt: Date;
}

interface CollectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStatsUpdate?: () => void;
}

export default function CollectionsModal({ isOpen, onClose, onStatsUpdate }: CollectionsModalProps) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [viewingCollection, setViewingCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  // Load collections from API
  useEffect(() => {
    if (isOpen) {
      loadCollections();
    }
  }, [isOpen]);

  const loadCollections = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('takopi_token');
      if (!token) return;

      const response = await fetch('/api/collections', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setCollections(result.data.map((c: any) => ({
            ...c,
            createdAt: new Date(c.createdAt),
            updatedAt: new Date(c.updatedAt)
          })));
        }
      }
    } catch (error) {
      console.error('Error loading collections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCollection = () => {
    setShowCreateModal(true);
  };

  const handleEditCollection = (collection: Collection) => {
    setSelectedCollection(collection);
    setShowCreateModal(true);
  };

  const handleDeleteCollection = async (collectionId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta colección?')) return;

    try {
      const token = localStorage.getItem('takopi_token');
      if (!token) return;

      const response = await fetch(`/api/collections/${collectionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setCollections(collections.filter(c => c.id !== collectionId));
        addToast({ type: 'success', title: 'Eliminada', message: 'Colección eliminada correctamente' });
        onStatsUpdate?.();
      } else {
        const result = await response.json();
        addToast({ type: 'error', title: 'Error', message: result.error || 'Error al eliminar la colección' });
      }
    } catch (error) {
      console.error('Error deleting collection:', error);
      addToast({ type: 'error', title: 'Error', message: 'Error al eliminar la colección' });
    }
  };

  const handleViewCollection = (collection: Collection) => {
    setViewingCollection(collection);
  };

  const handleAddItems = () => {
    addToast({ type: 'info', title: 'Próximamente', message: 'Selector de productos próximamente' });
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-3xl bg-[#0a0a0a] border border-white/10 shadow-2xl transition-all">
                  {/* Header */}
                  <div className="relative border-b border-white/10 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Dialog.Title className="text-2xl font-bold text-white">
                          Mis Colecciones
                        </Dialog.Title>
                        <p className="text-sm text-gray-400 mt-1">
                          {collections.length} {collections.length === 1 ? 'colección' : 'colecciones'}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {/* Botón Crear Nueva Colección */}
                        <button
                          onClick={handleCreateCollection}
                          className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg shadow-purple-500/20"
                        >
                          <PlusIcon className="w-5 h-5" />
                          <span>Nueva Colección</span>
                        </button>

                        {/* Botón Cerrar */}
                        <button
                          onClick={onClose}
                          className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors"
                        >
                          <XMarkIcon className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Collections Grid */}
                  <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {collections.length === 0 ? (
                      // Empty State
                      <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl bg-white/5">
                        <PhotoIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">No tienes colecciones aún</h3>
                        <p className="text-gray-400 mb-6 max-w-md mx-auto">
                          Crea tu primera colección para organizar tus productos favoritos
                        </p>
                        <button
                          onClick={handleCreateCollection}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105"
                        >
                          <PlusIcon className="w-5 h-5" />
                          <span>Crear Primera Colección</span>
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {collections.map((collection) => (
                          <div
                            key={collection.id}
                            className="group relative bg-[#0f0f0f] border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(168,85,247,0.2)]"
                          >
                            {/* Cover Image */}
                            <div
                              onClick={() => handleViewCollection(collection)}
                              className="relative aspect-[4/3] overflow-hidden cursor-pointer"
                            >
                              {collection.coverImage ? (
                                <img
                                  src={collection.coverImage}
                                  alt={collection.title}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-purple-900/20 to-blue-900/20 flex items-center justify-center">
                                  <PhotoIcon className="w-16 h-16 text-white/20" />
                                </div>
                              )}
                              
                              {/* Gradient Overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>

                              {/* Item Count Badge */}
                              <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-black/60 backdrop-blur-md border border-white/20 rounded-full text-sm font-medium text-white">
                                {collection.itemCount} {collection.itemCount === 1 ? 'item' : 'items'}
                              </div>

                              {/* Privacy Badge */}
                              <div className="absolute top-3 right-3">
                                {collection.isPublic ? (
                                  <div className="p-2 bg-green-500/20 backdrop-blur-md border border-green-500/30 rounded-full text-green-400" title="Pública">
                                    <GlobeAltIcon className="w-4 h-4" />
                                  </div>
                                ) : (
                                  <div className="p-2 bg-gray-500/20 backdrop-blur-md border border-gray-500/30 rounded-full text-gray-400" title="Privada">
                                    <LockClosedIcon className="w-4 h-4" />
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Collection Info */}
                            <div className="p-4">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <h3
                                  onClick={() => handleViewCollection(collection)}
                                  className="text-lg font-bold text-white line-clamp-1 cursor-pointer hover:text-purple-400 transition-colors"
                                >
                                  {collection.title}
                                </h3>

                                {/* Actions Menu */}
                                <Menu as="div" className="relative">
                                  <Menu.Button className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                                    <EllipsisVerticalIcon className="w-5 h-5 text-gray-400" />
                                  </Menu.Button>
                                  <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                  >
                                    <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl bg-[#0f0f0f] border border-white/10 shadow-2xl overflow-hidden z-10">
                                      <Menu.Item>
                                        {({ active }) => (
                                          <button
                                            onClick={() => handleEditCollection(collection)}
                                            className={`${active ? 'bg-white/5' : ''} flex items-center gap-3 w-full px-4 py-3 text-sm text-white transition-colors`}
                                          >
                                            <PencilIcon className="w-4 h-4" />
                                            <span>Editar</span>
                                          </button>
                                        )}
                                      </Menu.Item>
                                      <Menu.Item>
                                        {({ active }) => (
                                          <button
                                            onClick={() => handleDeleteCollection(collection.id)}
                                            className={`${active ? 'bg-red-500/10' : ''} flex items-center gap-3 w-full px-4 py-3 text-sm text-red-400 transition-colors`}
                                          >
                                            <TrashIcon className="w-4 h-4" />
                                            <span>Eliminar</span>
                                          </button>
                                        )}
                                      </Menu.Item>
                                    </Menu.Items>
                                  </Transition>
                                </Menu>
                              </div>

                              {collection.description && (
                                <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                                  {collection.description}
                                </p>
                              )}

                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>Actualizado {new Date(collection.updatedAt).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Create/Edit Collection Modal */}
      {showCreateModal && (
        <CreateCollectionModal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setSelectedCollection(null);
          }}
          collection={selectedCollection}
          onSave={async (newCollection) => {
            try {
              const token = localStorage.getItem('takopi_token');
              if (!token) return;

              if (selectedCollection) {
                // Editar colección existente
                const response = await fetch(`/api/collections/${selectedCollection.id}`, {
                  method: 'PATCH',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  },
                  body: JSON.stringify(newCollection)
                });

                if (response.ok) {
                  const result = await response.json();
                  setCollections(collections.map(c =>
                    c.id === selectedCollection.id ? {
                      ...result.data,
                      createdAt: new Date(result.data.createdAt),
                      updatedAt: new Date(result.data.updatedAt)
                    } : c
                  ));
                  addToast({ type: 'success', title: 'Actualizada', message: 'Colección actualizada correctamente' });
                  onStatsUpdate?.();
                } else {
                  const result = await response.json();
                  addToast({ type: 'error', title: 'Error', message: result.error || 'Error al actualizar la colección' });
                  return;
                }
              } else {
                // Crear nueva colección
                const response = await fetch('/api/collections', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  },
                  body: JSON.stringify(newCollection)
                });

                if (response.ok) {
                  const result = await response.json();
                  setCollections([...collections, {
                    ...result.data,
                    createdAt: new Date(result.data.createdAt),
                    updatedAt: new Date(result.data.updatedAt)
                  }]);
                  addToast({ type: 'success', title: 'Creada', message: 'Colección creada correctamente' });
                  onStatsUpdate?.();
                } else {
                  const result = await response.json();
                  addToast({ type: 'error', title: 'Error', message: result.error || 'Error al crear la colección' });
                  return;
                }
              }
              setShowCreateModal(false);
              setSelectedCollection(null);
            } catch (error) {
              console.error('Error saving collection:', error);
              addToast({ type: 'error', title: 'Error', message: 'Error al guardar la colección' });
            }
          }}
        />
      )}

      {/* Collection Detail Modal */}
      {viewingCollection && (
        <CollectionDetailModal
          isOpen={!!viewingCollection}
          onClose={() => setViewingCollection(null)}
          collection={viewingCollection}
          onEdit={(collection) => {
            handleEditCollection(collection);
            setViewingCollection(null);
          }}
          onDelete={(collectionId) => {
            handleDeleteCollection(collectionId);
            setViewingCollection(null);
          }}
          onAddItems={handleAddItems}
        />
      )}
    </>
  );
}

// Modal para crear/editar colección
interface CreateCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  collection: Collection | null;
  onSave: (collection: Partial<Collection>) => void;
}

function CreateCollectionModal({ isOpen, onClose, collection, onSave }: CreateCollectionModalProps) {
  const [title, setTitle] = useState(collection?.title || '');
  const [description, setDescription] = useState(collection?.description || '');
  const [isPublic, setIsPublic] = useState(collection?.isPublic ?? true);
  const { addToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      addToast({ type: 'warning', title: 'Título requerido', message: 'Por favor ingresa un título para la colección' });
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim(),
      isPublic
    });
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[60]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-3xl bg-[#0a0a0a] border border-white/10 shadow-2xl transition-all">
                {/* Header */}
                <div className="border-b border-white/10 p-6">
                  <Dialog.Title className="text-xl font-bold text-white">
                    {collection ? 'Editar Colección' : 'Nueva Colección'}
                  </Dialog.Title>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* Título */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Título <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ej: Modelos Favoritos"
                      maxLength={50}
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                      autoFocus
                    />
                    <p className="text-xs text-gray-500 mt-1">{title.length}/50 caracteres</p>
                  </div>

                  {/* Descripción */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Descripción (opcional)
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe tu colección..."
                      rows={3}
                      maxLength={200}
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">{description.length}/200 caracteres</p>
                  </div>

                  {/* Visibilidad */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-3">
                      Visibilidad
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setIsPublic(true)}
                        className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 ${
                          isPublic
                            ? 'bg-purple-500/10 border-purple-500/50 text-purple-400'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                        }`}
                      >
                        <GlobeAltIcon className="w-5 h-5" />
                        <div className="text-left">
                          <div className="font-medium text-sm">Pública</div>
                          <div className="text-xs opacity-70">Todos pueden ver</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsPublic(false)}
                        className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 ${
                          !isPublic
                            ? 'bg-purple-500/10 border-purple-500/50 text-purple-400'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                        }`}
                      >
                        <LockClosedIcon className="w-5 h-5" />
                        <div className="text-left">
                          <div className="font-medium text-sm">Privada</div>
                          <div className="text-xs opacity-70">Solo tú</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-medium hover:bg-white/10 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg shadow-purple-500/20"
                    >
                      {collection ? 'Guardar Cambios' : 'Crear Colección'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
