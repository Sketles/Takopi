// Payment Repository Factory
import { IPaymentRepository } from '../../domain/repositories/payment.repository.interface';
import { PaymentRepositoryLocal } from './payment.repository.local';

export function createPaymentRepository(): IPaymentRepository {
  return new PaymentRepositoryLocal();
}

