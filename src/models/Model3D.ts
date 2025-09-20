import mongoose, { Document, Schema } from 'mongoose';

export interface IModel3D extends Document {
  title: string;
  description: string;
  author: mongoose.Types.ObjectId;
  category: string;
  subcategory?: string;
  price: number;
  license: 'Personal' | 'Indie' | 'Pro';
  files: {
    model: string; // URL del archivo 3D
    preview: string; // URL de la imagen de vista previa
    thumbnail: string; // URL de la miniatura
    formats?: string[]; // Formatos disponibles (fbx, obj, gltf, etc.)
  };
  tags: string[];
  likes: mongoose.Types.ObjectId[]; // Usuarios que dieron like
  downloads: number;
  views: number;
  isActive: boolean;
  isFeatured: boolean;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
  polyCount?: number;
  textureCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

const Model3DSchema = new Schema<IModel3D>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Personajes', 'Vehículos', 'Arquitectura', 'Arte', 'Naturaleza', 'Tecnología', 'Gaming', 'Otros']
  },
  subcategory: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  license: {
    type: String,
    enum: ['Personal', 'Indie', 'Pro'],
    required: [true, 'License is required']
  },
  files: {
    model: {
      type: String,
      required: [true, 'Model file URL is required']
    },
    preview: {
      type: String,
      required: [true, 'Preview image URL is required']
    },
    thumbnail: {
      type: String,
      required: [true, 'Thumbnail URL is required']
    },
    formats: [{
      type: String,
      enum: ['fbx', 'obj', 'gltf', 'glb', 'dae', '3ds', 'blend']
    }]
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [20, 'Tag cannot exceed 20 characters']
  }],
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  downloads: {
    type: Number,
    default: 0,
    min: 0
  },
  views: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  dimensions: {
    width: Number,
    height: Number,
    depth: Number
  },
  polyCount: {
    type: Number,
    min: 0
  },
  textureCount: {
    type: Number,
    min: 0,
    default: 0
  }
}, {
  timestamps: true
});

// Índices para mejorar performance
Model3DSchema.index({ author: 1 });
Model3DSchema.index({ category: 1 });
Model3DSchema.index({ tags: 1 });
Model3DSchema.index({ price: 1 });
Model3DSchema.index({ createdAt: -1 });
Model3DSchema.index({ downloads: -1 });
Model3DSchema.index({ likes: -1 });

// Índice de texto para búsquedas
Model3DSchema.index({
  title: 'text',
  description: 'text',
  tags: 'text'
});

export default mongoose.models.Model3D || mongoose.model<IModel3D>('Model3D', Model3DSchema);
