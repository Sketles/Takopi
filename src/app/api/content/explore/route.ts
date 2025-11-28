import { NextRequest, NextResponse } from 'next/server';
import { GetContentUseCase } from '@/features/content/domain/usecases/get-content.usecase';
import { createContentRepository } from '@/features/content/data/repositories/content.repository';
import { VerifyTokenUseCase } from '@/features/auth/domain/usecases/verify-token.usecase';
import { createAuthRepository } from '@/features/auth/data/repositories/auth.repository';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'all';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    if (process.env.NODE_ENV !== 'production') {
      console.log('🔍 Explore Content API:', { category, page, limit });
    }

    // Obtener userId del token (opcional)
    let userId: string | null = null;
    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const authRepository = createAuthRepository();
      const verifyTokenUseCase = new VerifyTokenUseCase(authRepository);
      const result = await verifyTokenUseCase.execute(token);
      userId = result.valid ? result.userId || null : null;
    }

    // Crear repository y usecase (Clean Architecture)
    const repository = createContentRepository();
    const usecase = new GetContentUseCase(repository);

    // Ejecutar caso de uso
    const content = await usecase.execute(category);

    // Aplicar paginación
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedContent = content.slice(startIndex, endIndex);
    const total = content.length;
    const hasMore = endIndex < total;

    if (process.env.NODE_ENV !== 'production') {
      console.log('✅ Content retrieved:', { count: paginatedContent.length, total, page, hasMore });
    }

    // Si hay usuario autenticado, obtener likes y pins en batch
    let userLikes: Set<string> = new Set();
    let userPins: Set<string> = new Set();

    if (userId && paginatedContent.length > 0) {
      const contentIds = paginatedContent.map(item => item.id);

      const [likesData, pinsData] = await Promise.all([
        prisma.like.findMany({
          where: { userId, contentId: { in: contentIds } },
          select: { contentId: true }
        }),
        prisma.pin.findMany({
          where: { userId, contentId: { in: contentIds } },
          select: { contentId: true }
        })
      ]);

      userLikes = new Set(likesData.map(l => l.contentId));
      userPins = new Set(pinsData.map(p => p.contentId));
    }

    // Serializar entities para respuesta JSON
    const serializedContent = paginatedContent.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      shortDescription: item.shortDescription || item.description?.substring(0, 100) + '...',
      author: item.authorUsername || item.author,
      authorAvatar: item.authorAvatar,
      authorId: item.authorId,
      type: item.typeDisplay,
      category: item.categoryDisplay,
      image: item.coverImage,
      files: item.files || [],
      coverImage: item.coverImage,
      price: item.price,
      isFree: item.isFree,
      currency: item.currency,
      contentType: item.contentType,
      tags: item.tags || [],
      likes: item.likes || 0,
      views: item.views || 0,
      downloads: item.downloads || 0,
      isLiked: userLikes.has(item.id),
      isPinned: userPins.has(item.id),
      createdAt: item.createdAt instanceof Date ? item.createdAt.toISOString() : item.createdAt,
      updatedAt: item.updatedAt instanceof Date ? item.updatedAt.toISOString() : item.updatedAt
    }));

    return NextResponse.json({
      success: true,
      data: serializedContent,
      pagination: {
        page,
        limit,
        total,
        hasMore,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('❌ Error fetching explore content:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener contenido' },
      { status: 500 }
    );
  }
}
