import { NextRequest, NextResponse } from 'next/server';
import { GetContentByIdUseCase } from '@/features/content/domain/usecases/get-content-by-id.usecase';
import { UpdateContentUseCase } from '@/features/content/domain/usecases/update-content.usecase';
import { DeleteContentUseCase } from '@/features/content/domain/usecases/delete-content.usecase';
import { createContentRepository } from '@/features/content/data/repositories/content.repository';
import { logger } from '@/lib/logger';
import { requireAuth } from '@/lib/auth';

// GET - Obtener contenido específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    logger.info('Get Content by ID API', { id });

    // Crear repository y usecase (Clean Architecture)
    const repository = createContentRepository();
    const usecase = new GetContentByIdUseCase(repository);

    // Ejecutar caso de uso
    const content = await usecase.execute(id);

    if (!content) {
      return NextResponse.json(
        { success: false, error: 'Contenido no encontrado' },
        { status: 404 }
      );
    }

    logger.info('Contenido obtenido exitosamente', { contentId: content.id });

    // Serializar entity para respuesta JSON
    const serializedContent = {
      id: content.id,
      title: content.title,
      description: content.description,
      shortDescription: content.shortDescription,
      author: content.authorUsername || content.author,
      authorAvatar: content.authorAvatar,
      authorId: content.authorId,
      type: content.typeDisplay,
      category: content.categoryDisplay,
      image: content.coverImage,
      files: content.files || [],
      coverImage: content.coverImage,
      price: content.price,
      isFree: content.isFree,
      currency: content.currency,
      contentType: content.contentType,
      tags: content.tags || [],
      likes: content.likes || 0,
      views: content.views || 0,
      downloads: content.downloads || 0,
      createdAt: content.createdAt instanceof Date ? content.createdAt.toISOString() : content.createdAt,
      updatedAt: content.updatedAt instanceof Date ? content.updatedAt.toISOString() : content.updatedAt
    };

    return NextResponse.json({
      success: true,
      data: serializedContent
    });

  } catch (error) {
    logger.error('Error fetching content', { error: error instanceof Error ? error.message : error });
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

// PUT - Actualizar contenido
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    console.log('🔍 Update Content API (Clean Architecture):', id);

    // Verificar autenticación con módulo centralizado
    const auth = requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const requestBody = await request.json();
    console.log('🔍 Datos de actualización:', requestBody);

    // Convertir price a Int si existe
    if (requestBody.price !== undefined) {
      requestBody.price = parseInt(requestBody.price);
    }

    // Crear repository y usecase (Clean Architecture)
    const repository = createContentRepository();
    const usecase = new UpdateContentUseCase(repository);

    // Ejecutar caso de uso
    const updatedContent = await usecase.execute(id, auth.userId, requestBody);

    console.log('✅ Contenido actualizado:', updatedContent.id);

    // Serializar entity para respuesta JSON
    const serializedContent = {
      id: updatedContent.id,
      title: updatedContent.title,
      description: updatedContent.description,
      price: updatedContent.price,
      isFree: updatedContent.isFree,
      currency: updatedContent.currency,
      contentType: updatedContent.contentType,
      tags: updatedContent.tags,
      createdAt: updatedContent.createdAt instanceof Date ? updatedContent.createdAt.toISOString() : updatedContent.createdAt,
      updatedAt: updatedContent.updatedAt instanceof Date ? updatedContent.updatedAt.toISOString() : updatedContent.updatedAt
    };

    return NextResponse.json({
      success: true,
      message: 'Contenido actualizado exitosamente',
      data: serializedContent
    });

  } catch (error) {
    console.error('❌ Error updating content:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor';
    const statusCode = errorMessage.includes('No tienes permisos') ? 403 :
      errorMessage.includes('no encontrado') ? 404 : 500;

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: statusCode }
    );
  }
}

// DELETE - Eliminar contenido
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    console.log('🔍 Delete Content API (Clean Architecture):', id);

    // Verificar autenticación con módulo centralizado
    const auth = requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    // Crear repository y usecase (Clean Architecture)
    const repository = createContentRepository();
    const usecase = new DeleteContentUseCase(repository);

    // Ejecutar caso de uso
    const success = await usecase.execute(id, auth.userId);

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Error al eliminar el contenido' },
        { status: 500 }
      );
    }

    console.log('✅ Contenido eliminado:', id);

    return NextResponse.json({
      success: true,
      message: 'Contenido eliminado exitosamente'
    });

  } catch (error) {
    console.error('❌ Error deleting content:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor';
    const statusCode = errorMessage.includes('No tienes permisos') ? 403 :
      errorMessage.includes('no encontrado') ? 404 : 500;

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: statusCode }
    );
  }
}
