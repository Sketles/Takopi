import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

// API route para servir archivos estáticos de manera segura
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathArray } = await params;
    const filePath = pathArray.join('/');

    // Construir ruta completa del archivo
    const fullPath = path.join(process.cwd(), 'public/uploads', filePath);

    // Verificar que el archivo existe
    if (!fs.existsSync(fullPath)) {
      return NextResponse.json(
        { success: false, error: 'Archivo no encontrado' },
        { status: 404 }
      );
    }

    // Verificar que es un archivo (no directorio)
    const stats = fs.statSync(fullPath);
    if (!stats.isFile()) {
      return NextResponse.json(
        { success: false, error: 'No es un archivo válido' },
        { status: 400 }
      );
    }

    // Leer el archivo
    const fileBuffer = fs.readFileSync(fullPath);

    // Determinar el tipo MIME basado en la extensión
    const ext = path.extname(fullPath).toLowerCase();
    const mimeTypes: { [key: string]: string } = {
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
      '.zip': 'application/zip',
      '.rar': 'application/x-rar-compressed',
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.json': 'application/json'
    };

    const mimeType = mimeTypes[ext] || 'application/octet-stream';

    // Crear respuesta con el archivo
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': mimeType,
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000', // Cache por 1 año
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });

  } catch (error) {
    console.error('Error serving file:', error);
    return NextResponse.json(
      { success: false, error: 'Error al servir el archivo' },
      { status: 500 }
    );
  }
}
