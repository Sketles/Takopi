'use client';

import { memo, useState } from 'react';
import ContentCard from '@/components/shared/ContentCard';
import type { ContentItem } from '@/hooks/useExploreState';

interface TrendingCarouselProps {
  items: ContentItem[];
  onItemClick: (item: ContentItem) => void;
}

const TrendingCarousel = memo(({ items, onItemClick }: TrendingCarouselProps) => {
  const [isPaused, setIsPaused] = useState(false);

  if (!items || items.length === 0) return null;

  // Triplicar para loop seamless
  const tripleItems = [...items, ...items, ...items];

  return (
    <div className="relative mt-8 sm:mt-10 lg:mt-12 mb-6 sm:mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-5 lg:mb-6 px-4">
        <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2 sm:gap-3">
          <span className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 text-black text-xs sm:text-sm">
            ★
          </span>
          Tendencias
        </h2>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className={`w-2 h-2 rounded-full transition-colors ${isPaused ? 'bg-yellow-500' : 'bg-green-500 animate-pulse'}`}></div>
          <span className="hidden sm:inline">{isPaused ? 'Pausado' : 'Auto-scroll'}</span>
        </div>
      </div>

      {/* LEFT NEON LINES - Outside carousel, in page background */}
      <div className="hidden lg:block absolute left-0 top-16 bottom-0 w-64 pointer-events-none" style={{ transform: 'translateX(-30%)' }}>
        <div className="absolute right-0 top-[10%] h-[2px] neon-line-purple glitch-h-1" style={{ width: '120px' }}></div>
        <div className="absolute right-0 top-[25%] h-[3px] neon-line-cyan glitch-h-2" style={{ width: '160px' }}></div>
        <div className="absolute right-0 top-[40%] h-[4px] neon-line-fuchsia-intense glitch-h-3" style={{ width: '280px' }}></div>
        <div className="absolute right-0 top-[55%] h-[5px] neon-line-cyan-intense glitch-h-4" style={{ width: '320px' }}></div>
        <div className="absolute right-0 top-[70%] h-[3px] neon-line-purple glitch-h-2" style={{ width: '180px' }}></div>
        <div className="absolute right-0 top-[85%] h-[2px] neon-line-fuchsia glitch-h-1" style={{ width: '100px' }}></div>
      </div>

      {/* RIGHT NEON LINES - Outside carousel, in page background */}
      <div className="hidden lg:block absolute right-0 top-16 bottom-0 w-64 pointer-events-none" style={{ transform: 'translateX(30%)' }}>
        <div className="absolute left-0 top-[15%] h-[2px] neon-line-cyan-r glitch-h-3" style={{ width: '130px' }}></div>
        <div className="absolute left-0 top-[32%] h-[3px] neon-line-purple-r glitch-h-1" style={{ width: '170px' }}></div>
        <div className="absolute left-0 top-[48%] h-[5px] neon-line-fuchsia-intense-r glitch-h-4" style={{ width: '300px' }}></div>
        <div className="absolute left-0 top-[62%] h-[4px] neon-line-cyan-intense-r glitch-h-2" style={{ width: '260px' }}></div>
        <div className="absolute left-0 top-[78%] h-[2px] neon-line-purple-r glitch-h-3" style={{ width: '140px' }}></div>
      </div>

      {/* Carousel wrapper */}
      <div 
        className="relative overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Gradient masks inside carousel */}
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-16 lg:w-24 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-16 lg:w-24 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none"></div>

        {/* Animated Track - GPU accelerated */}
        <div 
          className="flex gap-3 sm:gap-4 lg:gap-5 w-max"
          style={{
            animation: `scroll ${items.length * 5}s linear infinite`,
            animationPlayState: isPaused ? 'paused' : 'running',
          }}
        >
          {tripleItems.map((item, index) => (
            <div
              key={`trend-${item.id}-${index}`}
              className="w-[240px] sm:w-[260px] md:w-[280px] lg:w-[300px] flex-shrink-0 cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
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
                showPrice={true}
                showStats={false}
                showDescription={false}
              />
            </div>
          ))}
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        
        /* Neon glow lines - LEFT (gradient to right, fades inward) */
        .neon-line-purple {
          background: linear-gradient(90deg, transparent 0%, #a855f7 15%, #a855f7 100%);
          box-shadow: 0 0 15px #a855f7, 0 0 35px #a855f7, 0 0 60px rgba(168, 85, 247, 0.8);
          filter: blur(2.5px);
          border-radius: 6px;
        }
        .neon-line-cyan {
          background: linear-gradient(90deg, transparent 0%, #22d3ee 15%, #22d3ee 100%);
          box-shadow: 0 0 15px #22d3ee, 0 0 35px #22d3ee, 0 0 60px rgba(34, 211, 238, 0.8);
          filter: blur(2.5px);
          border-radius: 6px;
        }
        .neon-line-fuchsia {
          background: linear-gradient(90deg, transparent 0%, #d946ef 15%, #d946ef 100%);
          box-shadow: 0 0 15px #d946ef, 0 0 35px #d946ef, 0 0 60px rgba(217, 70, 239, 0.8);
          filter: blur(2.5px);
          border-radius: 6px;
        }
        
        /* INTENSE neon lines - center/middle (much more glow) */
        .neon-line-fuchsia-intense {
          background: linear-gradient(90deg, transparent 0%, #d946ef 10%, #ff6bef 50%, #d946ef 100%);
          box-shadow: 0 0 20px #d946ef, 0 0 50px #d946ef, 0 0 100px #d946ef, 0 0 150px rgba(217, 70, 239, 0.6);
          filter: blur(3.5px);
          border-radius: 8px;
        }
        .neon-line-cyan-intense {
          background: linear-gradient(90deg, transparent 0%, #22d3ee 10%, #6bfff8 50%, #22d3ee 100%);
          box-shadow: 0 0 20px #22d3ee, 0 0 50px #22d3ee, 0 0 100px #22d3ee, 0 0 150px rgba(34, 211, 238, 0.6);
          filter: blur(3.5px);
          border-radius: 8px;
        }
        
        /* Neon glow lines - RIGHT (gradient to left, fades inward) */
        .neon-line-purple-r {
          background: linear-gradient(270deg, transparent 0%, #a855f7 15%, #a855f7 100%);
          box-shadow: 0 0 15px #a855f7, 0 0 35px #a855f7, 0 0 60px rgba(168, 85, 247, 0.8);
          filter: blur(2.5px);
          border-radius: 6px;
        }
        .neon-line-cyan-r {
          background: linear-gradient(270deg, transparent 0%, #22d3ee 15%, #22d3ee 100%);
          box-shadow: 0 0 15px #22d3ee, 0 0 35px #22d3ee, 0 0 60px rgba(34, 211, 238, 0.8);
          filter: blur(2.5px);
          border-radius: 6px;
        }
        .neon-line-fuchsia-r {
          background: linear-gradient(270deg, transparent 0%, #d946ef 15%, #d946ef 100%);
          box-shadow: 0 0 15px #d946ef, 0 0 35px #d946ef, 0 0 60px rgba(217, 70, 239, 0.8);
          filter: blur(2.5px);
          border-radius: 6px;
        }
        
        /* INTENSE neon lines RIGHT */
        .neon-line-fuchsia-intense-r {
          background: linear-gradient(270deg, transparent 0%, #d946ef 10%, #ff6bef 50%, #d946ef 100%);
          box-shadow: 0 0 20px #d946ef, 0 0 50px #d946ef, 0 0 100px #d946ef, 0 0 150px rgba(217, 70, 239, 0.6);
          filter: blur(3.5px);
          border-radius: 8px;
        }
        .neon-line-cyan-intense-r {
          background: linear-gradient(270deg, transparent 0%, #22d3ee 10%, #6bfff8 50%, #22d3ee 100%);
          box-shadow: 0 0 20px #22d3ee, 0 0 50px #22d3ee, 0 0 100px #22d3ee, 0 0 150px rgba(34, 211, 238, 0.6);
          filter: blur(3.5px);
          border-radius: 8px;
        }
        
        /* Glitch pulse animations */
        .glitch-h-1 {
          animation: neonPulse1 3s ease-in-out infinite;
        }
        .glitch-h-2 {
          animation: neonPulse2 4s ease-in-out infinite 0.7s;
        }
        .glitch-h-3 {
          animation: neonPulse3 2.5s ease-in-out infinite 1.2s;
        }
        .glitch-h-4 {
          animation: neonPulse4 3.5s ease-in-out infinite 0.3s;
        }
        
        @keyframes neonPulse1 {
          0%, 100% { opacity: 0.4; transform: scaleX(1); }
          25% { opacity: 1; transform: scaleX(1.3); }
          50% { opacity: 0.2; transform: scaleX(0.8); }
          75% { opacity: 0.8; transform: scaleX(1.1); }
        }
        
        @keyframes neonPulse2 {
          0%, 100% { opacity: 0.5; transform: scaleX(1); }
          30% { opacity: 0.9; transform: scaleX(1.4); }
          60% { opacity: 0.3; transform: scaleX(0.9); }
        }
        
        @keyframes neonPulse3 {
          0%, 100% { opacity: 0.6; transform: scaleX(1); }
          20% { opacity: 0.2; transform: scaleX(0.7); }
          50% { opacity: 1; transform: scaleX(1.5); }
          80% { opacity: 0.5; transform: scaleX(1.2); }
        }
        
        @keyframes neonPulse4 {
          0%, 100% { opacity: 0.3; transform: scaleX(1); }
          40% { opacity: 0.8; transform: scaleX(1.2); }
          70% { opacity: 0.1; transform: scaleX(0.6); }
        }
      `}</style>
    </div>
  );
});

TrendingCarousel.displayName = 'TrendingCarousel';
export default TrendingCarousel;