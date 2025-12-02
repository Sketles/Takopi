/**
 * Validación de archivos para uploads
 * 
 * Define tipos permitidos y mensajes de error amigables
 */

export interface FileValidationResult {
  valid: boolean;
  error?: {
    title: string;
    message: string;
    suggestion?: string;
  };
}

// Tipos de archivo permitidos por categoría
export const ALLOWED_FILE_TYPES = {
  // Imágenes para portadas y texturas
  images: {
    mimeTypes: [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/webp',
      'image/gif',
    ],
    extensions: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
    label: 'Imágenes',
    icon: '🖼️',
  },
  
  // Modelos 3D
  models3d: {
    mimeTypes: [
      'model/gltf-binary',
      'model/gltf+json',
      'application/octet-stream', // .glb, .fbx, .obj a veces se detectan así
    ],
    extensions: ['.glb', '.gltf', '.fbx', '.obj', '.stl'],
    label: 'Modelos 3D',
    icon: '🧊',
  },
  
  // Audio
  audio: {
    mimeTypes: [
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'audio/ogg',
      'audio/m4a',
      'audio/x-m4a',
      'audio/aac',
    ],
    extensions: ['.mp3', '.wav', '.ogg', '.m4a', '.aac'],
    label: 'Audio',
    icon: '🎵',
  },
  
  // Video
  video: {
    mimeTypes: [
      'video/mp4',
      'video/webm',
      'video/ogg',
      'video/quicktime',
    ],
    extensions: ['.mp4', '.webm', '.ogv', '.mov'],
    label: 'Video',
    icon: '🎬',
  },
  
  // Archivos comprimidos
  archives: {
    mimeTypes: [
      'application/zip',
      'application/x-zip-compressed',
      'application/x-rar-compressed',
      'application/x-7z-compressed',
    ],
    extensions: ['.zip', '.rar', '.7z'],
    label: 'Archivos comprimidos',
    icon: '📦',
  },
};

// Formatos NO soportados (para mensajes específicos)
export const UNSUPPORTED_FORMATS: Record<string, { name: string; alternative: string }> = {
  'image/avif': { name: 'AVIF', alternative: 'JPG, PNG o WebP' },
  'image/heic': { name: 'HEIC', alternative: 'JPG o PNG' },
  'image/heif': { name: 'HEIF', alternative: 'JPG o PNG' },
  'image/tiff': { name: 'TIFF', alternative: 'JPG, PNG o WebP' },
  'image/bmp': { name: 'BMP', alternative: 'PNG o JPG' },
  'image/svg+xml': { name: 'SVG', alternative: 'PNG o WebP' },
  'audio/flac': { name: 'FLAC', alternative: 'MP3 o WAV' },
  'video/avi': { name: 'AVI', alternative: 'MP4 o WebM' },
  'video/x-msvideo': { name: 'AVI', alternative: 'MP4 o WebM' },
  'video/x-matroska': { name: 'MKV', alternative: 'MP4 o WebM' },
};

// Tamaños máximos
export const MAX_FILE_SIZES = {
  cover: 10 * 1024 * 1024, // 10MB para portadas
  content: 500 * 1024 * 1024, // 500MB para contenido
};

/**
 * Validar archivo de portada (solo imágenes web-friendly)
 */
export function validateCoverImage(file: File): FileValidationResult {
  const { mimeTypes, extensions } = ALLOWED_FILE_TYPES.images;
  
  // Verificar si es un formato no soportado conocido
  const unsupported = UNSUPPORTED_FORMATS[file.type];
  if (unsupported) {
    return {
      valid: false,
      error: {
        title: `Formato ${unsupported.name} no soportado`,
        message: `Los archivos ${unsupported.name} no son compatibles con la web.`,
        suggestion: `Convierte tu imagen a ${unsupported.alternative}`,
      },
    };
  }
  
  // Verificar extensión del archivo
  const ext = '.' + file.name.split('.').pop()?.toLowerCase();
  const hasValidExtension = extensions.includes(ext);
  const hasValidMimeType = mimeTypes.includes(file.type);
  
  if (!hasValidExtension && !hasValidMimeType) {
    return {
      valid: false,
      error: {
        title: 'Formato de imagen no válido',
        message: `El archivo "${file.name}" no es una imagen compatible.`,
        suggestion: 'Usa JPG, PNG, WebP o GIF',
      },
    };
  }
  
  // Verificar tamaño
  if (file.size > MAX_FILE_SIZES.cover) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: {
        title: 'Imagen muy grande',
        message: `Tu imagen pesa ${sizeMB}MB (máximo 10MB).`,
        suggestion: 'Comprime la imagen o reduce su resolución',
      },
    };
  }
  
  return { valid: true };
}

/**
 * Validar archivos de contenido según el tipo de contenido
 */
export function validateContentFile(file: File, contentType: string): FileValidationResult {
  // Verificar si es un formato no soportado conocido
  const unsupported = UNSUPPORTED_FORMATS[file.type];
  if (unsupported) {
    return {
      valid: false,
      error: {
        title: `Formato ${unsupported.name} no soportado`,
        message: `Los archivos ${unsupported.name} no son compatibles.`,
        suggestion: `Convierte a ${unsupported.alternative}`,
      },
    };
  }
  
  // Obtener tipos permitidos según categoría de contenido
  const allowedTypes = getAllowedTypesForContent(contentType);
  const ext = '.' + file.name.split('.').pop()?.toLowerCase();
  
  // Verificar si el archivo es válido
  const isValidByMime = allowedTypes.some(cat => cat.mimeTypes.includes(file.type));
  const isValidByExt = allowedTypes.some(cat => cat.extensions.includes(ext));
  
  // Para archivos como .glb que pueden tener mime type genérico
  const isOctetStream = file.type === 'application/octet-stream';
  const hasKnownExtension = Object.values(ALLOWED_FILE_TYPES).some(cat => cat.extensions.includes(ext));
  
  if (!isValidByMime && !isValidByExt && !(isOctetStream && hasKnownExtension)) {
    const allowedLabels = allowedTypes.map(t => t.label).join(', ');
    const allowedExts = allowedTypes.flatMap(t => t.extensions).join(', ');
    
    return {
      valid: false,
      error: {
        title: 'Tipo de archivo no permitido',
        message: `"${file.name}" no es válido para ${contentType}.`,
        suggestion: `Formatos permitidos: ${allowedExts}`,
      },
    };
  }
  
  // Verificar tamaño
  if (file.size > MAX_FILE_SIZES.content) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(0);
    return {
      valid: false,
      error: {
        title: 'Archivo muy grande',
        message: `Tu archivo pesa ${sizeMB}MB (máximo 500MB).`,
        suggestion: 'Comprime el archivo o divídelo en partes',
      },
    };
  }
  
  return { valid: true };
}

/**
 * Obtener tipos de archivo permitidos para un tipo de contenido
 */
function getAllowedTypesForContent(contentType: string) {
  switch (contentType) {
    case 'modelos3d':
    case 'avatares':
      return [
        ALLOWED_FILE_TYPES.models3d,
        ALLOWED_FILE_TYPES.images, // Texturas incluidas
        ALLOWED_FILE_TYPES.archives, // ZIPs con assets
      ];
    case 'texturas':
      return [
        ALLOWED_FILE_TYPES.images,
        ALLOWED_FILE_TYPES.archives,
      ];
    case 'musica':
      return [
        ALLOWED_FILE_TYPES.audio,
        ALLOWED_FILE_TYPES.images, // Cover art
        ALLOWED_FILE_TYPES.archives,
      ];
    case 'animaciones':
      return [
        ALLOWED_FILE_TYPES.video,
        ALLOWED_FILE_TYPES.models3d,
        ALLOWED_FILE_TYPES.images,
        ALLOWED_FILE_TYPES.archives,
      ];
    default:
      // Para "otros" permitir casi todo
      return Object.values(ALLOWED_FILE_TYPES);
  }
}

/**
 * Validar múltiples archivos
 */
export function validateFiles(files: File[], contentType: string): {
  validFiles: File[];
  errors: Array<{ file: File; error: NonNullable<FileValidationResult['error']> }>;
} {
  const validFiles: File[] = [];
  const errors: Array<{ file: File; error: NonNullable<FileValidationResult['error']> }> = [];
  
  for (const file of files) {
    const result = validateContentFile(file, contentType);
    if (result.valid) {
      validFiles.push(file);
    } else if (result.error) {
      errors.push({ file, error: result.error });
    }
  }
  
  return { validFiles, errors };
}

/**
 * Formatear tamaño de archivo
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
}
