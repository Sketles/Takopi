import { NextRequest, NextResponse } from 'next/server';
import { GetUserStatsUseCase } from '@/features/user/domain/usecases/get-user-stats.usecase';
import { createUserRepository } from '@/features/user/data/repositories/user.repository';
import jwt from 'jsonwebtoken';
import { config } from '@/config/env';
import { handleApiError } from '@/lib/error-handler';
import { AuthenticationError } from '@/lib/errors';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    logger.info('Get User Stats API: iniciando');

    // Obtener token de autorización
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('Token de autorización requerido');
    }

    const token = authHeader.split(' ')[1];
    
    // Verificar token
    let userId;
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as any;
      userId = decoded.userId;
      if (!userId) {
        throw new AuthenticationError('Token inválido: userId no encontrado');
      }
      logger.info('Token válido', { userId });
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw error;
      }
      throw new AuthenticationError('Token inválido o expirado');
    }

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
