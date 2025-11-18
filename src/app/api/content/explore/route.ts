import { NextRequest, NextResponse } from 'next/server';
import { GetContentUseCase } from '@/features/content/domain/usecases/get-content.usecase';
import { createContentRepository } from '@/features/content/data/repositories/content.repository';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'all';

    console.log('🔍 Explore Content API (Clean Architecture):', { category });

    // Crear repository y usecase (Clean Architecture)
    const repository = createContentRepository();
    const usecase = new GetContentUseCase(repository);

    // Ejecutar caso de uso
    const content = await usecase.execute(category);

    console.log('✅ Content retrieved:', { count: content.length, category });

    // Serializar entities para respuesta JSON
    const serializedContent = content.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      shortDescription: item.shortDescription || item.description?.substring(0, 100) + '...',
      author: item.authorUsername,
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
      createdAt: item.createdAt instanceof Date ? item.createdAt.toISOString() : item.createdAt,
      updatedAt: item.updatedAt instanceof Date ? item.updatedAt.toISOString() : item.updatedAt
    }));

    return NextResponse.json({
      success: true,
      data: serializedContent
    });

  } catch (error) {
    console.error('❌ Error fetching explore content:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener contenido' },
      { status: 500 }
    );
  }
}
