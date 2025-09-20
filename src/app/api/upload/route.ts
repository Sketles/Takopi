import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { connectToDatabase } from '@/lib/mongodb';
import jwt from 'jsonwebtoken';

// Función para verificar el token JWT
async function verifyToken(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return null;
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key') as any;
    return decoded;
  } catch (error) {
    return null;
  }
}

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

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No se proporcionó archivo' },
        { status: 400 }
      );
    }

    // Crear nombre único para el archivo
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split('.').pop();
    const fileName = `${timestamp}-${randomId}.${extension}`;

    // Convertir archivo a buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Crear directorio si no existe
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    // Guardar archivo
    const filePath = join(uploadsDir, fileName);
    await writeFile(filePath, buffer);

    // URL del archivo
    const fileUrl = `/uploads/${fileName}`;

    console.log('📁 Archivo subido:', {
      originalName: file.name,
      fileName,
      size: file.size,
      type: file.type,
      url: fileUrl
    });

    return NextResponse.json({
      success: true,
      data: {
        originalName: file.name,
        fileName,
        size: file.size,
        type: file.type,
        url: fileUrl
      }
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { success: false, error: 'Error al subir archivo' },
      { status: 500 }
    );
  }
}
