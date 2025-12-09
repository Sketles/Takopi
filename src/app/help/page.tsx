import Layout from '@/components/shared/Layout';
import ParticleBackground from '@/components/shared/ParticleBackground';
import Link from 'next/link';

export const metadata = {
  title: 'Centro de ayuda - Takopi',
  description: 'Preguntas frecuentes, guías y soporte para Takopi.'
};

export default function HelpPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-purple-500/30">
        <div className="relative min-h-[56vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-[#0a0a0a] to-[#0a0a0a] z-0"></div>
          <div className="absolute top-0 left-1/4 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-purple-600/20 rounded-full blur-[80px] sm:blur-[100px] lg:blur-[120px] pointer-events-none"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-blue-600/10 rounded-full blur-[80px] sm:blur-[100px] lg:blur-[120px] pointer-events-none"></div>
          <ParticleBackground />
          <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-24 max-w-5xl mx-auto text-white">
        <h1 className="text-4xl font-black tracking-tighter mb-4"><span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-600 bg-clip-text text-transparent">Centro de Ayuda</span></h1>
        <p className="text-white/80 mb-8">Encuentra respuestas rápidas a las preguntas más frecuentes, guías y cómo contactarnos si necesitas soporte adicional.</p>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Preguntas Frecuentes</h2>
          <div className="space-y-6">
            <div className="bg-white/5 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">¿Cómo puedo descargar un archivo que compré?</h3>
              <p className="text-white/80 text-sm">Después de comprar contenido, ve a tu perfil → Mis compras y haz clic en el archivo para descargarlo o acceder a las instrucciones del autor.</p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">¿Ofrecen impresiones 3D a pedido?</h3>
              <p className="text-white/80 text-sm">Sí. Usa nuestro servicio de Impresión 3D en la página de <Link href="/impresion-3d" className="text-purple-400">Impresión 3D</Link> para convertir tus modelos digitales en objetos físicos.</p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">¿Cómo vendo mi contenido en Takopi?</h3>
              <p className="text-white/80 text-sm">Regístrate como creador y sigue las guías de publicación desde tu perfil para agregar títulos, descripciones y precios.</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Guías rápidas</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <li className="bg-white/5 p-4 rounded-lg">
              <h4 className="font-semibold">Guía de publicación</h4>
              <p className="text-white/80 text-sm">Aprende a crear y publicar contenido optimizado.</p>
              <Link href="/docs/GUIA_INTEGRACION_IA_3D.md" className="text-purple-400 text-sm">Ver guía →</Link>
            </li>
            <li className="bg-white/5 p-4 rounded-lg">
              <h4 className="font-semibold">Impresión 3D: Proceso</h4>
              <p className="text-white/80 text-sm">Revisa cómo preparar tu archivo y tiempos de envío.</p>
              <Link href="/impresion-3d" className="text-purple-400 text-sm">Abrir →</Link>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">¿Necesitas más ayuda?</h2>
          <p className="text-white/80 text-sm mb-4">Nuestro equipo de soporte está disponible via correo o chat. Si no encuentras lo que necesitas, contáctanos.</p>
            <div className="flex items-center gap-4">
            <Link href="/contact" className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-white font-semibold">Contactar Soporte</Link>
            <Link href="/auth/login" className="px-4 py-2 rounded-lg bg-white/5 text-gray-200 hover:bg-white/10">Ir a mi perfil</Link>
          </div>
        </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}
