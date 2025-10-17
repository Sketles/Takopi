import { NextRequest, NextResponse } from 'next/server';
import { LoginUseCase } from '@/features/auth/domain/usecases/login.usecase';
import { createAuthRepository } from '@/features/auth/data/repositories/auth.repository';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    console.log('🔍 Login API (Clean Architecture):', { email });

    // Crear repository y usecase (Clean Architecture)
    const repository = createAuthRepository();
    const usecase = new LoginUseCase(repository);

    // Ejecutar caso de uso
    const result = await usecase.execute(email, password);

    console.log('✅ Login exitoso:', { userId: result.user.id, email: result.user.email });

    // Serializar user entity (sin password)
    const userResponse = {
      _id: result.user.id,
      username: result.user.username,
      email: result.user.email,
      role: result.user.role,
      avatar: result.user.avatar,
      bio: result.user.bio,
      createdAt: result.user.createdAt
    };

    return NextResponse.json({
      message: 'Login exitoso',
      user: userResponse,
      token: result.token
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor';
    const statusCode = errorMessage.includes('Credenciales') ? 401 : 500;
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}
