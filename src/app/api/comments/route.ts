import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Comment from '@/models/Comment';

export async function POST(request: NextRequest) {
  try {
    const { user, model, content, rating, parentComment } = await request.json();

    // Validaciones básicas
    if (!user || !model || !content) {
      return NextResponse.json(
        { error: 'Usuario, modelo y contenido son requeridos' },
        { status: 400 }
      );
    }

    if (content.length > 500) {
      return NextResponse.json(
        { error: 'El comentario no puede exceder 500 caracteres' },
        { status: 400 }
      );
    }

    await connectDB();

    // Crear nuevo comentario
    const newComment = new Comment({
      user,
      model,
      content,
      rating,
      parentComment
    });

    await newComment.save();

    // Populate user para la respuesta
    await newComment.populate('user', 'username avatar');

    return NextResponse.json({
      message: 'Comentario creado exitosamente',
      comment: newComment
    }, { status: 201 });

  } catch (error) {
    console.error('Create comment error:', error);
    return NextResponse.json(
      { error: 'Error al crear comentario' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const modelId = searchParams.get('model');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!modelId) {
      return NextResponse.json(
        { error: 'ID del modelo es requerido' },
        { status: 400 }
      );
    }

    await connectDB();

    // Calcular skip para paginación
    const skip = (page - 1) * limit;

    // Obtener comentarios
    const comments = await Comment.find({
      model: modelId,
      isActive: true,
      parentComment: null // Solo comentarios principales, no respuestas
    })
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Contar total para paginación
    const total = await Comment.countDocuments({
      model: modelId,
      isActive: true,
      parentComment: null
    });

    // Calcular información de paginación
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      comments,
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
    console.error('Get comments error:', error);
    return NextResponse.json(
      { error: 'Error al obtener comentarios' },
      { status: 500 }
    );
  }
}
