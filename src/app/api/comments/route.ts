import { NextRequest, NextResponse } from 'next/server';
import { GetCommentsUseCase } from '@/features/comments/domain/usecases/get-comments.usecase';
import { CreateCommentUseCase } from '@/features/comments/domain/usecases/create-comment.usecase';
import { createCommentRepository } from '@/features/comments/data/repositories/comment.repository';
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
    const decoded = await verifyToken(request);
    const userId = decoded?.userId;

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
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString()
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
    // Verificar autenticación
    const decoded = await verifyToken(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const requestBody = await request.json();
    const { contentId, text } = requestBody;

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
      userId: decoded.userId,
      username: decoded.username || 'Usuario',
      userAvatar: decoded.avatar,
      text: text.trim()
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
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString()
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
