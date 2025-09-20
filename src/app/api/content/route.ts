import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Content from '@/models/Content';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

// Función para verificar el token JWT
async function verifyToken(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    console.log('🔍 Token recibido:', token ? `${token.substring(0, 50)}...` : 'No token');

    if (!token) {
      console.log('❌ No hay token en el header');
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key') as any;
    console.log('✅ Token verificado:', { userId: decoded.userId, email: decoded.email });
    return decoded;
  } catch (error) {
    console.error('❌ Error verificando token:', error);
    return null;
  }
}

// GET - Obtener publicaciones (con filtros opcionales)
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const contentType = searchParams.get('type');
    const category = searchParams.get('category');
    const tags = searchParams.get('tags');
    const author = searchParams.get('author');
    const sortBy = searchParams.get('sort') || 'newest'; // newest, popular, trending
    const search = searchParams.get('search');

    // Construir filtros
    const filters: any = {
      status: 'published',
      visibility: { $in: ['public', 'unlisted'] }
    };

    if (contentType) {
      filters.contentType = contentType;
    }

    if (category) {
      filters.category = category;
    }

    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim().toLowerCase());
      filters.tags = { $in: tagArray };
    }

    if (author) {
      filters.authorUsername = author;
    }

    if (search) {
      filters.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Construir ordenamiento
    let sort: any = { createdAt: -1 };
    switch (sortBy) {
      case 'popular':
        sort = { views: -1, likes: -1 };
        break;
      case 'trending':
        // Combinación de views, likes y fecha (últimos 30 días)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        filters.createdAt = { $gte: thirtyDaysAgo };
        sort = { likes: -1, views: -1, createdAt: -1 };
        break;
      case 'price-low':
        sort = { price: 1 };
        break;
      case 'price-high':
        sort = { price: -1 };
        break;
      default:
        sort = { createdAt: -1 };
    }

    // Ejecutar consulta
    const skip = (page - 1) * limit;
    const contents = await Content.find(filters)
      .populate('author', 'username avatar role')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Content.countDocuments(filters);

    return NextResponse.json({
      success: true,
      data: {
        contents,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching contents:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener publicaciones' },
      { status: 500 }
    );
  }
}

// POST - Crear nueva publicación
export async function POST(request: NextRequest) {
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

    const body = await request.json();

    console.log('📥 Datos recibidos:', JSON.stringify(body, null, 2));

    // Validar datos requeridos
    const requiredFields = ['title', 'description', 'contentType', 'category', 'files'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `El campo ${field} es requerido` },
          { status: 400 }
        );
      }
    }

    // Verificar que el usuario existe
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Procesar archivos (por ahora simulamos URLs)
    const processedFiles = body.files.map((file: any) => ({
      name: file.name,
      originalName: file.originalName || file.name,
      size: file.size,
      type: file.type,
      url: `/uploads/${file.name}`, // TODO: Implementar subida real de archivos
      previewUrl: file.type.startsWith('image/') ? `/uploads/${file.name}` : undefined
    }));

    console.log('📁 Archivos procesados:', JSON.stringify(processedFiles, null, 2));

    // Procesar enlaces externos
    const externalLinks = [];
    if (body.externalLinks) {
      const linksArray = body.externalLinks.split('\n').filter((link: string) => link.trim());
      for (const link of linksArray) {
        const [title, url] = link.split('|').map((s: string) => s.trim());
        if (title && url) {
          externalLinks.push({ title, url });
        }
      }
    }

    // Crear la publicación
    const contentData = {
      title: body.title.trim(),
      provisionalName: body.provisionalName?.trim(),
      description: body.description.trim(),
      shortDescription: body.shortDescription?.trim(),
      contentType: body.contentType,
      category: body.category.trim(),
      subcategory: body.subcategory?.trim(),
      files: processedFiles,
      coverImage: body.coverImage,
      additionalImages: body.additionalImages || [],
      price: parseFloat(body.price) || 0,
      isFree: body.isFree || parseFloat(body.price) === 0,
      currency: 'CLP',
      license: body.license || 'personal',
      customLicense: body.customLicense?.trim(),
      tags: [...(body.tags || []), ...(body.customTags || [])].map((tag: string) =>
        tag.trim().toLowerCase()
      ).filter((tag: string) => tag),
      customTags: (body.customTags || []).map((tag: string) =>
        tag.trim().toLowerCase()
      ).filter((tag: string) => tag),
      visibility: body.visibility || 'public',
      allowTips: body.allowTips || false,
      allowCommissions: body.allowCommissions || false,
      externalLinks,
      notes: body.notes?.trim(),
      author: decoded.userId,
      authorUsername: user.username,
      status: body.visibility === 'draft' ? 'draft' : 'published'
    };

    const content = new Content(contentData);
    await content.save();

    console.log('✅ Contenido guardado exitosamente:', content._id);

    // Poblar datos del autor para la respuesta
    await content.populate('author', 'username avatar role');

    return NextResponse.json({
      success: true,
      data: content,
      message: 'Publicación creada exitosamente'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating content:', error);
    return NextResponse.json(
      { success: false, error: 'Error al crear la publicación' },
      { status: 500 }
    );
  }
}
