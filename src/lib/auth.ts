/**
 * 🔐 Takopi Authentication Module
 * 
 * Sistema centralizado de autenticación JWT optimizado para Vercel Edge/Serverless.
 * - Token generation & verification
 * - Request authentication helpers
 * - Type-safe token payloads
 * 
 * @author Takopi Team
 * @version 2.0.0
 */

import { NextRequest, NextResponse } from 'next/server';
import jwt, { JwtPayload, SignOptions, TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';

// ============ TYPES ============

/** Payload del token JWT */
export interface TokenPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

/** Resultado de verificación de token */
export interface AuthResult {
  success: true;
  user: TokenPayload;
}

export interface AuthError {
  success: false;
  error: string;
  code: 'NO_TOKEN' | 'INVALID_TOKEN' | 'EXPIRED_TOKEN' | 'MALFORMED_TOKEN' | 'SERVER_ERROR';
}

export type AuthVerifyResult = AuthResult | AuthError;

/** Opciones para crear tokens */
export interface TokenOptions {
  expiresIn?: string | number;
}

// ============ CONFIGURATION ============

/**
 * Obtiene el secret de JWT de forma segura.
 * En producción (Vercel), usa variables de entorno.
 * En desarrollo, usa un fallback con advertencia.
 */
function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET must be configured in production environment');
    }
    // Solo en desarrollo
    return 'takopi_dev_secret_not_for_production_2025';
  }
  
  return secret;
}

/** Configuración de JWT */
const JWT_CONFIG = {
  get secret() { return getJwtSecret(); },
  defaultExpiry: '7d',
  algorithm: 'HS256' as const,
  issuer: 'takopi',
  audience: 'takopi-users'
};

// ============ TOKEN OPERATIONS ============

/**
 * Genera un nuevo token JWT.
 * 
 * @param payload - Datos del usuario a incluir en el token
 * @param options - Opciones adicionales (expiración personalizada)
 * @returns Token JWT firmado
 * 
 * @example
 * const token = generateToken({ userId: 'abc123', email: 'user@example.com' });
 */
export function generateToken(payload: Omit<TokenPayload, 'iat' | 'exp'>, options?: TokenOptions): string {
  const signOptions: SignOptions = {
    expiresIn: options?.expiresIn || JWT_CONFIG.defaultExpiry,
    algorithm: JWT_CONFIG.algorithm,
    issuer: JWT_CONFIG.issuer,
    audience: JWT_CONFIG.audience
  };

  return jwt.sign(payload, JWT_CONFIG.secret, signOptions);
}

/**
 * Verifica y decodifica un token JWT.
 * 
 * @param token - Token JWT a verificar
 * @returns Resultado con payload o error tipado
 * 
 * @example
 * const result = verifyToken(token);
 * if (result.success) {
 *   console.log(result.user.userId);
 * }
 */
export function verifyToken(token: string): AuthVerifyResult {
  if (!token || token.trim() === '') {
    return {
      success: false,
      error: 'Token requerido',
      code: 'NO_TOKEN'
    };
  }

  try {
    const decoded = jwt.verify(token, JWT_CONFIG.secret, {
      algorithms: [JWT_CONFIG.algorithm],
      issuer: JWT_CONFIG.issuer,
      audience: JWT_CONFIG.audience
    }) as TokenPayload;

    // Validar que el payload tenga los campos requeridos
    if (!decoded.userId || !decoded.email) {
      return {
        success: false,
        error: 'Token malformado: faltan campos requeridos',
        code: 'MALFORMED_TOKEN'
      };
    }

    return {
      success: true,
      user: {
        userId: decoded.userId,
        email: decoded.email,
        iat: decoded.iat,
        exp: decoded.exp
      }
    };

  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return {
        success: false,
        error: 'Token expirado',
        code: 'EXPIRED_TOKEN'
      };
    }

    if (error instanceof JsonWebTokenError) {
      return {
        success: false,
        error: 'Token inválido',
        code: 'INVALID_TOKEN'
      };
    }

    // Error inesperado
    console.error('❌ Error verificando token:', error);
    return {
      success: false,
      error: 'Error del servidor al verificar token',
      code: 'SERVER_ERROR'
    };
  }
}

/**
 * Verifica un token sin validar issuer/audience (para tokens legacy).
 * Usar solo durante migración.
 */
export function verifyTokenLegacy(token: string): AuthVerifyResult {
  if (!token || token.trim() === '') {
    return {
      success: false,
      error: 'Token requerido',
      code: 'NO_TOKEN'
    };
  }

  try {
    const decoded = jwt.verify(token, JWT_CONFIG.secret) as TokenPayload;

    if (!decoded.userId) {
      return {
        success: false,
        error: 'Token malformado',
        code: 'MALFORMED_TOKEN'
      };
    }

    return {
      success: true,
      user: {
        userId: decoded.userId,
        email: decoded.email || '',
        iat: decoded.iat,
        exp: decoded.exp
      }
    };

  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return {
        success: false,
        error: 'Token expirado',
        code: 'EXPIRED_TOKEN'
      };
    }

    return {
      success: false,
      error: 'Token inválido',
      code: 'INVALID_TOKEN'
    };
  }
}

// ============ REQUEST HELPERS ============

/**
 * Extrae el token del header Authorization de un request.
 * Soporta formato "Bearer <token>".
 * 
 * @param request - NextRequest de Next.js
 * @returns Token extraído o null
 */
export function extractToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader) {
    return null;
  }

  // Soportar "Bearer <token>" y "<token>" directamente
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }

  return authHeader.trim();
}

/**
 * Verifica autenticación de un request completo.
 * Combina extracción de token + verificación.
 * 
 * @param request - NextRequest de Next.js
 * @returns Resultado de autenticación
 * 
 * @example
 * export async function GET(request: NextRequest) {
 *   const auth = authenticateRequest(request);
 *   if (!auth.success) {
 *     return NextResponse.json({ error: auth.error }, { status: 401 });
 *   }
 *   // auth.user disponible
 * }
 */
export function authenticateRequest(request: NextRequest): AuthVerifyResult {
  const token = extractToken(request);
  
  if (!token) {
    return {
      success: false,
      error: 'Token de autorización requerido',
      code: 'NO_TOKEN'
    };
  }

  // Usar legacy para compatibilidad con tokens existentes
  return verifyTokenLegacy(token);
}

/**
 * Middleware de autenticación que retorna respuesta de error si falla.
 * Para usar en API routes que requieren autenticación.
 * 
 * @param request - NextRequest
 * @returns Usuario autenticado o NextResponse de error
 * 
 * @example
 * export async function GET(request: NextRequest) {
 *   const auth = requireAuth(request);
 *   if (auth instanceof NextResponse) return auth;
 *   
 *   // auth es TokenPayload
 *   const userId = auth.userId;
 * }
 */
export function requireAuth(request: NextRequest): TokenPayload | NextResponse {
  const result = authenticateRequest(request);
  
  if (!result.success) {
    const status = result.code === 'EXPIRED_TOKEN' ? 401 : 
                   result.code === 'NO_TOKEN' ? 401 : 401;
    
    return NextResponse.json(
      { 
        error: result.error,
        code: result.code 
      },
      { status }
    );
  }
  
  return result.user;
}

// ============ UTILITIES ============

/**
 * Verifica si un token está próximo a expirar.
 * Útil para refresh de tokens.
 * 
 * @param token - Token a verificar
 * @param thresholdSeconds - Segundos antes de expiración (default: 1 hora)
 */
export function isTokenExpiringSoon(token: string, thresholdSeconds = 3600): boolean {
  const result = verifyTokenLegacy(token);
  
  if (!result.success || !result.user.exp) {
    return true; // Si no se puede verificar, considerar como expirado
  }
  
  const now = Math.floor(Date.now() / 1000);
  const timeUntilExpiry = result.user.exp - now;
  
  return timeUntilExpiry <= thresholdSeconds;
}

/**
 * Decodifica un token sin verificar firma.
 * ⚠️ USAR SOLO PARA DEBUG, nunca para autenticación.
 */
export function decodeTokenUnsafe(token: string): TokenPayload | null {
  try {
    const decoded = jwt.decode(token) as TokenPayload;
    return decoded;
  } catch {
    return null;
  }
}

// ============ EXPORTS ============

export default {
  generateToken,
  verifyToken,
  verifyTokenLegacy,
  extractToken,
  authenticateRequest,
  requireAuth,
  isTokenExpiringSoon,
  decodeTokenUnsafe
};
