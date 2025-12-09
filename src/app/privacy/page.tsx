import Layout from '@/components/shared/Layout';
import ParticleBackground from '@/components/shared/ParticleBackground';
import Link from 'next/link';

export const metadata = {
  title: 'Política de Privacidad - Takopi',
  description: 'Cómo recogemos, utilizamos y protegemos tus datos en Takopi.'
};

export default function PrivacyPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-purple-500/30">
        <div className="relative min-h-[56vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-[#0a0a0a] to-[#0a0a0a] z-0"></div>
          <div className="absolute top-0 left-1/4 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-purple-600/20 rounded-full blur-[80px] sm:blur-[100px] lg:blur-[120px] pointer-events-none"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-blue-600/10 rounded-full blur-[80px] sm:blur-[100px] lg:blur-[120px] pointer-events-none"></div>
          <ParticleBackground />
          <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-24 max-w-5xl mx-auto text-white">
        <h1 className="text-4xl font-black tracking-tighter mb-4"><span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-600 bg-clip-text text-transparent">Política de Privacidad</span></h1>
        <p className="text-white/80 mb-8">En Takopi valoramos tu privacidad. Esta política describe qué datos recogemos y cómo los utilizamos.</p>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">1. Información que recopilamos</h2>
          <p className="text-white/80 text-sm">Recopilamos información que nos proporcionas directamente (por ejemplo, al registrarte), información técnica (IPs, datos de navegación), y metadatos relacionados con tus contenidos y compras.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">2. Uso de la información</h2>
          <p className="text-white/80 text-sm">Usamos los datos para operar la plataforma, procesar pagos, enviar notificaciones relevantes y mejorar nuestros servicios. No vendemos tu información a terceros para fines comerciales.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">3. Compartir datos</h2>
          <p className="text-white/80 text-sm">Podemos compartir información con proveedores de servicios (pasarelas de pago, hosting, analítica) y cuando la ley lo exige.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">4. Seguridad</h2>
          <p className="text-white/80 text-sm">Implementamos medidas técnicas y administrativas razonables para proteger la información. Sin embargo, ningún método de transmisión por Internet es completamente seguro.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">5. Tus derechos</h2>
          <p className="text-white/80 text-sm">Dependiendo de tu jurisdicción, puedes tener derechos de acceso, rectificación, eliminación o portabilidad de tus datos. Si deseas ejercerlos, contáctanos.</p>
          <Link href="/contact" className="text-purple-400">Contacto →</Link>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">6. Cambios en la política</h2>
          <p className="text-white/80 text-sm">Podemos actualizar esta política en el futuro; notificaremos cambios significativos cuando corresponda.</p>
          <div className="mt-6 flex gap-4">
            <Link href="/help" className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-white font-semibold">Centro de Ayuda</Link>
            <Link href="/terms" className="px-4 py-2 rounded-lg bg-white/5 text-gray-200 hover:bg-white/10">Términos de Servicio</Link>
          </div>
        </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}
