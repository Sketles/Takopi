import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { config } from '@/config/env';

// Configuración de multer para Next.js API routes
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const contentType = (req as any).body?.contentType || 'temp';
      const uploadPath = path.join(process.cwd(), 'public/uploads/content', contentType);

      // Crear directorio si no existe
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const extension = path.extname(file.originalname);
      const filename = `${file.fieldname}-${uniqueSuffix}${extension}`;
      cb(null, filename);
    }
  }),
  fileFilter: (req, file, cb) => {
    const contentType = (req as any).body?.contentType;

    const allowedTypes: { [key: string]: string[] } = {
      'musica': ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/ogg', 'audio/m4a', 'application/zip'],
      'modelos3d': ['model/gltf-binary', 'model/gltf+json', 'application/octet-stream', 'model/obj', 'application/zip'],
      'texturas': ['image/jpeg', 'image/png', 'image/webp', 'image/tiff', 'application/zip'],
      'avatares': ['model/gltf-binary', 'model/gltf+json', 'application/octet-stream', 'model/obj', 'application/zip'],
      'animaciones': ['video/mp4', 'video/webm', 'video/ogg', 'image/gif', 'application/zip'],
      'OBS': ['text/html', 'text/css', 'application/javascript', 'application/json', 'application/zip'],
      'colecciones': ['application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed']
    };

    if (contentType && allowedTypes[contentType]) {
      if (allowedTypes[contentType].includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error(`Tipo de archivo no permitido para ${contentType}: ${file.mimetype}`));
      }
    } else {
      cb(null, true);
    }
  },
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
    files: 10
  }
});

// Función para verificar token JWT
async function verifyToken(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return null;

    const decoded = jwt.verify(token, config.jwt.secret) as any;
    return decoded;
  } catch (error) {
    console.error('Error verificando token:', error);
    return null;
  }
}

// Función para parsear multipart form data
function parseMultipartFormData(request: NextRequest): Promise<any> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();

    // Este es un middleware simplificado para Next.js
    // En producción, usarías una librería como busboy
    resolve({ files: [], fields: {} });
  });
}

// POST - Subir archivos
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const decoded = await verifyToken(request);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Token inválido o expirado' },
        { status: 401 }
      );
    }

    // Parsear FormData
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const contentType = formData.get('contentType') as string;
    const coverImage = formData.get('coverImage') as File | null;

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No se encontraron archivos para subir' },
        { status: 400 }
      );
    }

    if (!contentType) {
      return NextResponse.json(
        { success: false, error: 'El tipo de contenido es requerido' },
        { status: 400 }
      );
    }

    // Crear directorio de destino
    const uploadDir = path.join(process.cwd(), 'public/uploads/content', contentType);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uploadedFiles: any[] = [];

    // Procesar archivos principales
    for (const file of files) {
      if (file.size === 0) continue;

      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const extension = path.extname(file.name);
      const filename = `file-${uniqueSuffix}${extension}`;
      const filePath = path.join(uploadDir, filename);

      // Convertir File a Buffer y escribir
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      fs.writeFileSync(filePath, buffer);

      const uploadedFile = {
        name: filename,
        originalName: file.name,
        size: file.size,
        type: file.type,
        url: `/uploads/content/${contentType}/${filename}`,
        previewUrl: file.type.startsWith('image/') ? `/uploads/content/${contentType}/${filename}` : undefined
      };

      uploadedFiles.push(uploadedFile);
      console.log(`✅ Archivo subido: ${uploadedFile.url}`);
    }

    // Procesar imagen de portada si existe
    let coverImageUrl = null;
    if (coverImage && coverImage.size > 0) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const extension = path.extname(coverImage.name);
      const filename = `cover-${uniqueSuffix}${extension}`;
      const coverDir = path.join(process.cwd(), 'public/uploads/covers');

      if (!fs.existsSync(coverDir)) {
        fs.mkdirSync(coverDir, { recursive: true });
      }

      const filePath = path.join(coverDir, filename);
      const bytes = await coverImage.arrayBuffer();
      const buffer = Buffer.from(bytes);

      fs.writeFileSync(filePath, buffer);
      coverImageUrl = `/uploads/covers/${filename}`;

    }


    return NextResponse.json({
      success: true,
      data: {
        files: uploadedFiles,
        coverImage: coverImageUrl,
        contentType,
        uploadedBy: decoded.userId
      },
      message: `${uploadedFiles.length} archivo(s) subido(s) exitosamente`
    });

  } catch (error) {
    console.error('Error uploading files:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor';
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al subir archivos',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}

// GET - Obtener información de archivos subidos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const contentType = searchParams.get('type');
    const author = searchParams.get('author');

    if (!contentType) {
      return NextResponse.json(
        { success: false, error: 'El tipo de contenido es requerido' },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), 'public/uploads/content', contentType);

    if (!fs.existsSync(uploadDir)) {
      return NextResponse.json({
        success: true,
        data: { files: [] },
        message: 'No hay archivos en este directorio'
      });
    }

    const files = fs.readdirSync(uploadDir);
    const fileList = files.map(filename => {
      const filePath = path.join(uploadDir, filename);
      const stats = fs.statSync(filePath);

      return {
        name: filename,
        size: stats.size,
        url: `/uploads/content/${contentType}/${filename}`,
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime
      };
    });

    return NextResponse.json({
      success: true,
      data: { files: fileList },
      message: `${fileList.length} archivo(s) encontrado(s)`
    });

  } catch (error) {
    console.error('Error getting files:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener archivos' },
      { status: 500 }
    );
  }
}