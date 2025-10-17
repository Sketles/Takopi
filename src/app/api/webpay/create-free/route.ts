import { NextRequest, NextResponse } from "next/server";
import { CreatePurchaseUseCase } from "@/features/purchase/domain/usecases/create-purchase.usecase";
import { createPurchaseRepository } from "@/features/purchase/data/repositories/purchase.repository";
import { GetContentByIdUseCase } from "@/features/content/domain/usecases/get-content-by-id.usecase";
import { createContentRepository } from "@/features/content/data/repositories/content.repository";
import jwt from 'jsonwebtoken';
import { config } from '@/config/env';

export async function POST(req: NextRequest) {
  try {
    console.log('🎁 Free purchase API (Clean Architecture)');
    
    // Verificar autorización
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No authorization header');
      return NextResponse.json(
        { error: 'Token de autorización requerido' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    let decodedToken: any;
    try {
      decodedToken = jwt.verify(token, config.jwt.secret);
      console.log('✅ Token válido:', { userId: decodedToken.userId });
    } catch (error) {
      console.log('❌ Token inválido:', error);
      return NextResponse.json(
        { error: 'Token inválido o expirado' },
        { status: 401 }
      );
    }
    
    const { contentId, userId } = await req.json();
    
    console.log('🎁 Free purchase request data:', { contentId, userId });
    
    // Verificar que el userId del token coincida con el del request
    if (userId !== decodedToken.userId) {
      console.log('❌ UserId mismatch:', { requestUserId: userId, tokenUserId: decodedToken.userId });
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
