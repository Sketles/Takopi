import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  items: {
    model: mongoose.Types.ObjectId;
    title: string; // Snapshot del título en el momento de la compra
    price: number; // Precio pagado
    license: string; // Licencia comprada
    downloadUrl: string; // URL para descargar
  }[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
  paymentMethod: 'stripe' | 'paypal' | 'credit_card';
  paymentId?: string; // ID del pago externo
  shippingAddress?: {
    name: string;
    email: string;
    country: string;
    city: string;
    zipCode: string;
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

const OrderSchema = new Schema<IOrder>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  items: [{
    model: {
      type: Schema.Types.ObjectId,
      ref: 'Model3D',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    license: {
      type: String,
      required: true,
      enum: ['Personal', 'Indie', 'Pro']
    },
    downloadUrl: {
      type: String,
      required: true
    }
  }],
  total: {
    type: Number,
    required: [true, 'Total is required'],
    min: [0, 'Total cannot be negative']
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['stripe', 'paypal', 'credit_card'],
    required: [true, 'Payment method is required']
  },
  paymentId: {
    type: String
  },
  shippingAddress: {
    name: String,
    email: String,
    country: String,
    city: String,
    zipCode: String
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  completedAt: Date
}, {
  timestamps: true
});

// Índices para mejorar performance
OrderSchema.index({ user: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ paymentId: 1 });

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
