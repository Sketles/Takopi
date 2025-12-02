'use client';

import { memo, useRef, useEffect } from 'react';
import ContentCard from '@/components/shared/ContentCard';
import type { ContentItem } from '@/hooks/useExploreState';

interface ContentGridProps {
  items: ContentItem[];
  loading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  isSearching: boolean;
  error: string | null;
  onItemClick: (item: ContentItem) => void;
  onLoadMore: () => void;
  onResetFilters: () => void;
}

const ContentGrid = memo(
  ({
    items,
    loading,
    isLoadingMore,
    hasMore,
    isSearching,
    error,
    onItemClick,
    onLoadMore,
    onResetFilters
  }: ContentGridProps) => {
    const observerTarget = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (
            entries[0].isIntersecting &&
            hasMore &&
            !loading &&
            !isLoadingMore &&
            !isSearching
          ) {
            onLoadMore();
          }
        },
        { threshold: 0.5 }
      );

      if (observerTarget.current) {
        observer.observe(observerTarget.current);
      }

      return () => observer.disconnect();
    }, [hasMore, loading, isLoadingMore, isSearching, onLoadMore]);

    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-12 sm:py-16 lg:py-20">
          <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-3 sm:mb-4"></div>
          <p className="text-gray-400 text-sm sm:text-base animate-pulse">Cargando contenido increíble...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-16 sm:py-20 lg:py-24">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-red-500/10 mb-4 sm:mb-5 lg:mb-6">
            <span className="text-2xl sm:text-3xl lg:text-4xl">⚠️</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Error al cargar contenido</h3>
          <p className="text-gray-400 text-sm sm:text-base">{error}</p>
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <div className="text-center py-16 sm:py-20 lg:py-24">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-white/5 mb-4 sm:mb-5 lg:mb-6">
            <span className="text-2xl sm:text-3xl lg:text-4xl">🔍</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">No encontramos nada por aquí</h3>
          <p className="text-gray-400 text-sm sm:text-base">Intenta con otra categoría o ajusta tus filtros.</p>
          <button
            onClick={onResetFilters}
            className="mt-3 sm:mt-4 text-purple-400 hover:text-purple-300 font-medium text-sm sm:text-base"
          >
            Limpiar todos los filtros
          </button>
        </div>
      );
    }

    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="animate-fade-in-up cursor-pointer"
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => onItemClick(item)}
            >
              <ContentCard
                id={item.id}
                title={item.title}
                author={item.author}
                authorAvatar={(item as any).authorAvatar}
                authorId={(item as any).authorId}
                contentType={item.contentType || item.type}
                category={item.category}
                price={item.price}
                isFree={item.isFree}
                currency={item.currency}
                image={item.image}
                coverImage={item.coverImage}
                description={item.description}
                shortDescription={item.shortDescription}
                tags={item.tags || []}
                likes={item.likes || 0}
                views={item.views || 0}
                downloads={item.downloads || 0}
                favorites={(item as any).favorites || 0}
                pins={(item as any).pins || 0}
                createdAt={item.createdAt}
                updatedAt={(item as any).updatedAt || item.createdAt}
                isLiked={(item as any).isLiked || false}
                isPinned={(item as any).isPinned || false}
                className="h-full"
                showPrice={true}
                showStats={true}
                showDescription={true}
              />
            </div>
          ))}
        </div>

        {!isSearching && hasMore && (
          <div ref={observerTarget} className="flex justify-center py-8 sm:py-10 lg:py-12">
            {isLoadingMore && (
              <div className="flex flex-col items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                <p className="text-gray-400 text-xs sm:text-sm">Cargando más contenido...</p>
              </div>
            )}
          </div>
        )}
      </>
    );
  }
);

ContentGrid.displayName = 'ContentGrid';
export default ContentGrid;