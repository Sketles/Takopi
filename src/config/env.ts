// Configuración de variables de entorno
// Optimizado para Vercel deployment

/** Detectar si estamos en Vercel */
const isVercel = process.env.VERCEL === '1';
const isProduction = process.env.NODE_ENV === 'production';

export const config = {
  // Base de datos
  database: {
    url: process.env.POSTGRES_PRISMA_URL,
    directUrl: process.env.POSTGRES_URL_NON_POOLING,
  },

  // Vercel Blob
  blob: {
    readWriteToken: process.env.BLOB_READ_WRITE_TOKEN,
  },

  // JWT - El secret DEBE venir de env en producción
  jwt: {
    // En producción/Vercel: usa variable de entorno obligatoria
    // En desarrollo: usa fallback con advertencia
    secret: process.env.JWT_SECRET || (isProduction ? '' : 'takopi_dev_secret_not_for_production_2025'),
    expiresIn: '7d',
    algorithm: 'HS256' as const
  },

  // NextAuth
  nextauth: {
    secret: process.env.NEXTAUTH_SECRET || (isProduction ? '' : 'takopi_nextauth_dev_secret_2025'),
    url: process.env.NEXTAUTH_URL || process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000'
  },

  // Transbank Webpay
  transbank: {
    commerceCode: process.env.TRANSBANK_COMMERCE_CODE || '597055555532', // Sandbox default
    apiKey: process.env.TRANSBANK_API_KEY || '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C', // Sandbox default
    environment: process.env.TRANSBANK_ENVIRONMENT || 'integration', // integration | production
  },

  // App
  app: {
    name: 'Takopi',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    isVercel,
    isProduction,
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
  }
};

// Validar variables críticas
export function validateConfig(): boolean {
  const errors: string[] = [];
  const warnings: string[] = [];

  // En producción (Vercel), validar variables críticas
  if (config.app.isProduction || config.app.isVercel) {
    if (!process.env.POSTGRES_PRISMA_URL) {
      errors.push('POSTGRES_PRISMA_URL requerido en producción');
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      errors.push('BLOB_READ_WRITE_TOKEN requerido en producción');
    }

    if (!process.env.JWT_SECRET) {
      errors.push('JWT_SECRET requerido en producción');
    } else if (process.env.JWT_SECRET.length < 32) {
      warnings.push('JWT_SECRET debería tener al menos 32 caracteres');
    }

    if (!process.env.NEXTAUTH_SECRET) {
      warnings.push('NEXTAUTH_SECRET no configurado');
    }

    if (errors.length > 0) {
      console.error('❌ Variables de entorno faltantes en producción:', errors);
      // En Vercel, NO lanzar error para permitir build, pero loguear
      if (process.env.VERCEL_ENV === 'production') {
        throw new Error(`Missing required environment variables: ${errors.join(', ')}`);
      }
    }

    if (warnings.length > 0) {
      console.warn('⚠️ Advertencias de configuración:', warnings);
    }
  } else {
    // En desarrollo, solo advertir
    if (!process.env.JWT_SECRET) {
      warnings.push('JWT_SECRET no configurado (usando default de desarrollo)');
    }

    if (!process.env.NEXTAUTH_SECRET) {
      warnings.push('NEXTAUTH_SECRET no configurado (usando default de desarrollo)');
    }

    if (warnings.length > 0) {
      console.warn('⚠️ Configuración de desarrollo:', warnings);
    }
  }

  return errors.length === 0;
}

// Ejecutar validación al importar (solo loguea, no bloquea)
if (typeof window === 'undefined') {
  // Solo en servidor
  validateConfig();
}
