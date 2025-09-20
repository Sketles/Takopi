import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Model3D from '@/models/Model3D';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { userId } = await request.json();

    if (!id || !userId) {
      return NextResponse.json(
        { error: 'ID del modelo y usuario son requeridos' },
        { status: 400 }
      );
    }

    await connectDB();

    // Buscar el modelo
    const model = await Model3D.findById(id);

    if (!model) {
      return NextResponse.json(
        { error: 'Modelo no encontrado' },
        { status: 404 }
      );
    }

    // Verificar si ya le dio like
    const hasLiked = model.likes.includes(userId);

    let updatedModel;
    if (hasLiked) {
      // Quitar like
      updatedModel = await Model3D.findByIdAndUpdate(
        id,
        { $pull: { likes: userId } },
        { new: true }
      );
    } else {
      // Agregar like
      updatedModel = await Model3D.findByIdAndUpdate(
        id,
        { $addToSet: { likes: userId } },
        { new: true }
      );
    }

    return NextResponse.json({
      message: hasLiked ? 'Like removido' : 'Like agregado',
      likesCount: updatedModel.likes.length,
      hasLiked: !hasLiked
    });

  } catch (error) {
    console.error('Like/Unlike error:', error);
    return NextResponse.json(
      { error: 'Error al procesar like' },
      { status: 500 }
    );
  }
}
