import { NextRequest, NextResponse } from 'next/server';
import { webpayConfig } from '@/config/webpay';
import prisma from '@/lib/prisma';
import { PrintStatus } from '@prisma/client';
import { sendPrintOrderConfirmationEmail } from '@/lib/email';

// Importar WebpayPlus de manera condicional para mejor manejo de errores
let WebpayPlus: unknown;
try {
  WebpayPlus = require("transbank-sdk").WebpayPlus;
  console.log('✅ Transbank SDK loaded successfully for commit-print');
} catch (error) {
  console.error('❌ Error loading Transbank SDK for commit-print:', error);
}

// Manejar tanto GET como POST para compatibilidad con Transbank
export async function POST(request: NextRequest) {
  return handleCommit(request);
}

export async function GET(request: NextRequest) {
  return handleCommit(request);
}

async function handleCommit(request: NextRequest) {
  console.log('🖨️ [commit-print] Iniciando proceso de confirmación');
  console.log('🖨️ [commit-print] baseUrl configurada:', webpayConfig.baseUrl);
  
  try {
    const token = request.nextUrl.searchParams.get("token_ws");
    console.log('🖨️ [commit-print] Token recibido:', token ? `${token.substring(0, 10)}...` : 'NO TOKEN');
    
    if (!token) {
      console.error('❌ [commit-print] Token no encontrado en la URL');
      return NextResponse.redirect(
        `${webpayConfig.baseUrl}/impresion-3d/confirmacion?success=false&error=no_token`,
        302
      );
    }

    // Verificar si el SDK está disponible
    if (!WebpayPlus) {
      console.error('❌ Transbank SDK not available for commit-print');
      return NextResponse.redirect(
        `${webpayConfig.baseUrl}/impresion-3d/confirmacion?success=false&error=sdk_error`,
        302
      );
    }

    // Configurar transacción usando la API real de Transbank
    const tx = WebpayPlus.Transaction.buildForIntegration(
      webpayConfig.commerceCode,
      webpayConfig.apiKey
    );

    // Confirmar transacción real con Transbank
    let transbankResponse;
    try {
      transbankResponse = await tx.commit(token);
      console.log('✅ Transbank commit-print response:', transbankResponse);
    } catch (error) {
      console.error('❌ Error committing print with Transbank:', error);
      return NextResponse.redirect(
        `${webpayConfig.baseUrl}/impresion-3d/confirmacion?success=false&error=transbank_error`,
        302
      );
    }

    // Verificar si la transacción fue autorizada por Transbank
    if (!transbankResponse || transbankResponse.status !== 'AUTHORIZED') {
      console.log('❌ Transacción de impresión no autorizada por Transbank:', transbankResponse);
      return NextResponse.redirect(
        `${webpayConfig.baseUrl}/impresion-3d/confirmacion?success=false&error=not_authorized&status=${transbankResponse?.status || 'unknown'}`,
        302
      );
    }

    // Guardar la transacción y la compra en la base de datos
    try {
      console.log('💾 [commit-print] Guardando transacción en base de datos...');
      
      const buyOrder = transbankResponse.buy_order;
      
      // Buscar la transacción inicial que se creó en create-print
      let transaction = await prisma.transaction.findUnique({
        where: { buyOrder },
      });

      if (!transaction) {
        console.error('❌ [commit-print] Transacción inicial no encontrada para buyOrder:', buyOrder);
        // Crear una nueva si no existe (fallback)
        transaction = await prisma.transaction.create({
          data: {
            token: token,
            buyOrder: buyOrder,
            sessionId: transbankResponse.session_id || 'unknown',
            amount: transbankResponse.amount,
            currency: 'CLP',
            status: 'completed',
            authorizationCode: transbankResponse.authorization_code || '',
            paymentTypeCode: transbankResponse.payment_type_code || '',
            transactionDate: transbankResponse.transaction_date ? new Date(transbankResponse.transaction_date) : new Date(),
            userId: 'unknown', // No podemos obtener el userId sin la transacción inicial
            contentIds: [],
          },
        });
      } else {
        // Actualizar transacción existente
        transaction = await prisma.transaction.update({
          where: { id: transaction.id },
          data: {
            status: 'completed',
            authorizationCode: transbankResponse.authorization_code || '',
            paymentTypeCode: transbankResponse.payment_type_code || '',
            transactionDate: transbankResponse.transaction_date ? new Date(transbankResponse.transaction_date) : new Date(),
          },
        });
      }

      console.log('✅ [commit-print] Transacción actualizada:', transaction.id);

      // Obtener productId desde contentIds de la transacción
      const productId = transaction.contentIds?.length > 0 ? transaction.contentIds[0] : null;
      
      // Obtener metadata con datos de impresión
      const metadata = transaction.metadata as {
        type?: string;
        printConfig?: {
          material: string;
          quality: string;
          scale: number;
          color: string;
          infill: number;
          copies: number;
          supports: boolean;
          estimatedTime: string;
          modelUrl: string;
          productTitle: string;
          productImage: string;
        };
        shippingData?: {
          fullName: string;
          phone: string;
          address: string;
          city: string;
          region: string;
          postalCode: string;
          additionalInfo: string;
          shippingMethod: string;
        };
        pricing?: {
          printPrice: number;
          shippingPrice: number;
          totalPrice: number;
        };
      } | null;
      
      // Si hay productId, obtener datos del contenido original
      let contentData = null;
      if (productId) {
        try {
          const content = await prisma.content.findUnique({
            where: { id: productId },
            select: {
              id: true,
              title: true,
              coverImage: true,
              contentType: true,
              files: true,
              authorId: true,
              price: true,
            }
          });
          if (content) {
            contentData = content;
            console.log('✅ [commit-print] Datos del producto obtenidos:', content.title);
          }
        } catch (e) {
          console.log('⚠️ [commit-print] No se pudo obtener contenido:', e);
        }
      }

      // Crear snapshot completo con datos del producto
      const printOrderData = {
        type: '3d_print',
        buyOrder: buyOrder,
        // Datos del producto original (o defaults si no hay)
        title: contentData?.title || metadata?.printConfig?.productTitle || 'Impresión 3D',
        coverImage: contentData?.coverImage || metadata?.printConfig?.productImage || '/placeholders/placeholder-3d.svg',
        contentType: 'Modelos3d',
        category: 'Modelos3d',
        authorId: contentData?.authorId || null,
        files: contentData?.files || [],
        // Datos de Transbank
        transbankData: {
          authorizationCode: transbankResponse.authorization_code,
          cardNumber: transbankResponse.card_detail?.card_number,
          transactionDate: transbankResponse.transaction_date,
          paymentTypeCode: transbankResponse.payment_type_code,
        }
      };

      // 1. Crear compra (Purchase) del modelo digital
      const purchase = await prisma.purchase.create({
        data: {
          userId: transaction.userId,
          contentId: productId,
          price: transbankResponse.amount,
          currency: 'CLP',
          status: 'completed',
          transactionId: transaction.id,
          completedAt: new Date(),
          contentSnapshot: printOrderData,
        },
      });
      console.log('✅ [commit-print] Purchase creado:', purchase.id);

      // 2. Crear PrintOrder para tracking de impresión física
      let createdPrintOrderId: string | null = null;
      if (productId && metadata?.printConfig) {
        try {
          const printOrder = await prisma.printOrder.create({
            data: {
              userId: transaction.userId,
              contentId: productId,
              purchaseId: purchase.id,
              transactionId: transaction.id,
              // Configuración de impresión
              material: metadata.printConfig.material || 'PLA',
              quality: metadata.printConfig.quality || 'standard',
              scale: metadata.printConfig.scale || 1.0,
              color: metadata.printConfig.color || null,
              infill: metadata.printConfig.infill || 20,
              notes: null,
              // Precios
              printPrice: metadata.pricing?.printPrice || transbankResponse.amount,
              modelPrice: contentData?.price || 0,
              shippingPrice: metadata.pricing?.shippingPrice || 0,
              totalPrice: metadata.pricing?.totalPrice || transbankResponse.amount,
              currency: 'CLP',
              // Estado
              status: PrintStatus.CONFIRMED,
              statusHistory: [
                { status: 'PENDING', timestamp: transaction.createdAt, note: 'Orden creada' },
                { status: 'CONFIRMED', timestamp: new Date(), note: 'Pago confirmado por Transbank' },
              ],
              estimatedDays: 7, // Estimación por defecto
              // Datos de envío
              shippingAddress: metadata.shippingData ? {
                fullName: metadata.shippingData.fullName,
                phone: metadata.shippingData.phone,
                street: metadata.shippingData.address,
                city: metadata.shippingData.city,
                region: metadata.shippingData.region,
                postalCode: metadata.shippingData.postalCode,
                additionalInfo: metadata.shippingData.additionalInfo,
              } : null,
              shippingMethod: metadata.shippingData?.shippingMethod || 'standard',
              // Timestamps
              confirmedAt: new Date(),
            },
          });
          createdPrintOrderId = printOrder.id;
          console.log('✅ [commit-print] PrintOrder creado:', printOrder.id);

          // Enviar email de confirmación de impresión 3D
          try {
            const user = await prisma.user.findUnique({
              where: { id: transaction.userId },
              select: { username: true, email: true }
            });

            if (user && metadata.shippingData) {
              const emailResult = await sendPrintOrderConfirmationEmail({
                orderId: printOrder.id,
                orderDate: new Date().toLocaleDateString('es-CL', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }),
                customerName: user.username,
                customerEmail: user.email,
                modelName: contentData?.title || metadata.printConfig?.productTitle || 'Modelo 3D',
                modelAuthor: contentData?.authorId ? 'Creador' : 'Takopi',
                material: metadata.printConfig.material || 'PLA',
                quality: metadata.printConfig.quality || 'standard',
                color: metadata.printConfig.color || undefined,
                scale: metadata.printConfig.scale || 1.0,
                infill: metadata.printConfig.infill || 20,
                notes: undefined,
                printPrice: metadata.pricing?.printPrice || transbankResponse.amount,
                modelPrice: contentData?.price || 0,
                shippingPrice: metadata.pricing?.shippingPrice || 0,
                totalPrice: metadata.pricing?.totalPrice || transbankResponse.amount,
                currency: 'CLP',
                shippingMethod: metadata.shippingData.shippingMethod || 'standard',
                shippingAddress: {
                  street: metadata.shippingData.address,
                  city: metadata.shippingData.city,
                  region: metadata.shippingData.region,
                  postalCode: metadata.shippingData.postalCode,
                  country: 'Chile'
                },
                estimatedDays: 7,
                status: 'CONFIRMED'
              });

              if (emailResult.success) {
                console.log('📧 [commit-print] Email de confirmación enviado:', emailResult.id);
              } else {
                console.error('❌ [commit-print] Error enviando email:', emailResult.error);
              }
            }
          } catch (emailError) {
            console.error('❌ [commit-print] Error enviando email de confirmación:', emailError);
            // No fallar la orden si el email falla
          }

        } catch (printOrderError) {
          console.error('⚠️ [commit-print] Error creando PrintOrder:', printOrderError);
          // Continuar aunque falle el PrintOrder - el Purchase ya está creado
        }
      }

      console.log('✅ [commit-print] Compra y orden guardadas correctamente');

    } catch (dbError) {
      console.error('❌ [commit-print] Error guardando en base de datos:', dbError);
      // Continuar con la redirección aunque falle el guardado
      // La transacción de Transbank ya está confirmada
    }

    // Redirigir a la página de confirmación exitosa con los datos de la transacción
    const redirectUrl = new URL(`${webpayConfig.baseUrl}/impresion-3d/confirmacion`);
    redirectUrl.searchParams.set('success', 'true');
    redirectUrl.searchParams.set('token_ws', token);
    redirectUrl.searchParams.set('amount', transbankResponse.amount.toString());
    redirectUrl.searchParams.set('buyOrder', transbankResponse.buy_order);
    redirectUrl.searchParams.set('authorizationCode', transbankResponse.authorization_code || '');
    redirectUrl.searchParams.set('cardNumber', transbankResponse.card_detail?.card_number || '');
    redirectUrl.searchParams.set('transactionDate', transbankResponse.transaction_date || '');
    redirectUrl.searchParams.set('status', transbankResponse.status);

    console.log('✅ [commit-print] Redirigiendo a confirmación exitosa');
    console.log('✅ [commit-print] URL de redirección:', redirectUrl.toString());

    return NextResponse.redirect(redirectUrl.toString(), 302);

  } catch (error) {
    console.error('❌ Error committing print transaction:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor';
    return NextResponse.redirect(
      `${webpayConfig.baseUrl}/impresion-3d/confirmacion?success=false&error=server_error&details=${encodeURIComponent(errorMessage)}`,
      302
    );
  }
}
