// Payment Repository Prisma Implementation
import { IPaymentRepository } from '../../domain/repositories/payment.repository.interface';
import { WebpayTransactionEntity } from '../../domain/entities/webpay-transaction.entity';
import prisma from '@/lib/prisma';

export class PaymentRepositoryPrisma implements IPaymentRepository {
  async createTransaction(data: any): Promise<WebpayTransactionEntity> {
    const transaction = await prisma.transaction.create({
      data: {
        token: data.token,
        buyOrder: data.buyOrder,
        sessionId: data.sessionId,
        amount: data.amount,
        currency: data.currency || 'CLP',
        status: data.status || 'pending',
        url: data.url,
        returnUrl: data.returnUrl,
        userId: data.userId,
        contentIds: data.contentIds || (data.contentId ? [data.contentId] : [])
      }
    });
    return this.toEntity(transaction);
  }

  async findTransactionById(id: string): Promise<WebpayTransactionEntity | null> {
    const transaction = await prisma.transaction.findUnique({
      where: { id }
    });
    return transaction ? this.toEntity(transaction) : null;
  }

  async findTransactionByToken(token: string): Promise<WebpayTransactionEntity | null> {
    const transaction = await prisma.transaction.findUnique({
      where: { token }
    });
    return transaction ? this.toEntity(transaction) : null;
  }

  async findTransactionByBuyOrder(buyOrder: string): Promise<WebpayTransactionEntity | null> {
    const transaction = await prisma.transaction.findUnique({
      where: { buyOrder }
    });
    return transaction ? this.toEntity(transaction) : null;
  }

  async updateTransaction(id: string, data: any): Promise<WebpayTransactionEntity | null> {
    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        status: data.status,
        authorizationCode: data.authorizationCode,
        responseCode: data.responseCode,
        paymentTypeCode: data.paymentTypeCode,
        accountingDate: data.accountingDate,
        transactionDate: data.transactionDate
      }
    });
    return this.toEntity(transaction);
  }

  async deleteTransaction(id: string): Promise<boolean> {
    try {
      await prisma.transaction.delete({ where: { id } });
      return true;
    } catch (error) {
      return false;
    }
  }

  private toEntity(transaction: any): WebpayTransactionEntity {
    return new WebpayTransactionEntity(
      transaction.id,
      transaction.buyOrder,
      transaction.sessionId,
      transaction.amount,
      transaction.currency,
      transaction.userId,
      transaction.contentIds && transaction.contentIds.length > 0 ? transaction.contentIds[0] : '',
      transaction.token,
      transaction.url,
      transaction.status,
      transaction.createdAt,
      transaction.updatedAt
    );
  }
}
