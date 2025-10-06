import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Purchase from '@/models/Purchase';
import Content from '@/models/Content';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { config } from '@/config/env';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Purchases API - Request received');
    await connectToDatabase();

    // Obtener token de autorización
    const authHeader = request.headers.get('authorization');
    console.log('🔍 Purchases API - Auth header:', authHeader ? 'Present' : 'Missing');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ Purchases API - No valid auth header');
      return NextResponse.json({ error: 'Token de autorización requerido' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    console.log('🔍 Purchases API - Token extracted:', token ? 'Yes' : 'No');
    
    // Verificar token
    let userId;
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as any;
      userId = decoded.userId;
      console.log('✅ Purchases API - Token valid, userId:', userId);
    } catch (error) {
      console.log('❌ Purchases API - Token invalid:', error);
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    // Obtener parámetros de consulta
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Buscar compras del usuario con información del contenido y vendedor
    const purchases = await Purchase.find({ 
      buyer: userId, 
      status: 'completed' 
    })
    .populate({
      path: 'content',
      model: Content,
      select: 'title description contentType category coverImage files price isFree license tags createdAt author'
    })
    .populate({
      path: 'seller',
      model: User,
      select: 'username avatar'
    })
    .sort({ purchaseDate: -1 })
    .skip(skip)
    .limit(limit);

    // Obtener total de compras para paginación
    const totalPurchases = await Purchase.countDocuments({ 
      buyer: userId, 
      status: 'completed' 
    });
    
    console.log('🔍 Purchases found:', {
      userId,
      purchasesCount: purchases.length,
      totalPurchases,
      page,
      limit
    });

    // Formatear respuesta
    const formattedPurchases = purchases.map(purchase => ({
      id: purchase._id,
      purchaseDate: purchase.purchaseDate,
      amount: purchase.amount,
      currency: purchase.currency,
      downloadCount: purchase.downloadCount,
      lastDownloadDate: purchase.lastDownloadDate,
      content: {
        id: purchase.content._id,
        title: purchase.content.title,
        description: purchase.content.description,
        contentType: purchase.content.contentType,
        category: purchase.content.category,
        coverImage: purchase.content.coverImage,
        files: purchase.content.files || [],
        price: purchase.content.price,
        isFree: purchase.content.isFree,
        license: purchase.content.license,
        tags: purchase.content.tags || [],
        createdAt: purchase.content.createdAt,
        author: purchase.content.author
      },
      seller: {
        id: purchase.seller._id,
        username: purchase.seller.username,
        avatar: purchase.seller.avatar
      }
    }));

    return NextResponse.json({
      success: true,
      data: {
        purchases: formattedPurchases,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalPurchases / limit),
          totalItems: totalPurchases,
          itemsPerPage: limit
        }
      }
    });

  } catch (error) {
    console.error('Error fetching user purchases:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 });
  }
}
