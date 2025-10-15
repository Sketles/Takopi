import { NextRequest, NextResponse } from "next/server";
import { webpayConfig, generateBuyOrder, generateSessionId } from "@/config/webpay";

// Importar WebpayPlus de manera condicional para mejor manejo de errores
let WebpayPlus: any;
try {
  WebpayPlus = require("transbank-sdk").WebpayPlus;
  console.log('✅ Transbank SDK loaded successfully for test');
} catch (error) {
  console.error('❌ Error loading Transbank SDK for test:', error);
}

export async function POST(req: NextRequest) {
  try {
    console.log('🧪 Webpay TEST API called');
    const { amount, contentId, userId } = await req.json();
    
    console.log('🧪 Test request data:', { amount, contentId, userId });
    
    // Validar datos requeridos
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Monto inválido' },
        { status: 400 }
      );
    }

    if (!contentId || !userId) {
      return NextResponse.json(
        { error: 'Datos de compra incompletos' },
        { status: 400 }
      );
    }

    // Verificar si el SDK está disponible
    if (!WebpayPlus) {
      console.error('❌ Transbank SDK not available for test');
      return NextResponse.json(
        { 
          success: false,
          error: 'SDK de Transbank no disponible para pruebas',
          details: 'El SDK de Transbank no se pudo cargar correctamente'
        },
        { status: 500 }
      );
    }

    // Generar identificadores únicos
    const buyOrder = generateBuyOrder(contentId, userId);
    const sessionId = generateSessionId();
    const returnUrl = `${webpayConfig.baseUrl}/webpay/return`;
    
    console.log('🧪 Generated identifiers:', { 
      buyOrder, 
      sessionId, 
      returnUrl,
      commerceCode: webpayConfig.commerceCode,
      apiKey: webpayConfig.apiKey ? '***' + webpayConfig.apiKey.slice(-4) : 'undefined'
    });

    // Configurar transacción usando la API real de Transbank
    const tx = WebpayPlus.Transaction.buildForIntegration(
      webpayConfig.commerceCode,
      webpayConfig.apiKey
    );

    console.log('🧪 Attempting to create REAL Webpay transaction for test...');
    // Crear transacción real en Webpay (ambiente de integración)
    const response = await tx.create(buyOrder, sessionId, amount, returnUrl);
    console.log('✅ Real Webpay transaction created for test:', response);

    return NextResponse.json({
      success: true,
      url: response.url,
      token: response.token,
      buyOrder,
      sessionId,
      isTest: true,
      message: 'Transacción de prueba creada exitosamente con Transbank'
    });

  } catch (error) {
    console.error('❌ Error in test API:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Error al crear transacción de prueba con Transbank',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}
