import { NextRequest, NextResponse } from "next/server";
import { webpayConfig, generateBuyOrder, generateSessionId } from "@/config/webpay";

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

    // Generar identificadores únicos
    const buyOrder = generateBuyOrder(contentId, userId);
    const sessionId = generateSessionId();
    
    console.log('🧪 Generated identifiers:', { buyOrder, sessionId });

    // Simular respuesta de Webpay para testing
    const mockResponse = {
      url: 'https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions',
      token: `mock-token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    console.log('🧪 Mock Webpay response:', mockResponse);

    return NextResponse.json({
      success: true,
      url: mockResponse.url,
      token: mockResponse.token,
      buyOrder,
      sessionId,
      isTest: true
    });

  } catch (error) {
    console.error('❌ Error in test API:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Error en la API de prueba',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}
