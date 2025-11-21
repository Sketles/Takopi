'use client';

import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  XMarkIcon,
  PlusIcon,
  EllipsisVerticalIcon,
  TrashIcon,
  ShareIcon,
  LockClosedIcon,
  GlobeAltIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import { Menu } from '@headlessui/react';
import ContentCard from '@/components/shared/ContentCard';
import ProductModal from '@/components/product/ProductModal';
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

interface CollectionItem {
  id: string;
  collectionId: string;
  contentId: string;
  addedAt: string;
  content: {
    id: string;
    title: string;
    description?: string;
    contentType: string;
    category: string;
    coverImage?: string;
    price: number;
    isFree: boolean;
    currency: string;
    likes: number;
    pins: number;
    views: number;
    downloads: number;
    author: string;
    authorId: string;
    authorAvatar?: string;
  };
}

interface CollectionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  collection: Collection;
  onEdit: (collection: Collection) => void;
  onDelete: (collectionId: string) => void;
  onAddItems: () => void;
}

export default function CollectionDetailModal({
  isOpen,
  onClose,
  collection,
  onEdit,
  onDelete,
  onAddItems
}: CollectionDetailModalProps) {
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const { addToast } = useToast();

  // Cargar productos de la colección desde la API
  useEffect(() => {
    if (isOpen && collection) {
      loadCollectionItems();
    }
  }, [isOpen, collection]);

  const loadCollectionItems = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('takopi_token');
      if (!token) return;

      const response = await fetch(`/api/collections/${collection.id}/items`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        // Los datos ya vienen con la estructura correcta desde la API
        setItems(result.data || []);
      } else {
        console.error('Error loading collection items');
        setItems([]);
      }
    } catch (error) {
      console.error('Error loading collection items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (contentId: string) => {
    if (!confirm('¿Quieres eliminar este item de la colección?')) return;

    try {
      const token = localStorage.getItem('takopi_token');
      if (!token) return;

      const response = await fetch(`/api/collections/${collection.id}/items?contentId=${contentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setItems(items.filter(item => item.contentId !== contentId));
        addToast({ type: 'success', title: 'Eliminado', message: 'Producto eliminado de la colección' });
      } else {
        const result = await response.json();
        addToast({ type: 'error', title: 'Error', message: result.error || 'Error al eliminar el producto' });
      }
    } catch (error) {
      console.error('Error removing item:', error);
      addToast({ type: 'error', title: 'Error', message: 'Error al eliminar el producto de la colección' });
    }
  };

  const openProductModal = (item: CollectionItem) => {
    // Transformar el item al formato esperado por ProductModal
    const product = {
      id: item.content.id,
      title: item.content.title,
      description: item.content.description || '',
      contentType: item.content.contentType,
      category: item.content.category,
      coverImage: item.content.coverImage,
      price: item.content.price,
      isFree: item.content.isFree,
      currency: item.content.currency,
      likes: item.content.likes,
      views: item.content.views,
      downloads: item.content.downloads,
      author: item.content.author,
      authorId: item.content.authorId,
      image: item.content.coverImage,
      tags: [],
      files: []
    };
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const closeProductModal = () => {
    setIsProductModalOpen(false);
    setSelectedProduct(null);
  };

  const handleShare = () => {
    addToast({ type: 'info', title: 'Próximamente', message: 'Función de compartir colección próximamente' });
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
              <Dialog.Panel className="w-full max-w-7xl transform overflow-hidden rounded-3xl bg-[#0a0a0a] border border-white/10 shadow-2xl transition-all">
                {/* Header */}
                <div className="relative border-b border-white/10 p-6">
                  {/* Background Image Blur Effect */}
                  {collection.coverImage && (
                    <div className="absolute inset-0 opacity-20">
                      <img
                        src={collection.coverImage}
                        alt=""
                        className="w-full h-full object-cover blur-2xl"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0a]"></div>
                    </div>
                  )}

                  <div className="relative flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Dialog.Title className="text-3xl font-bold text-white">
                          {collection.title}
                        </Dialog.Title>
                        
                        {/* Privacy Badge */}
                        {collection.isPublic ? (
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-xs font-medium">
                            <GlobeAltIcon className="w-3.5 h-3.5" />
                            <span>Pública</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-500/10 border border-gray-500/20 rounded-lg text-gray-400 text-xs font-medium">
                            <LockClosedIcon className="w-3.5 h-3.5" />
                            <span>Privada</span>
                          </div>
                        )}
                      </div>

                      {collection.description && (
                        <p className="text-gray-400 mb-3 max-w-3xl">
                          {collection.description}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{items.length} {items.length === 1 ? 'producto' : 'productos'}</span>
                        <span>•</span>
                        <span>Actualizado {new Date(collection.updatedAt).toLocaleDateString('es-ES', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Botón Agregar Productos */}
                      <button
                        onClick={onAddItems}
                        className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg shadow-purple-500/20"
                      >
                        <PlusIcon className="w-5 h-5" />
                        <span className="hidden sm:inline">Agregar Productos</span>
                      </button>

                      {/* Botón Compartir */}
                      <button
                        onClick={handleShare}
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors"
                        title="Compartir"
                      >
                        <ShareIcon className="w-5 h-5" />
                      </button>

                      {/* Menu de Acciones */}
                      <Menu as="div" className="relative">
                        <Menu.Button className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors">
                          <EllipsisVerticalIcon className="w-5 h-5" />
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
                                  onClick={() => {
                                    onEdit(collection);
                                    onClose();
                                  }}
                                  className={`${active ? 'bg-white/5' : ''} flex items-center gap-3 w-full px-4 py-3 text-sm text-white transition-colors`}
                                >
                                  <PencilIcon className="w-4 h-4" />
                                  <span>Editar colección</span>
                                </button>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() => {
                                    onDelete(collection.id);
                                    onClose();
                                  }}
                                  className={`${active ? 'bg-red-500/10' : ''} flex items-center gap-3 w-full px-4 py-3 text-sm text-red-400 transition-colors`}
                                >
                                  <TrashIcon className="w-4 h-4" />
                                  <span>Eliminar colección</span>
                                </button>
                              )}
                            </Menu.Item>
                          </Menu.Items>
                        </Transition>
                      </Menu>

                      {/* Botón Cerrar */}
                      <button
                        onClick={onClose}
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors"
                      >
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Products Grid */}
                <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                  {loading ? (
                    // Loading State
                    <div className="text-center py-20">
                      <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                      <p className="text-gray-400 mt-4">Cargando productos...</p>
                    </div>
                  ) : items.length === 0 ? (
                    // Empty State
                    <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl bg-white/5">
                      <div className="text-4xl mb-4 opacity-50">📦</div>
                      <h3 className="text-xl font-bold text-white mb-2">Colección vacía</h3>
                      <p className="text-gray-400 mb-6 max-w-md mx-auto">
                        Empieza a agregar productos a tu colección
                      </p>
                      <button
                        onClick={onAddItems}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105"
                      >
                        <PlusIcon className="w-5 h-5" />
                        <span>Agregar Productos</span>
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {items.map((item) => (
                        <div key={item.id} className="relative group">
                          <ContentCard
                            id={item.content.id}
                            title={item.content.title}
                            author={item.content.author}
                            authorId={item.content.authorId}
                            authorAvatar={item.content.authorAvatar}
                            contentType={item.content.contentType}
                            category={item.content.category}
                            coverImage={item.content.coverImage}
                            price={item.content.price}
                            isFree={item.content.isFree}
                            currency={item.content.currency}
                            likes={item.content.likes}
                            views={item.content.views}
                            downloads={item.content.downloads}
                            description={item.content.description}
                            showDescription={false}
                            onClick={() => openProductModal(item)}
                          />
                          
                          {/* Remove Button Overlay */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveItem(item.contentId);
                            }}
                            className="absolute top-3 left-3 z-20 p-2 rounded-full bg-red-500/80 hover:bg-red-600 backdrop-blur-md border border-red-500/50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            title="Eliminar de colección"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>

        {/* Product Detail Modal */}
        {selectedProduct && (
          <ProductModal
            isOpen={isProductModalOpen}
            onClose={closeProductModal}
            product={selectedProduct}
          />
        )}
      </Dialog>
    </Transition>
  );
}
