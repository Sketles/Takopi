'use client';

import { useState } from 'react';
import ContentCard from '@/components/shared/ContentCard';
import ProductModal from '@/components/product/ProductModal';

interface SearchResultsProps {
  results: {
    items: any[];
    total: number;
    page: number;
    totalPages: number;
    hasMore: boolean;
    stats: {
      total: number;
      currentPage: number;
      totalPages: number;
      itemsPerPage: number;
      showing: string;
    };
  };
  currentUserId?: string;
  onLoadMore?: () => void;
  className?: string;
}

export default function SearchResults({
  results,
  currentUserId,
  onLoadMore,
  className = ""
}: SearchResultsProps) {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Función para transformar item a formato de ContentCard
  const transformToCardProps = (item: any) => ({
    id: item.id,
    title: item.title,
    author: item.authorUsername || item.author,
    authorAvatar: item.authorAvatar,
    contentType: item.contentType,
    category: item.category,
    price: item.price,
    isFree: item.isFree,
    currency: item.currency,
    image: item.coverImage,
    coverImage: item.coverImage,
    description: item.description,
    shortDescription: item.shortDescription,
    tags: item.tags || [],
    likes: item.likes || 0,
    views: item.views || 0,
    downloads: item.downloads || 0,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    onClick: () => handleProductClick(item)
  });

  return (
    <div className={className}>
      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {results.items.map((item) => (
          <ContentCard
            key={item.id}
            {...transformToCardProps(item)}
            className="flex flex-col h-[420px] hover:scale-[1.02] transition-transform duration-200"
          />
        ))}
      </div>

      {/* Load More Button */}
      {results.hasMore && onLoadMore && (
        <div className="text-center">
          <button
            onClick={onLoadMore}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
          >
            Cargar más resultados
          </button>
          <p className="text-gray-400 text-sm mt-2">
            Mostrando {results.stats.showing} de {results.stats.total} resultados
          </p>
        </div>
      )}

      {/* Results Info */}
      {!results.hasMore && results.items.length > 0 && (
        <div className="text-center py-6">
          <p className="text-gray-400">
            Has visto todos los resultados disponibles
          </p>
        </div>
      )}

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          isOwner={currentUserId === selectedProduct.authorId}
          currentUserId={currentUserId}
          onEdit={() => {}}
          onDelete={() => {}}
          onBuy={() => {}}
          onAddToBox={() => {}}
          onLike={() => {}}
          onSave={() => {}}
          onShare={() => {}}
          source="search"
        />
      )}
    </div>
  );
}
