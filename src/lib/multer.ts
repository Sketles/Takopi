import multer from 'multer';
import path from 'path';
import { NextRequest } from 'next/server';

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determinar la carpeta destino según el tipo de contenido
    let uploadPath = 'public/uploads/temp'; // Por defecto

    if (file.fieldname === 'avatar' || file.fieldname === 'banner') {
      uploadPath = 'public/uploads/users';
    } else if (file.fieldname === 'coverImage') {
      uploadPath = 'public/uploads/covers';
    } else if (file.fieldname === 'files') {
      // Para archivos de contenido, necesitamos el contentType del body
      const contentType = (req as any).body?.contentType;
      if (contentType) {
        uploadPath = `public/uploads/content/${contentType}`;
      }
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generar nombre único: timestamp + random + extensión original
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const filename = `${file.fieldname}-${uniqueSuffix}${extension}`;
    cb(null, filename);
  }
});

// Filtro de tipos de archivo permitidos
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Tipos de archivo permitidos por categoría
  const allowedTypes: { [key: string]: string[] } = {
    // Música
    'musica': ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/ogg', 'audio/m4a', 'application/zip'],
    // Modelos 3D
    'modelos3d': ['model/gltf-binary', 'model/gltf+json', 'application/octet-stream', 'model/obj', 'application/zip'],
    // Texturas
    'texturas': ['image/jpeg', 'image/png', 'image/webp', 'image/tiff', 'application/zip'],
    // Avatares (modelos 3D)
    'avatares': ['model/gltf-binary', 'model/gltf+json', 'application/octet-stream', 'model/obj', 'application/zip'],
    // Animaciones
    'animaciones': ['video/mp4', 'video/webm', 'video/ogg', 'image/gif', 'application/zip'],
    // OBS
    'OBS': ['text/html', 'text/css', 'application/javascript', 'application/json', 'application/zip'],
    // Colecciones
    'colecciones': ['application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed'],
    // Usuarios (avatar/banner)
    'users': ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  };

  const contentType = req.body?.contentType;
  let allowedMimeTypes: string[] = [];

  if (file.fieldname === 'avatar' || file.fieldname === 'banner') {
    allowedMimeTypes = allowedTypes['users'];
  } else if (file.fieldname === 'coverImage') {
    allowedMimeTypes = allowedTypes['users']; // Las portadas son imágenes
  } else if (contentType && allowedTypes[contentType]) {
    allowedMimeTypes = allowedTypes[contentType];
  } else {
    // Si no se especifica tipo, permitir tipos comunes
    allowedMimeTypes = [
      'image/jpeg', 'image/png', 'image/webp', 'image/gif',
      'audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/ogg',
      'video/mp4', 'video/webm', 'video/ogg',
      'model/gltf-binary', 'model/gltf+json', 'application/octet-stream',
      'text/html', 'text/css', 'application/javascript',
      'application/zip', 'application/x-rar-compressed'
    ];
  }

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Tipo de archivo no permitido: ${file.mimetype}. Tipos permitidos: ${allowedMimeTypes.join(', ')}`));
  }
};

// Configuración de multer
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB máximo
    files: 10 // Máximo 10 archivos por request
  }
});

// Middleware para diferentes tipos de uploads
export const uploadSingle = (fieldName: string) => upload.single(fieldName);
export const uploadMultiple = (fieldName: string, maxCount: number = 10) => upload.array(fieldName, maxCount);
export const uploadFields = (fields: multer.Field[]) => upload.fields(fields);

// Función para generar URL del archivo subido
export function generateFileUrl(file: Express.Multer.File, contentType?: string): string {
  let basePath = '/uploads';

  if (file.fieldname === 'avatar' || file.fieldname === 'banner') {
    basePath += '/users';
  } else if (file.fieldname === 'coverImage') {
    basePath += '/covers';
  } else if (contentType) {
    basePath += `/content/${contentType}`;
  } else {
    basePath += '/temp';
  }

  return `${basePath}/${file.filename}`;
}

// Función para limpiar archivos temporales (async)
export async function cleanupTempFiles(files: Express.Multer.File[]) {
  const fs = require('fs/promises');
  const path = require('path');

  for (const file of files) {
    const filePath = path.join(process.cwd(), file.path);
    try {
      await fs.unlink(filePath);
      console.log(`🗑️ Archivo temporal eliminado: ${filePath}`);
    } catch (error) {
      console.error(`❌ Error eliminando archivo temporal ${filePath}:`, error);
    }
  }
}

// Función para mover archivo de temp a destino final (async)
export async function moveFileToFinalDestination(tempFile: Express.Multer.File, contentType: string) {
  const fs = require('fs/promises');
  const path = require('path');

  const tempPath = tempFile.path;
  const finalDir = path.join(process.cwd(), 'public/uploads/content', contentType);
  const finalPath = path.join(finalDir, tempFile.filename);

  try {
    // Crear directorio si no existe
    await fs.mkdir(finalDir, { recursive: true });

    // Mover archivo
    await fs.rename(tempPath, finalPath);

    // Generar nueva URL
    const newUrl = `/uploads/content/${contentType}/${tempFile.filename}`;
    console.log(`✅ Archivo movido a destino final: ${newUrl}`);

    return {
      ...tempFile,
      path: finalPath,
      url: newUrl
    };
  } catch (error) {
    console.error(`❌ Error moviendo archivo a destino final:`, error);
    throw error;
  }
}
