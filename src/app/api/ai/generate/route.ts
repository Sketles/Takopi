/**
 * POST /api/ai/generate - Crear nueva generación
 * GET /api/ai/generate - Listar generaciones del usuario
 */
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import { config } from '@/config/env';
import { meshy, MeshyError } from '@/lib/meshy';

// Verificar JWT
function verifyAuth(request: NextRequest): { userId: string } | null {
  const auth = request.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  
  try {
    return jwt.verify(auth.slice(7), config.jwt.secret) as { userId: string };
  } catch {
    return null;
  }
}

// POST - Crear generación
export async function POST(request: NextRequest) {
  try {
    const user = verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      type = 'text-to-3d', 
      prompt, 
      imageUrl, 
      artStyle, 
      aiModel,
      // Nuevos campos para texturas
      enablePbr,
      texturePrompt,
      previewTaskId,
    } = body;

    // Validación básica
    if (type === 'text-to-3d' && !prompt) {
      return NextResponse.json({ error: 'Se requiere un prompt' }, { status: 400 });
    }
    if (type === 'image-to-3d' && !imageUrl) {
      return NextResponse.json({ error: 'Se requiere una imagen' }, { status: 400 });
    }
    if (type === 'text-to-3d-refine' && !previewTaskId) {
      return NextResponse.json({ error: 'Se requiere previewTaskId para refine' }, { status: 400 });
    }

    let taskId: string;
    let creditsEstimate = 20;
    let mode: 'preview' | 'refine' = 'preview';

    // Crear tarea en Meshy según el tipo
    if (type === 'text-to-3d') {
      taskId = await meshy.textTo3D.createPreview({
        prompt,
        art_style: artStyle || 'realistic',
        ai_model: aiModel || 'latest',
      });
      creditsEstimate = aiModel === 'latest' ? 20 : 5;
      mode = 'preview';
    } else if (type === 'text-to-3d-refine') {
      // Refine: aplicar texturas a un preview existente
      taskId = await meshy.textTo3D.createRefine({
        preview_task_id: previewTaskId,
        enable_pbr: enablePbr ?? true,
        texture_prompt: texturePrompt,
        ai_model: aiModel || 'latest',
      });
      creditsEstimate = 10;
      mode = 'refine';
    } else if (type === 'image-to-3d') {
      taskId = await meshy.imageTo3D.create({
        image_url: imageUrl,
        ai_model: aiModel || 'latest',
        should_texture: true,
        enable_pbr: enablePbr ?? false,
        texture_prompt: texturePrompt,
      });
      creditsEstimate = enablePbr ? 35 : 30;
    } else {
      return NextResponse.json({ error: 'Tipo no soportado' }, { status: 400 });
    }

    // Guardar en DB
    const generation = await prisma.generation.create({
      data: {
        userId: user.userId,
        taskId,
        taskType: type,
        prompt: prompt || null,
        imageUrl: imageUrl || null,
        artStyle: artStyle || 'realistic',
        aiModel: aiModel || 'latest',
        creditsUsed: creditsEstimate,
        status: 'PENDING',
        mode,
        enablePbr: enablePbr ?? (type === 'text-to-3d-refine'),
        texturePrompt: texturePrompt || null,
        previewTaskId: previewTaskId || null,
      } as any,
    });

    return NextResponse.json({
      id: generation.id,
      taskId: generation.taskId,
      status: generation.status,
    });
  } catch (error) {
    console.error('❌ Error creando generación:', error);
    
    if (error instanceof MeshyError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

// GET - Listar generaciones del usuario
export async function GET(request: NextRequest) {
  try {
    const user = verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);

    const generations = await prisma.generation.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    }) as any[];

    return NextResponse.json(generations);
  } catch (error) {
    console.error('❌ Error listando generaciones:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
