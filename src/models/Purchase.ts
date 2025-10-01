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
}

const PurchaseSchema = new Schema<IPurchase>({
  buyer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  content: {
    type: Schema.Types.ObjectId,
    ref: 'Content',
    required: true,
    index: true
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
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
    required: true,
    index: true
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
  }
}, {
  timestamps: true
});

// Índices compuestos para optimizar consultas
PurchaseSchema.index({ buyer: 1, purchaseDate: -1 });
PurchaseSchema.index({ buyer: 1, content: 1 }, { unique: true }); // Un usuario no puede comprar el mismo contenido dos veces
PurchaseSchema.index({ seller: 1, purchaseDate: -1 });

export default mongoose.models.Purchase || mongoose.model<IPurchase>('Purchase', PurchaseSchema);
