import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    // Verificar autenticación
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    const userId = authResult.userId;

    // Obtener generaciones del usuario
    const generations = await prisma.generation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        taskId: true,
        taskType: true,
        prompt: true,
        imageUrl: true,
        status: true,
        progress: true,
        modelUrl: true,
        thumbnailUrl: true,
        artStyle: true,
        aiModel: true,
        creditsUsed: true,
        errorMessage: true,
        createdAt: true,
        completedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: generations,
      total: generations.length,
    });
  } catch (error) {
    console.error('Error fetching generations:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener generaciones' },
      { status: 500 }
    );
  }
}
