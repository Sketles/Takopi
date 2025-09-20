import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    await connectDB();

    // Intentar contar usuarios para verificar conexión
    const userCount = await User.countDocuments();

    return NextResponse.json({
      message: 'Conexión a MongoDB exitosa',
      userCount,
      database: 'Takopi_BaseDatos',
      status: 'connected'
    });

  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({
      message: 'Error de conexión a MongoDB',
      error: error instanceof Error ? error.message : 'Error desconocido',
      status: 'error'
    }, { status: 500 });
  }
}
