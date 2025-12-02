/**
 * GET /api/ai/proxy?url=... - Proxy para archivos de Meshy (evitar CORS)
 * 
 * Las URLs de Meshy tienen firma CloudFront que puede causar problemas CORS
 * Este proxy descarga el archivo y lo sirve desde nuestro dominio
 */
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json({ error: 'URL requerida' }, { status: 400 });
    }

    // Validar que sea una URL de Meshy
    if (!url.includes('assets.meshy.ai')) {
      return NextResponse.json({ error: 'Solo URLs de Meshy permitidas' }, { status: 403 });
    }

    // Decodificar la URL si viene codificada
    const decodedUrl = decodeURIComponent(url);

    // Descargar el archivo
    const response = await fetch(decodedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': '*/*',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Error descargando archivo: ${response.status}` },
        { status: response.status }
      );
    }

    // Obtener el contenido
    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'application/octet-stream';

    // Devolver con headers CORS permisivos
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': buffer.byteLength.toString(),
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Cache-Control': 'public, max-age=86400', // Cache 24h
      },
    });
  } catch {
    return NextResponse.json({ error: 'Error interno del proxy' }, { status: 500 });
  }
}
