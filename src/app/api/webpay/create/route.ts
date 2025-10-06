import { NextRequest, NextResponse } from "next/server";
import { webpayConfig, generateBuyOrder, generateSessionId } from "@/config/webpay";
import jwt from 'jsonwebtoken';
import { config } from '@/config/env';

// Importar WebpayPlus de manera condicional para mejor manejo de errores
let WebpayPlus: any;
try {
  WebpayPlus = require("transbank-sdk").WebpayPlus;
  console.log('✅ Transbank SDK loaded successfully');
} catch (error) {
  console.error('❌ Error loading Transbank SDK:', error);
}

export async function POST(req: NextRequest) {
  try {
    console.log('🔍 Webpay create API called');
    
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
    
    // Verificar si el SDK está disponible
    if (!WebpayPlus) {
      console.error('❌ Transbank SDK not available');
      return NextResponse.json(
        { 
          success: false,
          error: 'SDK de Transbank no disponible',
          details: 'El SDK de Transbank no se pudo cargar correctamente'
        },
        { status: 500 }
      );
    }
    
    const { amount, contentId, userId } = await req.json();
    
    console.log('🔍 Request data:', { amount, contentId, userId });
    
    // Verificar que el userId del token coincida con el del request
    if (userId !== decodedToken.userId) {
      console.log('❌ UserId mismatch:', { requestUserId: userId, tokenUserId: decodedToken.userId });
      return NextResponse.json(
        { error: 'No autorizado para realizar esta transacción' },
        { status: 403 }
      );
    }
    
    // Validar datos requeridos
    if (!amount || amount <= 0) {
      console.log('❌ Invalid amount:', amount);
      return NextResponse.json(
        { error: 'Monto inválido' },
        { status: 400 }
      );
    }

    if (!contentId || !userId) {
      console.log('❌ Missing required fields:', { contentId, userId });
      return NextResponse.json(
        { error: 'Datos de compra incompletos' },
        { status: 400 }
      );
    }

    // Generar identificadores únicos
    const buyOrder = generateBuyOrder(contentId, userId);
    const sessionId = generateSessionId();
    const returnUrl = `${webpayConfig.baseUrl}/webpay/return`;

    console.log('🔍 Webpay config:', {
      commerceCode: webpayConfig.commerceCode,
      apiKey: webpayConfig.apiKey ? '***' + webpayConfig.apiKey.slice(-4) : 'undefined',
      baseUrl: webpayConfig.baseUrl,
      buyOrder,
      sessionId,
      returnUrl,
      amount
    });

    // Configurar transacción
    const tx = WebpayPlus.Transaction.buildForIntegration(
      webpayConfig.commerceCode,
      webpayConfig.apiKey
    );

    console.log('🔍 Attempting to create Webpay transaction...');
    // Crear transacción en Webpay
    const response = await tx.create(buyOrder, sessionId, amount, returnUrl);
    console.log('✅ Webpay transaction created successfully:', response);

    // Guardar información de la transacción para referencia
    // En una implementación real, esto se guardaría en la base de datos
    const transactionData = {
      buyOrder,
      sessionId,
      amount,
      contentId,
      userId,
      token: response.token,
      url: response.url,
      createdAt: new Date().toISOString()
    };

    console.log('🔍 Webpay transaction created:', {
      buyOrder,
      amount,
      contentId,
      userId
    });

    return NextResponse.json({
      success: true,
      url: response.url,
      token: response.token,
      buyOrder,
      sessionId
    });

  } catch (error) {
    console.error('❌ Error creating Webpay transaction:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('❌ Error message:', error instanceof Error ? error.message : 'Unknown error');
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Error al crear la transacción de pago',
        details: process.env.NODE_ENV === 'development' ? {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          type: typeof error
        } : undefined
      },
      { status: 500 }
    );
  }
}
