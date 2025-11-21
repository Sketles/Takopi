// Register UseCase - Caso de uso para registrar usuario
import { IAuthRepository, LoginResult } from '../repositories/auth.repository.interface';

export class RegisterUseCase {
  constructor(private repository: IAuthRepository) {}

  async execute(
    username: string, 
    email: string, 
    password: string, 
    role: string
  ): Promise<LoginResult> {
    // Normalizar email a lowercase (doble capa de seguridad)
    const normalizedEmail = email?.toLowerCase().trim();
    
    console.log('🎯 RegisterUseCase: Registrando usuario', normalizedEmail);

    // Validaciones de negocio
    if (!username || username.trim().length < 3) {
      throw new Error('El nombre de usuario debe tener al menos 3 caracteres');
    }

    if (!normalizedEmail || normalizedEmail.length === 0) {
      throw new Error('El email es requerido');
    }

    // Email válido
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      throw new Error('El email no es válido');
    }

    if (!password || password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }

    if (!role || role.trim().length === 0) {
      throw new Error('El rol es requerido');
    }

    // Verificar que no existe el email
    const existingUser = await this.repository.findUserByEmail(normalizedEmail);
    if (existingUser) {
      throw new Error('El email ya está registrado');
    }

    // Ejecutar registro con email normalizado
    const result = await this.repository.register(username, normalizedEmail, password, role);

    console.log('✅ RegisterUseCase: Registro exitoso', result.user.id);
    return result;
  }
}

