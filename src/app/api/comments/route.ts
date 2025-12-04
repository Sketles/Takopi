import { NextRequest, NextResponse } from 'next/server';
import { GetCommentsUseCase } from '@/features/comments/domain/usecases/get-comments.usecase';
import { CreateCommentUseCase } from '@/features/comments/domain/usecases/create-comment.usecase';
import { createCommentRepository } from '@/features/comments/data/repositories/comment.repository';
import { authenticateRequest } from '@/lib/auth';

// GET - Obtener comentarios de un contenido
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const contentId = searchParams.get('contentId');

    if (!contentId) {
      return NextResponse.json(
        { success: false, error: 'ID de contenido es requerido' },
        { status: 400 }
      );
    }

    // Verificar autenticación (opcional para leer comentarios)
    const authResult = authenticateRequest(request);
    const userId = authResult.success ? authResult.user.userId : undefined;

    // Crear repository y usecase
    const repository = createCommentRepository();
    const usecase = new GetCommentsUseCase(repository);

    // Ejecutar caso de uso
    const comments = await usecase.execute(contentId, userId);

    // Serializar comentarios
    const serializedComments = comments.map(comment => ({
      id: comment.id,
      contentId: comment.contentId,
      userId: comment.userId,
      username: comment.username,
      userAvatar: comment.userAvatar,
      text: comment.text,
      likes: comment.likes,
      isLiked: comment.isLiked,
      parentId: comment.parentId || null,
      createdAt: comment.createdAt instanceof Date ? comment.createdAt.toISOString() : comment.createdAt,
      updatedAt: comment.updatedAt instanceof Date ? comment.updatedAt.toISOString() : comment.updatedAt
    }));

    return NextResponse.json({
      success: true,
      data: serializedComments
    });

  } catch (error) {
    console.error('❌ Error fetching comments:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo comentario
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación con módulo centralizado
    const authResult = authenticateRequest(request);
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error || 'Token inválido' }, { status: 401 });
    }

    const requestBody = await request.json();
    const { contentId, text, parentId } = requestBody;

    // Validaciones
    if (!contentId) {
      return NextResponse.json(
        { success: false, error: 'ID de contenido es requerido' },
        { status: 400 }
      );
    }

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'El texto del comentario es requerido' },
        { status: 400 }
      );
    }

    // Crear repository y usecase
    const repository = createCommentRepository();
    const usecase = new CreateCommentUseCase(repository);

    // Ejecutar caso de uso
    const comment = await usecase.execute({
      contentId,
      userId: authResult.user.userId,
      username: authResult.user.email?.split('@')[0] || 'Usuario',
      userAvatar: undefined,
      text: text.trim(),
      parentId: parentId || null
    });

    // Serializar comentario
    const serializedComment = {
      id: comment.id,
      contentId: comment.contentId,
      userId: comment.userId,
      username: comment.username,
      userAvatar: comment.userAvatar,
      text: comment.text,
      likes: comment.likes,
      isLiked: comment.isLiked,
      parentId: comment.parentId || null,
      createdAt: comment.createdAt instanceof Date ? comment.createdAt.toISOString() : comment.createdAt,
      updatedAt: comment.updatedAt instanceof Date ? comment.updatedAt.toISOString() : comment.updatedAt
    };

    return NextResponse.json({
      success: true,
      data: serializedComment
    });

  } catch (error) {
    console.error('❌ Error creating comment:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
