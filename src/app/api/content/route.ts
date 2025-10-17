import { NextRequest, NextResponse } from 'next/server';
import { CreateContentUseCase } from '@/features/content/domain/usecases/create-content.usecase';
import { GetContentUseCase } from '@/features/content/domain/usecases/get-content.usecase';
import { createContentRepository } from '@/features/content/data/repositories/content.repository';
import jwt from 'jsonwebtoken';
import { config } from '@/config/env';

// Función para verificar el token JWT
async function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as any;
    return decoded;
  } catch (error) {
    return null;
  }
}

// GET - Obtener publicaciones (con filtros opcionales)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || searchParams.get('type') || 'all';
    const author = searchParams.get('author');
    const search = searchParams.get('search');

    console.log('🔍 Get Content API (Clean Architecture):', { category, author, search });

    // Crear repository y usecase (Clean Architecture)
    const repository = createContentRepository();
    const usecase = new GetContentUseCase(repository);

    // Ejecutar caso de uso
    let content = await usecase.execute(category);

    // Filtros adicionales
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

    console.log('✅ Content retrieved:', { count: content.length, category, author, search });

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
      createdAt: item.createdAt?.toISOString(),
      updatedAt: item.updatedAt?.toISOString()
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
    console.log('🔍 Create Content API (Clean Architecture)');

    // Verificar autenticación
    const decoded = await verifyToken(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const requestBody = await request.json();
    console.log('🔍 Datos de creación:', requestBody);

    // Crear repository y usecase (Clean Architecture)
    const repository = createContentRepository();
    const usecase = new CreateContentUseCase(repository);

    // Preparar datos para el UseCase
    const contentData = {
      title: requestBody.title,
      description: requestBody.description,
      author: decoded.userId,
      authorUsername: decoded.email?.split('@')[0] || 'Usuario', // Temporal
      price: requestBody.price || 0,
      currency: requestBody.currency || 'CLP',
      contentType: requestBody.contentType,
      category: requestBody.category,
      tags: requestBody.tags || [],
      coverImage: requestBody.coverImage,
      files: requestBody.files || []
    };

    // Ejecutar caso de uso
    const newContent = await usecase.execute(contentData);

    console.log('✅ Contenido creado:', newContent.id);

    // Serializar entity para respuesta JSON
    const serializedContent = {
      id: newContent.id,
      title: newContent.title,
      description: newContent.description,
      author: newContent.authorUsername,
      authorId: newContent.author,
      price: newContent.price,
      isFree: newContent.isFree,
      currency: newContent.currency,
      contentType: newContent.contentType,
      category: newContent.category,
      tags: newContent.tags,
      coverImage: newContent.coverImage,
      files: newContent.files,
      createdAt: newContent.createdAt?.toISOString(),
      updatedAt: newContent.updatedAt?.toISOString()
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
