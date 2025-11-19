import { NextRequest, NextResponse } from 'next/server';
import { UpdateProfileUseCase } from '@/features/auth/domain/usecases/update-profile.usecase';
import { createAuthRepository } from '@/features/auth/data/repositories/auth.repository';
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

    if (process.env.NODE_ENV !== 'production') {
      console.log('🔍 Get Profile API (Clean Architecture):', decoded.userId);
    }

    // Usar repository para obtener usuario
    const repository = createAuthRepository();
    const user = await repository.findUserById(decoded.userId);

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Serializar user entity
    const userResponse = {
      _id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      banner: user.banner,
      bio: user.bio,
      location: user.location,
      createdAt: user.createdAt
    };

    return NextResponse.json({ user: userResponse });

  } catch (error) {
    console.error('❌ Error al obtener perfil:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// PUT - Actualizar perfil del usuario
export async function PUT(request: NextRequest) {
  if (process.env.NODE_ENV !== 'production') {
    console.log('🔍 Update Profile API (Clean Architecture)');
  }
  try {
    const decoded = await verifyToken(request);
    if (!decoded) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('❌ Token inválido');
      }
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const requestBody = await request.json();
    if (process.env.NODE_ENV !== 'production') {
      console.log('🔍 Datos recibidos:', requestBody);
    }
    const { username, bio, role, avatar, banner, location } = requestBody;

    // Crear repository y usecase (Clean Architecture)
    const repository = createAuthRepository();
    const usecase = new UpdateProfileUseCase(repository);

    // Ejecutar caso de uso
    const updatedUser = await usecase.execute(decoded.userId, {
      username,
      bio,
      role,
      avatar,
      banner,
      location
    });

    if (process.env.NODE_ENV !== 'production') {
      console.log('✅ Perfil actualizado:', updatedUser.id);
    }

    // Serializar user entity
    const userResponse = {
      _id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      avatar: updatedUser.avatar,
      banner: updatedUser.banner,
      bio: updatedUser.bio,
      location: updatedUser.location,
      createdAt: updatedUser.createdAt
    };

    return NextResponse.json({
      message: 'Perfil actualizado exitosamente',
      user: userResponse
    });

  } catch (error) {
    console.error('❌ Error al actualizar perfil:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor';
    const statusCode = errorMessage.includes('ya está en uso') ? 409 : 
                        errorMessage.includes('debe tener') ? 400 : 500;
    
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
