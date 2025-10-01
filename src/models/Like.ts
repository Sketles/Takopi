import mongoose, { Schema, Document } from 'mongoose';

export interface ILike extends Document {
  user: mongoose.Types.ObjectId;
  content: mongoose.Types.ObjectId;
  createdAt: Date;
}

const LikeSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  content: {
    type: Schema.Types.ObjectId,
    ref: 'Content',
    required: true,
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Índice único para evitar likes duplicados
LikeSchema.index({ user: 1, content: 1 }, { unique: true });

// Índice para consultas rápidas
LikeSchema.index({ content: 1 });
LikeSchema.index({ user: 1 });

const Like = mongoose.models.Like || mongoose.model<ILike>('Like', LikeSchema);

export default Like;
