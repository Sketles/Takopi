import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { uploadFile } from '@/lib/blob';

// POST - Subir imagen de perfil (avatar o banner) a Vercel Blob
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const auth = requireAuth(request);
    if (auth instanceof NextResponse) return auth;
    
    const decoded = auth;

    // Parsear FormData
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string; // 'users/avatars' o 'users/banners'

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No se encontró archivo para subir' },
        { status: 400 }
      );
    }

    if (!folder || !['users/avatars', 'users/banners'].includes(folder)) {
      return NextResponse.json(
        { success: false, error: 'Carpeta de destino inválida' },
        { status: 400 }
      );
    }

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Tipo de archivo no permitido. Usa JPG, PNG, GIF o WEBP' },
        { status: 400 }
      );
    }

    // Validar tamaño del archivo (10MB máximo)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'Archivo demasiado grande. Máximo 10MB' },
        { status: 400 }
      );
    }

    // Subir a Vercel Blob
    const pathname = `${folder}/${decoded.userId}/${Date.now()}-${file.name}`;
    const blob = await uploadFile(file, pathname, {
      contentType: file.type,
      addRandomSuffix: true
    });

    console.log(`✅ Imagen de perfil subida: ${blob.url}`);

    return NextResponse.json({
      success: true,
      data: {
        url: blob.url,
        pathname: blob.pathname,
        size: blob.size,
        contentType: blob.contentType
      },
      message: 'Imagen subida exitosamente'
    });

  } catch (error) {
    console.error('❌ Error uploading profile image to Vercel Blob:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor';
    return NextResponse.json(
      {
        success: false,
        error: 'Error al subir la imagen',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}
