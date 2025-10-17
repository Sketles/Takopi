import { NextRequest, NextResponse } from 'next/server';
import { CommitWebpayTransactionUseCase } from '@/features/payment/domain/usecases/commit-webpay-transaction.usecase';
import { createPaymentRepository } from '@/features/payment/data/repositories/payment.repository';
import { CreatePurchaseUseCase } from '@/features/purchase/domain/usecases/create-purchase.usecase';
import { createPurchaseRepository } from '@/features/purchase/data/repositories/purchase.repository';
import { webpayConfig } from '@/config/webpay';

// Importar WebpayPlus de manera condicional para mejor manejo de errores
let WebpayPlus: any;
try {
  WebpayPlus = require("transbank-sdk").WebpayPlus;
  console.log('✅ Transbank SDK loaded successfully for commit');
} catch (error) {
  console.error('❌ Error loading Transbank SDK for commit:', error);
}

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token_ws");
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token de transacción no encontrado' },
        { status: 400 }
      );
    }

    // Verificar si el SDK está disponible
    if (!WebpayPlus) {
      console.error('❌ Transbank SDK not available for commit');
      const baseUrl = process.env.APP_BASE_URL || 'http://localhost:3000';
      return NextResponse.redirect(`${baseUrl}/payment/result?success=false&error=sdk_error&details=${encodeURIComponent('SDK de Transbank no disponible')}`, 302);
    }

    // Configurar transacción usando la API real de Transbank
    const tx = WebpayPlus.Transaction.buildForIntegration(
      webpayConfig.commerceCode,
      webpayConfig.apiKey
    );

    // Confirmar transacción real con Transbank
    let transbankResponse;
    try {
      transbankResponse = await tx.commit(token);
      console.log('✅ Transbank commit response:', transbankResponse);
    } catch (error) {
      console.error('❌ Error committing with Transbank:', error);
      const baseUrl = process.env.APP_BASE_URL || 'http://localhost:3000';
      return NextResponse.redirect(`${baseUrl}/payment/result?success=false&error=transbank_error&details=${encodeURIComponent(error instanceof Error ? error.message : 'Error al confirmar con Transbank')}`, 302);
    }

    // Verificar si la transacción fue autorizada por Transbank
    if (!transbankResponse || transbankResponse.status !== 'AUTHORIZED') {
      console.log('❌ Transacción no autorizada por Transbank:', transbankResponse);
      const baseUrl = process.env.APP_BASE_URL || 'http://localhost:3000';
      return NextResponse.redirect(`${baseUrl}/payment/result?success=false&error=not_authorized&details=${encodeURIComponent('Transacción no autorizada')}`, 302);
    }

    // Crear repositories y usecases (Clean Architecture)
    const paymentRepository = createPaymentRepository();
    const commitUseCase = new CommitWebpayTransactionUseCase(paymentRepository);

    // Ejecutar caso de uso para confirmar transacción local
    const transaction = await commitUseCase.execute(token);

    // Si la transacción fue exitosa, crear la compra
    if (transaction.isCompleted) {
      try {
        const purchaseRepository = createPurchaseRepository();
        const createPurchaseUseCase = new CreatePurchaseUseCase(purchaseRepository);

        const purchase = await createPurchaseUseCase.execute({
          userId: transaction.userId,
          contentId: transaction.contentId,
          amount: transaction.amount,
          currency: transaction.currency,
          paymentMethod: 'webpay',
          status: 'completed'
        });


        // Redirigir a la página de resultado exitoso
        const baseUrl = process.env.APP_BASE_URL || 'http://localhost:3000';
        return NextResponse.redirect(`${baseUrl}/payment/result?success=true&transactionId=${transaction.id}&purchaseId=${purchase.id}&amount=${transbankResponse.amount}&currency=CLP&buyOrder=${transbankResponse.buy_order}&authorizationCode=${transbankResponse.authorization_code}`, 302);

      } catch (error) {
        console.error('❌ Error creating purchase:', error);
        const baseUrl = process.env.APP_BASE_URL || 'http://localhost:3000';
        return NextResponse.redirect(`${baseUrl}/payment/result?success=false&error=purchase_error&details=${encodeURIComponent(error instanceof Error ? error.message : 'Error desconocido')}`, 302);
      }
    }

    const baseUrl = process.env.APP_BASE_URL || 'http://localhost:3000';
    return NextResponse.redirect(`${baseUrl}/payment/result?success=false&error=transaction_incomplete`, 302);

  } catch (error) {
    console.error('❌ Error committing webpay transaction:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor';
    const baseUrl = process.env.APP_BASE_URL || 'http://localhost:3000';
    return NextResponse.redirect(`${baseUrl}/payment/result?success=false&error=server_error&details=${encodeURIComponent(errorMessage)}`, 302);
  }
}
