import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { config } from '@/config/env';
import { webpayConfig, generateBuyOrder, generateSessionId } from '@/config/webpay';
import prisma from '@/lib/prisma';

// Importar WebpayPlus
let WebpayPlus: any;
try {
  WebpayPlus = require("transbank-sdk").WebpayPlus;
  console.log('✅ Transbank SDK loaded successfully for print');
} catch (error) {
  console.error('❌ Error loading Transbank SDK:', error);
}

// Función para verificar el token JWT
async function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as any;
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const decoded = await verifyToken(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const requestBody = await request.json();
    const { amount, printConfig, shippingData, userId } = requestBody;

    // Validaciones
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Monto inválido' }, { status: 400 });
    }

    if (!printConfig || !shippingData) {
      return NextResponse.json({ error: 'Faltan datos de configuración o envío' }, { status: 400 });
    }

    // Verificar SDK
    if (!WebpayPlus) {
      console.error('❌ Transbank SDK not available');
      return NextResponse.json(
        {
          success: false,
          error: 'SDK de Transbank no disponible'
        },
        { status: 500 }
      );
    }

    // Generar identificadores únicos para impresión 3D
    const printId = `print-${Date.now()}`;
    const buyOrder = generateBuyOrder(printId, userId);
    const sessionId = generateSessionId();
    const returnUrl = `${webpayConfig.baseUrl}/api/webpay/commit-print`;

    console.log('🖨️ Creating 3D print transaction:', {
      amount,
      buyOrder,
      sessionId,
      userId,
      material: printConfig.material,
      shippingMethod: shippingData.shippingMethod
    });

    // Configurar transacción
    const tx = WebpayPlus.Transaction.buildForIntegration(
      webpayConfig.commerceCode,
      webpayConfig.apiKey
    );

    // Crear transacción en Webpay
    const response = await tx.create(buyOrder, sessionId, amount, returnUrl);

    // Guardar transacción inicial en base de datos
    try {
      await prisma.transaction.create({
        data: {
          token: response.token,
          buyOrder,
          sessionId,
          amount,
          currency: 'CLP',
          status: 'pending',
          userId,
          contentIds: [], // No hay contenido específico
          url: response.url,
          returnUrl,
        },
      });
      console.log('✅ Initial transaction saved to database');
    } catch (dbError) {
      console.error('⚠️ Error saving initial transaction:', dbError);
      // Continuar aunque falle el guardado inicial
    }

    console.log('✅ 3D print transaction created:', {
      token: response.token.substring(0, 10) + '...',
      url: response.url
    });

    return NextResponse.json({
      success: true,
      url: response.url,
      token: response.token,
      buyOrder,
      sessionId,
      printConfig, // Devolver printConfig para que el cliente lo guarde
      shippingData, // Devolver shippingData para que el cliente lo guarde
      message: 'Transacción de impresión 3D creada exitosamente'
    });

  } catch (error) {
    console.error('❌ Error creating 3D print transaction:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
