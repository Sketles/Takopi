// Verify Token UseCase - Verificar validez de token JWT
import { IAuthRepository } from '../repositories/auth.repository.interface';
import { verifyTokenLegacy } from '@/lib/auth';

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

    // Usar módulo centralizado para verificar token
    const result = verifyTokenLegacy(token);
    
    if (!result.success) {
      console.log('❌ Token inválido:', result.error);
      return {
        valid: false,
        error: result.error
      };
    }

    console.log('✅ Token válido:', { userId: result.user.userId });

    // Verificar que el usuario existe en el repositorio
    const user = await this.repository.findUserById(result.user.userId);
    if (!user) {
      return {
        valid: false,
        error: 'Usuario no encontrado'
      };
    }

    return {
      valid: true,
      userId: result.user.userId,
      email: result.user.email
    };
  }
}

