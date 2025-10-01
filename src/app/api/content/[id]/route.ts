import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Content from '@/models/Content';
import User from '@/models/User';
import mongoose from 'mongoose';

// GET - Obtener publicación específica
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await params;

    // Validar ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'ID de publicación inválido' },
        { status: 400 }
      );
    }

    // Buscar la publicación
    const content = await Content.findById(id)
      .populate('author', 'username avatar role bio banner')
      .lean() as any;

    if (!content) {
      return NextResponse.json(
        { success: false, error: 'Publicación no encontrada' },
        { status: 404 }
      );
    }

    // Verificar visibilidad
    if (content.visibility === 'unlisted') {
      // Solo el autor puede ver contenido unlisted sin enlace directo
      // TODO: Implementar verificación de autor si es necesario
    }

    if (content.status !== 'published') {
      return NextResponse.json(
        { success: false, error: 'Publicación no disponible' },
        { status: 404 }
      );
    }

    // Incrementar contador de views (asíncrono, no esperamos)
    Content.findByIdAndUpdate(id, { $inc: { views: 1 } }).catch(console.error);

    // Transformar datos para el frontend
    const transformedContent = {
      ...content,
      author: content.author?.username || content.authorUsername || 'Anónimo',
      authorAvatar: content.author?.avatar || null,
      authorId: content.author?._id?.toString() || null
    };

    return NextResponse.json({
      success: true,
      data: transformedContent
    });

  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener la publicación' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar publicación
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await params;
    const body = await request.json();

    // TODO: Verificar autenticación y autorización
    // Solo el autor puede editar su publicación

    // Validar ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'ID de publicación inválido' },
        { status: 400 }
      );
    }

    // Buscar la publicación existente
    const existingContent = await Content.findById(id);
    if (!existingContent) {
      return NextResponse.json(
        { success: false, error: 'Publicación no encontrada' },
        { status: 404 }
      );
    }

    // Actualizar solo los campos proporcionados
    const updateData: any = {};

    if (body.title !== undefined) updateData.title = body.title.trim();
    if (body.description !== undefined) updateData.description = body.description.trim();
    if (body.category !== undefined) updateData.category = body.category.trim();
    if (body.subcategory !== undefined) updateData.subcategory = body.subcategory?.trim();
    if (body.price !== undefined) {
      updateData.price = parseFloat(body.price) || 0;
      updateData.isFree = body.isFree || parseFloat(body.price) === 0;
    }
    if (body.license !== undefined) updateData.license = body.license;
    if (body.visibility !== undefined) updateData.visibility = body.visibility;
    if (body.allowTips !== undefined) updateData.allowTips = body.allowTips;
    if (body.allowCommissions !== undefined) updateData.allowCommissions = body.allowCommissions;
    if (body.tags !== undefined) {
      updateData.tags = body.tags.map((tag: string) => tag.trim().toLowerCase());
    }
    if (body.customTags !== undefined) {
      updateData.customTags = body.customTags.map((tag: string) => tag.trim().toLowerCase());
    }

    // Actualizar estado si es necesario
    if (body.visibility === 'draft') {
      updateData.status = 'draft';
    } else if (body.visibility === 'public' && existingContent.status === 'draft') {
      updateData.status = 'published';
      updateData.publishedAt = new Date();
    }

    const updatedContent = await Content.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('author', 'username avatar role');

    return NextResponse.json({
      success: true,
      data: updatedContent,
      message: 'Publicación actualizada exitosamente'
    });

  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json(
      { success: false, error: 'Error al actualizar la publicación' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar publicación
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await params;

    console.log('🔍 DELETE Content - ID recibido:', id);
    console.log('🔍 DELETE Content - Tipo de ID:', typeof id);
    console.log('🔍 DELETE Content - Es ObjectId válido:', mongoose.Types.ObjectId.isValid(id));

    // TODO: Verificar autenticación y autorización
    // Solo el autor puede eliminar su publicación

    // Validar ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error('❌ DELETE Content - ID inválido:', id);
      return NextResponse.json(
        { success: false, error: 'ID de publicación inválido' },
        { status: 400 }
      );
    }

    // Buscar el contenido antes de eliminar
    const content = await Content.findById(id);
    console.log('🔍 DELETE Content - Contenido encontrado:', !!content);
    
    if (!content) {
      return NextResponse.json(
        { success: false, error: 'Publicación no encontrada' },
        { status: 404 }
      );
    }

    // TODO: Eliminar archivos físicos del servidor
    // Por ahora solo eliminamos de la base de datos
    // En el futuro se puede agregar lógica para eliminar archivos de public/uploads

    // Eliminar completamente de la base de datos
    const deletedContent = await Content.findByIdAndDelete(id);
    console.log('✅ DELETE Content - Contenido eliminado:', !!deletedContent);

    return NextResponse.json({
      success: true,
      message: 'Publicación eliminada exitosamente'
    });

  } catch (error) {
    console.error('❌ Error deleting content:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    // Intentar devolver un error más específico
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    
    return NextResponse.json(
      { 
        success: false, 
        error: `Error al eliminar la publicación: ${errorMessage}`,
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}
