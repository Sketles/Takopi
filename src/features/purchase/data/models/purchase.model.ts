// Purchase Model - Estructura exacta como viene de Storage/MongoDB
export interface PurchaseModel {
  _id: string;
  userId: string;
  contentId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}

