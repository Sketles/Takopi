import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import { config } from '@/config/env';

export async function POST(req: NextRequest) {
  try {
    console.log('🔍 Token verification API called');
    
    // Verificar autorización
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No authorization header');
      return NextResponse.json(
        { error: 'Token de autorización requerido' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    
    try {
      // Verificar el token JWT
      const decodedToken = jwt.verify(token, config.jwt.secret);
      console.log('✅ Token válido:', { userId: (decodedToken as any).userId });
      
      return NextResponse.json({
        valid: true,
        user: {
          userId: (decodedToken as any).userId,
          email: (decodedToken as any).email
        }
      });
    } catch (error) {
      console.log('❌ Token inválido o expirado:', error);
      return NextResponse.json(
        { 
          valid: false,
          error: 'Token inválido o expirado' 
        },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('❌ Error en verificación de token:', error);
    return NextResponse.json(
      { 
        valid: false,
        error: 'Error interno del servidor' 
      },
      { status: 500 }
    );
  }
}
