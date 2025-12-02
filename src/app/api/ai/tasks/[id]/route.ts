/**
 * GET /api/ai/tasks/[id] - Obtener y actualizar estado de una generación
 * DELETE /api/ai/tasks/[id] - Eliminar generación
 */
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import { config } from '@/config/env';
import { meshy, MeshyError, TaskType } from '@/lib/meshy';
import { put, del } from '@vercel/blob';

function verifyAuth(request: NextRequest): { userId: string } | null {
  const auth = request.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  
  try {
    return jwt.verify(auth.slice(7), config.jwt.secret) as { userId: string };
  } catch {
    return null;
  }
}

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * Descarga un archivo de Meshy y lo sube a Vercel Blob (persistencia permanente)
 * Solo guardamos GLB (modelo completo con texturas) y thumbnail
 */
async function persistToBlob(
  url: string, 
  userId: string, 
  taskId: string, 
  type: 'model' | 'thumbnail',
  retries = 2
): Promise<string | null> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, { 
        signal: AbortSignal.timeout(60000)
      });
      
      if (!response.ok) {
        console.error(`❌ persistToBlob: Error descargando ${type}:`, response.status);
        if (attempt === retries) return null;
        continue;
      }
      
      const buffer = await response.arrayBuffer();
      const extension = type === 'model' ? 'glb' : 'png';
      const contentType = type === 'model' ? 'model/gltf-binary' : 'image/png';
      const pathname = `ai-generations/${userId}/${taskId}/${type}.${extension}`;
      
      const blob = await put(pathname, Buffer.from(buffer), {
        access: 'public',
        addRandomSuffix: false,
        contentType,
      });
      
      console.log(`✅ persistToBlob: ${type} guardado en Blob`);
      return blob.url;
      
    } catch (err) {
      console.error(`❌ persistToBlob: Error en intento ${attempt}/${retries}:`, err);
      if (attempt === retries) return null;
      await new Promise(r => setTimeout(r, 2000));
    }
  }
  return null;
}

// GET - Obtener estado (sincroniza con Meshy si está en progreso)
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const user = verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await context.params;

    // Buscar en nuestra DB
    const generation = await prisma.generation.findUnique({
      where: { id },
    }) as any;

    if (!generation) {
      return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
    }

    if (generation.userId !== user.userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    // Si ya terminó con éxito, verificar si ya tiene URLs de Blob (permanentes)
    if (generation.status === 'SUCCEEDED') {
      const hasBlobUrls = generation.modelUrl?.includes('blob.vercel-storage.com') ||
                          generation.modelUrl?.includes('public.blob.vercel-storage.com');
      
      if (hasBlobUrls) {
        return NextResponse.json({
          id: generation.id,
          taskId: generation.taskId,
          taskType: generation.taskType,
          status: generation.status,
          progress: generation.progress,
          prompt: generation.prompt,
          modelUrl: generation.modelUrl,
          thumbnailUrl: generation.thumbnailUrl,
          artStyle: generation.artStyle,
          aiModel: generation.aiModel,
          errorMessage: generation.errorMessage,
          createdAt: generation.createdAt,
          completedAt: generation.completedAt,
          mode: generation.mode,
          enablePbr: generation.enablePbr,
          texturePrompt: generation.texturePrompt,
          previewTaskId: generation.previewTaskId,
          hasTextures: true,
        });
      }
      
      // URLs de Meshy (antiguas) - migrar a Blob
      try {
        const taskType = generation.taskType === 'text-to-3d-refine' ? 'text-to-3d' : generation.taskType;
        const task = await meshy.getTask(generation.taskId, taskType as TaskType);
        
        // Persistir en Blob
        let finalModelUrl = generation.modelUrl;
        let finalThumbUrl = generation.thumbnailUrl;
        
        if (task.model_urls?.glb) {
          const blobModelUrl = await persistToBlob(
            task.model_urls.glb, 
            generation.userId, 
            generation.taskId, 
            'model'
          );
          if (blobModelUrl) {
            finalModelUrl = blobModelUrl;
          }
        }
        
        if (task.thumbnail_url) {
          const blobThumbUrl = await persistToBlob(
            task.thumbnail_url, 
            generation.userId, 
            generation.taskId, 
            'thumbnail'
          );
          if (blobThumbUrl) {
            finalThumbUrl = blobThumbUrl;
          }
        }
        
        // Actualizar en DB con URLs de Blob
        if (finalModelUrl !== generation.modelUrl || finalThumbUrl !== generation.thumbnailUrl) {
          await prisma.generation.update({
            where: { id: generation.id },
            data: {
              modelUrl: finalModelUrl,
              thumbnailUrl: finalThumbUrl,
            },
          });
        }
        
        // Determinar si tiene texturas
        const hasTextures = generation.mode === 'refine' || 
          generation.taskType === 'text-to-3d-refine' || 
          (generation.taskType === 'image-to-3d') ||
          (task.texture_urls && task.texture_urls.length > 0);
        
        return NextResponse.json({
          id: generation.id,
          taskId: generation.taskId,
          taskType: generation.taskType,
          status: generation.status,
          progress: generation.progress,
          prompt: generation.prompt,
          modelUrl: finalModelUrl,
          thumbnailUrl: finalThumbUrl,
          artStyle: generation.artStyle,
          aiModel: generation.aiModel,
          errorMessage: generation.errorMessage,
          createdAt: generation.createdAt,
          completedAt: generation.completedAt,
          mode: generation.mode,
          enablePbr: generation.enablePbr,
          texturePrompt: generation.texturePrompt,
          previewTaskId: generation.previewTaskId,
          hasTextures,
        });
      } catch (error) {
        console.error('⚠️ Error obteniendo URLs frescas de Meshy:', error);
        // Fallback a URLs guardadas (pueden no funcionar)
        return NextResponse.json({
          id: generation.id,
          taskId: generation.taskId,
          taskType: generation.taskType,
          status: generation.status,
          progress: generation.progress,
          prompt: generation.prompt,
          modelUrl: generation.modelUrl,
          thumbnailUrl: generation.thumbnailUrl,
          artStyle: generation.artStyle,
          aiModel: generation.aiModel,
          errorMessage: generation.errorMessage,
          createdAt: generation.createdAt,
          completedAt: generation.completedAt,
          mode: generation.mode,
          enablePbr: generation.enablePbr,
          hasTextures: generation.hasTextures,
        });
      }
    }

    // Si falló o fue cancelado, devolver directo
    if (['FAILED', 'CANCELED'].includes(generation.status)) {
      return NextResponse.json({
        id: generation.id,
        taskId: generation.taskId,
        taskType: generation.taskType,
        status: generation.status,
        progress: generation.progress,
        prompt: generation.prompt,
        modelUrl: generation.modelUrl,
        thumbnailUrl: generation.thumbnailUrl,
        artStyle: generation.artStyle,
        aiModel: generation.aiModel,
        errorMessage: generation.errorMessage,
        createdAt: generation.createdAt,
        completedAt: generation.completedAt,
      });
    }

    // Sincronizar con Meshy
    try {
      // text-to-3d-refine usa el mismo endpoint que text-to-3d en Meshy
      const meshyTaskType = generation.taskType === 'text-to-3d-refine' ? 'text-to-3d' : generation.taskType;
      const task = await meshy.getTask(generation.taskId, meshyTaskType as TaskType);
      
      // Actualizar estado local
      const updateData: Record<string, unknown> = {
        status: task.status,
        progress: task.progress,
      };

      // Si completó, PERSISTIR EN BLOB y guardar URLs permanentes
      if (task.status === 'SUCCEEDED') {
        console.log('🎉 Task SUCCEEDED, persistiendo en Blob...');
        console.log('📦 GLB URL:', task.model_urls?.glb?.substring(0, 80));
        
        // Persistir modelo GLB (contiene modelo + texturas en un solo archivo)
        if (task.model_urls?.glb) {
          const blobModelUrl = await persistToBlob(
            task.model_urls.glb, 
            generation.userId, 
            generation.taskId, 
            'model'
          );
          
          if (blobModelUrl) {
            updateData.modelUrl = blobModelUrl;
          } else {
            updateData.modelUrl = task.model_urls.glb;
          }
        }
        
        // Persistir thumbnail
        if (task.thumbnail_url) {
          const blobThumbUrl = await persistToBlob(
            task.thumbnail_url, 
            generation.userId, 
            generation.taskId, 
            'thumbnail'
          );
          
          if (blobThumbUrl) {
            updateData.thumbnailUrl = blobThumbUrl;
          } else {
            updateData.thumbnailUrl = task.thumbnail_url;
          }
        }
        
        updateData.completedAt = new Date();
      }

      // Si falló, guardar mensaje de error
      if (task.status === 'FAILED') {
        updateData.errorMessage = task.task_error?.message || 'Error desconocido';
      }

      const updated = await prisma.generation.update({
        where: { id },
        data: updateData,
      });

      return NextResponse.json({
        id: updated.id,
        taskId: updated.taskId,
        taskType: updated.taskType,
        status: updated.status,
        progress: updated.progress,
        prompt: updated.prompt,
        modelUrl: updated.modelUrl,
        thumbnailUrl: updated.thumbnailUrl,
        artStyle: updated.artStyle,
        aiModel: (updated as any).aiModel,
        errorMessage: updated.errorMessage,
        createdAt: updated.createdAt,
        completedAt: updated.completedAt,
        // Campos necesarios para auto-refine
        mode: (updated as any).mode,
        enablePbr: (updated as any).enablePbr,
        texturePrompt: (updated as any).texturePrompt,
        previewTaskId: (updated as any).previewTaskId,
      });
    } catch (meshyError) {
      console.error('⚠️ Error sincronizando con Meshy:', meshyError);
      
      // Devolver último estado conocido
      return NextResponse.json({
        id: generation.id,
        taskId: generation.taskId,
        taskType: generation.taskType,
        status: generation.status,
        progress: generation.progress,
        prompt: generation.prompt,
        modelUrl: generation.modelUrl,
        thumbnailUrl: generation.thumbnailUrl,
        artStyle: generation.artStyle,
        aiModel: generation.aiModel,
        createdAt: generation.createdAt,
        // Campos necesarios para auto-refine
        mode: generation.mode,
        enablePbr: generation.enablePbr,
        texturePrompt: generation.texturePrompt,
        previewTaskId: generation.previewTaskId,
        _syncError: 'Error temporal al sincronizar',
      });
    }
  } catch (error) {
    console.error('❌ Error obteniendo tarea:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

// DELETE - Eliminar generación
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const user = verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await context.params;

    const generation = await prisma.generation.findUnique({
      where: { id },
    });

    if (!generation) {
      return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
    }

    if (generation.userId !== user.userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    // 1. Eliminar archivos de Vercel Blob
    const blobUrls: string[] = [];
    if (generation.modelUrl?.includes('blob.vercel-storage.com')) {
      blobUrls.push(generation.modelUrl);
    }
    if (generation.thumbnailUrl?.includes('blob.vercel-storage.com')) {
      blobUrls.push(generation.thumbnailUrl);
    }

    for (const url of blobUrls) {
      try {
        await del(url);
      } catch {
        // Continuar aunque falle
      }
    }

    // 2. Eliminar en Meshy (ignorar errores)
    try {
      const meshyTaskType = generation.taskType === 'text-to-3d-refine' ? 'text-to-3d' : generation.taskType;
      await meshy.deleteTask(generation.taskId, meshyTaskType as TaskType);
    } catch {
      // Puede que ya no exista en Meshy
    }

    // 3. Eliminar de nuestra DB
    await prisma.generation.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof MeshyError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
