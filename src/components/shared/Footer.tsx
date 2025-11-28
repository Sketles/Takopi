import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative mt-32 bg-[#050505] border-t border-white/5">
      {/* Gradient Top Border */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <span className="font-black text-2xl tracking-tighter text-white">
                TAKOPI
                <span className="text-purple-500">.</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              La plataforma definitiva para creadores de contenido. Compra, vende y materializa tus ideas.
            </p>
            <div className="flex gap-4">
              {/* Social Placeholders */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer">
                  <div className="w-4 h-4 bg-gray-500 rounded-sm"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h4 className="font-bold text-white mb-6">Plataforma</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href="/explore" className="hover:text-purple-400 transition-colors">Explorar Marketplace</Link></li>
              <li><Link href="/impresion-3d" className="hover:text-purple-400 transition-colors">Servicio de Impresión 3D</Link></li>
              <li><Link href="/auth/register" className="hover:text-purple-400 transition-colors">Vender Contenido</Link></li>
              <li><Link href="/pricing" className="hover:text-purple-400 transition-colors">Precios</Link></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="font-bold text-white mb-6">Soporte</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href="/help" className="hover:text-purple-400 transition-colors">Centro de Ayuda</Link></li>
              <li><Link href="/terms" className="hover:text-purple-400 transition-colors">Términos de Servicio</Link></li>
              <li><Link href="/privacy" className="hover:text-purple-400 transition-colors">Política de Privacidad</Link></li>
              <li><Link href="/contact" className="hover:text-purple-400 transition-colors">Contacto</Link></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h4 className="font-bold text-white mb-6">Mantente al día</h4>
            <p className="text-gray-400 text-sm mb-4">Recibe las últimas novedades y tendencias.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="tu@email.com"
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors w-full"
              />
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                →
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>&copy; 2025 Takopi. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <span style={{ color: '#663399' }}>663399GC</span>
          </div>
        </div>
      </div>
    </footer>
  );
}