import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { webpayConfig } from '@/config/webpay';

// Importar WebpayPlus
let WebpayPlus: any;
try {
  WebpayPlus = require("transbank-sdk").WebpayPlus;
  console.log('✅ Transbank SDK loaded successfully for coins commit');
} catch (error) {
  console.error('❌ Error loading Transbank SDK:', error);
}

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token_ws = searchParams.get('token_ws');

  console.log('💰 Coins purchase commit received:', { token_ws });

  if (!token_ws) {
    return NextResponse.redirect(
      `${webpayConfig.baseUrl}/takopi-ia?error=no_token`,
      { status: 303 }
    );
  }

  try {
    if (!WebpayPlus) {
      throw new Error('SDK de Transbank no disponible');
    }

    // Confirmar transacción con Webpay
    const tx = WebpayPlus.Transaction.buildForIntegration(
      webpayConfig.commerceCode,
      webpayConfig.apiKey
    );

    const response = await tx.commit(token_ws);

    console.log('✅ Webpay commit response:', {
      buyOrder: response.buy_order,
      status: response.status,
      responseCode: response.response_code,
      amount: response.amount
    });

    // Buscar la transacción en la base de datos
    const transaction = await prisma.coinTransaction.findUnique({
      where: { buyOrder: response.buy_order }
    });

    if (!transaction) {
      console.error('❌ Transaction not found:', response.buy_order);
      return NextResponse.redirect(
        `${webpayConfig.baseUrl}/takopi-ia?error=transaction_not_found`,
        { status: 303 }
      );
    }

    // Verificar el estado de la transacción
    const isApproved = response.status === 'AUTHORIZED' && response.response_code === 0;

    // Actualizar la transacción
    await prisma.coinTransaction.update({
      where: { buyOrder: response.buy_order },
      data: {
        status: isApproved ? 'COMPLETED' : 'FAILED',
        authorizationCode: response.authorization_code,
        paymentTypeCode: response.payment_type_code,
        responseCode: response.response_code,
        cardNumber: response.card_detail?.card_number,
        transactionDate: new Date(response.transaction_date),
        updatedAt: new Date()
      }
    });

    console.log(`${isApproved ? '✅' : '❌'} Transaction ${isApproved ? 'approved' : 'rejected'}:`, {
      buyOrder: response.buy_order,
      userId: transaction.userId,
      coins: transaction.coins,
      amount: transaction.amount
    });

    // Redirigir según el resultado
    if (isApproved) {
      // Nota: Las monedas NO se agregan automáticamente ya que son simbólicas
      return NextResponse.redirect(
        `${webpayConfig.baseUrl}/takopi-ia?purchase=success&coins=${transaction.coins}&package=${transaction.packageId}`,
        { status: 303 }
      );
    } else {
      return NextResponse.redirect(
        `${webpayConfig.baseUrl}/takopi-ia?purchase=failed&reason=${response.response_code}`,
        { status: 303 }
      );
    }

  } catch (error: any) {
    console.error('❌ Error in coins commit:', error);
    return NextResponse.redirect(
      `${webpayConfig.baseUrl}/takopi-ia?error=commit_error`,
      { status: 303 }
    );
  }
}

// Manejar GET (cuando Webpay redirige)
export async function GET(request: NextRequest) {
  return POST(request);
}
