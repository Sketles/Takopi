import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Follow from '@/models/Follow';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { config } from '@/config/env';
import mongoose from 'mongoose';

// POST - Seguir o dejar de seguir un usuario
export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Follow API - Iniciando request');
    await connectToDatabase();
    console.log('🔍 Follow API - Base de datos conectada');

    // Verificar autenticación
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      console.log('❌ Follow API - No token provided');
      return NextResponse.json({ success: false, error: 'Token requerido' }, { status: 401 });
    }

    console.log('🔍 Follow API - Token encontrado, verificando...');
    const decoded = jwt.verify(token, config.jwt.secret) as { userId: string };
    const followerId = decoded.userId;
    console.log('🔍 Follow API - Token verificado, userId:', followerId);

    const { followingId, action } = await request.json(); // action: 'follow' | 'unfollow'
    console.log('🔍 Follow API - Datos recibidos:', { followingId, action });

    if (!followingId || !action) {
      return NextResponse.json({ success: false, error: 'ID de usuario y acción requeridos' }, { status: 400 });
    }

    if (followerId === followingId) {
      return NextResponse.json({ success: false, error: 'No puedes seguirte a ti mismo' }, { status: 400 });
    }

    // Verificar que el usuario a seguir existe
    const userToFollow = await User.findById(followingId);
    if (!userToFollow) {
      return NextResponse.json({ success: false, error: 'Usuario no encontrado' }, { status: 404 });
    }

    if (action === 'follow') {
      // Crear relación de seguimiento
      console.log('🔍 Follow API - Creando relación de seguimiento...');
      try {
        const followDoc = await Follow.create({
          follower: followerId,
          following: followingId
        });
        console.log('✅ Follow API - Relación creada:', followDoc);
        
        return NextResponse.json({
          success: true,
          message: 'Usuario seguido exitosamente',
          data: { isFollowing: true }
        });
      } catch (error: any) {
        console.error('❌ Follow API - Error creando relación:', error);
        if (error.code === 11000) {
          console.log('ℹ️ Follow API - Duplicado detectado, usuario ya seguido');
          return NextResponse.json({
            success: true,
            message: 'Ya sigues a este usuario',
            data: { isFollowing: true }
          });
        }
        throw error;
      }
    } else if (action === 'unfollow') {
      // Eliminar relación de seguimiento
      await Follow.deleteOne({
        follower: followerId,
        following: followingId
      });

      return NextResponse.json({
        success: true,
        message: 'Dejaste de seguir al usuario',
        data: { isFollowing: false }
      });
    } else {
      return NextResponse.json({ success: false, error: 'Acción inválida' }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ Follow API - Error general:', error);
    console.error('❌ Follow API - Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json({ 
      success: false, 
      error: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : String(error) : undefined
    }, { status: 500 });
  }
}

// GET - Obtener estado de seguimiento y estadísticas
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'ID de usuario requerido' }, { status: 400 });
    }

    // Verificar autenticación (opcional para estadísticas públicas)
    let followerId = null;
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (token) {
      try {
        const decoded = jwt.verify(token, config.jwt.secret) as { userId: string };
        followerId = decoded.userId;
      } catch (error) {
        // Token inválido, continuar sin autenticación
      }
    }

    // Contar seguidores y seguidos
    const followersCount = await Follow.countDocuments({ following: userId });
    const followingCount = await Follow.countDocuments({ follower: userId });

    // Verificar si el usuario autenticado sigue al usuario consultado
    let isFollowing = false;
    if (followerId && followerId !== userId) {
      const followExists = await Follow.findOne({
        follower: followerId,
        following: userId
      });
      isFollowing = !!followExists;
    }

    return NextResponse.json({
      success: true,
      data: {
        followersCount,
        followingCount,
        isFollowing
      }
    });

  } catch (error) {
    console.error('Error fetching follow stats:', error);
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 });
  }
}
