import { NextRequest, NextResponse } from 'next/server';
import { ToggleLikeUseCase } from '@/features/social/domain/usecases/toggle-like.usecase';
import { createLikeRepository } from '@/features/social/data/repositories/like.repository';
import jwt from 'jsonwebtoken';
import { config } from '@/config/env';
import { handleApiError } from '@/lib/error-handler';
import { AuthenticationError, ValidationError } from '@/lib/errors';
import { logger } from '@/lib/logger';

// POST - Dar o quitar like a un contenido
export async function POST(request: NextRequest) {
  try {
    logger.info('Like API POST: procesando');

    // Verificar autenticación
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new AuthenticationError('Token requerido');
    }

    let userId: string;
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as { userId: string };
      userId = decoded.userId;
    } catch (error) {
      throw new AuthenticationError('Token inválido');
    }

    const body = await request.json();
    const { contentId } = body;

    if (!contentId) {
      throw new ValidationError('ID de contenido requerido');
    }

    logger.info('Like toggle request', { userId, contentId });

    // Crear repository y usecase (Clean Architecture)
    const repository = createLikeRepository();
    const usecase = new ToggleLikeUseCase(repository);

    // Ejecutar caso de uso
    const result = await usecase.execute(userId, contentId);

    logger.info('Like toggled exitosamente', { userId, contentId, liked: result.liked });

    return NextResponse.json({
      success: true,
      message: result.liked ? 'Like agregado' : 'Like eliminado',
      data: {
        isLiked: result.liked,
        likesCount: result.likesCount
      }
    });

  } catch (error) {
    return handleApiError(error);
  }
}

// GET - Verificar estado de like y obtener conteo
export async function GET(request: NextRequest) {
  try {
    if (process.env.NODE_ENV !== 'production') {
      console.log('🔍 Like API GET (Clean Architecture)');
    }

    const { searchParams } = new URL(request.url);
    const contentId = searchParams.get('contentId');
    const contentIds = searchParams.get('contentIds'); // Batch support

    // Batch endpoint for multiple content items
    if (contentIds) {
      const ids = contentIds.split(',');
      const repository = createLikeRepository();

      let userId: string | null = null;
      const token = request.headers.get('authorization')?.split(' ')[1];

      if (token) {
        try {
          const decoded: any = jwt.verify(token, config.jwt.secret);
          userId = decoded.userId;
        } catch (error) {
          // Token invalid, continue without userId
        }
      }

      // Get likes for all content items in parallel
      const results = await Promise.all(
        ids.map(async (id) => {
          const likesCount = await repository.countByContent(id);
          let isLiked = false;

          if (userId) {
            const like = await repository.findByUserAndContent(userId, id);
            isLiked = like !== null;
          }

          return {
            contentId: id,
            likesCount,
            isLiked
          };
        })
      );

      return NextResponse.json({
        success: true,
        data: results
      });
    }

    // Single content endpoint
    if (!contentId) {
      return NextResponse.json({ success: false, error: 'ID de contenido requerido' }, { status: 400 });
    }

    // Crear repository
    const repository = createLikeRepository();

    // Obtener conteo total de likes
    const likesCount = await repository.countByContent(contentId);

    let isLiked = false;
    const token = request.headers.get('authorization')?.split(' ')[1];

    if (token) {
      try {
        const decoded: any = jwt.verify(token, config.jwt.secret);
        const userId = decoded.userId;
        if (userId) {
          const like = await repository.findByUserAndContent(userId, contentId);
          isLiked = like !== null;
        }
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn('Invalid token for like status check:', error);
        }
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log('✅ Like status:', { contentId, likesCount, isLiked });
    }

    return NextResponse.json({
      success: true,
      data: {
        likesCount,
        isLiked
      }
    });

  } catch (error) {
    console.error('❌ Like API GET error:', error);
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 });
  }
}
