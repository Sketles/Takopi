// Commit Webpay Transaction UseCase - Confirmar transacción de pago
import { WebpayTransactionEntity } from '../entities/webpay-transaction.entity';
import { IPaymentRepository } from '../repositories/payment.repository.interface';

export class CommitWebpayTransactionUseCase {
  constructor(private repository: IPaymentRepository) {}

  async execute(token: string): Promise<WebpayTransactionEntity> {
    console.log('🎯 CommitWebpayTransactionUseCase: Confirmando transacción', token);

    // Validaciones de negocio
    if (!token || token.trim().length === 0) {
      throw new Error('Token de transacción es requerido');
    }

    // Buscar transacción por token
    const transaction = await this.repository.findTransactionByToken(token);

    if (!transaction) {
      throw new Error('Transacción no encontrada');
    }

    if (!transaction.canBeCompleted()) {
      throw new Error('La transacción no puede ser completada');
    }

    // Aquí normalmente se haría la verificación con Transbank
    // Por ahora simulamos que la transacción fue exitosa
    const completedTransaction = transaction.markAsCompleted(token);

    // Actualizar en el repositorio
    const updatedTransaction = await this.repository.updateTransaction(
      transaction.id,
      {
        status: 'completed',
        token: token
      }
    );

    if (!updatedTransaction) {
      throw new Error('Error al actualizar la transacción');
    }

    console.log('✅ Transacción completada:', updatedTransaction.id);
    return updatedTransaction;
  }
}

