// Purchase Mapper - Transforma Model ↔ Entity
import { PurchaseEntity } from '../../domain/entities/purchase.entity';
import { PurchaseModel } from '../models/purchase.model';

export class PurchaseMapper {
  static toDomain(model: PurchaseModel): PurchaseEntity {
    return new PurchaseEntity(
      model._id,
      model.userId,
      model.contentId,
      model.amount,
      model.currency,
      model.paymentMethod,
      model.status,
      model.transactionId,
      new Date(model.createdAt),
      new Date(model.updatedAt)
    );
  }

  static toModel(entity: PurchaseEntity): PurchaseModel {
    return {
      _id: entity.id,
      userId: entity.userId,
      contentId: entity.contentId,
      amount: entity.amount,
      currency: entity.currency,
      paymentMethod: entity.paymentMethod,
      status: entity.status,
      transactionId: entity.transactionId,
      createdAt: entity.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: entity.updatedAt?.toISOString() || new Date().toISOString()
    };
  }

  static toDomainList(models: PurchaseModel[]): PurchaseEntity[] {
    return models.map(model => this.toDomain(model));
  }
}

