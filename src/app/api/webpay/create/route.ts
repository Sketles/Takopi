import { NextRequest, NextResponse } from 'next/server';
import { CreateWebpayTransactionUseCase } from '@/features/payment/domain/usecases/create-webpay-transaction.usecase';
import { createPaymentRepository } from '@/features/payment/data/repositories/payment.repository';
import jwt from 'jsonwebtoken';
import { config } from '@/config/env';
import { webpayConfig, generateBuyOrder, generateSessionId } from '@/config/webpay';

// Importar WebpayPlus de manera condicional para mejor manejo de errores
let WebpayPlus: any;
try {
  WebpayPlus = require("transbank-sdk").WebpayPlus;
  console.log('✅ Transbank SDK loaded successfully for create');
} catch (error) {
  console.error('❌ Error loading Transbank SDK for create:', error);
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
    const { amount, contentId } = requestBody;

    // Validaciones
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Monto inválido' }, { status: 400 });
    }

    if (!contentId) {
      return NextResponse.json({ error: 'ID de contenido es requerido' }, { status: 400 });
    }

    // Verificar si el SDK está disponible
    if (!WebpayPlus) {
      console.error('❌ Transbank SDK not available for create');
      return NextResponse.json(
        {
          success: false,
          error: 'SDK de Transbank no disponible',
          details: 'El SDK de Transbank no se pudo cargar correctamente'
        },
        { status: 500 }
      );
    }

    // Generar identificadores únicos
    const buyOrder = generateBuyOrder(contentId, decoded.userId);
    const sessionId = generateSessionId();
    const returnUrl = `${webpayConfig.baseUrl}/webpay/return`;

    // Configurar transacción usando la API real de Transbank
    const tx = WebpayPlus.Transaction.buildForIntegration(
      webpayConfig.commerceCode,
      webpayConfig.apiKey
    );

    // Crear transacción real en Webpay (ambiente de integración)
    const response = await tx.create(buyOrder, sessionId, amount, returnUrl);

    // Guardar esta transacción real en nuestro almacenamiento local
    try {
      const paymentRepository = createPaymentRepository();
      const createWebpayTransactionUseCase = new CreateWebpayTransactionUseCase(paymentRepository);

      const localTransaction = await createWebpayTransactionUseCase.execute({
        amount,
        currency: 'CLP',
        userId: decoded.userId,
        contentId,
        buyOrder,
        sessionId,
        token: response.token, // Usar el token REAL de Transbank
        url: response.url,     // Usar la URL REAL de Transbank
        status: 'pending'
      });

    } catch (error) {
      console.error('❌ Error storing transaction locally:', error);
      // Continuar aunque falle el guardado local
    }

    return NextResponse.json({
      success: true,
      url: response.url,
      token: response.token,
      buyOrder,
      sessionId,
      message: 'Transacción creada exitosamente con Transbank'
    });

  } catch (error) {
    console.error('❌ Error creating webpay transaction:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
