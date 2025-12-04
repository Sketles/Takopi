import { NextRequest, NextResponse } from 'next/server';
import { resend, EMAIL_FROM } from '@/lib/email';

/**
 * POST /api/email/test
 * Endpoint de prueba para enviar un email simple
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, subject, message } = body;

    console.log('📧 Intentando enviar email a:', to);
    console.log('📧 API Key presente:', !!process.env.RESEND_API_KEY);

    if (!to) {
      return NextResponse.json(
        { success: false, error: 'El campo "to" es requerido' },
        { status: 400 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY no está configurada');
      return NextResponse.json(
        { success: false, error: 'RESEND_API_KEY no configurada' },
        { status: 500 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: to,
      subject: subject || '¡Prueba de Takopi!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #9333ea; margin: 0;">TAKOPI</h1>
            <p style="color: #666; margin: 5px 0;">Marketplace de Contenido Digital</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 12px; padding: 30px; color: white;">
            <h2 style="margin-top: 0; color: #a855f7;">¡Hola! 👋</h2>
            <p style="line-height: 1.6; color: #e5e5e5;">
              ${message || 'Este es un correo de prueba desde Takopi. Si recibes esto, ¡el sistema de emails está funcionando correctamente!'}
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #333;">
            <p style="color: #666; font-size: 12px; margin: 0;">
              Takopi - Donde los creadores brillan ✨
            </p>
            <p style="color: #888; font-size: 11px; margin: 5px 0;">
              #663399
            </p>
          </div>
        </div>
      `
    });

    if (error) {
      console.error('Error enviando email:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    console.log('✅ Email enviado:', data);
    
    return NextResponse.json({
      success: true,
      message: 'Email enviado correctamente',
      emailId: data?.id
    });

  } catch (error) {
    console.error('Error en API de email:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
