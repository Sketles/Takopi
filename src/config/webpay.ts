// Función para obtener credenciales de forma segura
function getTransbankCredentials() {
  const environment = process.env.NODE_ENV === 'production' ? 'production' : 'integration';
  
  if (environment === 'production') {
    // En producción, las credenciales DEBEN estar en variables de entorno
    const commerceCode = process.env.TBK_COMMERCE_CODE_PROD;
    const apiKey = process.env.TBK_API_KEY_PROD;
    
    if (!commerceCode || !apiKey) {
      console.warn('⚠️ ADVERTENCIA: Credenciales de producción no configuradas. Usando integración.');
      // Retornar config de integración como fallback
      return {
        environment: 'integration' as const,
        commerceCode: process.env.TBK_COMMERCE_CODE || '597055555532',
        apiKey: process.env.TBK_API_KEY || '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C'
      };
    }
    
    return {
      environment: 'production' as const,
      commerceCode,
      apiKey
    };
  } else {
    // En desarrollo/integración, usar variables de entorno o valores por defecto
    const commerceCode = process.env.TBK_COMMERCE_CODE || '597055555532';
    const apiKey = process.env.TBK_API_KEY || '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C';
    
    console.log('🔍 Usando credenciales de INTEGRACIÓN:', {
      commerceCode: commerceCode.slice(0, 4) + '***',
      apiKey: apiKey ? '***' + apiKey.slice(-4) : 'undefined'
    });
    
    return {
      environment: 'integration' as const,
      commerceCode,
      apiKey
    };
  }
}

const credentials = getTransbankCredentials();

// Función para detectar URL base automáticamente
function getBaseUrl(): string {
  // Si está definida explícitamente, usar esa
  if (process.env.APP_BASE_URL) {
    return process.env.APP_BASE_URL;
  }
  
  // Si es Vercel, detectar automáticamente
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // Fallback para desarrollo local
  return 'http://localhost:3000';
}

export const webpayConfig = {
  // Configuración del ambiente
  environment: credentials.environment,
  
  // Credenciales seguras
  commerceCode: credentials.commerceCode,
  apiKey: credentials.apiKey,
  
  // URL base de la aplicación (auto-detectada)
  baseUrl: getBaseUrl(),
  
  // URLs de Transbank
  urls: {
    integration: 'https://webpay3gint.transbank.cl',
    production: 'https://webpay3g.transbank.cl'
  }
};

// Tarjetas de prueba para testing
export const testCards = {
  visa: {
    number: '4051 8856 0044 6623',
    cvv: '123',
    expiration: '12/25',
    rut: '11.111.111-1',
    password: '123'
  },
  redcompra: {
    number: '4051 8842 3993 7763',
    cvv: '123',
    expiration: '12/25',
    rut: '11.111.111-1',
    password: '123'
  }
};

// Función para generar buyOrder único (máximo 26 caracteres)
export function generateBuyOrder(contentId: string, userId: string): string {
  const timestamp = Date.now().toString().slice(-6); // Últimos 6 dígitos del timestamp
  const contentShort = contentId.slice(-6); // Últimos 6 caracteres del contentId
  const userShort = userId.slice(-6); // Últimos 6 caracteres del userId
  const buyOrder = `tk${timestamp}${contentShort}${userShort}`; // tk + 6 dígitos + 6 chars content + 6 chars user = 19 caracteres
  
  console.log('🔍 Generated buyOrder:', {
    contentId,
    userId,
    contentShort,
    userShort,
    buyOrder,
    length: buyOrder.length
  });
  
  return buyOrder;
}

// Función para generar sessionId único
export function generateSessionId(): string {
  const timestamp = Date.now().toString().slice(-6); // Últimos 6 dígitos del timestamp
  const random = Math.random().toString(36).substr(2, 6); // 6 caracteres aleatorios
  return `s${timestamp}${random}`; // s + 6 dígitos + 6 chars = 13 caracteres
}
