import mongoose, { Document, Schema } from 'mongoose';

// Interfaz para los archivos subidos
export interface IContentFile {
  name: string;
  originalName: string;
  size: number;
  type: string;
  url: string; // URL donde se almacena el archivo
  previewUrl?: string; // URL de preview (para imágenes/videos)
}


// Interfaz principal del contenido
export interface IContent extends Document {
  // Información básica
  title: string;
  provisionalName?: string; // Nombre temporal usado durante la creación
  description: string;
  shortDescription?: string;

  // Metadatos
  contentType: 'avatares' | 'modelos3d' | 'musica' | 'texturas' | 'animaciones' | 'OBS' | 'colecciones';
  category: string;
  subcategory?: string;

  // Archivos
  files: IContentFile[];
  coverImage?: string; // URL de la imagen de portada
  additionalImages?: string[]; // URLs de imágenes adicionales

  // Precio y monetización
  price: number;
  isFree: boolean;
  currency: string; // CLP, USD, etc.

  // Licencia
  license: 'personal' | 'commercial' | 'streaming' | 'royalty-free' | 'custom';
  customLicense?: string;

  // Etiquetas y categorización
  tags: string[];
  customTags: string[];

  // Configuración de publicación
  visibility: 'public' | 'unlisted' | 'draft';
  allowTips: boolean;
  allowCommissions: boolean;


  // Información del autor
  author: mongoose.Types.ObjectId; // Referencia al usuario
  authorUsername: string; // Cache del username para consultas rápidas

  // Estadísticas
  views: number;
  downloads: number;
  likes: number;
  favorites: number;

  // Fechas
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;

  // Estado
  status: 'draft' | 'published' | 'archived' | 'rejected';

  // Moderación
  moderated: boolean;
  moderatedAt?: Date;
  moderatedBy?: mongoose.Types.ObjectId;
  moderationNotes?: string;
}

// Esquema de archivos
const ContentFileSchema = new Schema<IContentFile>({
  name: { type: String, required: true },
  originalName: { type: String, required: true },
  size: { type: Number, required: true },
  type: { type: String, required: true },
  url: { type: String, required: true },
  previewUrl: { type: String }
}, { _id: false });


// Esquema principal
const ContentSchema = new Schema<IContent>({
  // Información básica
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  provisionalName: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  shortDescription: {
    type: String,
    trim: true,
    maxlength: 500
  },

  // Metadatos
  contentType: {
    type: String,
    required: true,
    enum: ['avatares', 'modelos3d', 'musica', 'texturas', 'animaciones', 'OBS', 'colecciones']
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  subcategory: {
    type: String,
    trim: true
  },

  // Archivos
  files: [ContentFileSchema],
  coverImage: {
    type: String
  },
  additionalImages: [{
    type: String
  }],

  // Precio y monetización
  price: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  isFree: {
    type: Boolean,
    required: true,
    default: true
  },
  currency: {
    type: String,
    required: true,
    default: 'CLP'
  },

  // Licencia
  license: {
    type: String,
    required: true,
    enum: ['personal', 'commercial', 'streaming', 'royalty-free', 'custom'],
    default: 'personal'
  },
  customLicense: {
    type: String,
    trim: true
  },

  // Etiquetas
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  customTags: [{
    type: String,
    trim: true,
    lowercase: true
  }],

  // Configuración de publicación
  visibility: {
    type: String,
    required: true,
    enum: ['public', 'unlisted', 'draft'],
    default: 'public'
  },
  allowTips: {
    type: Boolean,
    default: false
  },
  allowCommissions: {
    type: Boolean,
    default: false
  },


  // Autor
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  authorUsername: {
    type: String,
    required: true,
    trim: true
  },

  // Estadísticas
  views: {
    type: Number,
    default: 0
  },
  downloads: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  favorites: {
    type: Number,
    default: 0
  },

  // Estado
  status: {
    type: String,
    required: true,
    enum: ['draft', 'published', 'archived', 'rejected'],
    default: 'draft'
  },

  // Moderación
  moderated: {
    type: Boolean,
    default: false
  },
  moderatedAt: {
    type: Date
  },
  moderatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  moderationNotes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true, // createdAt y updatedAt automáticos
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para optimizar consultas
ContentSchema.index({ author: 1, status: 1 });
ContentSchema.index({ contentType: 1, status: 1 });
ContentSchema.index({ category: 1, subcategory: 1 });
ContentSchema.index({ tags: 1 });
ContentSchema.index({ price: 1, isFree: 1 });
ContentSchema.index({ createdAt: -1 });
ContentSchema.index({ views: -1 });
ContentSchema.index({ likes: -1 });

// Virtual para obtener todas las etiquetas combinadas
ContentSchema.virtual('allTags').get(function () {
  return [...this.tags, ...this.customTags];
});

// Virtual para determinar si está publicado
ContentSchema.virtual('isPublished').get(function () {
  return this.status === 'published' && this.visibility === 'public';
});

// Virtual para precio formateado
ContentSchema.virtual('formattedPrice').get(function () {
  if (this.isFree) {
    return 'Gratis';
  }
  return `${this.price.toLocaleString('es-CL')} ${this.currency}`;
});

// Middleware para actualizar publishedAt cuando se publica
ContentSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Middleware para actualizar authorUsername cuando se guarda
ContentSchema.pre('save', async function (next) {
  if (this.isModified('author') && !this.authorUsername) {
    try {
      const User = mongoose.model('User');
      const user = await User.findById(this.author).select('username');
      if (user) {
        this.authorUsername = user.username;
      }
    } catch (error) {
      console.error('Error updating authorUsername:', error);
    }
  }
  next();
});

export default mongoose.models.Content || mongoose.model<IContent>('Content', ContentSchema);
