// Webpay Transaction Entity - Entidad para transacciones de pago
export class WebpayTransactionEntity {
  constructor(
    public readonly id: string,
    public readonly buyOrder: string,
    public readonly sessionId: string,
    public readonly amount: number,
    public readonly currency: string,
    public readonly userId: string,
    public readonly contentId: string,
    public readonly token?: string,
    public readonly url?: string,
    public readonly status: string = 'pending',
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {}

  // Lógica de negocio
  get isPending(): boolean {
    return this.status === 'pending';
  }

  get isCompleted(): boolean {
    return this.status === 'completed';
  }

  get isFailed(): boolean {
    return this.status === 'failed';
  }

  get isCancelled(): boolean {
    return this.status === 'cancelled';
  }

  get formattedAmount(): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: this.currency
    }).format(this.amount);
  }

  get isValid(): boolean {
    return this.amount > 0 && 
           this.userId && 
           this.contentId && 
           this.buyOrder && 
           this.sessionId;
  }

  canBeCompleted(): boolean {
    return this.isPending && this.token;
  }

  markAsCompleted(token?: string): WebpayTransactionEntity {
    return new WebpayTransactionEntity(
      this.id,
      this.buyOrder,
      this.sessionId,
      this.amount,
      this.currency,
      this.userId,
      this.contentId,
      token || this.token,
      this.url,
      'completed',
      this.createdAt,
      new Date()
    );
  }

  markAsFailed(): WebpayTransactionEntity {
    return new WebpayTransactionEntity(
      this.id,
      this.buyOrder,
      this.sessionId,
      this.amount,
      this.currency,
      this.userId,
      this.contentId,
      this.token,
      this.url,
      'failed',
      this.createdAt,
      new Date()
    );
  }
}

