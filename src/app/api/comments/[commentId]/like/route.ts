import { NextRequest, NextResponse } from 'next/server';
import { ToggleCommentLikeUseCase } from '@/features/comments/domain/usecases/toggle-comment-like.usecase';
import { createCommentRepository } from '@/features/comments/data/repositories/comment.repository';
import { requireAuth } from '@/lib/auth';

// POST - Toggle like en comentario
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    // Verificar autenticación con módulo centralizado
    const auth = requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const { commentId } = await params;

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
    const updatedComment = await usecase.execute(commentId, auth.userId);

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
