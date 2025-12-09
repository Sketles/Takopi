import Layout from '@/components/shared/Layout';
import ParticleBackground from '@/components/shared/ParticleBackground';
import Link from 'next/link';

export const metadata = {
  title: 'Precios - Takopi',
  description: 'Planes y precios para creadores y compradores en Takopi.'
};

export default function PricingPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-purple-500/30">
        <div className="relative min-h-[56vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-[#0a0a0a] to-[#0a0a0a] z-0"></div>
          <div className="absolute top-0 left-1/4 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-purple-600/20 rounded-full blur-[80px] sm:blur-[100px] lg:blur-[120px] pointer-events-none"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-blue-600/10 rounded-full blur-[80px] sm:blur-[100px] lg:blur-[120px] pointer-events-none"></div>
          <ParticleBackground />
          <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-24 max-w-7xl mx-auto text-white">
            <h1 className="text-4xl font-black tracking-tighter mb-4 text-center">
              <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-600 bg-clip-text text-transparent">
                Precios Transparentes
              </span>
            </h1>
            <p className="text-white/80 mb-12 text-center max-w-2xl mx-auto">
              Takopi cobra una comisión justa para mantener la plataforma funcionando. No hay tarifas ocultas.
            </p>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {/* Free Plan */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">Gratis</h3>
                  <p className="text-white/60 text-sm">Para compradores</p>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-black text-white">$0</span>
                  <span className="text-white/60">/mes</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2 text-sm text-white/80">
                    <span className="text-purple-400 mt-1">✓</span>
                    <span>Navegación ilimitada</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-white/80">
                    <span className="text-purple-400 mt-1">✓</span>
                    <span>Compra de contenido</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-white/80">
                    <span className="text-purple-400 mt-1">✓</span>
                    <span>Acceso a contenido gratuito</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-white/80">
                    <span className="text-purple-400 mt-1">✓</span>
                    <span>Soporte por email</span>
                  </li>
                </ul>
                <Link 
                  href="/auth/register" 
                  className="block w-full text-center px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-semibold hover:bg-white/10 transition-all"
                >
                  Comenzar Gratis
                </Link>
              </div>

              {/* Creator Plan */}
              <div className="bg-gradient-to-b from-purple-600/20 to-purple-900/10 border-2 border-purple-500/50 rounded-2xl p-8 relative hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                  POPULAR
                </div>
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">Creador</h3>
                  <p className="text-white/60 text-sm">Para vendedores</p>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-black text-white">15%</span>
                  <span className="text-white/60"> comisión</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2 text-sm text-white/80">
                    <span className="text-purple-400 mt-1">✓</span>
                    <span>Todo del plan Gratis</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-white/80">
                    <span className="text-purple-400 mt-1">✓</span>
                    <span>Vende contenido ilimitado</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-white/80">
                    <span className="text-purple-400 mt-1">✓</span>
                    <span>Panel de analíticas</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-white/80">
                    <span className="text-purple-400 mt-1">✓</span>
                    <span>Soporte prioritario</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-white/80">
                    <span className="text-purple-400 mt-1">✓</span>
                    <span>Badge de Creador Verificado</span>
                  </li>
                </ul>
                <Link 
                  href="/auth/register" 
                  className="block w-full text-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                >
                  Convertirse en Creador
                </Link>
              </div>

              {/* Enterprise Plan */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">Empresas</h3>
                  <p className="text-white/60 text-sm">Para equipos y estudios</p>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-black text-white">Custom</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2 text-sm text-white/80">
                    <span className="text-purple-400 mt-1">✓</span>
                    <span>Todo del plan Creador</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-white/80">
                    <span className="text-purple-400 mt-1">✓</span>
                    <span>Comisiones personalizadas</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-white/80">
                    <span className="text-purple-400 mt-1">✓</span>
                    <span>Gestión de equipos</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-white/80">
                    <span className="text-purple-400 mt-1">✓</span>
                    <span>API dedicada</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-white/80">
                    <span className="text-purple-400 mt-1">✓</span>
                    <span>Soporte 24/7</span>
                  </li>
                </ul>
                <Link 
                  href="/contact" 
                  className="block w-full text-center px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-semibold hover:bg-white/10 transition-all"
                >
                  Contactar Ventas
                </Link>
              </div>
            </div>

            {/* Additional Info */}
            <section className="mb-12 bg-white/5 rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6">Detalles de Comisiones</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-white mb-2">Ventas de Contenido Digital</h3>
                  <p className="text-white/80 text-sm">
                    Takopi retiene un 15% de comisión en cada venta. El 85% restante es para el creador.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Servicio de Impresión 3D</h3>
                  <p className="text-white/80 text-sm">
                    Los precios de impresión incluyen materiales, tiempo y envío. No hay comisión adicional.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Retiros y Pagos</h3>
                  <p className="text-white/80 text-sm">
                    Los pagos se procesan mensualmente. Puedes retirar fondos cuando superes los $10.000 CLP.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Sin Tarifas Ocultas</h3>
                  <p className="text-white/80 text-sm">
                    No cobramos por listar contenido, almacenamiento o transferencias entre usuarios.
                  </p>
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Preguntas Frecuentes</h2>
              <div className="space-y-4 max-w-3xl mx-auto">
                <div className="bg-white/5 p-6 rounded-xl">
                  <h3 className="font-semibold text-white mb-2">¿Puedo cambiar de plan más tarde?</h3>
                  <p className="text-white/80 text-sm">
                    Sí, puedes comenzar como comprador y convertirte en creador en cualquier momento desde tu perfil.
                  </p>
                </div>
                <div className="bg-white/5 p-6 rounded-xl">
                  <h3 className="font-semibold text-white mb-2">¿Cómo funcionan los pagos?</h3>
                  <p className="text-white/80 text-sm">
                    Utilizamos Webpay Plus de Transbank para procesar pagos de forma segura. Los fondos de ventas se retienen hasta el retiro mensual.
                  </p>
                </div>
                <div className="bg-white/5 p-6 rounded-xl">
                  <h3 className="font-semibold text-white mb-2">¿Hay límite de contenido que puedo subir?</h3>
                  <p className="text-white/80 text-sm">
                    No hay límite en cantidad de contenido, pero cada archivo individual debe ser menor a 500MB.
                  </p>
                </div>
              </div>
            </section>

            {/* CTA */}
            <div className="text-center bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl p-12 border border-purple-500/30">
              <h2 className="text-3xl font-bold text-white mb-4">
                ¿Listo para comenzar?
              </h2>
              <p className="text-white/80 mb-8 max-w-2xl mx-auto">
                Únete a miles de creadores que ya están monetizando su contenido en Takopi.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link 
                  href="/auth/register" 
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 transition-all shadow-[0_0_30px_rgba(168,85,247,0.3)]"
                >
                  Registrarse Ahora
                </Link>
                <Link 
                  href="/explore" 
                  className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-semibold hover:bg-white/10 transition-all"
                >
                  Explorar Contenido
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
