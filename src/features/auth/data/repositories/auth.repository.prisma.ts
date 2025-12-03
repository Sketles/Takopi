// Auth Repository Prisma Implementation
import { IAuthRepository, LoginResult } from '../../domain/repositories/auth.repository.interface';
import { UserEntity } from '../../domain/entities/user.entity';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { generateToken, verifyTokenLegacy } from '@/lib/auth';

export class AuthRepositoryPrisma implements IAuthRepository {
  async login(email: string, password: string): Promise<LoginResult> {
    console.log('🗄️ AuthRepositoryPrisma: login', email);

    // Buscar usuario por email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Credenciales inválidas');
    }

    // Generar token JWT usando módulo centralizado
    const token = generateToken({
      userId: user.id,
      email: user.email
    });

    const userEntity = this.toEntity(user);

    return { user: userEntity, token };
  }

  async register(username: string, email: string, password: string, role: string): Promise<LoginResult> {
    console.log('🗄️ AuthRepositoryPrisma: register', email);

    // Hash de contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role,
        isActive: true
      }
    });

    // Generar token JWT usando módulo centralizado
    const token = generateToken({
      userId: user.id,
      email: user.email
    });

    const userEntity = this.toEntity(user);

    return { user: userEntity, token };
  }

  async verifyToken(token: string): Promise<UserEntity | null> {
    console.log('🗄️ AuthRepositoryPrisma: verifyToken');

    const result = verifyTokenLegacy(token);
    if (!result.success) {
      console.error('Token verification failed:', result.error);
      return null;
    }
    
    const user = await this.findUserById(result.user.userId);
    return user;
  }

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    console.log('🗄️ AuthRepositoryPrisma: findUserByEmail', email);

    const user = await prisma.user.findUnique({
      where: { email }
    });

    return user ? this.toEntity(user) : null;
  }

  async findUserByUsername(username: string): Promise<UserEntity | null> {
    console.log('🗄️ AuthRepositoryPrisma: findUserByUsername', username);

    const user = await prisma.user.findUnique({
      where: { username }
    });

    return user ? this.toEntity(user) : null;
  }

  async findUserById(id: string): Promise<UserEntity | null> {
    console.log('🗄️ AuthRepositoryPrisma: findUserById', id);

    const user = await prisma.user.findUnique({
      where: { id }
    });

    return user ? this.toEntity(user) : null;
  }

  async updateProfile(userId: string, data: any): Promise<UserEntity | null> {
    console.log('🗄️ AuthRepositoryPrisma: updateProfile', userId);

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        username: data.username,
        bio: data.bio,
        role: data.role,
        location: data.location,
        avatar: data.avatar,
        banner: data.banner
      }
    });

    return this.toEntity(user);
  }

  // Helper para convertir modelo Prisma a Entity
  private toEntity(user: any): UserEntity {
    return new UserEntity(
      user.id,
      user.username,
      user.email,
      user.role,
      user.avatar,
      user.banner,
      user.bio,
      user.location,
      user.createdAt,
      user.updatedAt,
      user.isActive
    );
  }
}
