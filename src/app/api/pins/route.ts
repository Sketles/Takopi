import { NextRequest, NextResponse } from 'next/server';
import { TogglePinUseCase } from '@/features/social/domain/usecases/toggle-pin.usecase';
import { createPinRepository } from '@/features/social/data/repositories/pin.repository';
import jwt from 'jsonwebtoken';
import { config } from '@/config/env';
import { handleApiError } from '@/lib/error-handler';
import { AuthenticationError, ValidationError } from '@/lib/errors';
import { logger } from '@/lib/logger';

// POST - Dar o quitar pin a un contenido
export async function POST(request: NextRequest) {
  try {
    logger.info('Pin API POST: procesando');

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
    const { contentId, isPublic } = body;

    if (!contentId) {
      throw new ValidationError('ID de contenido requerido');
    }

    logger.info('Pin toggle request', { userId, contentId, isPublic });

    // Crear repository y usecase (Clean Architecture)
    const repository = createPinRepository();
    const usecase = new TogglePinUseCase(repository);

    // Ejecutar caso de uso
    const result = await usecase.execute(userId, contentId, isPublic ?? true);

    logger.info('Pin toggled exitosamente', { userId, contentId, pinned: result.pinned });

    return NextResponse.json({
      success: true,
      message: result.pinned ? 'Pin agregado' : 'Pin eliminado',
      data: {
        isPinned: result.pinned,
        pinsCount: result.pinsCount
      }
    });

  } catch (error) {
    return handleApiError(error);
  }
}

// GET - Verificar estado de pin y obtener conteo
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Pin API GET (Clean Architecture)');

    const { searchParams } = new URL(request.url);
    const contentId = searchParams.get('contentId');
    const contentIds = searchParams.get('contentIds'); // Batch support

    // Batch endpoint for multiple content items
    if (contentIds) {
      const ids = contentIds.split(',');
      const repository = createPinRepository();

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

      // Get pins for all content items in parallel
      const results = await Promise.all(
        ids.map(async (id) => {
          const pinsCount = await repository.countByContent(id);
          let isPinned = false;

          if (userId) {
            const pin = await repository.findByUserAndContent(userId, id);
            isPinned = pin !== null;
          }

          return {
            contentId: id,
            pinsCount,
            isPinned
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
    const repository = createPinRepository();

    // Obtener conteo total de pins
    const pinsCount = await repository.countByContent(contentId);

    let isPinned = false;
    const token = request.headers.get('authorization')?.split(' ')[1];

    if (token) {
      try {
        const decoded: any = jwt.verify(token, config.jwt.secret);
        const userId = decoded.userId;
        if (userId) {
          const pin = await repository.findByUserAndContent(userId, contentId);
          isPinned = pin !== null;
        }
      } catch (error) {
        console.warn('Invalid token for pin status check:', error);
      }
    }

    console.log('✅ Pin status:', { contentId, pinsCount, isPinned });

    return NextResponse.json({
      success: true,
      data: {
        pinsCount,
        isPinned
      }
    });

  } catch (error) {
    console.error('❌ Pin API GET error:', error);
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 });
  }
}
