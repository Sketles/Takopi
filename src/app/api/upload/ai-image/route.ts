import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { uploadFile } from '@/lib/blob';

/**
 * API Route para subir imágenes para generación IA (Image-to-3D)
 * Acepta FormData con un archivo de imagen
 */

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const auth = requireAuth(request);
    if (auth instanceof NextResponse) return auth;
    
    const decoded = auth;

    // Parsear FormData
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No se encontró archivo para subir' },
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
        { success: false, error: 'El archivo excede el tamaño máximo de 10MB' },
        { status: 400 }
      );
    }

    console.log(`📤 Subiendo imagen para IA: ${file.name} (${(file.size / 1024).toFixed(1)}KB)`);

    // Subir a Vercel Blob
    const result = await uploadFile(file, 'ai-generations');

    console.log(`✅ Imagen subida: ${result.url}`);

    return NextResponse.json({
      success: true,
      url: result.url,
      filename: file.name,
      size: file.size,
    });

  } catch (error) {
    console.error('❌ Error subiendo imagen para IA:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error al subir imagen' 
      },
      { status: 500 }
    );
  }
}