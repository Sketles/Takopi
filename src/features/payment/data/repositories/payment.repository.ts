// Payment Repository Factory
import { IPaymentRepository } from '../../domain/repositories/payment.repository.interface';
import { PaymentRepositoryPrisma } from './payment.repository.prisma';

export function createPaymentRepository(): IPaymentRepository {
  return new PaymentRepositoryPrisma();
}

