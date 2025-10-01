import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import Content from '@/models/Content';
import Follow from '@/models/Follow';

// Función para verificar el token JWT
async function verifyToken(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return null;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key') as any;
    return decoded;
  } catch (error) {
    console.error('❌ Error verificando token en stats API:', error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    // Verificar autenticación
    const decoded = await verifyToken(request);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Token inválido o expirado' },
        { status: 401 }
      );
    }

    // Verificar que el usuario existe
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Obtener estadísticas del usuario
    const totalCreations = await Content.countDocuments({
      author: decoded.userId,
      status: 'published'
    });

    const totalSales = await Content.countDocuments({
      author: decoded.userId,
      status: 'published',
      // Aquí podrías agregar lógica para contar ventas reales
    });

    const heartsReceived = await Content.aggregate([
      { $match: { author: decoded.userId, status: 'published' } },
      { $group: { _id: null, totalLikes: { $sum: '$likes' } } }
    ]);

    const totalLikes = heartsReceived.length > 0 ? heartsReceived[0].totalLikes : 0;

    // Obtener conteo por tipo de contenido
    const contentByType = await Content.aggregate([
      { $match: { author: decoded.userId, status: 'published' } },
      { $group: { _id: '$contentType', count: { $sum: 1 } } }
    ]);

    // Obtener estadísticas de seguidores y siguiendo
    const followersCount = await Follow.countDocuments({ following: decoded.userId });
    const followingCount = await Follow.countDocuments({ follower: decoded.userId });

    const stats = {
      totalCreations,
      totalSales,
      heartsReceived: totalLikes,
      followersCount,
      followingCount,
      contentByType: contentByType.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {} as Record<string, number>)
    };

    console.log(`✅ Estadísticas obtenidas para usuario ${user.username}:`, stats);

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error: any) {
    console.error('Error obteniendo estadísticas:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener estadísticas' },
      { status: 500 }
    );
  }
}
