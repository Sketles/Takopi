// Create Purchase UseCase - Crear nueva compra
import { PurchaseEntity } from '../entities/purchase.entity';
import { IPurchaseRepository } from '../repositories/purchase.repository.interface';

export interface CreatePurchaseDTO {
  userId: string;
  contentId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  transactionId?: string;
}

export class CreatePurchaseUseCase {
  constructor(private repository: IPurchaseRepository) {}

  async execute(data: CreatePurchaseDTO): Promise<PurchaseEntity> {
    console.log('🎯 CreatePurchaseUseCase: Creando compra');

    // Validaciones de negocio
    if (!data.userId || data.userId.trim().length === 0) {
      throw new Error('El ID de usuario es requerido');
    }

    if (!data.contentId || data.contentId.trim().length === 0) {
      throw new Error('El ID de contenido es requerido');
    }

    if (data.amount < 0) {
      throw new Error('El monto no puede ser negativo');
    }

    // Verificar si ya existe una compra para este usuario y contenido
    const existingPurchase = await this.repository.findByUserAndContent(
      data.userId, 
      data.contentId
    );

    if (existingPurchase && existingPurchase.isCompleted) {
      throw new Error('Ya has comprado este contenido');
    }

    // Crear compra
    const purchase = await this.repository.create({
      ...data,
      status: data.amount === 0 ? 'completed' : 'pending'
    });

    console.log('✅ Compra creada:', purchase.id);
    return purchase;
  }
}

