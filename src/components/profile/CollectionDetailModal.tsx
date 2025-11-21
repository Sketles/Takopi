'use client';

import { useState, Fragment } from 'react';
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
  title: string;
  author: string;
  contentType: string;
  coverImage: string;
  price: number;
  isFree: boolean;
  currency: string;
  likes: number;
  views: number;
  downloads: number;
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
  // Mock data de productos en la colección
  const [items, setItems] = useState<CollectionItem[]>([
    {
      id: '1',
      title: 'Modelo 3D Sci-Fi Rifle',
      author: 'Usuario Demo',
      contentType: 'modelos3d',
      coverImage: '/placeholders/placeholder-modelo3d.webp',
      price: 15000,
      isFree: false,
      currency: 'CLP',
      likes: 45,
      views: 230,
      downloads: 12
    },
    {
      id: '2',
      title: 'Textura Metal Oxidado',
      author: 'Usuario Demo',
      contentType: 'texturas',
      coverImage: '/placeholders/placeholder-textura.webp',
      price: 0,
      isFree: true,
      currency: 'CLP',
      likes: 78,
      views: 450,
      downloads: 89
    },
    {
      id: '3',
      title: 'Avatar Cyberpunk',
      author: 'Usuario Demo',
      contentType: 'avatares',
      coverImage: '/placeholders/placeholder-avatar.webp',
      price: 8000,
      isFree: false,
      currency: 'CLP',
      likes: 120,
      views: 680,
      downloads: 34
    }
  ]);

  const handleRemoveItem = (itemId: string) => {
    if (confirm('¿Quieres eliminar este item de la colección?')) {
      setItems(items.filter(item => item.id !== itemId));
    }
  };

  const handleShare = () => {
    // TODO: Implementar compartir colección
    alert('¡Función de compartir próximamente!');
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
                  {items.length === 0 ? (
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
                            id={item.id}
                            title={item.title}
                            author={item.author}
                            contentType={item.contentType}
                            category={item.contentType}
                            coverImage={item.coverImage}
                            price={item.price}
                            isFree={item.isFree}
                            currency={item.currency}
                            likes={item.likes}
                            views={item.views}
                            downloads={item.downloads}
                            onClick={() => {/* TODO: Abrir modal de producto */}}
                          />
                          
                          {/* Remove Button Overlay */}
                          <button
                            onClick={() => handleRemoveItem(item.id)}
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
      </Dialog>
    </Transition>
  );
}
