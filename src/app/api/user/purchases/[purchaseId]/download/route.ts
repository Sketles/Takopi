import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Purchase from '@/models/Purchase';
import Content from '@/models/Content';
import jwt from 'jsonwebtoken';
import { config } from '@/config/env';

export async function POST(
  request: NextRequest,
  { params }: { params: { purchaseId: string } }
) {
  try {
    await connectToDatabase();

    // Obtener token de autorización
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token de autorización requerido' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    
    // Verificar token
    let userId;
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as any;
      userId = decoded.userId;
    } catch (error) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const { purchaseId } = params;

    // Verificar que la compra existe y pertenece al usuario
    const purchase = await Purchase.findOne({
      _id: purchaseId,
      buyer: userId,
      status: 'completed'
    }).populate('content');

    if (!purchase) {
      return NextResponse.json({ 
        error: 'Compra no encontrada o no autorizada' 
      }, { status: 404 });
    }

    // Actualizar contador de descargas y fecha de última descarga
    await Purchase.findByIdAndUpdate(purchaseId, {
      $inc: { downloadCount: 1 },
      lastDownloadDate: new Date()
    });

    // Obtener información del contenido para la descarga
    const content = await Content.findById(purchase.content._id).select('files title');

    if (!content) {
      return NextResponse.json({ 
        error: 'Contenido no encontrado' 
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        content: {
          id: content._id,
          title: content.title,
          files: content.files || []
        },
        downloadInfo: {
          purchaseId: purchase._id,
          downloadCount: purchase.downloadCount + 1,
          lastDownloadDate: new Date()
        }
      }
    });

  } catch (error) {
    console.error('Error processing download:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 });
  }
}
