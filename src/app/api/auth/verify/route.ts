import { NextRequest, NextResponse } from 'next/server';
import { VerifyTokenUseCase } from '@/features/auth/domain/usecases/verify-token.usecase';
import { createAuthRepository } from '@/features/auth/data/repositories/auth.repository';

export async function POST(req: NextRequest) {
  try {
    console.log('🔍 Token verification API (Clean Architecture)');
    
    // Verificar autorización
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No authorization header');
      return NextResponse.json(
        { error: 'Token de autorización requerido' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    
    // Crear repository y usecase (Clean Architecture)
    const repository = createAuthRepository();
    const usecase = new VerifyTokenUseCase(repository);

    // Ejecutar caso de uso
    const result = await usecase.execute(token);

    if (result.valid) {
      console.log('✅ Token válido:', result.userId);
      return NextResponse.json({
        valid: true,
        user: {
          userId: result.userId,
          email: result.email
        }
      });
    } else {
      console.log('❌ Token inválido:', result.error);
      return NextResponse.json(
        { 
          valid: false,
          error: result.error
        },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('❌ Error en verificación de token:', error);
    return NextResponse.json(
      { 
        valid: false,
        error: 'Error interno del servidor'
      },
      { status: 500 }
    );
  }
}