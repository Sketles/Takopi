import { NextRequest, NextResponse } from 'next/server';
import { GetUserStatsUseCase } from '@/features/user/domain/usecases/get-user-stats.usecase';
import { createUserRepository } from '@/features/user/data/repositories/user.repository';
import { requireAuth } from '@/lib/auth';
import { handleApiError } from '@/lib/error-handler';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    logger.info('Get User Stats API: iniciando');

    // Verificar autenticación
    const auth = requireAuth(request);
    if (auth instanceof NextResponse) return auth;
    
    const userId = auth.userId;
    logger.info('Token válido', { userId });

    // Crear repository y usecase (Clean Architecture)
    const repository = createUserRepository();
    const usecase = new GetUserStatsUseCase(repository);

    // Ejecutar caso de uso
    const stats = await usecase.execute(userId);

    logger.info('Estadísticas obtenidas exitosamente', { userId });

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    return handleApiError(error);
  }
}
