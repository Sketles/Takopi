// Collection Items API - GET, POST, DELETE
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { config } from '@/config/env';
import { createCollectionRepository } from '@/features/collections/data/repositories/collection.repository';
import { AddItemToCollectionUseCase } from '@/features/collections/domain/usecases/add-item-to-collection.usecase';
import { RemoveItemFromCollectionUseCase } from '@/features/collections/domain/usecases/remove-item-from-collection.usecase';
import prisma from '@/lib/prisma';

// GET - Obtener items de una colección con detalles de contenido
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    console.log('🗂️ Collection Items API GET', id);

    const repository = createCollectionRepository();
    const items = await repository.getItems(id);

    // Get content details for each item
    const contentIds = items.map(item => item.contentId);
    const contents = await prisma.content.findMany({
      where: {
        id: { in: contentIds }
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        },
        _count: {
          select: {
            likes: true,
            pins: true
          }
        }
      }
    });

    const response = items.map(item => {
      const content = contents.find(c => c.id === item.contentId);
      if (!content) return null;

      return {
        id: item.id,
        collectionId: item.collectionId,
        contentId: item.contentId,
        addedAt: item.addedAt.toISOString(),
        content: {
          id: content.id,
          title: content.title,
          description: content.description,
          contentType: content.contentType,
          category: content.category,
          coverImage: content.coverImage,
          price: content.price,
          isFree: content.isFree,
          currency: content.currency,
          likes: content._count.likes,
          pins: content._count.pins,
          views: content.views,
          downloads: content.downloads,
          author: content.author.username,
          authorId: content.authorId,
          authorAvatar: content.author.avatar
        }
      };
    }).filter(Boolean);

    return NextResponse.json({
      success: true,
      data: response
    });

  } catch (error) {
    console.error('❌ Collection Items API GET error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor';
    return NextResponse.json({
      success: false,
      error: errorMessage
    }, { status: 500 });
  }
}

// POST - Agregar item a colección
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    console.log('🗂️ Collection Items API POST', id);

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
    const { contentId } = body;

    if (!contentId) {
      return NextResponse.json({
        success: false,
        error: 'contentId es obligatorio'
      }, { status: 400 });
    }

    const repository = createCollectionRepository();
    const useCase = new AddItemToCollectionUseCase(repository);

    const item = await useCase.execute(id, contentId, userId);

    return NextResponse.json({
      success: true,
      data: {
        id: item.id,
        collectionId: item.collectionId,
        contentId: item.contentId,
        addedAt: item.addedAt.toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Collection Items API POST error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor';
    const status = errorMessage.includes('No tienes permiso') ? 403 : 
                   errorMessage.includes('no encontrada') ? 404 :
                   errorMessage.includes('ya está en la colección') ? 409 : 500;
    return NextResponse.json({
      success: false,
      error: errorMessage
    }, { status });
  }
}

// DELETE - Remover item de colección
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    console.log('🗂️ Collection Items API DELETE', id);

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

    const { searchParams } = new URL(request.url);
    const contentId = searchParams.get('contentId');

    if (!contentId) {
      return NextResponse.json({
        success: false,
        error: 'contentId es obligatorio'
      }, { status: 400 });
    }

    const repository = createCollectionRepository();
    const useCase = new RemoveItemFromCollectionUseCase(repository);

    await useCase.execute(id, contentId, userId);

    return NextResponse.json({
      success: true,
      message: 'Item eliminado de la colección'
    });

  } catch (error) {
    console.error('❌ Collection Items API DELETE error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor';
    const status = errorMessage.includes('No tienes permiso') ? 403 : 
                   errorMessage.includes('no encontrada') ? 404 : 500;
    return NextResponse.json({
      success: false,
      error: errorMessage
    }, { status });
  }
}
