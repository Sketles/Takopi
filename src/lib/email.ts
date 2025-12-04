import { Resend } from 'resend';
import {
  purchaseConfirmationTemplate,
  printOrderConfirmationTemplate,
  printOrderStatusUpdateTemplate,
  type PurchaseEmailData,
  type PrintOrderEmailData,
} from './email-templates';

// Cliente de Resend para envío de emails
export const resend = new Resend(process.env.RESEND_API_KEY);

// Dominio de envío (usar el de Resend para desarrollo)
export const EMAIL_FROM = 'Takopi <onboarding@resend.dev>';

// En producción con dominio verificado:
// export const EMAIL_FROM = 'Takopi <noreply@takopi.com>';

// Re-exportar tipos para uso externo
export type { PurchaseEmailData, PrintOrderEmailData };

// ============ FUNCIONES DE ENVÍO ============

/**
 * Envía email de confirmación de compra de contenido digital
 */
export async function sendPurchaseConfirmationEmail(data: PurchaseEmailData): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const result = await resend.emails.send({
      from: EMAIL_FROM,
      to: data.customerEmail,
      subject: `✅ Confirmación de compra - Orden #${data.orderId.slice(-8).toUpperCase()}`,
      html: purchaseConfirmationTemplate(data),
    });

    if (result.error) {
      console.error('[Email] Error enviando confirmación de compra:', result.error);
      return { success: false, error: result.error.message };
    }

    console.log('[Email] Confirmación de compra enviada:', result.data?.id);
    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error('[Email] Error inesperado:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
  }
}

/**
 * Envía email de confirmación de orden de impresión 3D
 */
export async function sendPrintOrderConfirmationEmail(data: PrintOrderEmailData): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const result = await resend.emails.send({
      from: EMAIL_FROM,
      to: data.customerEmail,
      subject: `🖨️ Tu impresión 3D está en proceso - Orden #${data.orderId.slice(-8).toUpperCase()}`,
      html: printOrderConfirmationTemplate(data),
    });

    if (result.error) {
      console.error('[Email] Error enviando confirmación de impresión:', result.error);
      return { success: false, error: result.error.message };
    }

    console.log('[Email] Confirmación de impresión 3D enviada:', result.data?.id);
    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error('[Email] Error inesperado:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
  }
}

/**
 * Envía email de actualización de estado de impresión 3D
 */
export async function sendPrintOrderStatusEmail(data: PrintOrderEmailData): Promise<{ success: boolean; id?: string; error?: string }> {
  const statusSubjects: Record<string, string> = {
    'CONFIRMED': '✅ Pago confirmado - Tu impresión 3D está en cola',
    'PROCESSING': '🔧 Preparando tu impresión 3D',
    'PRINTING': '🖨️ ¡Tu modelo está siendo impreso!',
    'QUALITY_CHECK': '🔍 Tu impresión está en control de calidad',
    'SHIPPED': '📦 ¡Tu impresión 3D va en camino!',
    'DELIVERED': '🎉 ¡Tu impresión 3D ha sido entregada!',
    'CANCELLED': '❌ Orden de impresión cancelada',
    'FAILED': '⚠️ Problema con tu impresión 3D',
  };

  const subject = statusSubjects[data.status] || `📋 Actualización de tu orden #${data.orderId.slice(-8).toUpperCase()}`;

  try {
    const result = await resend.emails.send({
      from: EMAIL_FROM,
      to: data.customerEmail,
      subject: `${subject} - Orden #${data.orderId.slice(-8).toUpperCase()}`,
      html: printOrderStatusUpdateTemplate(data),
    });

    if (result.error) {
      console.error('[Email] Error enviando actualización de estado:', result.error);
      return { success: false, error: result.error.message };
    }

    console.log('[Email] Actualización de estado enviada:', result.data?.id, '- Estado:', data.status);
    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error('[Email] Error inesperado:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
  }
}
