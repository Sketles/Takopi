// Plantillas de email HTML para Takopi
// Diseñadas siguiendo el Design System (dark theme, purple accent)

// ============ ESTILOS BASE ============
const baseStyles = `
  body { margin: 0; padding: 0; background-color: #050505; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
  .email-container { max-width: 600px; margin: 0 auto; background-color: #0a0a0a; }
  .header { background: linear-gradient(135deg, #581c87 0%, #1e3a8a 100%); padding: 40px 30px; text-align: center; }
  .logo { font-size: 32px; font-weight: 900; color: #ffffff; letter-spacing: -1px; margin: 0; }
  .logo-accent { background: linear-gradient(to right, #a855f7, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .content { padding: 40px 30px; color: #ffffff; }
  .greeting { font-size: 24px; font-weight: 700; margin-bottom: 16px; color: #ffffff; }
  .text { font-size: 16px; line-height: 1.6; color: #9ca3af; margin-bottom: 20px; }
  .highlight-box { background-color: #111111; border: 1px solid rgba(168, 85, 247, 0.3); border-radius: 16px; padding: 24px; margin: 24px 0; }
  .order-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
  .order-number { font-size: 14px; color: #a855f7; font-weight: 600; letter-spacing: 0.5px; }
  .order-date { font-size: 14px; color: #6b7280; }
  .product-card { background-color: #0f0f0f; border-radius: 12px; padding: 16px; margin-bottom: 16px; border: 1px solid rgba(255, 255, 255, 0.05); }
  .product-title { font-size: 18px; font-weight: 600; color: #ffffff; margin-bottom: 4px; }
  .product-author { font-size: 14px; color: #9ca3af; }
  .product-type { display: inline-block; font-size: 12px; color: #a855f7; background-color: rgba(168, 85, 247, 0.1); padding: 4px 12px; border-radius: 20px; margin-top: 8px; text-transform: uppercase; font-weight: 600; }
  .price-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; }
  .price-label { color: #9ca3af; }
  .price-value { color: #ffffff; font-weight: 500; }
  .price-total { border-top: 1px solid rgba(255, 255, 255, 0.1); margin-top: 12px; padding-top: 12px; }
  .price-total .price-label { font-weight: 600; color: #ffffff; }
  .price-total .price-value { font-size: 20px; font-weight: 700; color: #a855f7; }
  .status-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; }
  .status-confirmed { background-color: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); }
  .status-processing { background-color: rgba(245, 158, 11, 0.1); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.3); }
  .status-shipped { background-color: rgba(59, 130, 246, 0.1); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.3); }
  .cta-button { display: inline-block; background: linear-gradient(135deg, #a855f7 0%, #7e22ce 100%); color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 600; font-size: 16px; margin: 20px 0; }
  .cta-button:hover { background: linear-gradient(135deg, #9333ea 0%, #6b21a8 100%); }
  .divider { height: 1px; background: linear-gradient(to right, transparent, rgba(168, 85, 247, 0.3), transparent); margin: 32px 0; }
  .info-grid { display: table; width: 100%; }
  .info-item { display: table-cell; width: 50%; vertical-align: top; padding: 12px 0; }
  .info-label { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
  .info-value { font-size: 14px; color: #ffffff; }
  .shipping-box { background-color: #0f0f0f; border-radius: 12px; padding: 20px; margin: 20px 0; border-left: 4px solid #3b82f6; }
  .print-specs { display: table; width: 100%; border-collapse: collapse; }
  .print-spec-row { display: table-row; }
  .print-spec-label { display: table-cell; padding: 8px 0; color: #6b7280; font-size: 14px; width: 40%; }
  .print-spec-value { display: table-cell; padding: 8px 0; color: #ffffff; font-size: 14px; font-weight: 500; }
  .footer { background-color: #050505; padding: 30px; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.05); }
  .footer-text { font-size: 12px; color: #6b7280; margin: 4px 0; }
  .social-links { margin: 16px 0; }
  .social-link { display: inline-block; margin: 0 8px; color: #9ca3af; text-decoration: none; font-size: 14px; }
  .emoji { font-size: 20px; margin-right: 8px; }
`;

// ============ TIPOS ============
export interface PurchaseEmailData {
  orderId: string;
  orderDate: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    title: string;
    author: string;
    type: string;
    price: number;
  }>;
  subtotal: number;
  total: number;
  currency: string;
  downloadUrl?: string;
}

export interface PrintOrderEmailData {
  orderId: string;
  orderDate: string;
  customerName: string;
  customerEmail: string;
  modelName: string;
  modelAuthor: string;
  modelImage?: string;
  // Configuración de impresión
  material: string;
  quality: string;
  color?: string;
  scale: number;
  infill: number;
  notes?: string;
  // Precios
  printPrice: number;
  modelPrice: number;
  shippingPrice: number;
  totalPrice: number;
  currency: string;
  // Envío
  shippingMethod: string;
  shippingAddress: {
    street: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
  };
  estimatedDays?: number;
  // Estado
  status: string;
  trackingNumber?: string;
  trackingUrl?: string;
}

// ============ HELPERS ============
const formatPrice = (price: number, currency: string = 'CLP'): string => {
  if (currency === 'CLP') {
    return `$${price.toLocaleString('es-CL')} CLP`;
  }
  return `$${price.toFixed(2)} ${currency}`;
};

const getMaterialName = (material: string): string => {
  const materials: Record<string, string> = {
    'pla': 'PLA (Biodegradable)',
    'abs': 'ABS (Alta resistencia)',
    'petg': 'PETG (Resistente y flexible)',
    'resin': 'Resina (Alta definición)',
  };
  return materials[material.toLowerCase()] || material;
};

const getQualityName = (quality: string): string => {
  const qualities: Record<string, string> = {
    'draft': 'Borrador (0.3mm)',
    'standard': 'Estándar (0.2mm)',
    'high': 'Alta calidad (0.1mm)',
  };
  return qualities[quality.toLowerCase()] || quality;
};

const getStatusName = (status: string): string => {
  const statuses: Record<string, string> = {
    'PENDING': '⏳ Pendiente de pago',
    'CONFIRMED': '✅ Pago confirmado',
    'PROCESSING': '🔧 Preparando impresión',
    'PRINTING': '🖨️ Imprimiendo',
    'QUALITY_CHECK': '🔍 Control de calidad',
    'SHIPPED': '📦 Enviado',
    'DELIVERED': '🎉 Entregado',
    'CANCELLED': '❌ Cancelado',
    'FAILED': '⚠️ Error en impresión',
  };
  return statuses[status] || status;
};

const getShippingMethodName = (method: string): string => {
  const methods: Record<string, string> = {
    'pickup': 'Retiro en tienda',
    'standard': 'Envío estándar',
    'express': 'Envío express',
  };
  return methods[method] || method;
};

const getContentTypeEmoji = (type: string): string => {
  const emojis: Record<string, string> = {
    'modelos3d': '🧩',
    'avatares': '👤',
    'texturas': '🖼️',
    'musica': '🎵',
    'animaciones': '🎬',
    'obs': '📺',
    'otros': '📦',
  };
  return emojis[type.toLowerCase()] || '📦';
};

// ============ PLANTILLA: COMPRA DIGITAL ============
export const purchaseConfirmationTemplate = (data: PurchaseEmailData): string => {
  const itemsHtml = data.items.map(item => `
    <div style="background-color: #0f0f0f; border-radius: 12px; padding: 16px; margin-bottom: 12px; border: 1px solid rgba(255, 255, 255, 0.05);">
      <div style="font-size: 18px; font-weight: 600; color: #ffffff; margin-bottom: 4px;">
        ${getContentTypeEmoji(item.type)} ${item.title}
      </div>
      <div style="font-size: 14px; color: #9ca3af; margin-bottom: 8px;">
        por ${item.author}
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="display: inline-block; font-size: 12px; color: #a855f7; background-color: rgba(168, 85, 247, 0.1); padding: 4px 12px; border-radius: 20px; text-transform: uppercase; font-weight: 600;">
          ${item.type}
        </span>
        <span style="font-size: 16px; font-weight: 600; color: #ffffff;">
          ${item.price === 0 ? 'GRATIS' : formatPrice(item.price, data.currency)}
        </span>
      </div>
    </div>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmación de Compra - Takopi</title>
  <style>${baseStyles}</style>
</head>
<body style="margin: 0; padding: 0; background-color: #050505; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #0a0a0a;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #581c87 0%, #1e3a8a 100%); padding: 40px 30px; text-align: center;">
      <h1 style="font-size: 32px; font-weight: 900; color: #ffffff; letter-spacing: -1px; margin: 0;">
        TAKOPI
      </h1>
      <p style="font-size: 14px; color: rgba(255, 255, 255, 0.8); margin: 8px 0 0 0;">
        Marketplace de Contenido Digital
      </p>
    </div>

    <!-- Content -->
    <div style="padding: 40px 30px; color: #ffffff;">
      <!-- Success Icon -->
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; width: 80px; height: 80px; background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.1)); border-radius: 50%; line-height: 80px; font-size: 40px;">
          ✅
        </div>
      </div>

      <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 8px; color: #ffffff; text-align: center;">
        ¡Compra exitosa!
      </h2>
      <p style="font-size: 16px; line-height: 1.6; color: #9ca3af; margin-bottom: 24px; text-align: center;">
        Hola <strong style="color: #ffffff;">${data.customerName}</strong>, tu compra ha sido procesada correctamente.
      </p>

      <!-- Order Info -->
      <div style="background-color: #111111; border: 1px solid rgba(168, 85, 247, 0.3); border-radius: 16px; padding: 24px; margin: 24px 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
          <span style="font-size: 14px; color: #a855f7; font-weight: 600; letter-spacing: 0.5px;">
            Orden #${data.orderId.slice(-8).toUpperCase()}
          </span>
          <span style="font-size: 14px; color: #6b7280;">
            ${data.orderDate}
          </span>
        </div>

        <!-- Products -->
        <div style="margin-bottom: 20px;">
          <h3 style="font-size: 14px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">
            Contenido adquirido
          </h3>
          ${itemsHtml}
        </div>

        <!-- Price Summary -->
        <div style="border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 16px;">
          <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px;">
            <span style="color: #9ca3af;">Subtotal</span>
            <span style="color: #ffffff; font-weight: 500;">${formatPrice(data.subtotal, data.currency)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 12px 0; font-size: 14px; border-top: 1px solid rgba(255, 255, 255, 0.1); margin-top: 8px;">
            <span style="font-weight: 600; color: #ffffff;">Total pagado</span>
            <span style="font-size: 20px; font-weight: 700; color: #a855f7;">${formatPrice(data.total, data.currency)}</span>
          </div>
        </div>
      </div>

      <!-- CTA Button -->
      <div style="text-align: center;">
        <a href="${data.downloadUrl || 'https://takopi.com/profile'}" style="display: inline-block; background: linear-gradient(135deg, #a855f7 0%, #7e22ce 100%); color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 600; font-size: 16px; margin: 20px 0;">
          📥 Descargar Archivos
        </a>
      </div>

      <p style="font-size: 14px; line-height: 1.6; color: #6b7280; text-align: center; margin-top: 16px;">
        Tus archivos están disponibles en tu perfil en la sección "Mis Compras".
      </p>

      <!-- Divider -->
      <div style="height: 1px; background: linear-gradient(to right, transparent, rgba(168, 85, 247, 0.3), transparent); margin: 32px 0;"></div>

      <!-- Help Section -->
      <div style="text-align: center;">
        <p style="font-size: 14px; color: #9ca3af; margin-bottom: 8px;">
          ¿Tienes alguna pregunta sobre tu compra?
        </p>
        <a href="mailto:soporte@takopi.com" style="color: #a855f7; text-decoration: none; font-weight: 500;">
          Contáctanos →
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #050505; padding: 30px; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.05);">
      <p style="font-size: 14px; color: #9ca3af; margin: 0 0 8px 0;">
        Gracias por ser parte de <strong style="color: #a855f7;">Takopi</strong> 💜
      </p>
      <p style="font-size: 12px; color: #6b7280; margin: 4px 0;">
        © 2025 Takopi. Todos los derechos reservados.
      </p>
      <p style="font-size: 12px; color: #6b7280; margin: 4px 0;">
        Santiago, Chile
      </p>
    </div>
  </div>
</body>
</html>
`;
};

// ============ PLANTILLA: ORDEN DE IMPRESIÓN 3D ============
export const printOrderConfirmationTemplate = (data: PrintOrderEmailData): string => {
  const statusBadgeStyle = data.status === 'CONFIRMED' 
    ? 'background-color: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3);'
    : data.status === 'SHIPPED'
    ? 'background-color: rgba(59, 130, 246, 0.1); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.3);'
    : 'background-color: rgba(245, 158, 11, 0.1); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.3);';

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmación de Impresión 3D - Takopi</title>
  <style>${baseStyles}</style>
</head>
<body style="margin: 0; padding: 0; background-color: #050505; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #0a0a0a;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #581c87 0%, #1e3a8a 100%); padding: 40px 30px; text-align: center;">
      <h1 style="font-size: 32px; font-weight: 900; color: #ffffff; letter-spacing: -1px; margin: 0;">
        TAKOPI
      </h1>
      <p style="font-size: 14px; color: rgba(255, 255, 255, 0.8); margin: 8px 0 0 0;">
        🖨️ Servicio de Impresión 3D
      </p>
    </div>

    <!-- Content -->
    <div style="padding: 40px 30px; color: #ffffff;">
      <!-- Success Icon -->
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; width: 80px; height: 80px; background: linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(59, 130, 246, 0.1)); border-radius: 50%; line-height: 80px; font-size: 40px;">
          🖨️
        </div>
      </div>

      <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 8px; color: #ffffff; text-align: center;">
        ¡Tu impresión 3D está en camino!
      </h2>
      <p style="font-size: 16px; line-height: 1.6; color: #9ca3af; margin-bottom: 24px; text-align: center;">
        Hola <strong style="color: #ffffff;">${data.customerName}</strong>, hemos recibido tu orden de impresión 3D.
      </p>

      <!-- Order Status -->
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="display: inline-block; padding: 10px 20px; border-radius: 20px; font-size: 14px; font-weight: 600; ${statusBadgeStyle}">
          ${getStatusName(data.status)}
        </span>
      </div>

      <!-- Order Info Box -->
      <div style="background-color: #111111; border: 1px solid rgba(168, 85, 247, 0.3); border-radius: 16px; padding: 24px; margin: 24px 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
          <span style="font-size: 14px; color: #a855f7; font-weight: 600; letter-spacing: 0.5px;">
            Orden #${data.orderId.slice(-8).toUpperCase()}
          </span>
          <span style="font-size: 14px; color: #6b7280;">
            ${data.orderDate}
          </span>
        </div>

        <!-- Model Info -->
        <div style="background-color: #0f0f0f; border-radius: 12px; padding: 16px; margin-bottom: 20px; border: 1px solid rgba(255, 255, 255, 0.05);">
          <div style="font-size: 18px; font-weight: 600; color: #ffffff; margin-bottom: 4px;">
            🧩 ${data.modelName}
          </div>
          <div style="font-size: 14px; color: #9ca3af;">
            por ${data.modelAuthor}
          </div>
        </div>

        <!-- Print Specifications -->
        <h3 style="font-size: 14px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px;">
          Especificaciones de impresión
        </h3>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; color: #6b7280; font-size: 14px; width: 40%; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">Material</td>
            <td style="padding: 10px 0; color: #ffffff; font-size: 14px; font-weight: 500; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">${getMaterialName(data.material)}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #6b7280; font-size: 14px; width: 40%; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">Calidad</td>
            <td style="padding: 10px 0; color: #ffffff; font-size: 14px; font-weight: 500; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">${getQualityName(data.quality)}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #6b7280; font-size: 14px; width: 40%; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">Escala</td>
            <td style="padding: 10px 0; color: #ffffff; font-size: 14px; font-weight: 500; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">${data.scale * 100}%</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #6b7280; font-size: 14px; width: 40%; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">Relleno</td>
            <td style="padding: 10px 0; color: #ffffff; font-size: 14px; font-weight: 500; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">${data.infill}%</td>
          </tr>
          ${data.color ? `
          <tr>
            <td style="padding: 10px 0; color: #6b7280; font-size: 14px; width: 40%; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">Color</td>
            <td style="padding: 10px 0; color: #ffffff; font-size: 14px; font-weight: 500; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
              <span style="display: inline-block; width: 16px; height: 16px; background-color: ${data.color}; border-radius: 4px; vertical-align: middle; margin-right: 8px; border: 1px solid rgba(255,255,255,0.2);"></span>
              ${data.color}
            </td>
          </tr>
          ` : ''}
        </table>

        ${data.notes ? `
        <div style="margin-top: 16px; padding: 12px; background-color: rgba(168, 85, 247, 0.05); border-radius: 8px; border-left: 3px solid #a855f7;">
          <div style="font-size: 12px; color: #a855f7; font-weight: 600; margin-bottom: 4px;">Notas especiales:</div>
          <div style="font-size: 14px; color: #9ca3af;">${data.notes}</div>
        </div>
        ` : ''}
      </div>

      <!-- Shipping Info -->
      <div style="background-color: #0f0f0f; border-radius: 12px; padding: 20px; margin: 20px 0; border-left: 4px solid #3b82f6;">
        <h3 style="font-size: 14px; color: #3b82f6; font-weight: 600; margin: 0 0 12px 0;">
          📦 Información de envío
        </h3>
        <div style="font-size: 14px; color: #ffffff; line-height: 1.6;">
          <strong>${data.shippingAddress.street}</strong><br>
          ${data.shippingAddress.city}, ${data.shippingAddress.region}<br>
          ${data.shippingAddress.postalCode}<br>
          ${data.shippingAddress.country}
        </div>
        <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
          <span style="font-size: 14px; color: #9ca3af;">Método: </span>
          <span style="font-size: 14px; color: #ffffff; font-weight: 500;">${getShippingMethodName(data.shippingMethod)}</span>
        </div>
        ${data.estimatedDays ? `
        <div style="margin-top: 8px;">
          <span style="font-size: 14px; color: #9ca3af;">Tiempo estimado: </span>
          <span style="font-size: 14px; color: #10b981; font-weight: 500;">${data.estimatedDays} días hábiles</span>
        </div>
        ` : ''}
        ${data.trackingNumber ? `
        <div style="margin-top: 12px; padding: 12px; background-color: rgba(59, 130, 246, 0.1); border-radius: 8px;">
          <div style="font-size: 12px; color: #3b82f6; font-weight: 600; margin-bottom: 4px;">Número de seguimiento:</div>
          <div style="font-size: 16px; color: #ffffff; font-weight: 600;">${data.trackingNumber}</div>
          ${data.trackingUrl ? `<a href="${data.trackingUrl}" style="font-size: 14px; color: #3b82f6; text-decoration: none;">Rastrear envío →</a>` : ''}
        </div>
        ` : ''}
      </div>

      <!-- Price Summary -->
      <div style="background-color: #111111; border-radius: 12px; padding: 20px; margin: 20px 0;">
        <h3 style="font-size: 14px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 16px 0;">
          Resumen del pago
        </h3>
        <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px;">
          <span style="color: #9ca3af;">Servicio de impresión</span>
          <span style="color: #ffffff; font-weight: 500;">${formatPrice(data.printPrice, data.currency)}</span>
        </div>
        ${data.modelPrice > 0 ? `
        <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px;">
          <span style="color: #9ca3af;">Modelo 3D</span>
          <span style="color: #ffffff; font-weight: 500;">${formatPrice(data.modelPrice, data.currency)}</span>
        </div>
        ` : ''}
        <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px;">
          <span style="color: #9ca3af;">Envío (${getShippingMethodName(data.shippingMethod)})</span>
          <span style="color: #ffffff; font-weight: 500;">${data.shippingPrice === 0 ? 'GRATIS' : formatPrice(data.shippingPrice, data.currency)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 12px 0; font-size: 14px; border-top: 1px solid rgba(255, 255, 255, 0.1); margin-top: 8px;">
          <span style="font-weight: 600; color: #ffffff;">Total pagado</span>
          <span style="font-size: 20px; font-weight: 700; color: #a855f7;">${formatPrice(data.totalPrice, data.currency)}</span>
        </div>
      </div>

      <!-- CTA Button -->
      <div style="text-align: center;">
        <a href="https://takopi.com/profile" style="display: inline-block; background: linear-gradient(135deg, #a855f7 0%, #7e22ce 100%); color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 600; font-size: 16px; margin: 20px 0;">
          👀 Ver estado de mi orden
        </a>
      </div>

      <!-- Timeline -->
      <div style="margin-top: 32px;">
        <h3 style="font-size: 14px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px; text-align: center;">
          Proceso de tu impresión
        </h3>
        <div style="display: flex; justify-content: space-between; position: relative; padding: 0 10px;">
          <div style="position: absolute; top: 12px; left: 30px; right: 30px; height: 2px; background: linear-gradient(to right, #a855f7, #3b82f6, rgba(255,255,255,0.1));"></div>
          <div style="text-align: center; position: relative; z-index: 1;">
            <div style="width: 24px; height: 24px; background: #a855f7; border-radius: 50%; margin: 0 auto 8px; line-height: 24px; font-size: 12px;">✓</div>
            <div style="font-size: 11px; color: #9ca3af;">Pedido</div>
          </div>
          <div style="text-align: center; position: relative; z-index: 1;">
            <div style="width: 24px; height: 24px; background: ${['PROCESSING', 'PRINTING', 'QUALITY_CHECK', 'SHIPPED', 'DELIVERED'].includes(data.status) ? '#a855f7' : '#374151'}; border-radius: 50%; margin: 0 auto 8px; line-height: 24px; font-size: 12px;">${['PROCESSING', 'PRINTING', 'QUALITY_CHECK', 'SHIPPED', 'DELIVERED'].includes(data.status) ? '✓' : '2'}</div>
            <div style="font-size: 11px; color: #9ca3af;">Impresión</div>
          </div>
          <div style="text-align: center; position: relative; z-index: 1;">
            <div style="width: 24px; height: 24px; background: ${['SHIPPED', 'DELIVERED'].includes(data.status) ? '#3b82f6' : '#374151'}; border-radius: 50%; margin: 0 auto 8px; line-height: 24px; font-size: 12px;">${['SHIPPED', 'DELIVERED'].includes(data.status) ? '✓' : '3'}</div>
            <div style="font-size: 11px; color: #9ca3af;">Enviado</div>
          </div>
          <div style="text-align: center; position: relative; z-index: 1;">
            <div style="width: 24px; height: 24px; background: ${data.status === 'DELIVERED' ? '#10b981' : '#374151'}; border-radius: 50%; margin: 0 auto 8px; line-height: 24px; font-size: 12px;">${data.status === 'DELIVERED' ? '✓' : '4'}</div>
            <div style="font-size: 11px; color: #9ca3af;">Entregado</div>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div style="height: 1px; background: linear-gradient(to right, transparent, rgba(168, 85, 247, 0.3), transparent); margin: 32px 0;"></div>

      <!-- Help Section -->
      <div style="text-align: center;">
        <p style="font-size: 14px; color: #9ca3af; margin-bottom: 8px;">
          ¿Tienes preguntas sobre tu impresión?
        </p>
        <a href="mailto:impresion3d@takopi.com" style="color: #a855f7; text-decoration: none; font-weight: 500;">
          Contáctanos →
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #050505; padding: 30px; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.05);">
      <p style="font-size: 14px; color: #9ca3af; margin: 0 0 8px 0;">
        Gracias por confiar en <strong style="color: #a855f7;">Takopi</strong> 🖨️💜
      </p>
      <p style="font-size: 12px; color: #6b7280; margin: 4px 0;">
        © 2025 Takopi. Todos los derechos reservados.
      </p>
      <p style="font-size: 12px; color: #6b7280; margin: 4px 0;">
        Santiago, Chile
      </p>
    </div>
  </div>
</body>
</html>
`;
};

// ============ PLANTILLA: ACTUALIZACIÓN DE ESTADO ============
export const printOrderStatusUpdateTemplate = (data: PrintOrderEmailData): string => {
  const statusMessages: Record<string, { title: string; message: string; emoji: string }> = {
    'CONFIRMED': {
      title: '¡Pago confirmado!',
      message: 'Tu pago ha sido procesado correctamente. Tu impresión está en cola.',
      emoji: '✅'
    },
    'PROCESSING': {
      title: 'Preparando tu impresión',
      message: 'Estamos preparando los materiales y configurando la impresora.',
      emoji: '🔧'
    },
    'PRINTING': {
      title: '¡Imprimiendo!',
      message: 'Tu modelo está siendo impreso en este momento. Este proceso puede tomar varias horas.',
      emoji: '🖨️'
    },
    'QUALITY_CHECK': {
      title: 'Control de calidad',
      message: 'Tu impresión ha terminado y está siendo revisada para asegurar la mejor calidad.',
      emoji: '🔍'
    },
    'SHIPPED': {
      title: '¡Tu pedido va en camino!',
      message: `Tu impresión ha sido enviada${data.trackingNumber ? ` con número de seguimiento ${data.trackingNumber}` : ''}.`,
      emoji: '📦'
    },
    'DELIVERED': {
      title: '¡Entregado!',
      message: '¡Tu impresión 3D ha llegado a destino! Esperamos que lo disfrutes.',
      emoji: '🎉'
    },
    'CANCELLED': {
      title: 'Orden cancelada',
      message: 'Tu orden ha sido cancelada. Si tienes dudas, contáctanos.',
      emoji: '❌'
    },
    'FAILED': {
      title: 'Problema con la impresión',
      message: 'Hubo un problema con tu impresión. Te contactaremos pronto para resolverlo.',
      emoji: '⚠️'
    }
  };

  const statusInfo = statusMessages[data.status] || {
    title: 'Actualización de tu orden',
    message: 'El estado de tu orden ha sido actualizado.',
    emoji: '📋'
  };

  const statusBadgeStyle = data.status === 'DELIVERED' 
    ? 'background-color: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3);'
    : data.status === 'SHIPPED'
    ? 'background-color: rgba(59, 130, 246, 0.1); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.3);'
    : data.status === 'CANCELLED' || data.status === 'FAILED'
    ? 'background-color: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3);'
    : 'background-color: rgba(168, 85, 247, 0.1); color: #a855f7; border: 1px solid rgba(168, 85, 247, 0.3);';

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Actualización de Orden - Takopi</title>
  <style>${baseStyles}</style>
</head>
<body style="margin: 0; padding: 0; background-color: #050505; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #0a0a0a;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #581c87 0%, #1e3a8a 100%); padding: 40px 30px; text-align: center;">
      <h1 style="font-size: 32px; font-weight: 900; color: #ffffff; letter-spacing: -1px; margin: 0;">
        TAKOPI
      </h1>
      <p style="font-size: 14px; color: rgba(255, 255, 255, 0.8); margin: 8px 0 0 0;">
        Actualización de tu orden
      </p>
    </div>

    <!-- Content -->
    <div style="padding: 40px 30px; color: #ffffff;">
      <!-- Status Icon -->
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; width: 80px; height: 80px; background: linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(59, 130, 246, 0.1)); border-radius: 50%; line-height: 80px; font-size: 40px;">
          ${statusInfo.emoji}
        </div>
      </div>

      <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 8px; color: #ffffff; text-align: center;">
        ${statusInfo.title}
      </h2>
      
      <p style="font-size: 16px; line-height: 1.6; color: #9ca3af; margin-bottom: 24px; text-align: center;">
        ${statusInfo.message}
      </p>

      <!-- Status Badge -->
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="display: inline-block; padding: 10px 20px; border-radius: 20px; font-size: 14px; font-weight: 600; ${statusBadgeStyle}">
          ${getStatusName(data.status)}
        </span>
      </div>

      <!-- Order Summary -->
      <div style="background-color: #111111; border: 1px solid rgba(168, 85, 247, 0.3); border-radius: 16px; padding: 24px; margin: 24px 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <span style="font-size: 14px; color: #a855f7; font-weight: 600;">
            Orden #${data.orderId.slice(-8).toUpperCase()}
          </span>
        </div>
        
        <div style="background-color: #0f0f0f; border-radius: 12px; padding: 16px; border: 1px solid rgba(255, 255, 255, 0.05);">
          <div style="font-size: 16px; font-weight: 600; color: #ffffff;">
            🧩 ${data.modelName}
          </div>
          <div style="font-size: 14px; color: #9ca3af; margin-top: 4px;">
            ${getMaterialName(data.material)} · ${getQualityName(data.quality)}
          </div>
        </div>
      </div>

      ${data.status === 'SHIPPED' && data.trackingNumber ? `
      <!-- Tracking Info -->
      <div style="background-color: #0f0f0f; border-radius: 12px; padding: 20px; margin: 20px 0; border-left: 4px solid #3b82f6;">
        <h3 style="font-size: 14px; color: #3b82f6; font-weight: 600; margin: 0 0 12px 0;">
          📦 Seguimiento de envío
        </h3>
        <div style="font-size: 18px; color: #ffffff; font-weight: 600; margin-bottom: 8px;">
          ${data.trackingNumber}
        </div>
        ${data.trackingUrl ? `
        <a href="${data.trackingUrl}" style="display: inline-block; background-color: rgba(59, 130, 246, 0.1); color: #3b82f6; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: 500; margin-top: 8px;">
          Rastrear mi pedido →
        </a>
        ` : ''}
      </div>
      ` : ''}

      <!-- CTA Button -->
      <div style="text-align: center;">
        <a href="https://takopi.com/profile" style="display: inline-block; background: linear-gradient(135deg, #a855f7 0%, #7e22ce 100%); color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 600; font-size: 16px; margin: 20px 0;">
          Ver mi orden completa
        </a>
      </div>

      <!-- Divider -->
      <div style="height: 1px; background: linear-gradient(to right, transparent, rgba(168, 85, 247, 0.3), transparent); margin: 32px 0;"></div>

      <!-- Help Section -->
      <div style="text-align: center;">
        <p style="font-size: 14px; color: #9ca3af; margin-bottom: 8px;">
          ¿Tienes preguntas?
        </p>
        <a href="mailto:impresion3d@takopi.com" style="color: #a855f7; text-decoration: none; font-weight: 500;">
          Contáctanos →
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #050505; padding: 30px; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.05);">
      <p style="font-size: 12px; color: #6b7280; margin: 4px 0;">
        © 2025 Takopi. Todos los derechos reservados.
      </p>
    </div>
  </div>
</body>
</html>
`;
};
