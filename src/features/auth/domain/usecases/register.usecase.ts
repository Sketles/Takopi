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
    console.log('🎯 RegisterUseCase: Registrando usuario', email);

    // Validaciones de negocio
    if (!username || username.trim().length < 3) {
      throw new Error('El nombre de usuario debe tener al menos 3 caracteres');
    }

    if (!email || email.trim().length === 0) {
      throw new Error('El email es requerido');
    }

    // Email válido
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('El email no es válido');
    }

    if (!password || password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }

    if (!role || role.trim().length === 0) {
      throw new Error('El rol es requerido');
    }

    // Verificar que no existe el email
    const existingUser = await this.repository.findUserByEmail(email);
    if (existingUser) {
      throw new Error('El email ya está registrado');
    }

    // Ejecutar registro
    const result = await this.repository.register(username, email, password, role);

    console.log('✅ RegisterUseCase: Registro exitoso', result.user.id);
    return result;
  }
}

