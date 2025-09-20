import { NextResponse } from 'next/server';
import { config, validateConfig } from '@/config/env';

export async function GET() {
  try {
    const isSecure = validateConfig();
    const environment = config.app.environment;

    // Información de configuración (sin datos sensibles)
    const configInfo = {
      environment,
      appName: config.app.name,
      appVersion: config.app.version,
      hasMongoUri: !!config.mongodb.uri,
      hasJwtSecret: !!config.jwt.secret,
      hasNextAuthSecret: !!config.nextauth.secret,
      isSecure,
      warnings: []
    };

    // Advertencias de seguridad
    if (config.jwt.secret.includes('change_in_production')) {
      configInfo.warnings.push('JWT_SECRET usa valor por defecto - cambiar en producción');
    }

    if (config.nextauth.secret.includes('change_in_production')) {
      configInfo.warnings.push('NEXTAUTH_SECRET usa valor por defecto - cambiar en producción');
    }

    if (config.mongodb.uri.includes('Suicidesurrender603')) {
      configInfo.warnings.push('MONGODB_URI contiene contraseña hardcodeada - usar variables de entorno');
    }

    if (environment === 'production') {
      configInfo.warnings.push('Verificar configuración de seguridad para producción');
    }

    return NextResponse.json({
      message: isSecure ? 'Configuración segura' : 'Configuración necesita ajustes',
      config: configInfo,
      recommendations: [
        'Usar variables de entorno para todas las credenciales',
        'Generar claves JWT únicas y seguras',
        'Configurar HTTPS en producción',
        'Usar un servicio de gestión de secretos',
        'Rotar claves regularmente'
      ]
    });

  } catch (error) {
    return NextResponse.json({
      message: 'Error al verificar configuración',
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}
