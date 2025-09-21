import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Content from '@/models/Content';
// Importar el modelo User para registrar el esquema en Mongoose
import '@/models/User';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    // Obtener parámetros de consulta
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'all';
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    // Construir filtro
    let filter: any = { status: 'published' };

    if (category !== 'all') {
      // El parámetro category ya viene mapeado desde el frontend
      // Solo necesitamos usarlo directamente como contentType
      filter.contentType = category;
    }

    // Obtener contenido con paginación
    const content = await Content.find(filter)
      .populate('author', 'username avatar role')
      .sort({ createdAt: -1 }) // Más recientes primero
      .skip(skip)
      .limit(limit);

    // Obtener total para paginación
    const total = await Content.countDocuments(filter);

    // Transformar datos para la UI
    const transformedContent = content.map(item => ({
      id: item._id.toString(),
      title: item.title || item.provisionalName,
      author: item.authorUsername || item.author?.username || 'Anónimo',
      type: getContentTypeDisplay(item.contentType),
      category: getCategoryDisplay(item.category),
      image: getContentImage(item),
      // Incluir archivos y cover para que el modal pueda decidir el preview correcto
      files: item.files || [],
      coverImage: item.coverImage || null,
      likes: item.likes || 0,
      price: formatPrice(item.price, item.isFree),
      license: item.license || 'Personal',
      downloads: item.downloads || 0,
      tags: [...(item.tags || []), ...(item.customTags || [])],
      views: item.views || 0,
      createdAt: item.createdAt,
      contentType: item.contentType,
      isFree: item.isFree,
      currency: item.currency
    }));

    return NextResponse.json({
      success: true,
      data: transformedContent,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching explore content:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener contenido' },
      { status: 500 }
    );
  }
}

// Función para obtener el tipo de contenido para mostrar
function getContentTypeDisplay(contentType: string): string {
  const typeMap: { [key: string]: string } = {
    'avatares': 'Avatar',
    'modelos3d': '3D Model',
    'musica': 'Music',
    'texturas': 'Texture Pack',
    'animaciones': 'Animation',
    'OBS': 'OBS Widget',
    'colecciones': 'Collection'
  };
  return typeMap[contentType] || 'Content';
}

// Función para obtener la categoría para mostrar
function getCategoryDisplay(category: string): string {
  const categoryMap: { [key: string]: string } = {
    'characters': 'Personajes',
    'vehicles': 'Vehículos',
    'architecture': 'Arquitectura',
    'weapons': 'Armas',
    'props': 'Props',
    'environment': 'Ambiente',
    'materials': 'Materiales',
    'ambient': 'Ambiental',
    'electronic': 'Electrónica',
    'anime': 'Anime',
    'realistic': 'Realista',
    'overlays': 'Overlays',
    'alerts': 'Alertas',
    'mixed': 'Mixto'
  };
  return categoryMap[category] || category;
}

// Función para obtener la imagen del contenido
function getContentImage(content: any): string {
  // Si hay imagen de portada, usarla
  if (content.coverImage) {
    return content.coverImage;
  }

  // Si hay archivos, buscar una imagen o modelo 3D
  if (content.files && content.files.length > 0) {
    // Para modelos 3D, buscar archivos GLB/GLTF
    if (content.contentType === 'models') {
      const modelFile = content.files.find((file: any) =>
        file.type && (
          file.type.includes('gltf') ||
          file.type.includes('glb') ||
          file.name.endsWith('.glb') ||
          file.name.endsWith('.gltf')
        )
      );
      if (modelFile && (modelFile.previewUrl || modelFile.url)) {
        return modelFile.previewUrl || modelFile.url;
      }
    }

    // Para otros tipos, buscar imágenes
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

  // Si hay imágenes adicionales
  if (content.additionalImages && content.additionalImages.length > 0) {
    return content.additionalImages[0];
  }

  // Generar portada por defecto con gradiente e icono
  return generateDefaultCover(content.contentType);
}

// Función para generar portada por defecto con gradiente e icono
function generateDefaultCover(contentType: string): string {
  const coverConfig = {
    'avatares': {
      gradient: 'from-green-500 to-teal-500',
      icon: '👤',
      placeholder: '/placeholders/placeholder-avatar.jpg'
    },
    'modelos3d': {
      gradient: 'from-blue-500 to-cyan-500',
      icon: '🧩',
      placeholder: '/placeholders/placeholder-3d.jpg'
    },
    'musica': {
      gradient: 'from-purple-500 to-pink-500',
      icon: '🎵',
      placeholder: '/placeholders/placeholder-music.jpg'
    },
    'texturas': {
      gradient: 'from-indigo-500 to-purple-500',
      icon: '🖼️',
      placeholder: '/placeholders/placeholder-texture.jpg'
    },
    'animaciones': {
      gradient: 'from-orange-500 to-red-500',
      icon: '🎬',
      placeholder: '/placeholders/placeholder-animation.jpg'
    },
    'OBS': {
      gradient: 'from-gray-500 to-blue-500',
      icon: '📺',
      placeholder: '/placeholders/placeholder-widget.jpg',
      customLogo: '/logos/OBS_Studio_logo.png'
    },
    'colecciones': {
      gradient: 'from-yellow-500 to-orange-500',
      icon: '📦',
      placeholder: '/placeholders/placeholder-collection.jpg'
    }
  };

  const config = coverConfig[contentType as keyof typeof coverConfig] || coverConfig['modelos3d'];

  // Por ahora retornamos el placeholder, pero en el futuro se podría generar
  // una imagen SVG dinámica con gradiente e icono
  return config.placeholder;
}

// Función para formatear el precio
function formatPrice(price: number, isFree: boolean): string {
  if (isFree || price === 0) {
    return 'GRATIS';
  }

  // Formatear con puntos para miles (formato CLP)
  return `$${price.toLocaleString('es-CL')}`;
}
