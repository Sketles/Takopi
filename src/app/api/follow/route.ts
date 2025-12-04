import { NextRequest, NextResponse } from 'next/server';
import { ToggleFollowUseCase } from '@/features/social/domain/usecases/toggle-follow.usecase';
import { createFollowRepository } from '@/features/social/data/repositories/follow.repository';
import { requireAuth } from '@/lib/auth';

// POST - Seguir/dejar de seguir usuario
export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Toggle Follow API (Clean Architecture)');

    // Verificar autenticación
    const auth = requireAuth(request);
    if (auth instanceof NextResponse) return auth;
    
    const decoded = auth;

    const requestBody = await request.json();
    const { followingId } = requestBody;

    if (!followingId) {
      return NextResponse.json({ error: 'ID del usuario a seguir es requerido' }, { status: 400 });
    }

    // Crear repository y usecase (Clean Architecture)
    const repository = createFollowRepository();
    const usecase = new ToggleFollowUseCase(repository);

    // Ejecutar caso de uso
    const result = await usecase.execute(decoded.userId, followingId);

    console.log('✅ Follow toggled:', result.isFollowing);

    return NextResponse.json({
      success: true,
      data: {
        isFollowing: result.isFollowing,
        action: result.isFollowing ? 'followed' : 'unfollowed',
        followingId
      }
    });

  } catch (error) {
    console.error('❌ Error toggling follow:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor';
    const statusCode = errorMessage.includes('No puedes seguirte') ? 400 : 500;

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: statusCode }
    );
  }
}

// GET - Verificar estado de follow
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Check Follow Status API (Clean Architecture)');

    // Verificar autenticación con módulo centralizado
    const auth = requireAuth(request);
    if (auth instanceof NextResponse) return auth;
    
    const decoded = auth;

    const { searchParams } = new URL(request.url);
    const followingId = searchParams.get('followingId');

    if (!followingId) {
      return NextResponse.json({ error: 'ID del usuario es requerido' }, { status: 400 });
    }

    // Crear repository (Clean Architecture)
    const repository = createFollowRepository();

    // Verificar si existe el follow
    const existingFollow = await repository.findByUsers(decoded.userId, followingId);

    console.log('✅ Follow status checked:', !!existingFollow);

    return NextResponse.json({
      success: true,
      data: {
        isFollowing: !!existingFollow,
        followingId
      }
    });

  } catch (error) {
    console.error('❌ Error checking follow status:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor';

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
