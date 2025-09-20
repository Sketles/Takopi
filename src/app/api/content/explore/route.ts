import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Content from '@/models/Content';

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
      // Mapear categorías de la UI a categorías de la BD
      const categoryMap: { [key: string]: string } = {
        'Todo': '',
        'Juegos': 'games',
        'Modelos 3D': 'models',
        'Texturas': 'textures',
        'Colecciones': 'collections',
        'Vehículos': 'vehicles',
        'Arquitectura': 'architecture',
        'Personajes': 'characters'
      };

      if (categoryMap[category]) {
        if (categoryMap[category] === '') {
          // Si es "Todo", no agregar filtro de categoría
        } else {
          filter.contentType = categoryMap[category];
        }
      }
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
    'models': '3D Model',
    'textures': 'Texture Pack',
    'music': 'Music',
    'avatars': 'Avatar',
    'animations': 'Animation',
    'obs': 'OBS Widget',
    'collections': 'Collection',
    'games': 'Game'
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

  // Imagen por defecto basada en el tipo de contenido
  return '/placeholder-3d.jpg';
}

// Función para formatear el precio
function formatPrice(price: number, isFree: boolean): string {
  if (isFree || price === 0) {
    return 'GRATIS';
  }

  // Formatear con puntos para miles (formato CLP)
  return `$${price.toLocaleString('es-CL')}`;
}
