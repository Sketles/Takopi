import mongoose, { Document, Schema } from 'mongoose';

export interface IPurchase extends Document {
  buyer: mongoose.Types.ObjectId;
  content: mongoose.Types.ObjectId;
  seller: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  purchaseDate: Date;
  downloadCount: number;
  lastDownloadDate?: Date;
  status: 'completed' | 'pending' | 'refunded';
  transactionId?: string;
  // Campos específicos de Webpay
  webpayToken?: string;
  webpayBuyOrder?: string;
  webpaySessionId?: string;
  authorizationCode?: string;
  paymentTypeCode?: string;
  responseCode?: number;
  installmentsNumber?: number;
  transactionDate?: string;
  accountingDate?: string;
  vci?: string;
}

const PurchaseSchema = new Schema<IPurchase>({
  buyer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: Schema.Types.ObjectId,
    ref: 'Content',
    required: true
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'CLP',
    required: true
  },
  purchaseDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  downloadCount: {
    type: Number,
    default: 0,
    min: 0
  },
  lastDownloadDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['completed', 'pending', 'refunded'],
    default: 'completed',
    required: true
  },
  transactionId: {
    type: String,
    sparse: true
  },
  // Campos específicos de Webpay
  webpayToken: {
    type: String
  },
  webpayBuyOrder: {
    type: String
  },
  webpaySessionId: {
    type: String
  },
  authorizationCode: {
    type: String
  },
  paymentTypeCode: {
    type: String
  },
  responseCode: {
    type: Number
  },
  installmentsNumber: {
    type: Number
  },
  transactionDate: {
    type: String
  },
  accountingDate: {
    type: String
  },
  vci: {
    type: String
  }
}, {
  timestamps: true
});

// Índices compuestos para optimizar consultas
PurchaseSchema.index({ buyer: 1, purchaseDate: -1 });
PurchaseSchema.index({ buyer: 1, content: 1 }, { unique: true }); // Un usuario no puede comprar el mismo contenido dos veces
PurchaseSchema.index({ seller: 1, purchaseDate: -1 });

export default mongoose.models.Purchase || mongoose.model<IPurchase>('Purchase', PurchaseSchema);
