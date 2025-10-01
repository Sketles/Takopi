import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Like from '@/models/Like';
import Content from '@/models/Content';
import jwt from 'jsonwebtoken';
import { config } from '@/config/env';
import mongoose from 'mongoose';

// POST - Dar o quitar like a un contenido
export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Like API - Iniciando request');
    await connectToDatabase();
    console.log('🔍 Like API - Base de datos conectada');

    // Verificar autenticación
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      console.log('❌ Like API - No token provided');
      return NextResponse.json({ success: false, error: 'Token requerido' }, { status: 401 });
    }

    console.log('🔍 Like API - Token encontrado, verificando...');
    const decoded = jwt.verify(token, config.jwt.secret) as { userId: string };
    const userId = decoded.userId;
    console.log('🔍 Like API - Token verificado, userId:', userId);

    const { contentId, action } = await request.json(); // action: 'like' | 'unlike'
    console.log('🔍 Like API - Datos recibidos:', { contentId, action });

    if (!contentId || !action) {
      return NextResponse.json({ success: false, error: 'ID de contenido y acción requeridos' }, { status: 400 });
    }

    // Verificar que el contenido existe
    const content = await Content.findById(contentId);
    if (!content) {
      return NextResponse.json({ success: false, error: 'Contenido no encontrado' }, { status: 404 });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const contentObjectId = new mongoose.Types.ObjectId(contentId);

    if (action === 'like') {
      console.log('🔍 Like API - Creando like...');
      try {
        await Like.create({
          user: userObjectId,
          content: contentObjectId
        });
        
        // Incrementar contador de likes en el contenido
        await Content.findByIdAndUpdate(contentId, { $inc: { likes: 1 } });
        
        console.log('✅ Like API - Like creado exitosamente');
        return NextResponse.json({
          success: true,
          message: 'Like agregado exitosamente',
          data: { isLiked: true }
        });
      } catch (error: any) {
        console.error('❌ Like API - Error creando like:', error);
        if (error.code === 11000) {
          console.log('ℹ️ Like API - Ya existe el like, marcando como liked');
          return NextResponse.json({
            success: true,
            message: 'Ya tienes like en este contenido',
            data: { isLiked: true }
          });
        }
        throw error;
      }
    } else if (action === 'unlike') {
      console.log('🔍 Like API - Eliminando like...');
      const result = await Like.deleteOne({
        user: userObjectId,
        content: contentObjectId
      });
      
      if (result.deletedCount > 0) {
        // Decrementar contador de likes en el contenido
        await Content.findByIdAndUpdate(contentId, { $inc: { likes: -1 } });
        console.log('✅ Like API - Like eliminado exitosamente');
      } else {
        console.log('ℹ️ Like API - Like no existía');
      }
      
      return NextResponse.json({
        success: true,
        message: 'Like eliminado exitosamente',
        data: { isLiked: false }
      });
    } else {
      return NextResponse.json({ success: false, error: 'Acción inválida' }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ Like API - Error general:', error);
    console.error('❌ Like API - Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json({ 
      success: false, 
      error: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : String(error) : undefined
    }, { status: 500 });
  }
}

// GET - Verificar estado de like y obtener conteo
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Like API GET - Iniciando request');
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const contentId = searchParams.get('contentId');

    if (!contentId || !mongoose.Types.ObjectId.isValid(contentId)) {
      return NextResponse.json({ success: false, error: 'ID de contenido inválido' }, { status: 400 });
    }

    const contentObjectId = new mongoose.Types.ObjectId(contentId);

    // Obtener conteo total de likes
    const likesCount = await Like.countDocuments({ content: contentObjectId });

    let isLiked = false;
    const token = request.headers.get('authorization')?.split(' ')[1];

    if (token) {
      try {
        const decoded: any = jwt.verify(token, config.jwt.secret);
        const userId = decoded.userId;
        if (userId) {
          isLiked = await Like.exists({ user: new mongoose.Types.ObjectId(userId), content: contentObjectId });
        }
      } catch (error) {
        console.warn('Invalid token for like status check:', error);
      }
    }

    console.log('✅ Like API GET - Datos obtenidos:', { contentId, likesCount, isLiked });

    return NextResponse.json({
      success: true,
      data: {
        likesCount,
        isLiked: !!isLiked
      }
    });

  } catch (error) {
    console.error('❌ Like API GET - Error:', error);
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 });
  }
}
