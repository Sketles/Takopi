import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { config } from '@/config/env';
import { uploadFile, uploadMultipleFiles } from '@/lib/blob';

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

// POST - Subir archivos a Vercel Blob
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

    // Validar tipos de archivo
    const allowedTypes: { [key: string]: string[] } = {
      'musica': ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/ogg', 'audio/m4a', 'application/zip'],
      'modelos3d': ['model/gltf-binary', 'model/gltf+json', 'application/octet-stream', 'model/obj', 'application/zip'],
      'texturas': ['image/jpeg', 'image/png', 'image/webp', 'image/tiff', 'application/zip'],
      'avatares': ['model/gltf-binary', 'model/gltf+json', 'application/octet-stream', 'model/obj', 'application/zip'],
      'animaciones': ['video/mp4', 'video/webm', 'video/ogg', 'image/gif', 'application/zip'],
      'OBS': ['text/html', 'text/css', 'application/javascript', 'application/json', 'application/zip'],
      'colecciones': ['application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed']
    };

    // Validar archivos
    for (const file of files) {
      if (file.size === 0) continue;
      if (file.size > 100 * 1024 * 1024) { // 100MB
        return NextResponse.json(
          { success: false, error: `Archivo ${file.name} excede el tamaño máximo de 100MB` },
          { status: 400 }
        );
      }
      
      if (allowedTypes[contentType] && !allowedTypes[contentType].includes(file.type)) {
        return NextResponse.json(
          { success: false, error: `Tipo de archivo no permitido para ${contentType}: ${file.type}` },
          { status: 400 }
        );
      }
    }

    // Subir archivos principales a Vercel Blob
    const uploadedBlobs = await uploadMultipleFiles(
      files.filter(f => f.size > 0),
      `content/${contentType}`,
      decoded.userId
    );

    const uploadedFiles = uploadedBlobs.map(blob => ({
      name: blob.pathname.split('/').pop() || blob.pathname,
      originalName: blob.pathname,
      size: blob.size,
      type: blob.contentType || 'application/octet-stream',
      url: blob.url,
      previewUrl: blob.contentType?.startsWith('image/') ? blob.url : undefined
    }));

    console.log(`✅ ${uploadedFiles.length} archivo(s) subido(s) a Vercel Blob`);

    // Procesar imagen de portada si existe
    let coverImageUrl = null;
    if (coverImage && coverImage.size > 0) {
      const coverBlob = await uploadFile(coverImage, 'covers', decoded.userId);
      coverImageUrl = coverBlob.url;
      console.log(`✅ Portada subida: ${coverImageUrl}`);
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
    console.error('❌ Error uploading files to Vercel Blob:', error);
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