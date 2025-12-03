import { NextRequest, NextResponse } from 'next/server';
import { GetUserPurchasesUseCase } from '@/features/user/domain/usecases/get-user-purchases.usecase';
import { createUserRepository } from '@/features/user/data/repositories/user.repository';
import { requireAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación
    const auth = requireAuth(request);
    if (auth instanceof NextResponse) return auth;
    
    const userId = auth.userId;

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

      // Si contentId es null, es una impresión 3D - usar contentSnapshot directamente
      if (!purchase.contentId) {
        const snapshot = purchase.contentSnapshot as any;
        if (snapshot && snapshot.type === '3d_print') {
          // Es una impresión 3D - no hay contenido asociado
          contentData = null;
          seller = {
            id: 'takopi',
            username: 'Takopi',
            email: 'soporte@takopi.com'
          };
        }
      } else {
        // Tiene contentId - intentar obtener el contenido
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
                title: snapshot.title || 'Contenido eliminado',
                coverImage: snapshot.coverImage || '/placeholder-content.jpg',
                category: snapshot.category || 'N/A',
                contentType: snapshot.contentType || 'unknown',
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
              title: snapshot.title || 'Contenido no disponible',
              coverImage: snapshot.coverImage || '/placeholder-content.jpg',
              category: snapshot.category || 'N/A',
              contentType: snapshot.contentType || 'unknown',
              price: snapshot.price,
              files: snapshot.files || [],
              isDeleted: true
            };
          }
        }
      }

      return {
        id: purchase.id,
        contentId: purchase.contentId,
        content: contentData,
        seller: seller ? {
          id: seller.id,
          username: seller.username,
          email: seller.email,
          avatar: seller.avatar || null
        } : null,
        amount: purchase.price, // El campo en DB es 'price', lo mapeamos a 'amount' para el frontend
        currency: purchase.currency,
        paymentMethod: purchase.paymentMethod,
        status: purchase.status,
        transactionId: purchase.transactionId,
        purchaseDate: purchase.createdAt,
        createdAt: purchase.createdAt,
        updatedAt: purchase.updatedAt,
        contentSnapshot: purchase.contentSnapshot
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
