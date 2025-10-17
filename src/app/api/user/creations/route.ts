import { NextRequest, NextResponse } from 'next/server';
import { GetUserCreationsUseCase } from '@/features/user/domain/usecases/get-user-creations.usecase';
import { createUserRepository } from '@/features/user/data/repositories/user.repository';
import jwt from 'jsonwebtoken';
import { config } from '@/config/env';

// Función para verificar el token JWT
async function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as any;
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Get User Creations API (Clean Architecture)');

    // Verificar autenticación
    const decoded = await verifyToken(request);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Token inválido o expirado' },
        { status: 401 }
      );
    }

    // Crear repository y usecase (Clean Architecture)
    const repository = createUserRepository();
    const usecase = new GetUserCreationsUseCase(repository);

    // Ejecutar caso de uso
    const creations = await usecase.execute(decoded.userId);

    console.log('✅ Creaciones obtenidas:', creations.length);

    // Serializar creaciones
    const serializedCreations = creations.map(item => ({
      id: item._id,
      title: item.title,
      description: item.description,
      contentType: item.contentType,
      category: item.category,
      price: item.price,
      currency: item.currency,
      isFree: item.price === 0,
      coverImage: item.coverImage,
      files: item.files || [],
      tags: item.tags || [],
      likes: item.likes || 0,
      views: item.views || 0,
      downloads: item.downloads || 0,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }));

    return NextResponse.json({
      success: true,
      data: {
        creations: serializedCreations,
        total: serializedCreations.length
      }
    });

  } catch (error) {
    console.error('❌ Error fetching user creations:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
