import Layout from '@/components/shared/Layout';
import ParticleBackground from '@/components/shared/ParticleBackground';
import Link from 'next/link';

export const metadata = {
  title: 'Términos de Servicio - Takopi',
  description: 'Términos de uso y condiciones legales para utilizar Takopi.'
};

export default function TermsPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-purple-500/30">
        <div className="relative min-h-[56vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-[#0a0a0a] to-[#0a0a0a] z-0"></div>
          <div className="absolute top-0 left-1/4 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-purple-600/20 rounded-full blur-[80px] sm:blur-[100px] lg:blur-[120px] pointer-events-none"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-blue-600/10 rounded-full blur-[80px] sm:blur-[100px] lg:blur-[120px] pointer-events-none"></div>
          <ParticleBackground />
          <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-24 max-w-5xl mx-auto text-white">
        <h1 className="text-4xl font-black tracking-tighter mb-4"><span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-600 bg-clip-text text-transparent">Términos de Servicio</span></h1>
        <p className="text-white/80 mb-8">Lee los términos y condiciones para el uso de Takopi. Si tienes dudas, ponte en contacto con nuestro equipo de soporte.</p>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">1. Uso del Servicio</h2>
          <p className="text-white/80 text-sm">Takopi proporciona una plataforma para creadores y compradores. Aceptas usar el servicio conforme a la ley, sin emplearlo para actividades ilícitas o que infrinjan derechos de terceros.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">2. Contenido del Usuario</h2>
          <p className="text-white/80 text-sm">Los contenidos que publiques son responsabilidad del autor. Al subir contenido, autorizas a Takopi a hospedarlo y usar metadatos necesarios para la operación de la plataforma.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">3. Pagos y Reembolsos</h2>
          <p className="text-white/80 text-sm">Los pagos se gestionan por las pasarelas anunciadas en el sitio. Consulta nuestra política de reembolsos en la sección de soporte o contacta para mayores detalles.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">4. Protección de Datos</h2>
          <p className="text-white/80 text-sm">La privacidad y el tratamiento de datos se rigen por nuestra Política de Privacidad. Recomendamos revisar `Política de Privacidad` para más información.</p>
          <Link href="/privacy" className="text-purple-400">Ir a Política de Privacidad →</Link>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">5. Contacto</h2>
          <p className="text-white/80 text-sm mb-4">Si tienes preguntas sobre estos términos, contáctanos en la página de soporte.</p>
          <div className="flex items-center gap-4">
            <Link href="/help" className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-white font-semibold">Centro de Ayuda</Link>
            <Link href="/contact" className="px-4 py-2 rounded-lg bg-white/5 text-gray-200 hover:bg-white/10">Contacto</Link>
          </div>
        </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}
