import jwt from 'jsonwebtoken';
import { config } from '@/config/env';
import { NextRequest } from 'next/server';

export interface AuthUser {
  userId: string;
  email: string;
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as any;
    return {
      userId: decoded.userId,
      email: decoded.email
    };
  } catch (error) {
    return null;
  }
}

export function getTokenFromRequest(request: NextRequest): string | null {
  // Buscar token en el header Authorization
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Buscar token en cookies
  const cookieToken = request.cookies.get('takopi_token')?.value;
  if (cookieToken) {
    return cookieToken;
  }

  return null;
}

export function authenticateRequest(request: NextRequest): AuthUser | null {
  const token = getTokenFromRequest(request);
  if (!token) {
    return null;
  }

  return verifyToken(token);
}
