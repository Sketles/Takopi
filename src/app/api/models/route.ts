import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Model3D from '@/models/Model3D';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Construir filtros
    const filters: any = { isActive: true };

    if (category && category !== 'all') {
      filters.category = category;
    }

    if (search) {
      filters.$text = { $search: search };
    }

    // Construir sort
    const sort: any = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calcular skip para paginación
    const skip = (page - 1) * limit;

    // Obtener modelos con populate
    const models = await Model3D.find(filters)
      .populate('author', 'username avatar')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    // Contar total para paginación
    const total = await Model3D.countDocuments(filters);

    // Calcular información de paginación
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      models,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage,
        hasPrevPage
      }
    });

  } catch (error) {
    console.error('Get models error:', error);
    return NextResponse.json(
      { error: 'Error al obtener modelos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, category, price, license, files, tags } = body;

    // Validaciones básicas
    if (!title || !description || !category || price === undefined || !license || !files) {
      return NextResponse.json(
        { error: 'Todos los campos requeridos deben ser proporcionados' },
        { status: 400 }
      );
    }

    await connectDB();

    // Crear nuevo modelo
    const newModel = new Model3D({
      title,
      description,
      category,
      price,
      license,
      files,
      tags: tags || [],
      // TODO: Obtener author del token JWT
      author: '507f1f77bcf86cd799439011' // Temporal - reemplazar con auth
    });

    await newModel.save();

    // Populate author para la respuesta
    await newModel.populate('author', 'username avatar');

    return NextResponse.json({
      message: 'Modelo creado exitosamente',
      model: newModel
    }, { status: 201 });

  } catch (error) {
    console.error('Create model error:', error);
    return NextResponse.json(
      { error: 'Error al crear modelo' },
      { status: 500 }
    );
  }
}
