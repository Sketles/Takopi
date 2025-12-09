import Layout from '@/components/shared/Layout';
import ParticleBackground from '@/components/shared/ParticleBackground';
import Link from 'next/link';

export const metadata = {
  title: 'Contacto - Takopi',
  description: 'Contacta con el equipo de soporte de Takopi para preguntas, ventas y asistencia.'
};

export default function ContactPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-purple-500/30">
        <div className="relative min-h-[56vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-[#0a0a0a] to-[#0a0a0a] z-0"></div>
          <div className="absolute top-0 left-1/4 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-purple-600/20 rounded-full blur-[80px] sm:blur-[100px] lg:blur-[120px] pointer-events-none"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-blue-600/10 rounded-full blur-[80px] sm:blur-[100px] lg:blur-[120px] pointer-events-none"></div>
          <ParticleBackground />
          <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-24 max-w-5xl mx-auto text-white">
        <h1 className="text-4xl font-black tracking-tighter mb-4"><span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-600 bg-clip-text text-transparent">Contacto</span></h1>
        <p className="text-white/80 mb-8">Si necesitas ayuda, tienes dudas sobre tu cuenta o quieres colaborar con Takopi, aquí encontrarás formas de contactarnos.</p>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Soporte general</h2>
          <p className="text-white/80 text-sm mb-4">Para problemas con tu cuenta, pagos o contenido, escríbenos a:</p>
          <p className="text-white/80 text-sm font-medium mb-4">Correo: <a href="mailto:soporte@takopi.com" className="text-purple-400">soporte@takopi.com</a></p>
          <p className="text-white/80 text-sm">También puedes usar el Centro de Ayuda o abrir un ticket en la sección de soporte.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Comercial y partnerships</h2>
          <p className="text-white/80 text-sm mb-4">Si quieres colaborar como creador, empresa o distribuidor, contáctanos:</p>
          <p className="text-white/80 text-sm font-medium mb-4">Correo: <a href="mailto:partnerships@takopi.com" className="text-purple-400">partnerships@takopi.com</a></p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Redes sociales</h2>
          <div className="flex gap-4 items-center">
            <Link href="#" className="text-gray-300 hover:text-purple-400">Twitter</Link>
            <Link href="#" className="text-gray-300 hover:text-purple-400">Instagram</Link>
            <Link href="#" className="text-gray-300 hover:text-purple-400">Discord</Link>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">¿Necesitas soporte inmediato?</h2>
          <p className="text-white/80 text-sm mb-4">Accede al Centro de Ayuda o abre un ticket para una respuesta más rápida.</p>
          <div className="flex items-center gap-4">
            <Link href="/help" className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-white font-semibold">Centro de Ayuda</Link>
            <a href="mailto:soporte@takopi.com" className="px-4 py-2 rounded-lg bg-white/5 text-gray-200 hover:bg-white/10">Enviar correo</a>
          </div>
        </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}
