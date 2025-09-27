import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { config } from '@/config/env';

// Función para verificar el token JWT
async function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as any;
    return decoded;
  } catch (error) {
    return null;
  }
}

// GET - Obtener perfil del usuario
export async function GET(request: NextRequest) {
  try {
    const decoded = await verifyToken(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    await connectToDatabase();
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ user });

  } catch (error) {
    console.error('Error al obtener perfil:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// PUT - Actualizar perfil del usuario
export async function PUT(request: NextRequest) {
  console.error('🚀🚀🚀 API Profile - FUNCIÓN PUT INICIADA 🚀🚀🚀');
  console.error('🔍 API Profile - Timestamp:', new Date().toISOString());
  try {
    console.error('🔍 API Profile - Iniciando PUT request');
    const decoded = await verifyToken(request);
    if (!decoded) {
      console.error('🔍 API Profile - Token inválido');
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    console.error('🔍 API Profile - Token válido, procesando datos');
    const requestBody = await request.json();
    console.error('🔍 API Profile - Datos recibidos:', JSON.stringify(requestBody, null, 2));
    const { username, bio, role, avatar, banner, location } = requestBody;
    console.error('🔍 API Profile - Location extraída:', location);
    console.error('🔍 API Profile - Location type:', typeof location);
    console.error('🔍 API Profile - Location undefined?', location === undefined);

    // Validaciones básicas solo si se está actualizando el username
    if (username !== undefined && (!username || username.length < 3)) {
      return NextResponse.json(
        { error: 'El nombre de usuario debe tener al menos 3 caracteres' },
        { status: 400 }
      );
    }

    if (bio && bio.length > 500) {
      return NextResponse.json(
        { error: 'La descripción no puede exceder 500 caracteres' },
        { status: 400 }
      );
    }

    if (location && location.length > 100) {
      return NextResponse.json(
        { error: 'La ubicación no puede exceder 100 caracteres' },
        { status: 400 }
      );
    }

    const validRoles = ['Explorer', 'Artist', 'Buyer', 'Maker'];
    if (role && !validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Rol inválido' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Verificar si el username ya existe solo si se está actualizando el username
    if (username !== undefined) {
      const existingUser = await User.findOne({
        username,
        _id: { $ne: decoded.userId }
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'El nombre de usuario ya está en uso' },
          { status: 409 }
        );
      }
    }

    // Actualizar el usuario
    const updateData: any = {};

    console.error('🔍 API Profile - Iniciando construcción de updateData');
    if (username !== undefined) {
      updateData.username = username;
      console.error('🔍 API Profile - Username agregado:', username);
    }
    if (bio !== undefined) {
      updateData.bio = bio;
      console.error('🔍 API Profile - Bio agregado:', bio);
    }
    if (role !== undefined) {
      updateData.role = role;
      console.error('🔍 API Profile - Role agregado:', role);
    }
    if (avatar !== undefined) {
      updateData.avatar = avatar;
      console.error('🔍 API Profile - Avatar agregado');
    }
    if (banner !== undefined) {
      updateData.banner = banner;
      console.error('🔍 API Profile - Banner agregado');
    }
    if (location !== undefined) {
      updateData.location = location;
      console.error('🔍 API Profile - Location agregado:', location);
    } else {
      console.error('🔍 API Profile - Location es undefined, no se agrega');
    }

    console.error('🔍 API Profile - Datos a actualizar en BD:', updateData);

    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    console.error('🔍 API Profile - Usuario actualizado:', updatedUser);
    console.error('✅ API Profile - RESPONSE ENVIADA');
    return NextResponse.json({
      message: 'Perfil actualizado exitosamente',
      user: updatedUser
    });

  } catch (error) {
    console.error('🔍 API Profile - Error al actualizar perfil:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
