// Purchase Repository Interface - Contrato para compras
import { PurchaseEntity } from '../entities/purchase.entity';

export interface IPurchaseRepository {
  findAll(): Promise<PurchaseEntity[]>;
  findById(id: string): Promise<PurchaseEntity | null>;
  findByUser(userId: string): Promise<PurchaseEntity[]>;
  findByContent(contentId: string): Promise<PurchaseEntity[]>;
  findByUserAndContent(userId: string, contentId: string): Promise<PurchaseEntity | null>;
  create(purchase: any): Promise<PurchaseEntity>;
  update(id: string, data: Partial<any>): Promise<PurchaseEntity | null>;
  paginate(userId: string, page: number, limit: number): Promise<{
    items: PurchaseEntity[];
    total: number;
    page: number;
    totalPages: number;
  }>;
}

