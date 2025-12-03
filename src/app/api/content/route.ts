import { NextRequest, NextResponse } from 'next/server';
import { CreateContentUseCase } from '@/features/content/domain/usecases/create-content.usecase';
import { GetContentUseCase } from '@/features/content/domain/usecases/get-content.usecase';
import { createContentRepository } from '@/features/content/data/repositories/content.repository';
import { requireAuth } from '@/lib/auth';

// GET - Obtener publicaciones (con filtros opcionales)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || searchParams.get('type') || 'all';
    const author = searchParams.get('author');
    const search = searchParams.get('search');

    if (process.env.NODE_ENV !== 'production') {
      console.log('🔍 Get Content API (Clean Architecture):', { category, author, search });
    }

    // Crear repository y usecase (Clean Architecture)
    const repository = createContentRepository();
    const usecase = new GetContentUseCase(repository);

    // Ejecutar caso de uso con filtros optimizados
    let content = await usecase.execute(category);

    // Apply filters efficiently - move to DB query when possible
    // For now, keep minimal client-side filtering for complex cases
    if (author) {
      content = content.filter(item => item.author === author || item.authorId === author);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      content = content.filter(item =>
        item.title.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchLower)))
      );
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log('✅ Content retrieved:', { count: content.length, category, author, search });
    }

    // Serializar entities para respuesta JSON
    const serializedContent = content.map(item => ({
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
      createdAt: item.createdAt instanceof Date ? item.createdAt.toISOString() : item.createdAt,
      updatedAt: item.updatedAt instanceof Date ? item.updatedAt.toISOString() : item.updatedAt
    }));

    return NextResponse.json({
      success: true,
      data: serializedContent
    });

  } catch (error) {
    console.error('❌ Error fetching content:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener contenido' },
      { status: 500 }
    );
  }
}

// POST - Crear nueva publicación
export async function POST(request: NextRequest) {
  try {
    if (process.env.NODE_ENV !== 'production') {
      console.log('🔍 Create Content API (Clean Architecture)');
    }

    // Verificar autenticación
    const auth = requireAuth(request);
    if (auth instanceof NextResponse) return auth;
    
    const decoded = auth;

    const requestBody = await request.json();
    if (process.env.NODE_ENV !== 'production') {
      console.log('🔍 Datos de creación:', requestBody);
    }

    // Crear repository y usecase (Clean Architecture)
    const repository = createContentRepository();
    const usecase = new CreateContentUseCase(repository);

    // Preparar datos para el UseCase
    const contentData = {
      title: requestBody.title,
      description: requestBody.description,
      shortDescription: requestBody.shortDescription,
      author: decoded.userId,
      authorId: decoded.userId, // ✅ Agregar authorId para Prisma
      authorUsername: decoded.email?.split('@')[0] || 'Usuario', // Temporal
      price: parseInt(requestBody.price) || 0, // ✅ Convertir a Int
      currency: requestBody.currency || 'CLP',
      isFree: requestBody.isFree || false,
      contentType: requestBody.contentType,
      tags: requestBody.tags || [],
      customTags: requestBody.customTags || [],
      coverImage: requestBody.coverImage,
      additionalImages: requestBody.additionalImages || [],
      files: requestBody.files || [],
      license: requestBody.license || 'personal',
      customLicense: requestBody.customLicense,
      isPublished: true, // ✅ Publicar automáticamente
      allowTips: requestBody.allowTips || false,
      allowCommissions: requestBody.allowCommissions || false
    };

    // Ejecutar caso de uso
    const newContent = await usecase.execute(contentData);

    if (process.env.NODE_ENV !== 'production') {
      console.log('✅ Contenido creado:', newContent.id);
    }

    // Serializar entity para respuesta JSON
    const serializedContent = {
      id: newContent.id,
      title: newContent.title,
      description: newContent.description,
      author: newContent.author || newContent.authorUsername,
      authorId: newContent.authorId,
      price: newContent.price,
      isFree: newContent.isFree,
      currency: newContent.currency,
      contentType: newContent.contentType,
      tags: newContent.tags,
      coverImage: newContent.coverImage,
      files: newContent.files,
      createdAt: newContent.createdAt instanceof Date ? newContent.createdAt.toISOString() : newContent.createdAt,
      updatedAt: newContent.updatedAt instanceof Date ? newContent.updatedAt.toISOString() : newContent.updatedAt
    };

    return NextResponse.json({
      success: true,
      message: 'Contenido creado exitosamente',
      data: serializedContent
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Error creating content:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor';
    const statusCode = errorMessage.includes('debe tener') ? 400 : 500;

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: statusCode }
    );
  }
}
