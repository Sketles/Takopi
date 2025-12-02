import { NextRequest, NextResponse } from 'next/server';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import jwt from 'jsonwebtoken';
import { config } from '@/config/env';

/**
 * API Route para Client-Side Upload a Vercel Blob
 * 
 * Este endpoint permite uploads directos desde el navegador a Vercel Blob,
 * evitando el límite de 4.5MB de las Serverless Functions.
 * 
 * Soporta archivos de hasta 500MB (límite de Vercel Blob).
 */

// Configuración para manejar uploads grandes
export const runtime = 'nodejs';
export const maxDuration = 60;

// Verificar token JWT
function verifyToken(token: string | null | undefined): { userId: string; email: string } | null {
  try {
    if (!token) return null;
    
    const decoded = jwt.verify(token, config.jwt.secret) as { userId: string; email: string };
    return decoded;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as HandleUploadBody;

    // Debug: ver estructura del body
    console.log('📦 Upload request body type:', body.type);
    console.log('📦 Body payload:', JSON.stringify(body.payload, null, 2));

    // Intentar obtener token de headers primero, luego del payload
    let token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    // Si no hay token en headers, intentar extraerlo del clientPayload
    // El clientPayload viene como string en body.payload.clientPayload
    if (!token && body.type === 'blob.generate-client-token') {
      try {
        // body.payload puede tener clientPayload directamente
        const clientPayloadStr = (body.payload as { clientPayload?: string })?.clientPayload;
        if (clientPayloadStr) {
          const payload = JSON.parse(clientPayloadStr);
          token = payload.token;
          console.log('📦 Token extraído del clientPayload');
        }
      } catch (e) {
        console.error('❌ Error parseando clientPayload:', e);
      }
    }

    const user = verifyToken(token);
    if (!user) {
      console.log('❌ Token inválido o no encontrado');
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }
    
    console.log('✅ Usuario autenticado:', user.userId);

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // Validar que el usuario puede subir a este path
        console.log(`📤 Generando token para upload: ${pathname} (user: ${user.userId})`);
        
        return {
          allowedContentTypes: [
            // Modelos 3D
            'model/gltf-binary',
            'model/gltf+json', 
            'application/octet-stream',
            'model/obj',
            // Imágenes
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/webp',
            'image/gif',
            'image/tiff',
            // Audio
            'audio/mpeg',
            'audio/wav',
            'audio/mp3',
            'audio/ogg',
            'audio/m4a',
            'audio/x-m4a',
            // Video
            'video/mp4',
            'video/webm',
            'video/ogg',
            // Archivos
            'application/zip',
            'application/x-zip-compressed',
            'application/pdf',
            'text/plain',
          ],
          maximumSizeInBytes: 500 * 1024 * 1024, // 500MB máximo
          tokenPayload: JSON.stringify({
            userId: user.userId,
            uploadedAt: new Date().toISOString(),
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Callback cuando el upload se completa
        console.log(`✅ Upload completado: ${blob.pathname}`);
        console.log(`   URL: ${blob.url}`);
        
        try {
          const payload = JSON.parse(tokenPayload || '{}');
          console.log(`   Usuario: ${payload.userId}`);
        } catch {
          // Ignorar errores de parsing
        }
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error('❌ Error en client upload:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error al procesar upload' 
      },
      { status: 500 }
    );
  }
}
