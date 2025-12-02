/**
 * GET /api/ai/balance - Obtener balance de créditos de Meshy
 */
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { config } from '@/config/env';
import { meshy, MeshyError } from '@/lib/meshy';

function verifyAuth(request: NextRequest): { userId: string } | null {
  const auth = request.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  
  try {
    return jwt.verify(auth.slice(7), config.jwt.secret) as { userId: string };
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const balance = await meshy.getBalance();
    
    return NextResponse.json({ balance });
  } catch (error) {
    console.error('❌ Error obteniendo balance:', error);
    
    if (error instanceof MeshyError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
