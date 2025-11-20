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
  title: "Takopi - Aplicación Web Moderna",
  description: "Una aplicación moderna construida con Next.js 15, React 19 y TailwindCSS v4",
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
