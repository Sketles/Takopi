import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import Content from '@/models/Content';
import mongoose from 'mongoose';

// GET - Obtener perfil de usuario público
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await connectToDatabase();

    const { userId } = await params;

    // Validar ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, error: 'ID de usuario inválido' },
        { status: 400 }
      );
    }

    // Buscar usuario
    const user = await User.findById(userId).lean();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Obtener contenido público del usuario
    const userContent = await Content.find({
      author: userId,
      status: 'published',
      visibility: 'public'
    })
    .select('title description contentType category price isFree likes views createdAt files coverImage')
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

    // Obtener estadísticas de contenido
    const stats = await Content.aggregate([
      { $match: { author: new mongoose.Types.ObjectId(userId), status: 'published' } },
      {
        $group: {
          _id: null,
          totalCreations: { $sum: 1 },
          totalLikes: { $sum: '$likes' },
          totalViews: { $sum: '$views' },
          contentByType: {
            $push: {
              type: '$contentType',
              likes: '$likes',
              views: '$views'
            }
          }
        }
      }
    ]);

    // Obtener estadísticas de seguidores
    const followersCount = await mongoose.connection.collection('follows').countDocuments({ following: new mongoose.Types.ObjectId(userId) });
    const followingCount = await mongoose.connection.collection('follows').countDocuments({ follower: new mongoose.Types.ObjectId(userId) });

    const userStats = stats[0] || {
      totalCreations: 0,
      totalLikes: 0,
      totalViews: 0,
      contentByType: []
    };

    // Agrupar por tipo
    const contentByType = userStats.contentByType.reduce((acc: any, item: any) => {
      if (!acc[item.type]) {
        acc[item.type] = { count: 0, likes: 0, views: 0 };
      }
      acc[item.type].count += 1;
      acc[item.type].likes += item.likes;
      acc[item.type].views += item.views;
      return acc;
    }, {});

    // Datos públicos del usuario
    const publicUserData = {
      id: user._id.toString(),
      username: user.username,
      avatar: user.avatar,
      banner: user.banner,
      bio: user.bio,
      role: user.role,
      location: user.location,
      createdAt: user.createdAt,
      stats: {
        totalCreations: userStats.totalCreations,
        totalLikes: userStats.totalLikes,
        totalViews: userStats.totalViews,
        followersCount,
        followingCount,
        contentByType
      },
      content: userContent.map(item => ({
        id: item._id.toString(),
        title: item.title,
        description: item.description,
        contentType: item.contentType,
        category: item.category,
        price: item.price,
        isFree: item.isFree,
        likes: item.likes || 0,
        views: item.views || 0,
        createdAt: item.createdAt,
        files: item.files || [],
        coverImage: item.coverImage
      }))
    };

    return NextResponse.json({
      success: true,
      data: publicUserData
    });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener el perfil del usuario' },
      { status: 500 }
    );
  }
}
