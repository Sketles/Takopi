import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params;
    const filePath = pathSegments.join('/');

    console.log('🔍 Files API (Clean Architecture):', filePath);

    // Construir ruta completa del archivo
    const fullPath = path.join(process.cwd(), 'public/uploads', filePath);

    // Verificar que el archivo existe
    if (!fs.existsSync(fullPath)) {
      return NextResponse.json(
        { error: 'Archivo no encontrado' },
        { status: 404 }
      );
    }

    // Verificar que es un archivo (no directorio)
    const stats = fs.statSync(fullPath);
    if (!stats.isFile()) {
      return NextResponse.json(
        { error: 'Ruta no válida' },
        { status: 400 }
      );
    }

    // En un sistema real, aquí verificarías:
    // 1. Permisos del usuario para acceder al archivo
    // 2. Si el archivo fue comprado por el usuario
    // 3. Generar enlaces temporales con tokens

    // Por ahora, leer y servir el archivo directamente
    const fileBuffer = fs.readFileSync(fullPath);
    const ext = path.extname(fullPath).toLowerCase();

    // Determinar Content-Type
    const contentTypes: { [key: string]: string } = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.mp3': 'audio/mpeg',
      '.wav': 'audio/wav',
      '.ogg': 'audio/ogg',
      '.mp4': 'video/mp4',
      '.webm': 'video/webm',
      '.glb': 'model/gltf-binary',
      '.gltf': 'model/gltf+json',
      '.obj': 'model/obj',
      '.zip': 'application/zip'
    };

    const contentType = contentTypes[ext] || 'application/octet-stream';

    console.log('✅ Archivo servido:', filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'public, max-age=3600' // Cache por 1 hora
      }
    });

  } catch (error) {
    console.error('❌ Error serving file:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
