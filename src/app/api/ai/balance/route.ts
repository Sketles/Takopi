/**
 * GET /api/ai/balance - Obtener balance de créditos de Meshy
 */
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { meshy, MeshyError } from '@/lib/meshy';

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (auth instanceof NextResponse) return auth;

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
