import { NextRequest, NextResponse } from 'next/server';
import { ToggleCommentLikeUseCase } from '@/features/comments/domain/usecases/toggle-comment-like.usecase';
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

// POST - Toggle like en comentario
export async function POST(
  request: NextRequest,
  { params }: { params: { commentId: string } }
) {
  try {
    // Verificar autenticación
    const decoded = await verifyToken(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const { commentId } = params;

    // Validaciones
    if (!commentId) {
      return NextResponse.json(
        { success: false, error: 'ID de comentario es requerido' },
        { status: 400 }
      );
    }

    // Crear repository y usecase
    const repository = createCommentRepository();
    const usecase = new ToggleCommentLikeUseCase(repository);

    // Ejecutar caso de uso
    const updatedComment = await usecase.execute(commentId, decoded.userId);

    if (!updatedComment) {
      return NextResponse.json(
        { success: false, error: 'Comentario no encontrado' },
        { status: 404 }
      );
    }

    // Serializar comentario actualizado
    const serializedComment = {
      id: updatedComment.id,
      contentId: updatedComment.contentId,
      userId: updatedComment.userId,
      username: updatedComment.username,
      userAvatar: updatedComment.userAvatar,
      text: updatedComment.text,
      likes: updatedComment.likes,
      isLiked: updatedComment.isLiked,
      createdAt: updatedComment.createdAt.toISOString(),
      updatedAt: updatedComment.updatedAt.toISOString()
    };

    return NextResponse.json({
      success: true,
      data: serializedComment
    });

  } catch (error) {
    console.error('❌ Error toggling comment like:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
