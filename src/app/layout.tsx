import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { ToastProvider } from "@/components/shared/Toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Takopi - Marketplace Digital Chileno",
  description: "Marketplace digital chileno con impresión 3D, modelos generados por IA y contenido digital exclusivo",
  openGraph: {
    title: "Takopi",
    description: "Marketplace digital chileno con impresión 3D, modelos generados por IA y contenido digital exclusivo",
    siteName: "Takopi",
    locale: "es_CL",
    type: "website",
    url: "https://takopi-nine.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "Takopi",
    description: "Marketplace digital chileno con impresión 3D y contenido digital",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Script para configurar model-viewer y reducir advertencias */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Configurar el entorno de model-viewer para reducir advertencias
              if (typeof window !== 'undefined') {
                // Deshabilitar el modo desarrollo de Lit si es posible
                window.LIT_ENABLE_DEV_MODE = false;
                
                // Configurar model-viewer para modo producción
                window.MODEL_VIEWER_ENABLE_DEV_MODE = false;
                
                // Reducir logs de debug
                window.MODEL_VIEWER_DEBUG = false;
              }
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
      >
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
