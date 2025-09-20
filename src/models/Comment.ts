import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
  user: mongoose.Types.ObjectId;
  model: mongoose.Types.ObjectId;
  content: string;
  rating?: number; // Rating de 1-5 estrellas
  likes: mongoose.Types.ObjectId[]; // Usuarios que dieron like al comentario
  parentComment?: mongoose.Types.ObjectId; // Para respuestas a comentarios
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  model: {
    type: Schema.Types.ObjectId,
    ref: 'Model3D',
    required: [true, 'Model is required']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true,
    maxlength: [500, 'Comment cannot exceed 500 characters']
  },
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
    validate: {
      validator: Number.isInteger,
      message: 'Rating must be an integer'
    }
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  parentComment: {
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Índices para mejorar performance
CommentSchema.index({ model: 1, createdAt: -1 });
CommentSchema.index({ user: 1 });
CommentSchema.index({ parentComment: 1 });
CommentSchema.index({ rating: -1 });

export default mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);
