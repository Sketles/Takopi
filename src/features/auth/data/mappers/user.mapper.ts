// User Mapper - Transforma Model ↔ Entity
import { UserEntity } from '../../domain/entities/user.entity';
import { UserModel } from '../models/user.model';

export class UserMapper {
  static toDomain(model: UserModel): UserEntity {
    return new UserEntity(
      model._id,
      model.username,
      model.email,
      model.role,
      model.avatar,
      model.banner,
      model.bio,
      model.location,
      new Date(model.createdAt),
      new Date(model.updatedAt),
      model.isActive !== undefined ? model.isActive : true
    );
  }

  static toModel(entity: UserEntity, password?: string): UserModel {
    return {
      _id: entity.id,
      username: entity.username,
      email: entity.email,
      password: password || '', // Password se maneja por separado
      role: entity.role,
      avatar: entity.avatar,
      banner: entity.banner,
      bio: entity.bio,
      location: entity.location,
      createdAt: entity.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: entity.updatedAt?.toISOString() || new Date().toISOString(),
      isActive: entity.isActive
    };
  }

  static toDomainList(models: UserModel[]): UserEntity[] {
    return models.map(model => this.toDomain(model));
  }

  // Método especial para remover password antes de enviar al cliente
  static toPublicModel(model: UserModel): Omit<UserModel, 'password'> {
    const { password, ...publicModel } = model;
    return publicModel;
  }
}

