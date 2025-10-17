import { NextRequest, NextResponse } from 'next/server';
import { ToggleLikeUseCase } from '@/features/social/domain/usecases/toggle-like.usecase';
import { createLikeRepository } from '@/features/social/data/repositories/like.repository';
import jwt from 'jsonwebtoken';
import { config } from '@/config/env';

// POST - Dar o quitar like a un contenido
export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Like API (Clean Architecture)');

    // Verificar autenticación
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      console.log('❌ No token provided');
      return NextResponse.json({ success: false, error: 'Token requerido' }, { status: 401 });
    }

    const decoded = jwt.verify(token, config.jwt.secret) as { userId: string };
    const userId = decoded.userId;

    const { contentId, action } = await request.json();
    console.log('🔍 Like request:', { userId, contentId, action });

    if (!contentId) {
      return NextResponse.json({ success: false, error: 'ID de contenido requerido' }, { status: 400 });
    }

    // Crear repository y usecase (Clean Architecture)
    const repository = createLikeRepository();
    const usecase = new ToggleLikeUseCase(repository);

    // Ejecutar caso de uso
    const result = await usecase.execute(userId, contentId);

    console.log('✅ Like toggled:', result);

    return NextResponse.json({
      success: true,
      message: result.liked ? 'Like agregado' : 'Like eliminado',
      data: {
        isLiked: result.liked,
        likesCount: result.likesCount
      }
    });

  } catch (error) {
    console.error('❌ Like API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor';
    return NextResponse.json({ 
      success: false, 
      error: errorMessage
    }, { status: 500 });
  }
}

// GET - Verificar estado de like y obtener conteo
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Like API GET (Clean Architecture)');

    const { searchParams } = new URL(request.url);
    const contentId = searchParams.get('contentId');

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
        console.warn('Invalid token for like status check:', error);
      }
    }

    console.log('✅ Like status:', { contentId, likesCount, isLiked });

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
