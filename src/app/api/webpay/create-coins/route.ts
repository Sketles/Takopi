import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { webpayConfig, generateBuyOrder, generateSessionId } from '@/config/webpay';

// Importar WebpayPlus
let WebpayPlus: any;
try {
  WebpayPlus = require("transbank-sdk").WebpayPlus;
  console.log('✅ Transbank SDK loaded successfully for coins');
} catch (error) {
  console.error('❌ Error loading Transbank SDK:', error);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, packageId, coins, price } = body;

    console.log('💰 Create coins transaction request:', { userId, packageId, coins, price });

    // Validar datos
    if (!userId || !packageId || !coins || !price) {
      console.error('❌ Missing required data:', { userId, packageId, coins, price });
      return NextResponse.json(
        { 
          success: false, 
          error: 'Faltan datos requeridos',
          details: { 
            userId: userId ? 'OK' : 'MISSING', 
            packageId: packageId ? 'OK' : 'MISSING',
            coins: coins ? 'OK' : 'MISSING',
            price: price ? 'OK' : 'MISSING'
          }
        },
        { status: 400 }
      );
    }

    // Validar precio (debe ser mayor a 50 CLP)
    if (price < 50) {
      return NextResponse.json(
        { success: false, error: 'Monto mínimo: $50 CLP' },
        { status: 400 }
      );
    }

    // Verificar SDK
    if (!WebpayPlus) {
      console.error('❌ Transbank SDK not available');
      return NextResponse.json(
        { 
          success: false, 
          error: 'SDK de Transbank no disponible',
          details: 'El SDK de Transbank no se cargó correctamente'
        },
        { status: 500 }
      );
    }

    // Generar identificadores únicos
    const timestamp = Date.now().toString();
    const buyOrder = `COINS-${userId.slice(-8)}-${timestamp.slice(-10)}`;
    const sessionId = `SESS-${timestamp.slice(-10)}-${Math.random().toString(36).slice(-6)}`;
    const returnUrl = `${webpayConfig.baseUrl}/api/webpay/commit-coins`;

    console.log('💰 Creating coins purchase transaction:', {
      userId,
      packageId,
      coins,
      price,
      buyOrder,
      sessionId,
      returnUrl
    });

    // Crear transacción en Webpay
    const tx = WebpayPlus.Transaction.buildForIntegration(
      webpayConfig.commerceCode,
      webpayConfig.apiKey
    );

    const response = await tx.create(buyOrder, sessionId, price, returnUrl);

    console.log('✅ Webpay transaction created:', {
      token: response.token?.substring(0, 20) + '...',
      url: response.url
    });

    // Guardar la transacción pendiente en la base de datos
    await prisma.coinTransaction.create({
      data: {
        userId,
        buyOrder,
        sessionId,
        packageId,
        coins,
        amount: price,
        status: 'PENDING',
        token: response.token,
        createdAt: new Date(),
      }
    });

    console.log('💾 Transaction saved to database');

    return NextResponse.json({
      success: true,
      token: response.token,
      url: response.url,
      buyOrder,
      sessionId
    });

  } catch (error: any) {
    console.error('❌ Error creating coins transaction:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al crear la transacción',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
