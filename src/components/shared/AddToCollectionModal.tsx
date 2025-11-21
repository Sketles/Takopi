'use client';

import { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, PlusIcon, FolderIcon } from '@heroicons/react/24/outline';
import { useToast } from '@/components/shared/Toast';

interface Collection {
  id: string;
  title: string;
  itemCount: number;
}

interface AddToCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentId: string;
  contentTitle: string;
}

export default function AddToCollectionModal({
  isOpen,
  onClose,
  contentId,
  contentTitle
}: AddToCollectionModalProps) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState<string | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      loadCollections();
    }
  }, [isOpen]);

  const loadCollections = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('takopi_token');
      if (!token) {
        addToast({ type: 'warning', title: 'Inicia sesión', message: 'Debes iniciar sesión para usar colecciones' });
        onClose();
        return;
      }

      const response = await fetch('/api/collections', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        setCollections(result.data);
      }
    } catch (error) {
      console.error('Error loading collections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCollection = async (collectionId: string) => {
    setAdding(collectionId);
    try {
      const token = localStorage.getItem('takopi_token');
      if (!token) return;

      const response = await fetch(`/api/collections/${collectionId}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ contentId })
      });

      if (response.ok) {
        // Actualizar el contador de items
        setCollections(collections.map(c =>
          c.id === collectionId ? { ...c, itemCount: c.itemCount + 1 } : c
        ));
        
        // Mostrar mensaje de éxito y cerrar modal
        const collection = collections.find(c => c.id === collectionId);
        addToast({ 
          type: 'success', 
          title: 'Agregado', 
          message: `Guardado en "${collection?.title}"` 
        });
        setTimeout(() => onClose(), 800);
      } else {
        const result = await response.json();
        if (result.error?.includes('ya existe')) {
          addToast({ type: 'info', title: 'Ya existe', message: 'Este contenido ya está en esta colección' });
        } else {
          addToast({ type: 'error', title: 'Error', message: result.error || 'Error al agregar a la colección' });
        }
      }
    } catch (error) {
      console.error('Error adding to collection:', error);
      addToast({ type: 'error', title: 'Error', message: 'Error al agregar a la colección' });
    } finally {
      setAdding(null);
    }
  };

  const handleCreateNew = () => {
    onClose();
    addToast({ type: 'info', title: 'Crea colecciones', message: 'Ve a tu perfil para crear colecciones' });
  };

  return (
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
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#0a0a0a] border border-white/10 shadow-2xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <Dialog.Title className="text-lg font-bold text-white">
                    Guardar en colección
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>

                {/* Content Title */}
                <div className="px-4 pt-3 pb-2">
                  <p className="text-sm text-gray-400 truncate">
                    {contentTitle}
                  </p>
                </div>

                {/* Collections List */}
                <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : collections.length === 0 ? (
                    // Empty State
                    <div className="text-center py-12 px-4">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/10 flex items-center justify-center">
                        <FolderIcon className="w-8 h-8 text-purple-400" />
                      </div>
                      <h3 className="text-base font-semibold text-white mb-2">
                        No tienes colecciones
                      </h3>
                      <p className="text-sm text-gray-400 mb-6">
                        Crea una colección primero para organizar tus contenidos favoritos
                      </p>
                      <button
                        onClick={handleCreateNew}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-all duration-300"
                      >
                        <PlusIcon className="w-5 h-5" />
                        <span>Crear Colección</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-2">
                      {collections.map((collection) => (
                        <button
                          key={collection.id}
                          onClick={() => handleAddToCollection(collection.id)}
                          disabled={adding === collection.id}
                          className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                              <FolderIcon className="w-5 h-5 text-purple-400" />
                            </div>
                            <div className="text-left">
                              <p className="text-sm font-medium text-white">
                                {collection.title}
                              </p>
                              <p className="text-xs text-gray-500">
                                {collection.itemCount} {collection.itemCount === 1 ? 'item' : 'items'}
                              </p>
                            </div>
                          </div>

                          {adding === collection.id ? (
                            <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <PlusIcon className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer - Create New Button */}
                {collections.length > 0 && (
                  <div className="p-3 border-t border-white/10">
                    <button
                      onClick={handleCreateNew}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-medium transition-colors"
                    >
                      <PlusIcon className="w-5 h-5" />
                      <span>Crear Nueva Colección</span>
                    </button>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
