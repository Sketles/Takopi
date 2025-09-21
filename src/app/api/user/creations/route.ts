import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import Content from '@/models/Content';

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
    console.error('❌ Error verificando token en creations API:', error);
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

    // Obtener las creaciones del usuario
    const creations = await Content.find({
      author: decoded.userId,
      status: 'published'
    })
      .sort({ createdAt: -1 }) // Más recientes primero
      .limit(12) // Máximo 12 creaciones
      .select('title description contentType category price isFree files coverImage likes views downloads createdAt');

    // Procesar las creaciones para incluir la imagen
    const processedCreations = creations.map(creation => {
      // Función para obtener la imagen del contenido
      const getContentImage = (content: any): string => {
        // Si hay imagen de portada, usarla
        if (content.coverImage) {
          return content.coverImage;
        }

        // Si hay archivos, buscar una imagen
        if (content.files && content.files.length > 0) {
          const imageFile = content.files.find((file: any) =>
            file.type && (
              file.type.startsWith('image/') ||
              file.name.endsWith('.svg')
            )
          );
          if (imageFile && (imageFile.previewUrl || imageFile.url)) {
            return imageFile.previewUrl || imageFile.url;
          }
        }

        // Generar portada por defecto con gradiente e icono
        return generateDefaultCover(content.contentType);
      };

      return {
        id: creation._id,
        title: creation.title,
        description: creation.description,
        contentType: creation.contentType,
        category: creation.category,
        price: creation.price,
        isFree: creation.isFree,
        image: getContentImage(creation),
        likes: creation.likes || 0,
        views: creation.views || 0,
        downloads: creation.downloads || 0,
        createdAt: creation.createdAt
      };
    });

    console.log(`✅ ${processedCreations.length} creaciones obtenidas para usuario ${user.username}`);

    return NextResponse.json({
      success: true,
      data: {
        creations: processedCreations,
        total: processedCreations.length
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching user creations:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener las creaciones del usuario' },
      { status: 500 }
    );
  }
}

// Función para generar portada por defecto con gradiente e icono
function generateDefaultCover(contentType: string): string {
  const coverConfig = {
    'avatares': {
      gradient: 'from-green-500 to-teal-500',
      icon: '👤',
      placeholder: '/placeholder-avatar.jpg'
    },
    'modelos3d': {
      gradient: 'from-blue-500 to-cyan-500',
      icon: '🧩',
      placeholder: '/placeholder-3d.jpg'
    },
    'musica': {
      gradient: 'from-purple-500 to-pink-500',
      icon: '🎵',
      placeholder: '/placeholder-music.jpg'
    },
    'texturas': {
      gradient: 'from-indigo-500 to-purple-500',
      icon: '🖼️',
      placeholder: '/placeholder-texture.jpg'
    },
    'animaciones': {
      gradient: 'from-orange-500 to-red-500',
      icon: '🎬',
      placeholder: '/placeholder-animation.jpg'
    },
    'OBS': {
      gradient: 'from-gray-500 to-blue-500',
      icon: '📺',
      placeholder: '/placeholder-widget.jpg',
      customLogo: '/logos/OBS_Studio_logo.png'
    },
    'colecciones': {
      gradient: 'from-yellow-500 to-orange-500',
      icon: '📦',
      placeholder: '/placeholder-collection.jpg'
    }
  };

  const config = coverConfig[contentType] || coverConfig['modelos3d'];

  // Por ahora retornamos el placeholder, pero en el futuro se podría generar
  // una imagen SVG dinámica con gradiente e icono
  return config.placeholder;
}
