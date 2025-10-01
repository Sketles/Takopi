import mongoose, { Schema, Document } from 'mongoose';

export interface IFollow extends Document {
  follower: mongoose.Types.ObjectId; // Usuario que sigue
  following: mongoose.Types.ObjectId; // Usuario seguido
  createdAt: Date;
}

const FollowSchema = new Schema<IFollow>({
  follower: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  following: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Índice compuesto para evitar duplicados
FollowSchema.index({ follower: 1, following: 1 }, { unique: true });

// Índices para consultas eficientes
FollowSchema.index({ follower: 1 });
FollowSchema.index({ following: 1 });

const Follow = mongoose.models.Follow || mongoose.model<IFollow>('Follow', FollowSchema);

export default Follow;
