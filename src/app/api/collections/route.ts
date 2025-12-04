// Collections API - GET and POST
import { NextRequest, NextResponse } from 'next/server';
import { createCollectionRepository } from '@/features/collections/data/repositories/collection.repository';
import { CreateCollectionUseCase } from '@/features/collections/domain/usecases/create-collection.usecase';
import { requireAuth } from '@/lib/auth';

// GET - Obtener colecciones del usuario
export async function GET(request: NextRequest) {
  try {
    console.log('🗂️ Collections API GET');

    // Verificar autenticación con módulo centralizado
    const auth = requireAuth(request);
    if (auth instanceof NextResponse) return auth;
    
    const userId = auth.userId;

    const repository = createCollectionRepository();
    const collections = await repository.findByUser(userId);

    // Transform to API response format
    const response = collections.map(c => ({
      id: c.id,
      title: c.title,
      description: c.description,
      isPublic: c.isPublic,
      itemCount: c.itemCount,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString()
    }));

    return NextResponse.json({
      success: true,
      data: response
    });

  } catch (error) {
    console.error('❌ Collections API GET error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor';
    return NextResponse.json({
      success: false,
      error: errorMessage
    }, { status: 500 });
  }
}

// POST - Crear nueva colección
export async function POST(request: NextRequest) {
  try {
    console.log('🗂️ Collections API POST');

    // Verificar autenticación con módulo centralizado
    const auth = requireAuth(request);
    if (auth instanceof NextResponse) return auth;
    
    const userId = auth.userId;

    const body = await request.json();
    const { title, description, isPublic } = body;

    if (!title) {
      return NextResponse.json({
        success: false,
        error: 'El título es obligatorio'
      }, { status: 400 });
    }

    const repository = createCollectionRepository();
    const useCase = new CreateCollectionUseCase(repository);

    const collection = await useCase.execute(
      userId,
      title,
      description || null,
      isPublic ?? true
    );

    return NextResponse.json({
      success: true,
      data: {
        id: collection.id,
        title: collection.title,
        description: collection.description,
        isPublic: collection.isPublic,
        itemCount: collection.itemCount,
        createdAt: collection.createdAt.toISOString(),
        updatedAt: collection.updatedAt.toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Collections API POST error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor';
    return NextResponse.json({
      success: false,
      error: errorMessage
    }, { status: 500 });
  }
}
