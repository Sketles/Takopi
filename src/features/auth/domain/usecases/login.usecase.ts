// Login UseCase - Caso de uso para iniciar sesión
import { UserEntity } from '../entities/user.entity';
import { IAuthRepository, LoginResult } from '../repositories/auth.repository.interface';

export class LoginUseCase {
  constructor(private repository: IAuthRepository) {}

  async execute(email: string, password: string): Promise<LoginResult> {
    // Normalizar email a lowercase (doble capa de seguridad)
    const normalizedEmail = email?.toLowerCase().trim();
    
    console.log('🎯 LoginUseCase: Iniciando login', normalizedEmail);

    // Validaciones de negocio
    if (!normalizedEmail || normalizedEmail.length === 0) {
      throw new Error('El email es requerido');
    }

    if (!password || password.trim().length === 0) {
      throw new Error('La contraseña es requerida');
    }

    // Email válido
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      throw new Error('El email no es válido');
    }

    // Ejecutar login con email normalizado
    const result = await this.repository.login(normalizedEmail, password);

    console.log('✅ LoginUseCase: Login exitoso', result.user.id);
    return result;
  }
}

