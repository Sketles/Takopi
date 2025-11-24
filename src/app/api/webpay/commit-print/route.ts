import { NextRequest, NextResponse } from 'next/server';
import { webpayConfig } from '@/config/webpay';

// Importar WebpayPlus de manera condicional para mejor manejo de errores
let WebpayPlus: any;
try {
  WebpayPlus = require("transbank-sdk").WebpayPlus;
  console.log('✅ Transbank SDK loaded successfully for commit-print');
} catch (error) {
  console.error('❌ Error loading Transbank SDK for commit-print:', error);
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
      return NextResponse.redirect(
        `${webpayConfig.baseUrl}/impresion-3d/confirmacion?success=false&error=no_token`,
        302
      );
    }

    // Verificar si el SDK está disponible
    if (!WebpayPlus) {
      console.error('❌ Transbank SDK not available for commit-print');
      return NextResponse.redirect(
        `${webpayConfig.baseUrl}/impresion-3d/confirmacion?success=false&error=sdk_error`,
        302
      );
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
      console.log('✅ Transbank commit-print response:', transbankResponse);
    } catch (error) {
      console.error('❌ Error committing print with Transbank:', error);
      return NextResponse.redirect(
        `${webpayConfig.baseUrl}/impresion-3d/confirmacion?success=false&error=transbank_error`,
        302
      );
    }

    // Verificar si la transacción fue autorizada por Transbank
    if (!transbankResponse || transbankResponse.status !== 'AUTHORIZED') {
      console.log('❌ Transacción de impresión no autorizada por Transbank:', transbankResponse);
      return NextResponse.redirect(
        `${webpayConfig.baseUrl}/impresion-3d/confirmacion?success=false&error=not_authorized&status=${transbankResponse?.status || 'unknown'}`,
        302
      );
    }

    // Redirigir a la página de confirmación exitosa con los datos de la transacción
    const redirectUrl = new URL(`${webpayConfig.baseUrl}/impresion-3d/confirmacion`);
    redirectUrl.searchParams.set('success', 'true');
    redirectUrl.searchParams.set('token_ws', token);
    redirectUrl.searchParams.set('amount', transbankResponse.amount.toString());
    redirectUrl.searchParams.set('buyOrder', transbankResponse.buy_order);
    redirectUrl.searchParams.set('authorizationCode', transbankResponse.authorization_code || '');
    redirectUrl.searchParams.set('cardNumber', transbankResponse.card_detail?.card_number || '');
    redirectUrl.searchParams.set('transactionDate', transbankResponse.transaction_date || '');
    redirectUrl.searchParams.set('status', transbankResponse.status);

    console.log('✅ Redirigiendo a confirmación de impresión:', redirectUrl.toString());

    return NextResponse.redirect(redirectUrl.toString(), 302);

  } catch (error) {
    console.error('❌ Error committing print transaction:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor';
    return NextResponse.redirect(
      `${webpayConfig.baseUrl}/impresion-3d/confirmacion?success=false&error=server_error&details=${encodeURIComponent(errorMessage)}`,
      302
    );
  }
}
