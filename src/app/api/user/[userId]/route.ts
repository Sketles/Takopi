import { NextRequest, NextResponse } from 'next/server';
import { GetUserByIdUseCase } from '@/features/user/domain/usecases/get-user-by-id.usecase';
import { createUserRepository } from '@/features/user/data/repositories/user.repository';

// GET - Obtener perfil público de usuario
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    console.log('🔍 Get User by ID API (Clean Architecture):', userId);

    // Crear repository y usecase (Clean Architecture)
    const repository = createUserRepository();
    const usecase = new GetUserByIdUseCase(repository);

    // Ejecutar caso de uso
    const userProfile = await usecase.execute(userId);

    if (!userProfile) {
      return NextResponse.json(
        { success: false, error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    console.log('✅ Perfil de usuario obtenido:', userProfile.id);

    // Serializar perfil público
    const publicProfile = {
      ...userProfile.publicData,
      displayName: userProfile.displayName,
      isCreator: userProfile.isCreator(),
      isAdmin: userProfile.isAdmin()
    };

    return NextResponse.json({
      success: true,
      data: publicProfile
    });

  } catch (error) {
    console.error('❌ Error fetching user profile:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
