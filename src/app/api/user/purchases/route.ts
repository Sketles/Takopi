import { NextRequest, NextResponse } from 'next/server';
import { GetUserPurchasesUseCase } from '@/features/user/domain/usecases/get-user-purchases.usecase';
import { createUserRepository } from '@/features/user/data/repositories/user.repository';
import jwt from 'jsonwebtoken';
import { config } from '@/config/env';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {

    // Obtener token de autorización
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token de autorización requerido' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    // Verificar token
    let userId;
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as any;
      userId = decoded.userId;
    } catch (error) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    // Crear repository y usecase (Clean Architecture)
    const repository = createUserRepository();
    const usecase = new GetUserPurchasesUseCase(repository);

    // Ejecutar caso de uso
    const purchases = await usecase.execute(userId);


    // Serializar compras con información del contenido y vendedor usando Prisma
    const serializedPurchases = await Promise.all(purchases.map(async (purchase) => {
      // Obtener información del contenido y vendedor con Prisma
      let content = null;
      let seller = null;
      let contentData = null;

      try {
        content = await prisma.content.findUnique({
          where: { id: purchase.contentId },
          include: { author: true }
        });

        if (content) {
          // Contenido aún existe - usar datos actuales
          seller = content.author;
          contentData = {
            id: content.id,
            title: content.title,
            coverImage: content.coverImage,
            category: content.category,
            contentType: content.contentType,
            price: content.price,
            files: content.files || [],
            isDeleted: false
          };
        } else {
          // Contenido fue eliminado - usar snapshot
          const snapshot = purchase.contentSnapshot as any;
          if (snapshot) {
            contentData = {
              id: purchase.contentId,
              title: snapshot.title,
              coverImage: snapshot.coverImage,
              category: snapshot.category,
              contentType: snapshot.contentType,
              price: snapshot.price,
              files: snapshot.files || [],
              isDeleted: true // Flag para indicar que fue eliminado
            };

            // Intentar obtener info del vendedor desde el snapshot
            if (snapshot.authorId) {
              const author = await prisma.user.findUnique({
                where: { id: snapshot.authorId }
              });
              if (author) {
                seller = author;
              }
            }
          }
        }
      } catch (error) {
        console.log('⚠️ Content not found for purchase:', purchase.contentId);
        // Usar snapshot como fallback
        const snapshot = purchase.contentSnapshot as any;
        if (snapshot) {
          contentData = {
            id: purchase.contentId,
            title: snapshot.title,
            coverImage: snapshot.coverImage,
            category: snapshot.category,
            contentType: snapshot.contentType,
            price: snapshot.price,
            files: snapshot.files || [],
            isDeleted: true
          };
        }
      }

      return {
        id: purchase.id,
        contentId: purchase.contentId,
        content: contentData,
        seller: seller ? {
          id: seller.id,
          username: seller.username,
          email: seller.email
        } : null,
        amount: purchase.amount,
        currency: purchase.currency,
        paymentMethod: purchase.paymentMethod,
        status: purchase.status,
        transactionId: purchase.transactionId,
        purchaseDate: purchase.createdAt,
        createdAt: purchase.createdAt,
        updatedAt: purchase.updatedAt
      };
    }));

    return NextResponse.json({
      success: true,
      data: {
        purchases: serializedPurchases,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: serializedPurchases.length,
          itemsPerPage: serializedPurchases.length
        }
      }
    });

  } catch (error) {
    console.error('❌ Error fetching user purchases:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
