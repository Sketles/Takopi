'use client';

import { memo, useRef, useCallback } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import ContentCard from '@/components/shared/ContentCard';
import type { ContentItem } from '@/hooks/useExploreState';

interface TrendingCarouselProps {
  items: ContentItem[];
  onItemClick: (item: ContentItem) => void;
}

const TrendingCarousel = memo(({ items, onItemClick }: TrendingCarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = useCallback((direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 350;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  }, []);

  if (!items || items.length === 0) return null;

  return (
    <div className="relative mt-12 mb-16 text-left">
      <div className="flex items-center justify-between mb-4 px-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <span className="text-yellow-400">★</span> Tendencias para ti
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div
        ref={carouselRef}
        className="flex gap-6 overflow-x-auto pb-8 px-4 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map((item) => (
          <div
            key={`trend-${item.id}`}
            className="min-w-[300px] md:min-w-[350px] snap-center cursor-pointer"
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
              showStats={false}
              showDescription={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
});

TrendingCarousel.displayName = 'TrendingCarousel';
export default TrendingCarousel;