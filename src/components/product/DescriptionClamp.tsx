'use client';

import { useState } from 'react';

interface DescriptionClampProps {
  description: string;
  shortDescription?: string;
  maxLines?: number;
  showViewMore?: boolean;
  onViewMore?: () => void;
  className?: string;
}

export default function DescriptionClamp({
  description,
  shortDescription,
  maxLines = 5,
  showViewMore = true,
  onViewMore,
  className = ''
}: DescriptionClampProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const textToShow = shortDescription || description;
  const shouldTruncate = textToShow.length > 200; // Aproximadamente 5 líneas

  const handleViewMore = () => {
    if (onViewMore) {
      onViewMore();
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  if (!textToShow) {
    return (
      <div className={`text-gray-400 italic ${className}`}>
        No hay descripción disponible
      </div>
    );
  }

  return (
    <div className={className}>
      <div
        className={`text-gray-300 leading-relaxed ${
          !isExpanded && shouldTruncate ? 'line-clamp-5' : ''
        }`}
        style={{
          display: !isExpanded && shouldTruncate ? '-webkit-box' : 'block',
          WebkitLineClamp: !isExpanded && shouldTruncate ? maxLines : 'unset',
          WebkitBoxOrient: 'vertical',
          overflow: !isExpanded && shouldTruncate ? 'hidden' : 'visible'
        }}
      >
        {textToShow}
      </div>
      
      {shouldTruncate && showViewMore && (
        <button
          onClick={handleViewMore}
          className="mt-2 text-purple-400 hover:text-purple-300 font-medium text-sm transition-colors duration-200 flex items-center gap-1"
        >
          {isExpanded ? 'Ver menos' : 'Ver más'}
          <svg 
            className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}
    </div>
  );
}
