// Create Webpay Transaction UseCase - Crear transacción de pago
import { WebpayTransactionEntity } from '../entities/webpay-transaction.entity';
import { IPaymentRepository } from '../repositories/payment.repository.interface';

export interface CreateWebpayTransactionDTO {
  amount: number;
  currency: string;
  userId: string;
  contentId: string;
  buyOrder?: string;
  sessionId?: string;
  token?: string;
  url?: string;
  status?: string;
}

export class CreateWebpayTransactionUseCase {
  constructor(private repository: IPaymentRepository) {}

  async execute(data: CreateWebpayTransactionDTO): Promise<WebpayTransactionEntity> {

    // Validaciones de negocio
    if (!data.amount || data.amount <= 0) {
      throw new Error('El monto debe ser mayor a 0');
    }

    if (!data.userId || data.userId.trim().length === 0) {
      throw new Error('ID de usuario es requerido');
    }

    if (!data.contentId || data.contentId.trim().length === 0) {
      throw new Error('ID de contenido es requerido');
    }

    if (!data.currency || data.currency.trim().length === 0) {
      throw new Error('Moneda es requerida');
    }

    // Generar identificadores únicos, usando los proporcionados si existen
    const buyOrder = data.buyOrder || this.generateBuyOrder(data.contentId, data.userId);
    const sessionId = data.sessionId || this.generateSessionId();
    
    // Priorizar token y URL si vienen en los datos (desde Transbank), de lo contrario, generarlos
    const token = data.token || this.generateToken();
    const url = data.url || `https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions/${token}`;

    // Crear transacción
    const transaction = await this.repository.createTransaction({
      buyOrder,
      sessionId,
      amount: data.amount,
      currency: data.currency,
      userId: data.userId,
      contentId: data.contentId,
      token,
      url,
      status: data.status || 'pending'
    });

    if (!transaction) {
      throw new Error('Error al crear la transacción');
    }

    return transaction;
  }

  private generateBuyOrder(contentId: string, userId: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `buy_${contentId}_${userId}_${timestamp}_${random}`;
  }

  private generateSessionId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `session_${timestamp}_${random}`;
  }

  private generateToken(): string {
    // Generar un token único para Webpay (simulado)
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 12);
    return `${timestamp}_${random}`;
  }
}

