// Purchase Model - Estructura de datos para compras
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

