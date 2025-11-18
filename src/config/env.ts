// Configuración de variables de entorno
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

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'takopi_jwt_secret_super_secreto_2025_change_in_production',
    expiresIn: '7d'
  },

  // NextAuth
  nextauth: {
    secret: process.env.NEXTAUTH_SECRET || 'takopi_nextauth_secret_2025_change_in_production',
    url: process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
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
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  }
};

// Validar variables críticas
export function validateConfig() {
  const errors: string[] = [];

  // Solo validar en producción
  if (process.env.NODE_ENV === 'production') {
    if (!config.database.url) {
      errors.push('POSTGRES_PRISMA_URL debe estar configurado en producción');
    }

    if (!config.blob.readWriteToken) {
      errors.push('BLOB_READ_WRITE_TOKEN debe estar configurado en producción');
    }

    // Solo validar que existan, no su contenido específico
    if (!config.jwt.secret) {
      errors.push('JWT_SECRET debe estar configurado en producción');
    }

    if (!config.nextauth.secret) {
      errors.push('NEXTAUTH_SECRET debe estar configurado en producción');
    }

    if (errors.length > 0) {
      console.error('❌ Configuración de producción incompleta:', errors);
      throw new Error('Missing required environment variables in production');
    }
  } else {
    // En desarrollo, solo advertir
    const warnings: string[] = [];
    
    if (!config.jwt.secret || config.jwt.secret.includes('change_in_production')) {
      warnings.push('JWT_SECRET no configurado (usando default)');
    }

    if (!config.nextauth.secret || config.nextauth.secret.includes('change_in_production')) {
      warnings.push('NEXTAUTH_SECRET no configurado (usando default)');
    }

    if (warnings.length > 0) {
      console.warn('⚠️  Configuración de desarrollo:', warnings);
    }
  }

  return errors.length === 0;
}

// Ejecutar validación al importar
validateConfig();
