import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    // Verificar autenticación
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    const userId = authResult.userId;

    // Obtener print orders del usuario
    const printOrders = await prisma.printOrder.findMany({
      where: { userId },
      include: {
        content: {
          select: {
            id: true,
            title: true,
            coverImage: true,
            contentType: true,
            author: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Formatear respuesta
    const formattedOrders = printOrders.map((order) => ({
      id: order.id,
      status: order.status,
      statusHistory: order.statusHistory,
      // Modelo
      content: order.content
        ? {
            id: order.content.id,
            title: order.content.title,
            coverImage: order.content.coverImage,
            contentType: order.content.contentType,
            author: order.content.author,
          }
        : null,
      // Configuración de impresión
      printConfig: {
        material: order.material,
        quality: order.quality,
        scale: order.scale,
        color: order.color,
        infill: order.infill,
        notes: order.notes,
      },
      // Precios
      pricing: {
        printPrice: order.printPrice,
        modelPrice: order.modelPrice,
        shippingPrice: order.shippingPrice,
        totalPrice: order.totalPrice,
        currency: order.currency,
      },
      // Envío
      shipping: {
        address: order.shippingAddress,
        method: order.shippingMethod,
        trackingNumber: order.trackingNumber,
        trackingUrl: order.trackingUrl,
        carrier: order.carrier,
        estimatedDays: order.estimatedDays,
      },
      // Timestamps
      timestamps: {
        createdAt: order.createdAt,
        confirmedAt: order.confirmedAt,
        startedAt: order.startedAt,
        shippedAt: order.shippedAt,
        deliveredAt: order.deliveredAt,
      },
    }));

    return NextResponse.json({
      success: true,
      data: formattedOrders,
      total: formattedOrders.length,
    });
  } catch (error) {
    console.error('❌ Error fetching print orders:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener órdenes de impresión' },
      { status: 500 }
    );
  }
}