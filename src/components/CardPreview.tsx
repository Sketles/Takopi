'use client';

import { useState } from 'react';
import ContentCard, { useContentCard } from './shared/ContentCard';

interface CardPreviewProps {
  title: string;
  description?: string;
  shortDescription?: string;
  contentType: string;
  category: string;
  price: string;
  isFree: boolean;
  coverImage?: File | null;
  tags: string[];
}

export default function CardPreview({
  title,
  description,
  shortDescription,
  contentType,
  category,
  price,
  isFree,
  coverImage,
  tags
}: CardPreviewProps) {
  const { createCardProps } = useContentCard();
  const [imageError, setImageError] = useState(false);

  // Crear datos mock para el preview
  const mockData = {
    id: 'preview-' + Date.now(),
    title,
    description,
    shortDescription,
    contentType,
    category,
    price: typeof price === 'string' ? parseInt(price || '0') : price,
    isFree,
    currency: 'CLP',
    image: coverImage ? URL.createObjectURL(coverImage) : undefined,
    coverImage: coverImage ? URL.createObjectURL(coverImage) : undefined,
    tags,
    likes: 0,
    views: 0,
    downloads: 0,
    createdAt: new Date().toISOString()
  };

  return (
    <ContentCard
      {...createCardProps(mockData, {
        variant: 'default',
        showPrice: true,
        showStats: true,
        showTags: false,
        showAuthor: false,
        showDescription: true
      })}
    />
  );
}
