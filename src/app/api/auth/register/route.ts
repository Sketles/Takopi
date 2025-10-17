import { NextRequest, NextResponse } from 'next/server';
import { RegisterUseCase } from '@/features/auth/domain/usecases/register.usecase';
import { createAuthRepository } from '@/features/auth/data/repositories/auth.repository';

export async function POST(request: NextRequest) {
  try {
    const { username, email, password, role } = await request.json();

    console.log('🔍 Register API (Clean Architecture):', { username, email, role });

    // Crear repository y usecase (Clean Architecture)
    const repository = createAuthRepository();
    const usecase = new RegisterUseCase(repository);

    // Ejecutar caso de uso
    const result = await usecase.execute(username, email, password, role);

    console.log('✅ Registro exitoso:', { userId: result.user.id, email: result.user.email });

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
      message: 'Usuario registrado exitosamente',
      user: userResponse,
      token: result.token
    });

  } catch (error) {
    console.error('❌ Register error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor';
    const statusCode = errorMessage.includes('ya está registrado') ? 409 : 
                        errorMessage.includes('debe tener') ? 400 : 500;
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}
