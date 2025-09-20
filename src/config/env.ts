// Configuración de variables de entorno
export const config = {
  // MongoDB
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb+srv://takopi_app:Suicidesurrender603@cluster99.uzpzzow.mongodb.net/Takopi_BaseDatos?retryWrites=true&w=majority&appName=Cluster99',
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'takopi_jwt_secret_super_secreto_2025_change_in_production',
    expiresIn: '7d'
  },

  // NextAuth
  nextauth: {
    secret: process.env.NEXTAUTH_SECRET || 'takopi_nextauth_secret_2025_change_in_production',
    url: process.env.NEXTAUTH_URL || 'http://localhost:3000'
  },

  // App
  app: {
    name: 'Takopi',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  },

  // File Upload (opcional)
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET
  },

  // Payment (opcional)
  stripe: {
    publicKey: process.env.STRIPE_PUBLIC_KEY,
    secretKey: process.env.STRIPE_SECRET_KEY
  }
};

// Validar variables críticas
export function validateConfig() {
  const errors: string[] = [];

  if (!config.jwt.secret || config.jwt.secret.includes('change_in_production')) {
    errors.push('JWT_SECRET debe ser configurado en producción');
  }

  if (!config.nextauth.secret || config.nextauth.secret.includes('change_in_production')) {
    errors.push('NEXTAUTH_SECRET debe ser configurado en producción');
  }

  if (config.app.environment === 'production' && config.mongodb.uri.includes('Suicidesurrender603')) {
    errors.push('MONGODB_URI debe usar variables de entorno en producción');
  }

  if (errors.length > 0) {
    console.warn('⚠️  Configuración de seguridad:', errors);
  }

  return errors.length === 0;
}

// Ejecutar validación al importar
validateConfig();
