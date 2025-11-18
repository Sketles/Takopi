import { NextRequest, NextResponse } from 'next/server';
import { GetUserPurchasesUseCase } from '@/features/user/domain/usecases/get-user-purchases.usecase';
import { createUserRepository } from '@/features/user/data/repositories/user.repository';
import jwt from 'jsonwebtoken';
import { config } from '@/config/env';
import { fileStorageService } from '@/shared/infrastructure/storage/file-storage.service';

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


    // Serializar compras con información del contenido y vendedor
    const serializedPurchases = await Promise.all(purchases.map(async (purchase) => {
      // Obtener información del contenido
      let content = null;
      let seller = null;
      
      try {
        content = await fileStorageService.findById('content', purchase.contentId);
        
        // Si el contenido existe, obtener información del vendedor/creador
        if (content && typeof content === 'object' && 'author' in content && typeof content.author === 'string') {
          try {
            seller = await fileStorageService.findById('users', content.author);
          } catch (error) {
            console.log('⚠️ Seller not found for content:', content.author);
          }
        }
      } catch (error) {
        console.log('⚠️ Content not found for purchase:', purchase.contentId);
      }
      
      return {
        id: (purchase as any)._id,
        contentId: purchase.contentId,
        content: content ? {
          id: (content as any)._id,
          title: (content as any).title,
          coverImage: (content as any).coverImage,
          category: (content as any).category,
          price: (content as any).price,
          files: (content as any).files || []
        } : null,
        seller: seller ? {
          id: (seller as any)._id,
          username: (seller as any).username,
          email: (seller as any).email
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
