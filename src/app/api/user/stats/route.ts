import { NextRequest, NextResponse } from 'next/server';
import { GetUserStatsUseCase } from '@/features/user/domain/usecases/get-user-stats.usecase';
import { createUserRepository } from '@/features/user/data/repositories/user.repository';
import jwt from 'jsonwebtoken';
import { config } from '@/config/env';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Get User Stats API (Clean Architecture)');

    // Obtener token de autorización
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No valid auth header');
      return NextResponse.json({ error: 'Token de autorización requerido' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    
    // Verificar token
    let userId;
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as any;
      userId = decoded.userId;
      console.log('✅ Token valid, userId:', userId);
    } catch (error) {
      console.log('❌ Token invalid:', error);
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    // Crear repository y usecase (Clean Architecture)
    const repository = createUserRepository();
    const usecase = new GetUserStatsUseCase(repository);

    // Ejecutar caso de uso
    const stats = await usecase.execute(userId);

    console.log('✅ Estadísticas obtenidas:', stats);

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('❌ Error fetching user stats:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
