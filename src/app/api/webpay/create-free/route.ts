import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Purchase from "@/models/Purchase";
import Content from "@/models/Content";
import User from "@/models/User";
import jwt from 'jsonwebtoken';
import { config } from '@/config/env';

export async function POST(req: NextRequest) {
  try {
    console.log('🎁 Free purchase API called');
    
    // Verificar autorización
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No authorization header');
      return NextResponse.json(
        { error: 'Token de autorización requerido' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    let decodedToken: any;
    try {
      decodedToken = jwt.verify(token, config.jwt.secret);
      console.log('✅ Token válido:', { userId: decodedToken.userId });
    } catch (error) {
      console.log('❌ Token inválido:', error);
      return NextResponse.json(
        { error: 'Token inválido o expirado' },
        { status: 401 }
      );
    }
    
    const { contentId, userId } = await req.json();
    
    console.log('🎁 Free purchase request data:', { contentId, userId });
    
    // Verificar que el userId del token coincida con el del request
    if (userId !== decodedToken.userId) {
      console.log('❌ UserId mismatch:', { requestUserId: userId, tokenUserId: decodedToken.userId });
      return NextResponse.json(
        { error: 'No autorizado para realizar esta transacción' },
        { status: 403 }
      );
    }
    
    // Validar datos requeridos
    if (!contentId || !userId) {
      console.log('❌ Missing required fields:', { contentId, userId });
      return NextResponse.json(
        { error: 'Datos de compra incompletos' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Verificar que el contenido existe y es gratuito
    const content = await Content.findById(contentId);
    if (!content) {
      console.log('❌ Content not found:', contentId);
      return NextResponse.json(
        { error: 'Contenido no encontrado' },
        { status: 404 }
      );
    }

    if (!content.isFree) {
      console.log('❌ Content is not free:', contentId);
      return NextResponse.json(
        { error: 'Este contenido no es gratuito' },
        { status: 400 }
      );
    }

    // Verificar que el usuario existe
    const buyer = await User.findById(userId);
    if (!buyer) {
      console.log('❌ User not found:', userId);
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Verificar que el usuario no haya comprado ya este contenido
    const existingPurchase = await Purchase.findOne({
      buyer: userId,
      content: contentId
    });

    if (existingPurchase) {
      console.log('❌ User already purchased this content:', { userId, contentId });
      return NextResponse.json(
        { error: 'Ya has obtenido este contenido gratuitamente' },
        { status: 400 }
      );
    }

    // Crear la compra gratuita
    const purchase = new Purchase({
      buyer: userId,
      content: contentId,
      seller: content.author,
      amount: 0,
      currency: 'CLP',
      status: 'completed',
      // No hay campos de Webpay para compras gratuitas
    });

    await purchase.save();

    console.log('✅ Free purchase created successfully:', {
      purchaseId: purchase._id,
      buyer: buyer.username,
      content: content.title,
      amount: 0
    });

    return NextResponse.json({
      success: true,
      message: 'Contenido obtenido gratuitamente',
      purchaseId: purchase._id
    });

  } catch (error) {
    console.error('❌ Error creating free purchase:', error);
    console.error('❌ Error message:', error instanceof Error ? error.message : 'Unknown error');
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Error al procesar la compra gratuita',
        details: process.env.NODE_ENV === 'development' ? {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          type: typeof error
        } : undefined
      },
      { status: 500 }
    );
  }
}
