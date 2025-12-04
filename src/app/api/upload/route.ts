import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { uploadFile, uploadMultipleFiles } from '@/lib/blob';

// Configuración para aumentar el límite de tamaño del body
export const runtime = 'nodejs';
export const maxDuration = 60; // 60 segundos para uploads grandes

// POST - Subir archivos a Vercel Blob
export async function POST(request: NextRequest) {
    try {
        // Verificar autenticación
        const auth = requireAuth(request);
        if (auth instanceof NextResponse) return auth;
        
        const decoded = auth;

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
            'modelos3d': ['model/gltf-binary', 'model/gltf+json', 'application/octet-stream', 'model/obj', 'application/zip'],
            'avatares': ['model/gltf-binary', 'model/gltf+json', 'application/octet-stream', 'model/obj', 'application/zip'],
            'texturas': ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/tiff', 'application/zip'],
            'musica': ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/ogg', 'audio/m4a', 'application/zip'],
            'animaciones': ['video/mp4', 'video/webm', 'video/ogg', 'image/gif', 'application/zip'],
            'otros': ['application/zip', 'application/pdf', 'application/octet-stream', 'text/plain']
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
        // Primero, extraer los archivos con sus nombres originales
        const filesArray = files.filter(f => f.size > 0);
        const fileMetadata = filesArray.map(file => ({
            originalName: file.name,
            file: file
        }));

        const uploadedBlobs = await uploadMultipleFiles(
            fileMetadata.map(fm => fm.file),
            `content/${contentType}`,
            decoded.userId
        );

        // Mapear los blobs subidos con sus nombres originales
        const uploadedFiles = uploadedBlobs.map((blob, index) => ({
            name: blob.pathname.split('/').pop() || blob.pathname,  // Nombre del archivo en Vercel Blob
            originalName: fileMetadata[index]?.originalName || blob.pathname,  // Nombre original del usuario
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