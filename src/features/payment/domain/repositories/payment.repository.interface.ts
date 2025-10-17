// Payment Repository Interface - Contrato para operaciones de pago
import { WebpayTransactionEntity } from '../entities/webpay-transaction.entity';

export interface CreateTransactionDTO {
  buyOrder: string;
  sessionId: string;
  amount: number;
  currency: string;
  userId: string;
  contentId: string;
  token?: string;
  url?: string;
  status?: string;
}

export interface IPaymentRepository {
  createTransaction(data: CreateTransactionDTO): Promise<WebpayTransactionEntity>;
  findTransactionById(id: string): Promise<WebpayTransactionEntity | null>;
  findTransactionByToken(token: string): Promise<WebpayTransactionEntity | null>;
  findTransactionByBuyOrder(buyOrder: string): Promise<WebpayTransactionEntity | null>;
  updateTransaction(id: string, data: Partial<CreateTransactionDTO>): Promise<WebpayTransactionEntity | null>;
  deleteTransaction(id: string): Promise<boolean>;
}

