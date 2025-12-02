/**
 * POST /api/ai/webhook - Webhook de Meshy para notificaciones de tareas
 * 
 * Meshy envía notificaciones cuando una tarea cambia de estado.
 * Esto elimina la necesidad de polling constante.
 */
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';

// Secreto del webhook (debe coincidir con el configurado en Meshy)
const WEBHOOK_SECRET = process.env.MESHY_WEBHOOK_SECRET || '';

// Verificar firma del webhook
function verifySignature(payload: string, signature: string | null): boolean {
  if (!WEBHOOK_SECRET || !signature) {
    console.warn('⚠️ Webhook sin secreto configurado o sin firma');
    return !WEBHOOK_SECRET; // Si no hay secreto, permitir (dev mode)
  }
  
  const expectedSignature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// Mapear status de Meshy a nuestro enum
function mapStatus(meshyStatus: string): 'PENDING' | 'IN_PROGRESS' | 'SUCCEEDED' | 'FAILED' | 'CANCELED' {
  const statusMap: Record<string, 'PENDING' | 'IN_PROGRESS' | 'SUCCEEDED' | 'FAILED' | 'CANCELED'> = {
    'PENDING': 'PENDING',
    'IN_PROGRESS': 'IN_PROGRESS',
    'SUCCEEDED': 'SUCCEEDED',
    'FAILED': 'FAILED',
    'CANCELED': 'CANCELED',
    'EXPIRED': 'FAILED',
  };
  return statusMap[meshyStatus] || 'PENDING';
}

interface MeshyWebhookPayload {
  id: string;
  status: string;
  progress: number;
  model_urls?: {
    glb?: string;
    fbx?: string;
    obj?: string;
    usdz?: string;
  };
  thumbnail_url?: string;
  task_error?: {
    message: string;
  };
  created_at?: number;
  finished_at?: number;
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text();
    const signature = request.headers.get('x-meshy-signature');
    
    // Verificar firma
    if (!verifySignature(payload, signature)) {
      console.error('❌ Firma de webhook inválida');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
    
    const data: MeshyWebhookPayload = JSON.parse(payload);
    console.log('📩 Webhook recibido:', { id: data.id, status: data.status, progress: data.progress });
    
    // Buscar la generación por taskId
    const generation = await prisma.generation.findUnique({
      where: { taskId: data.id },
    });
    
    if (!generation) {
      console.warn('⚠️ Generación no encontrada para taskId:', data.id);
      // Retornar 200 para que Meshy no reintente
      return NextResponse.json({ received: true, found: false });
    }
    
    // Preparar datos de actualización
    const updateData: Record<string, unknown> = {
      status: mapStatus(data.status),
      progress: data.progress || 0,
    };
    
    // Si completó exitosamente, guardar URLs
    if (data.status === 'SUCCEEDED') {
      updateData.modelUrl = data.model_urls?.glb || null;
      updateData.thumbnailUrl = data.thumbnail_url || null;
      updateData.completedAt = new Date();
      updateData.progress = 100;
      console.log('✅ Tarea completada:', data.id);
    }
    
    // Si falló, guardar error
    if (data.status === 'FAILED' || data.status === 'EXPIRED') {
      updateData.errorMessage = data.task_error?.message || 'Error desconocido';
      updateData.completedAt = new Date();
      console.log('❌ Tarea fallida:', data.id, data.task_error?.message);
    }
    
    // Actualizar en DB
    await prisma.generation.update({
      where: { taskId: data.id },
      data: updateData,
    });
    
    return NextResponse.json({ 
      received: true, 
      updated: true,
      status: data.status,
    });
  } catch (error) {
    console.error('❌ Error procesando webhook:', error);
    // Retornar 200 para evitar reintentos innecesarios
    return NextResponse.json({ error: 'Internal error', received: true }, { status: 200 });
  }
}

// GET para verificar que el endpoint está activo
export async function GET() {
  return NextResponse.json({ 
    status: 'ok',
    message: 'Meshy webhook endpoint active',
    timestamp: new Date().toISOString(),
  });
}
