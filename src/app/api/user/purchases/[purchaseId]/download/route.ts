import { NextRequest, NextResponse } from 'next/server';
import { createPurchaseRepository } from '@/features/purchase/data/repositories/purchase.repository';
import { createContentRepository } from '@/features/content/data/repositories/content.repository';
import path from 'path';
import { requireAuth } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ purchaseId: string }> }
) {
  try {
    const { purchaseId } = await params;

    console.log('🔍 Download Purchase API (Clean Architecture):', purchaseId);

    // Verificar autenticación con módulo centralizado
    const auth = requireAuth(request);
    if (auth instanceof NextResponse) return auth;
    
    const userId = auth.userId;

    // Verificar que la compra existe y pertenece al usuario (usando Clean Architecture)
    const purchaseRepository = createPurchaseRepository();
    const purchases = await purchaseRepository.findByUser(userId);
    const purchase = purchases.find(p => p.id === purchaseId);

    if (!purchase || purchase.status !== 'completed') {
      return NextResponse.json({
        error: 'Compra no encontrada o no autorizada'
      }, { status: 404 });
    }

    // Obtener información del contenido
    const contentRepository = createContentRepository();
    const content = await contentRepository.findById(purchase.contentId);

    if (!content) {
      return NextResponse.json({
        error: 'Contenido no encontrado'
      }, { status: 404 });
    }

    console.log('✅ Compra verificada, generando enlace de descarga');

    // Generar enlace de descarga temporal (por ahora devolvemos la URL directa)
    const downloadLinks = (content.files || []).map(filePath => ({
      filename: path.basename(filePath),
      url: `/api/files/${filePath}`,
      type: path.extname(filePath).toLowerCase()
    }));

    // En un sistema real, aquí generarías enlaces temporales con tokens
    // Por ahora devolvemos las URLs directas

    return NextResponse.json({
      success: true,
      data: {
        purchaseId: purchase.id,
        contentTitle: content.title,
        downloadLinks: downloadLinks
      }
    });

  } catch (error) {
    console.error('❌ Error processing download:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
