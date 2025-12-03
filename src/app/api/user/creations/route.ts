import { NextRequest, NextResponse } from 'next/server';
import { GetUserCreationsUseCase } from '@/features/user/domain/usecases/get-user-creations.usecase';
import { createUserRepository } from '@/features/user/data/repositories/user.repository';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Get User Creations API (Clean Architecture)');

    // Verificar autenticación
    const auth = requireAuth(request);
    if (auth instanceof NextResponse) return auth;
    
    const decoded = auth;

    // Crear repository y usecase (Clean Architecture)
    const repository = createUserRepository();
    const usecase = new GetUserCreationsUseCase(repository);

    // Ejecutar caso de uso
    const creations = await usecase.execute(decoded.userId);

    console.log('✅ Creaciones obtenidas:', creations.length);

    // Serializar creaciones
    const usernameFromToken = (decoded as any)?.username || 'Anónimo';
    const userIdFromToken = (decoded as any)?.userId;

    // Obtener avatar del perfil (si existe) para mostrar en las tarjetas del perfil
    const userProfile = await repository.getPublicProfile(decoded.userId);
    const profileAvatar = userProfile?.avatar || null;

    const serializedCreations = creations.map(item => ({
      id: item.id, // Prisma usa 'id', no '_id' (MongoDB)
      title: item.title,
      description: item.description,
      shortDescription: item.shortDescription,
      contentType: item.contentType,
      category: item.category,
      price: item.price,
      currency: item.currency,
      isFree: item.price === 0,
      license: item.license,
      isListed: item.isListed,
      isPublished: item.isPublished,
      coverImage: item.coverImage,
      additionalImages: item.additionalImages || [],
      files: item.files || [],
      tags: item.tags || [],
      customTags: item.customTags || [],
      likes: item.likes || 0,
      views: item.views || 0,
      downloads: item.downloads || 0,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      authorAvatar: item.author?.avatar || null
      // Agregamos metadata del autor para que las vistas (profile/explore)
      // muestren correctamente el nombre del creador cuando se renderiza la tarjeta.
    })).map(entry => ({
      ...entry,
      author: usernameFromToken,
      authorUsername: usernameFromToken,
      authorId: userIdFromToken,
      authorAvatar: entry.authorAvatar || profileAvatar
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
