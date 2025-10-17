// Purchase Entity - Entidad de compra con lógica de negocio
export class PurchaseEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly contentId: string,
    public readonly amount: number,
    public readonly currency: string,
    public readonly paymentMethod: string,
    public readonly status: 'pending' | 'completed' | 'failed' | 'refunded',
    public readonly transactionId?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {}

  // Lógica de negocio
  get isCompleted(): boolean {
    return this.status === 'completed';
  }

  get isPending(): boolean {
    return this.status === 'pending';
  }

  get isFailed(): boolean {
    return this.status === 'failed';
  }

  get displayAmount(): string {
    return `${this.currency} ${this.amount.toLocaleString()}`;
  }

  get displayStatus(): string {
    const statusMap = {
      pending: 'Pendiente',
      completed: 'Completada',
      failed: 'Fallida',
      refunded: 'Reembolsada'
    };
    return statusMap[this.status] || this.status;
  }

  canBeRefunded(): boolean {
    return this.isCompleted && this.createdAt 
      ? (Date.now() - this.createdAt.getTime()) < 30 * 24 * 60 * 60 * 1000 // 30 días
      : false;
  }
}

