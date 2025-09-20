import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Model3D from '@/models/Model3D';
import Comment from '@/models/Comment';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'ID del modelo es requerido' },
        { status: 400 }
      );
    }

    await connectDB();

    // Buscar modelo por ID
    const model = await Model3D.findById(id)
      .populate('author', 'username avatar bio')
      .lean();

    if (!model) {
      return NextResponse.json(
        { error: 'Modelo no encontrado' },
        { status: 404 }
      );
    }

    // Incrementar contador de vistas
    await Model3D.findByIdAndUpdate(id, { $inc: { views: 1 } });

    // Obtener comentarios del modelo
    const comments = await Comment.find({ model: id, isActive: true })
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return NextResponse.json({
      model,
      comments
    });

  } catch (error) {
    console.error('Get model error:', error);
    return NextResponse.json(
      { error: 'Error al obtener modelo' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'ID del modelo es requerido' },
        { status: 400 }
      );
    }

    await connectDB();

    // Buscar y actualizar modelo
    const updatedModel = await Model3D.findByIdAndUpdate(
      id,
      { ...body, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('author', 'username avatar');

    if (!updatedModel) {
      return NextResponse.json(
        { error: 'Modelo no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Modelo actualizado exitosamente',
      model: updatedModel
    });

  } catch (error) {
    console.error('Update model error:', error);
    return NextResponse.json(
      { error: 'Error al actualizar modelo' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'ID del modelo es requerido' },
        { status: 400 }
      );
    }

    await connectDB();

    // Soft delete - marcar como inactivo
    const deletedModel = await Model3D.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!deletedModel) {
      return NextResponse.json(
        { error: 'Modelo no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Modelo eliminado exitosamente'
    });

  } catch (error) {
    console.error('Delete model error:', error);
    return NextResponse.json(
      { error: 'Error al eliminar modelo' },
      { status: 500 }
    );
  }
}
