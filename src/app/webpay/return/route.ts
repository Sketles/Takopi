import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const token = form.get("token_ws")?.toString();
    const baseUrl = process.env.APP_BASE_URL || 'http://localhost:3000';
    
    if (!token) {
      console.error('❌ No token_ws found in form data');
      return NextResponse.redirect(`${baseUrl}/payment/result?success=false&error=no_token`, 302);
    }

    console.log('🔍 Webpay return received token:', token);

    // Redirigir al endpoint de commit con el token
    return NextResponse.redirect(`${baseUrl}/api/webpay/commit?token_ws=${token}`, 302);

  } catch (error) {
    console.error('❌ Error processing Webpay return:', error);
    const baseUrl = process.env.APP_BASE_URL || 'http://localhost:3000';
    return NextResponse.redirect(`${baseUrl}/payment/result?success=false&error=processing_error`, 302);
  }
}

// También manejar GET requests por si acaso
export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token_ws");
    const baseUrl = process.env.APP_BASE_URL || 'http://localhost:3000';
    
    if (!token) {
      console.error('❌ No token_ws found in query params');
      return NextResponse.redirect(`${baseUrl}/payment/result?success=false&error=no_token`, 302);
    }

    console.log('🔍 Webpay return GET received token:', token);

    // Redirigir al endpoint de commit con el token
    return NextResponse.redirect(`${baseUrl}/api/webpay/commit?token_ws=${token}`, 302);

  } catch (error) {
    console.error('❌ Error processing Webpay return GET:', error);
    const baseUrl = process.env.APP_BASE_URL || 'http://localhost:3000';
    return NextResponse.redirect(`${baseUrl}/payment/result?success=false&error=processing_error`, 302);
  }
}
