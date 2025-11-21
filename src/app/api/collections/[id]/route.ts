// Collections API - PATCH and DELETE by ID
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { config } from '@/config/env';
import { createCollectionRepository } from '@/features/collections/data/repositories/collection.repository';
import { UpdateCollectionUseCase } from '@/features/collections/domain/usecases/update-collection.usecase';
import { DeleteCollectionUseCase } from '@/features/collections/domain/usecases/delete-collection.usecase';

// PATCH - Actualizar colección
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    console.log('🗂️ Collections API PATCH', id);

    const token = request.headers.get('authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json({
        success: false,
        error: 'No autorizado'
      }, { status: 401 });
    }

    let userId: string;
    try {
      const decoded: any = jwt.verify(token, config.jwt.secret);
      userId = decoded.userId;
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: 'Token inválido'
      }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, isPublic } = body;

    const repository = createCollectionRepository();
    const useCase = new UpdateCollectionUseCase(repository);

    const collection = await useCase.execute(id, userId, {
      title,
      description,
      isPublic
    });

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
    console.error('❌ Collections API PATCH error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor';
    const status = errorMessage.includes('No tienes permiso') ? 403 : 
                   errorMessage.includes('no encontrada') ? 404 : 500;
    return NextResponse.json({
      success: false,
      error: errorMessage
    }, { status });
  }
}

// DELETE - Eliminar colección
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    console.log('🗂️ Collections API DELETE', id);

    const token = request.headers.get('authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json({
        success: false,
        error: 'No autorizado'
      }, { status: 401 });
    }

    let userId: string;
    try {
      const decoded: any = jwt.verify(token, config.jwt.secret);
      userId = decoded.userId;
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: 'Token inválido'
      }, { status: 401 });
    }

    const repository = createCollectionRepository();
    const useCase = new DeleteCollectionUseCase(repository);

    await useCase.execute(id, userId);

    return NextResponse.json({
      success: true,
      message: 'Colección eliminada correctamente'
    });

  } catch (error) {
    console.error('❌ Collections API DELETE error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor';
    const status = errorMessage.includes('No tienes permiso') ? 403 : 
                   errorMessage.includes('no encontrada') ? 404 : 500;
    return NextResponse.json({
      success: false,
      error: errorMessage
    }, { status });
  }
}
