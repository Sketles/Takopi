// Verify Token UseCase - Verificar validez de token JWT
import { IAuthRepository } from '../repositories/auth.repository.interface';
import jwt from 'jsonwebtoken';
import { config } from '@/config/env';

export interface VerifyTokenResult {
  valid: boolean;
  userId?: string;
  email?: string;
  error?: string;
}

export class VerifyTokenUseCase {
  constructor(private repository: IAuthRepository) {}

  async execute(token: string): Promise<VerifyTokenResult> {
    console.log('🎯 VerifyTokenUseCase: Verificando token');

    // Validaciones de negocio
    if (!token || token.trim().length === 0) {
      return {
        valid: false,
        error: 'Token requerido'
      };
    }

    try {
      // Verificar el token JWT
      const decodedToken = jwt.verify(token, config.jwt.secret) as any;
      
      console.log('✅ Token válido:', { userId: decodedToken.userId });

      // Opcionalmente verificar que el usuario existe en el repositorio
      const user = await this.repository.findUserById(decodedToken.userId);
      if (!user) {
        return {
          valid: false,
          error: 'Usuario no encontrado'
        };
      }

      return {
        valid: true,
        userId: decodedToken.userId,
        email: decodedToken.email
      };

    } catch (error) {
      console.log('❌ Token inválido o expirado:', error);
      return {
        valid: false,
        error: 'Token inválido o expirado'
      };
    }
  }
}

