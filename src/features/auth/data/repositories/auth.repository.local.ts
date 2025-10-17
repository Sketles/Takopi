// Auth Repository Local Implementation - Usa FileStorage
import { IAuthRepository, LoginResult } from '../../domain/repositories/auth.repository.interface';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserMapper } from '../mappers/user.mapper';
import { fileStorageService } from '@/shared/infrastructure/storage/file-storage.service';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '@/config/env';

export class AuthRepositoryLocal implements IAuthRepository {
  private collection = 'users';

  async login(email: string, password: string): Promise<LoginResult> {
    console.log('📁 AuthRepositoryLocal: login', email);
    
    // Buscar usuario por email
    const users = await fileStorageService.find<any>(this.collection, { email });
    const userModel = users[0];

    if (!userModel) {
      throw new Error('Credenciales inválidas');
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, userModel.password);
    if (!isValidPassword) {
      throw new Error('Credenciales inválidas');
    }

    // Generar token JWT (sin imágenes para evitar tokens demasiado grandes)
    const token = jwt.sign(
      { 
        userId: userModel._id, 
        email: userModel.email,
        username: userModel.username,
        role: userModel.role 
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    const user = UserMapper.toDomain(userModel);

    return { user, token };
  }

  async register(username: string, email: string, password: string, role: string): Promise<LoginResult> {
    console.log('📁 AuthRepositoryLocal: register', email);
    
    // Hash de contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const userModel = await fileStorageService.create(this.collection, {
      username,
      email,
      password: hashedPassword,
      role,
      isActive: true
    });

    // Generar token JWT (sin imágenes para evitar tokens demasiado grandes)
    const token = jwt.sign(
      { 
        userId: userModel._id, 
        email: userModel.email,
        username: userModel.username,
        role: userModel.role 
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    const user = UserMapper.toDomain(userModel);

    return { user, token };
  }

  async verifyToken(token: string): Promise<UserEntity | null> {
    console.log('📁 AuthRepositoryLocal: verifyToken');
    
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
    console.log('📁 AuthRepositoryLocal: findUserByEmail', email);
    
    const users = await fileStorageService.find<any>(this.collection, { email });
    const userModel = users[0];

    return userModel ? UserMapper.toDomain(userModel) : null;
  }

  async findUserByUsername(username: string): Promise<UserEntity | null> {
    console.log('📁 AuthRepositoryLocal: findUserByUsername', username);
    
    const users = await fileStorageService.find<any>(this.collection, { username });
    const userModel = users[0];

    return userModel ? UserMapper.toDomain(userModel) : null;
  }

  async findUserById(id: string): Promise<UserEntity | null> {
    console.log('📁 AuthRepositoryLocal: findUserById', id);
    
    const userModel = await fileStorageService.findById(this.collection, id);
    return userModel ? UserMapper.toDomain(userModel) : null;
  }

  async updateProfile(userId: string, data: any): Promise<UserEntity | null> {
    console.log('📁 AuthRepositoryLocal: updateProfile', userId, data);
    
    try {
      // Primero obtener el usuario actual
      const currentUser = await fileStorageService.findById(this.collection, userId);
      if (!currentUser) {
        console.log('❌ Usuario no encontrado:', userId);
        return null;
      }
      
      console.log('📁 Current user model:', currentUser);
      
      // Fusionar los datos actuales con los nuevos
      const updatedUserModel = {
        ...currentUser,
        ...data,
        updatedAt: new Date().toISOString()
      };
      
      console.log('📁 Updated user model to save:', updatedUserModel);
      
      // Actualizar el usuario
      const savedUserModel = await fileStorageService.update(this.collection, userId, updatedUserModel);
      console.log('📁 Saved user model:', savedUserModel);
      
      if (!savedUserModel) {
        console.log('❌ No user model returned from update');
        return null;
      }
      
      // Crear la entidad
      const userEntity = UserMapper.toDomain(savedUserModel);
      console.log('✅ User entity created:', userEntity.id);
      return userEntity;
    } catch (error) {
      console.error('❌ Error in updateProfile:', error);
      throw error;
    }
  }
}

