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
  coverImage?: string | File | null;
  tags: string[];
  author?: {
    name: string;
    avatar: string;
  };
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
  tags,
  author
}: CardPreviewProps) {
  const { createCardProps } = useContentCard();
  const [imageError, setImageError] = useState(false);

  // Helper para obtener la URL de la imagen
  const getImageUrl = (img?: string | File | null) => {
    if (!img) return undefined;
    if (typeof img === 'string') return img;
    return URL.createObjectURL(img);
  };

  const imageUrl = getImageUrl(coverImage);

  // Crear datos mock para el preview
  const mockData = {
    id: 'preview-' + Date.now(),
    title,
    description,
    shortDescription,
    contentType,
    category,
    price: typeof price === 'string' ? parseFloat(price || '0') : price,
    isFree,
    currency: 'USD',
    image: imageUrl,
    coverImage: imageUrl,
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
