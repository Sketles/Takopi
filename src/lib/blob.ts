// Vercel Blob Storage Helper
// Manejo de uploads de archivos a Vercel Blob

import { put, del, list } from '@vercel/blob';

export interface UploadResult {
  url: string;
  pathname: string;
  contentType: string;
  size: number;
}

/**
 * Sube un archivo a Vercel Blob
 */
export async function uploadFile(
  file: File | Buffer,
  pathname: string,
  options?: {
    contentType?: string;
    addRandomSuffix?: boolean;
  }
): Promise<UploadResult> {
  try {
    const blob = await put(pathname, file, {
      access: 'public',
      addRandomSuffix: options?.addRandomSuffix ?? true,
      contentType: options?.contentType,
    });

    return {
      url: blob.url,
      pathname: blob.pathname,
      contentType: blob.contentType || options?.contentType || 'application/octet-stream',
      size: blob.size,
    };
  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error);
    throw new Error('Failed to upload file');
  }
}

/**
 * Sube múltiples archivos a Vercel Blob
 */
export async function uploadMultipleFiles(
  files: Array<{ file: File | Buffer; pathname: string; contentType?: string }>
): Promise<UploadResult[]> {
  const uploads = files.map(({ file, pathname, contentType }) =>
    uploadFile(file, pathname, { contentType })
  );

  return Promise.all(uploads);
}

/**
 * Elimina un archivo de Vercel Blob por URL
 */
export async function deleteFile(url: string): Promise<void> {
  try {
    await del(url);
  } catch (error) {
    console.error('Error deleting from Vercel Blob:', error);
    throw new Error('Failed to delete file');
  }
}

/**
 * Elimina múltiples archivos de Vercel Blob
 */
export async function deleteMultipleFiles(urls: string[]): Promise<void> {
  const deletions = urls.map((url) => deleteFile(url));
  await Promise.all(deletions);
}

/**
 * Lista archivos en Vercel Blob con un prefijo
 */
export async function listFiles(prefix?: string) {
  try {
    const { blobs } = await list({
      prefix: prefix,
    });

    return blobs;
  } catch (error) {
    console.error('Error listing files from Vercel Blob:', error);
    throw new Error('Failed to list files');
  }
}

/**
 * Convierte File de FormData a Buffer
 */
export async function fileToBuffer(file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Genera un pathname único para un archivo
 */
export function generatePathname(
  contentType: string,
  filename: string,
  userId?: string
): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  
  if (userId) {
    return `${contentType}/${userId}/${timestamp}-${random}-${sanitizedFilename}`;
  }
  
  return `${contentType}/${timestamp}-${random}-${sanitizedFilename}`;
}
