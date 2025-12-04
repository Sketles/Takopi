import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
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

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const auth = requireAuth(request);
    if (auth instanceof NextResponse) return auth;
    
    const decoded = auth;

    const requestBody = await request.json();
    const { amount, printConfig, shippingData, userId } = requestBody;

    // Extraer productId del printConfig (si viene de un producto del marketplace)
    const productId = printConfig?.productId || null;
    const productTitle = printConfig?.productTitle || 'Impresión 3D';

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
          contentIds: productId ? [productId] : [],
          url: response.url,
          returnUrl,
          // Guardar datos de impresión para usarlos en commit-print
          metadata: {
            type: '3d_print',
            printConfig: {
              material: printConfig.material,
              quality: printConfig.quality,
              scale: printConfig.scale || 1.0,
              color: printConfig.color,
              infill: printConfig.infill || 20,
              copies: printConfig.copies || 1,
              supports: printConfig.supports || false,
              estimatedTime: printConfig.estimatedTime,
              modelUrl: printConfig.modelUrl,
              productTitle: printConfig.productTitle,
              productImage: printConfig.productImage,
            },
            shippingData: {
              fullName: shippingData.fullName,
              phone: shippingData.phone,
              address: shippingData.address,
              city: shippingData.city,
              region: shippingData.region,
              postalCode: shippingData.postalCode,
              additionalInfo: shippingData.additionalInfo,
              shippingMethod: shippingData.shippingMethod,
            },
            pricing: {
              printPrice: printConfig.price || amount,
              shippingPrice: shippingData.shippingMethod === 'chilexpress' ? 3990 : 2490,
              totalPrice: amount,
            }
          }
        },
      });
      console.log('✅ Initial transaction saved to database with metadata', { productId, productTitle });
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
