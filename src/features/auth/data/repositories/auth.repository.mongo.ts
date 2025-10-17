// Auth Repository MongoDB Implementation - Usa Mongoose
import { IAuthRepository, LoginResult } from '../../domain/repositories/auth.repository.interface';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserMapper } from '../mappers/user.mapper';
import { mongoDBService } from '@/shared/infrastructure/database/mongodb.service';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '@/config/env';

export class AuthRepositoryMongo implements IAuthRepository {
  async login(email: string, password: string): Promise<LoginResult> {
    console.log('🗄️  AuthRepositoryMongo: login', email);
    
    await mongoDBService.connect();
    
    // Buscar usuario por email
    const userDoc = await User.findOne({ email }).select('+password');

    if (!userDoc) {
      throw new Error('Credenciales inválidas');
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, userDoc.password);
    if (!isValidPassword) {
      throw new Error('Credenciales inválidas');
    }

    // Verificar si está activo
    if (!userDoc.isActive) {
      throw new Error('Cuenta desactivada');
    }

    // Generar token JWT
    const token = jwt.sign(
      { 
        userId: userDoc._id, 
        email: userDoc.email,
        role: userDoc.role 
      },
      config.jwt.secret,
      { expiresIn: '7d' }
    );

    const user = UserMapper.toDomain(userDoc.toObject());

    return { user, token };
  }

  async register(username: string, email: string, password: string, role: string): Promise<LoginResult> {
    console.log('🗄️  AuthRepositoryMongo: register', email);
    
    await mongoDBService.connect();
    
    // Hash de contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const userDoc = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
      isActive: true
    });

    // Generar token JWT
    const token = jwt.sign(
      { 
        userId: userDoc._id, 
        email: userDoc.email,
        role: userDoc.role 
      },
      config.jwt.secret,
      { expiresIn: '7d' }
    );

    const user = UserMapper.toDomain(userDoc.toObject());

    return { user, token };
  }

  async verifyToken(token: string): Promise<UserEntity | null> {
    console.log('🗄️  AuthRepositoryMongo: verifyToken');
    
    try {
      const decoded: any = jwt.verify(token, config.jwt.secret);
      const user = await this.findUserById(decoded.userId);
      return user;
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  }

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    console.log('🗄️  AuthRepositoryMongo: findUserByEmail', email);
    
    await mongoDBService.connect();
    const userDoc = await User.findOne({ email }).lean();

    return userDoc ? UserMapper.toDomain(userDoc as any) : null;
  }

  async findUserById(id: string): Promise<UserEntity | null> {
    console.log('🗄️  AuthRepositoryMongo: findUserById', id);
    
    await mongoDBService.connect();
    const userDoc = await User.findById(id).lean();

    return userDoc ? UserMapper.toDomain(userDoc as any) : null;
  }

  async updateProfile(userId: string, data: any): Promise<UserEntity | null> {
    console.log('🗄️  AuthRepositoryMongo: updateProfile', userId);
    
    await mongoDBService.connect();
    const userDoc = await User.findByIdAndUpdate(userId, data, { new: true }).lean();

    return userDoc ? UserMapper.toDomain(userDoc as any) : null;
  }
}

