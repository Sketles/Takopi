import { NextRequest, NextResponse } from "next/server";
import { CreatePurchaseUseCase } from "@/features/purchase/domain/usecases/create-purchase.usecase";
import { createPurchaseRepository } from "@/features/purchase/data/repositories/purchase.repository";
import { GetContentByIdUseCase } from "@/features/content/domain/usecases/get-content-by-id.usecase";
import { createContentRepository } from "@/features/content/data/repositories/content.repository";
import { requireAuth } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    console.log('🎁 Free purchase API (Clean Architecture)');
    
    // Verificar autorización con módulo centralizado
    const auth = requireAuth(req);
    if (auth instanceof NextResponse) return auth;
    
    console.log('✅ Token válido:', { userId: auth.userId });
    
    const { contentId, userId } = await req.json();
    
    console.log('🎁 Free purchase request data:', { contentId, userId });
    
    // Verificar que el userId del token coincida con el del request
    if (userId !== auth.userId) {
      console.log('❌ UserId mismatch:', { requestUserId: userId, tokenUserId: auth.userId });
      return NextResponse.json(
        { error: 'No autorizado para realizar esta transacción' },
        { status: 403 }
      );
    }
    
    // Validar datos requeridos
    if (!contentId || !userId) {
      console.log('❌ Missing required fields:', { contentId, userId });
      return NextResponse.json(
        { error: 'Datos de compra incompletos' },
        { status: 400 }
      );
    }

    // Verificar que el contenido existe y es gratuito (usando Clean Architecture)
    const contentRepository = createContentRepository();
    const getContentUseCase = new GetContentByIdUseCase(contentRepository);
    const content = await getContentUseCase.execute(contentId);

    if (!content) {
      console.log('❌ Content not found:', contentId);
      return NextResponse.json(
        { error: 'Contenido no encontrado' },
        { status: 404 }
      );
    }

    if (!content.isFree) {
      console.log('❌ Content is not free:', contentId);
      return NextResponse.json(
        { error: 'Este contenido no es gratuito' },
        { status: 400 }
      );
    }

    // Crear compra gratuita (usando Clean Architecture)
    const purchaseRepository = createPurchaseRepository();
    const createPurchaseUseCase = new CreatePurchaseUseCase(purchaseRepository);

    const purchase = await createPurchaseUseCase.execute({
      userId,
      contentId,
      amount: 0,
      currency: 'CLP',
      paymentMethod: 'free',
      transactionId: `free-${Date.now()}`
    });

    console.log('✅ Free purchase created:', purchase.id);

    return NextResponse.json({
      success: true,
      message: 'Contenido gratuito agregado a tus compras',
      data: {
        purchaseId: purchase.id,
        contentId: content.id,
        contentTitle: content.title
      }
    });

  } catch (error) {
    console.error('❌ Error in free purchase API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor';
    return NextResponse.json(
      { 
        success: false,
        error: errorMessage
      },
      { status: 500 }
    );
  }
}
