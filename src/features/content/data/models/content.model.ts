// Content Model - Estructura exacta como viene de Storage/MongoDB
export interface ContentModel {
  _id: string;
  title: string;
  description: string;
  author: string;
  authorUsername?: string;
  price: number;
  currency: string;
  contentType: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  coverImage?: string;
  files?: string[];
  likes?: number;
  views?: number;
  downloads?: number;
  authorAvatar?: string;
  authorId?: string;
  shortDescription?: string;
  createdAt: string;
  updatedAt: string;
}

