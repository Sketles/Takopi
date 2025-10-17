// Payment Repository Local Implementation - Usa FileStorage
import { IPaymentRepository, CreateTransactionDTO } from '../../domain/repositories/payment.repository.interface';
import { WebpayTransactionEntity } from '../../domain/entities/webpay-transaction.entity';
import { fileStorageService } from '@/shared/infrastructure/storage/file-storage.service';

export class PaymentRepositoryLocal implements IPaymentRepository {
  private collection = 'webpay_transactions';

  async createTransaction(data: CreateTransactionDTO): Promise<WebpayTransactionEntity> {
    console.log('📁 PaymentRepositoryLocal: createTransaction', data);
    
    const transactionModel = {
      _id: `webpay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      buyOrder: data.buyOrder,
      sessionId: data.sessionId,
      amount: data.amount,
      currency: data.currency,
      userId: data.userId,
      contentId: data.contentId,
      token: data.token,
      url: data.url,
      status: data.status || 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await fileStorageService.create(this.collection, transactionModel);

    return new WebpayTransactionEntity(
      transactionModel._id,
      transactionModel.buyOrder,
      transactionModel.sessionId,
      transactionModel.amount,
      transactionModel.currency,
      transactionModel.userId,
      transactionModel.contentId,
      transactionModel.token,
      transactionModel.url,
      transactionModel.status,
      new Date(transactionModel.createdAt),
      new Date(transactionModel.updatedAt)
    );
  }

  async findTransactionById(id: string): Promise<WebpayTransactionEntity | null> {
    console.log('📁 PaymentRepositoryLocal: findTransactionById', id);
    
    const transactionModel = await fileStorageService.findById(this.collection, id);
    if (!transactionModel) return null;

    return new WebpayTransactionEntity(
      transactionModel._id,
      transactionModel.buyOrder,
      transactionModel.sessionId,
      transactionModel.amount,
      transactionModel.currency,
      transactionModel.userId,
      transactionModel.contentId,
      transactionModel.token,
      transactionModel.url,
      transactionModel.status,
      new Date(transactionModel.createdAt),
      new Date(transactionModel.updatedAt)
    );
  }

  async findTransactionByToken(token: string): Promise<WebpayTransactionEntity | null> {
    console.log('📁 PaymentRepositoryLocal: findTransactionByToken', token);
    
    const transactions = await fileStorageService.find(this.collection, { token });

    if (transactions.length === 0) return null;

    const transactionModel = transactions[0];
    return new WebpayTransactionEntity(
      transactionModel._id,
      transactionModel.buyOrder,
      transactionModel.sessionId,
      transactionModel.amount,
      transactionModel.currency,
      transactionModel.userId,
      transactionModel.contentId,
      transactionModel.token,
      transactionModel.url,
      transactionModel.status,
      new Date(transactionModel.createdAt),
      new Date(transactionModel.updatedAt)
    );
  }

  async findTransactionByBuyOrder(buyOrder: string): Promise<WebpayTransactionEntity | null> {
    console.log('📁 PaymentRepositoryLocal: findTransactionByBuyOrder', buyOrder);
    
    const transactions = await fileStorageService.find(this.collection, { buyOrder });

    if (transactions.length === 0) return null;

    const transactionModel = transactions[0];
    return new WebpayTransactionEntity(
      transactionModel._id,
      transactionModel.buyOrder,
      transactionModel.sessionId,
      transactionModel.amount,
      transactionModel.currency,
      transactionModel.userId,
      transactionModel.contentId,
      transactionModel.token,
      transactionModel.url,
      transactionModel.status,
      new Date(transactionModel.createdAt),
      new Date(transactionModel.updatedAt)
    );
  }

  async updateTransaction(id: string, data: Partial<CreateTransactionDTO>): Promise<WebpayTransactionEntity | null> {
    console.log('📁 PaymentRepositoryLocal: updateTransaction', id, data);
    
    try {
      await fileStorageService.update(this.collection, id, {
        ...data,
        updatedAt: new Date().toISOString()
      });

      return await this.findTransactionById(id);
    } catch (error) {
      console.error('Error updating transaction:', error);
      return null;
    }
  }

  async deleteTransaction(id: string): Promise<boolean> {
    console.log('📁 PaymentRepositoryLocal: deleteTransaction', id);
    
    try {
      await fileStorageService.delete(this.collection, id);
      return true;
    } catch (error) {
      console.error('Error deleting transaction:', error);
      return false;
    }
  }
}

