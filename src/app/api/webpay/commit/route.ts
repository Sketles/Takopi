import { NextRequest, NextResponse } from 'next/server';
import { CommitWebpayTransactionUseCase } from '@/features/payment/domain/usecases/commit-webpay-transaction.usecase';
import { createPaymentRepository } from '@/features/payment/data/repositories/payment.repository';
import { CreatePurchaseUseCase } from '@/features/purchase/domain/usecases/create-purchase.usecase';
import { createPurchaseRepository } from '@/features/purchase/data/repositories/purchase.repository';
import { webpayConfig } from '@/config/webpay';
import { sendPurchaseConfirmationEmail } from '@/lib/email';
import prisma from '@/lib/prisma';

// Importar WebpayPlus de manera condicional para mejor manejo de errores
let WebpayPlus: any;
try {
  WebpayPlus = require("transbank-sdk").WebpayPlus;
  console.log('✅ Transbank SDK loaded successfully for commit');
} catch (error) {
  console.error('❌ Error loading Transbank SDK for commit:', error);
}

// Manejar tanto GET como POST para compatibilidad con Transbank
export async function POST(request: NextRequest) {
  return handleCommit(request);
}

export async function GET(request: NextRequest) {
  return handleCommit(request);
}

async function handleCommit(request: NextRequest) {
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
      return NextResponse.redirect(`${webpayConfig.baseUrl}/payment/result?success=false&error=sdk_error&details=${encodeURIComponent('SDK de Transbank no disponible')}`, 302);
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
      return NextResponse.redirect(`${webpayConfig.baseUrl}/payment/result?success=false&error=transbank_error&details=${encodeURIComponent(error instanceof Error ? error.message : 'Error al confirmar con Transbank')}`, 302);
    }

    // Verificar si la transacción fue autorizada por Transbank
    if (!transbankResponse || transbankResponse.status !== 'AUTHORIZED') {
      console.log('❌ Transacción no autorizada por Transbank:', transbankResponse);
      return NextResponse.redirect(`${webpayConfig.baseUrl}/payment/result?success=false&error=not_authorized&details=${encodeURIComponent('Transacción no autorizada')}`, 302);
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
          paymentMethod: 'webpay'
        } as any);

        // Enviar email de confirmación de compra
        try {
          // Obtener datos del usuario y contenido para el email
          const [user, content] = await Promise.all([
            prisma.user.findUnique({
              where: { id: transaction.userId },
              select: { username: true, email: true }
            }),
            prisma.content.findUnique({
              where: { id: transaction.contentId },
              select: { 
                title: true, 
                contentType: true,
                author: { select: { username: true } }
              }
            })
          ]);

          if (user && content) {
            const emailResult = await sendPurchaseConfirmationEmail({
              orderId: purchase.id,
              orderDate: new Date().toLocaleDateString('es-CL', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }),
              customerName: user.username,
              customerEmail: user.email,
              items: [{
                title: content.title,
                author: content.author?.username || 'Desconocido',
                type: content.contentType,
                price: transaction.amount,
              }],
              subtotal: transaction.amount,
              total: transaction.amount,
              currency: transaction.currency,
              downloadUrl: `${webpayConfig.baseUrl}/profile`
            });

            if (emailResult.success) {
              console.log('📧 Email de confirmación enviado:', emailResult.id);
            } else {
              console.error('❌ Error enviando email:', emailResult.error);
            }
          }
        } catch (emailError) {
          console.error('❌ Error enviando email de confirmación:', emailError);
          // No fallar la compra si el email falla
        }

        // Redirigir a la página de resultado exitoso
        return NextResponse.redirect(`${webpayConfig.baseUrl}/payment/result?success=true&transactionId=${transaction.id}&purchaseId=${purchase.id}&amount=${transbankResponse.amount}&currency=CLP&buyOrder=${transbankResponse.buy_order}&authorizationCode=${transbankResponse.authorization_code}`, 302);

  } catch (error) {
        console.error('❌ Error creating purchase:', error);
        return NextResponse.redirect(`${webpayConfig.baseUrl}/payment/result?success=false&error=purchase_error&details=${encodeURIComponent(error instanceof Error ? error.message : 'Error desconocido')}`, 302);
      }
    }
    
    return NextResponse.redirect(`${webpayConfig.baseUrl}/payment/result?success=false&error=transaction_incomplete`, 302);

  } catch (error) {
    console.error('❌ Error committing webpay transaction:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor';
    return NextResponse.redirect(`${webpayConfig.baseUrl}/payment/result?success=false&error=server_error&details=${encodeURIComponent(errorMessage)}`, 302);
  }
}
