import { NextRequest, NextResponse } from "next/server";
import { WebpayPlus } from "transbank-sdk";
import { webpayConfig } from "@/config/webpay";
import { connectToDatabase } from "@/lib/mongodb";
import Purchase from "@/models/Purchase";
import Content from "@/models/Content";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token_ws");
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token de transacción no encontrado' },
        { status: 400 }
      );
    }

    // Conectar a la base de datos
    await connectToDatabase();

    // Configurar transacción
    const tx = WebpayPlus.Transaction.buildForIntegration(
      webpayConfig.commerceCode,
      webpayConfig.apiKey
    );

    // Confirmar transacción con Webpay
    const response = await tx.commit(token);

    // Verificar si la transacción fue aprobada
    const approved = response.response_code === 0 && response.status === "AUTHORIZED";

    console.log('🔍 Webpay transaction commit result:', {
      approved,
      response_code: response.response_code,
      status: response.status,
      amount: response.amount,
      buy_order: response.buy_order
    });

    // Si la transacción fue aprobada, guardar en la base de datos
    if (approved) {
      try {
        // Extraer información del buyOrder (formato: tk + timestamp + contentShort + userShort)
        const buyOrderStr = response.buy_order;
        console.log('🔍 Parsing buyOrder:', buyOrderStr);
        
        let content, buyer;
        
        // Intentar parsing con el nuevo formato (19+ caracteres)
        if (buyOrderStr.startsWith('tk') && buyOrderStr.length >= 19) {
          const contentShort = buyOrderStr.slice(-12, -6); // 6 caracteres del contentId
          const userShort = buyOrderStr.slice(-6); // 6 caracteres del userId
          
          console.log('🔍 New format - Extracted parts:', { contentShort, userShort });
          
          // Buscar por los últimos caracteres del ID usando $where (para ObjectId)
          try {
            // Convertir los últimos 6 caracteres a regex para buscar en el string del ObjectId
            const contentRegex = new RegExp(contentShort + '$');
            const userRegex = new RegExp(userShort + '$');
            
            // Buscar todos los documentos y filtrar por los últimos caracteres del ID
            const allContents = await Content.find({});
            const allUsers = await User.find({});
            
            content = allContents.find(c => c._id.toString().match(contentRegex));
            buyer = allUsers.find(u => u._id.toString().match(userRegex));
            
            console.log('🔍 Found content:', content ? content._id : 'null');
            console.log('🔍 Found buyer:', buyer ? buyer._id : 'null');
          } catch (searchError) {
            console.log('❌ Error searching by regex:', searchError);
            // Fallback: usar el método anterior
            content = await Content.findOne({}).sort({ createdAt: -1 });
            buyer = await User.findOne({}).sort({ createdAt: -1 });
          }
        } 
        // Fallback para buyOrders antiguos (14 caracteres) - usar datos del request
        else if (buyOrderStr.startsWith('tk') && buyOrderStr.length >= 10) {
          console.log('🔍 Old format detected, using request data fallback');
          
          // Para buyOrders antiguos, vamos a buscar el contenido más reciente del usuario más reciente
          // Esto es un fallback temporal hasta que todos los buyOrders usen el nuevo formato
          content = await Content.findOne({}).sort({ createdAt: -1 });
          buyer = await User.findOne({}).sort({ createdAt: -1 });
          
          if (content && buyer) {
            console.log('🔍 Fallback - Using recent content and user:', {
              contentId: content._id,
              userId: buyer._id
            });
          }
        }

        if (content && buyer) {
          // Crear registro de compra
          const purchase = new Purchase({
            buyer: buyer._id,
            content: content._id,
            seller: content.author,
            amount: response.amount,
            currency: 'CLP',
            status: 'completed',
            webpayToken: token,
            webpayBuyOrder: response.buy_order,
            authorizationCode: response.authorization_code,
            paymentTypeCode: response.payment_type_code,
            responseCode: response.response_code,
            installmentsNumber: response.installments_number,
            transactionDate: response.transaction_date,
            accountingDate: response.accounting_date,
            vci: response.vci
          });

          await purchase.save();

          console.log('✅ Purchase saved successfully:', {
            purchaseId: purchase._id,
            buyer: buyer.username,
            content: content.title,
            amount: response.amount
          });
        } else {
          console.log('❌ Content or buyer not found:', { content: !!content, buyer: !!buyer });
        }
      } catch (dbError) {
        console.error('❌ Error saving purchase to database:', dbError);
        // No fallar la transacción por errores de BD, pero logear el error
      }
    }

    // Redirigir a la página de resultado
    const baseUrl = process.env.APP_BASE_URL || 'http://localhost:3000';
    const resultUrl = `${baseUrl}/payment/result?success=${approved}`;
    return NextResponse.redirect(resultUrl, 302);

  } catch (error) {
    console.error('❌ Error committing Webpay transaction:', error);
    console.error('❌ Error message:', error instanceof Error ? error.message : 'Unknown error');
    
    // Manejar errores específicos de Transbank
    let errorMessage = 'commit_error';
    let redirectSuccess = false;
    
    if (error instanceof Error) {
      if (error.message.includes('aborted') || error.message.includes('invalid finished state')) {
        errorMessage = 'La transacción fue cancelada o abortada';
        redirectSuccess = false;
      } else if (error.message.includes('expired')) {
        errorMessage = 'La transacción ha expirado';
        redirectSuccess = false;
      }
    }
    
    const baseUrl = process.env.APP_BASE_URL || 'http://localhost:3000';
    const errorUrl = `${baseUrl}/payment/result?success=${redirectSuccess}&error=${encodeURIComponent(errorMessage)}`;
    return NextResponse.redirect(errorUrl, 302);
  }
}
