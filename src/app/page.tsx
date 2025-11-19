'use client';

import Layout from '@/components/shared/Layout';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

// Particle Background Component
const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: any[] = [];
    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      alpha: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.alpha = Math.random() * 0.5 + 0.1;
        this.color = `rgba(${147 + Math.random() * 50}, ${51 + Math.random() * 50}, 234, ${this.alpha})`; // Purple base
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas!.width) this.x = 0;
        if (this.x < 0) this.x = canvas!.width;
        if (this.y > canvas!.height) this.y = 0;
        if (this.y < 0) this.y = canvas!.height;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      particles = [];
      for (let i = 0; i < 80; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    init();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-60" />;
};

export default function HomePage() {
  const [featuredContent, setFeaturedContent] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch contenido destacado
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await fetch('/api/content/explore?limit=6');
        if (response.ok) {
          const result = await response.json();
          const data = result.data || result; // Soporta ambos formatos
          setFeaturedContent(Array.isArray(data) ? data.slice(0, 6) : []);
        }
      } catch (error) {
        console.error('Error fetching featured:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-purple-500/30">
        {/* Hero Section with Particles */}
        <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          {/* Background Gradients */}
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-[#0a0a0a] to-[#0a0a0a] z-0"></div>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

          <ParticleBackground />

          {/* Content */}
          <div className="relative z-10 text-center px-4 max-w-5xl mx-auto space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md animate-fade-in-down hover:bg-white/10 transition-colors cursor-default">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-sm font-medium text-gray-300 tracking-wide">Marketplace V1.0 + Impresión 3D</span>
            </div>

            <h1 className="text-7xl md:text-9xl font-black tracking-tighter animate-fade-in leading-[0.9] mb-6">
              <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-600 bg-clip-text text-transparent drop-shadow-[0_0_50px_rgba(168,85,247,0.5)]">
                TAKOPI
              </span>
              <br />
              <span className="text-4xl md:text-6xl font-bold text-white tracking-tight">
                Marketplace Digital
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed animate-fade-in-up delay-100">
              Takopi es la plataforma definitiva para creadores. Compra y vende assets digitales, o lleva tus modelos 3D a la realidad con nuestro servicio de impresión de vanguardia.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center pt-8 animate-fade-in-up delay-200">
              <Link href="/explore" className="group relative px-8 py-4 bg-white text-black rounded-xl font-bold text-lg hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                <span className="relative flex items-center gap-2">
                  Explorar Marketplace
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </span>
              </Link>
              <Link href="/impresion-3d" className="group px-8 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-bold text-lg hover:bg-white/10 hover:scale-105 transition-all backdrop-blur-md flex items-center justify-center gap-2">
                <span>Servicio de Impresión 3D</span>
                <div className="w-2 h-2 rounded-full bg-purple-500 group-hover:shadow-[0_0_10px_#a855f7] transition-shadow"></div>
              </Link>
            </div>
          </div>
        </div>

        {/* Bento Grid Section */}
        <section className="py-24 px-4 max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
              Todo lo que necesitas <br />
              <span className="bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text text-transparent">en un solo lugar</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Un ecosistema diseñado para potenciar tu creatividad y monetizar tu talento.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            {/* Large Card - Marketplace */}
            <div className="md:col-span-2 row-span-2 relative group overflow-hidden rounded-3xl border border-white/10 bg-[#0f0f0f] hover:border-purple-500/30 transition-all duration-500">
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-transparent"></div>

              <div className="absolute bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-black via-black/80 to-transparent">
                <div className="inline-block p-3 rounded-2xl bg-purple-500/20 mb-4 backdrop-blur-md border border-purple-500/20">
                  <span className="text-3xl">🌍</span>
                </div>
                <h3 className="text-3xl font-bold mb-3 text-white">Marketplace Global</h3>
                <p className="text-gray-400 text-lg max-w-md">Accede a miles de recursos digitales de creadores de todo el mundo. Desde modelos 3D hasta música y scripts.</p>
              </div>

              {/* Abstract Visual */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] group-hover:bg-purple-500/20 transition-colors duration-700"></div>
            </div>

            {/* Tall Card - 3D Printing */}
            <div className="md:col-span-1 row-span-2 relative group overflow-hidden rounded-3xl border border-white/10 bg-[#0f0f0f] hover:border-blue-500/30 transition-all duration-500">
              <div className="absolute inset-0 flex items-center justify-center">
                {/* CSS Sphere Effect */}
                <div className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-400 via-cyan-500 to-blue-900 shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.5),0_0_30px_rgba(59,130,246,0.3)] group-hover:scale-110 transition-transform duration-700"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/50 to-transparent">
                <h3 className="text-2xl font-bold mb-2 text-white">Impresión 3D</h3>
                <p className="text-gray-400">Sube tu modelo y recíbelo en casa. Materiales premium y calidad industrial.</p>
              </div>
            </div>

            {/* Small Card - Secure */}
            <div className="relative group overflow-hidden rounded-3xl border border-white/10 bg-[#0f0f0f] hover:bg-white/5 transition-all">
              <div className="p-8 h-full flex flex-col justify-between relative z-10">
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-2xl border border-green-500/20">🔒</div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">100% Seguro</h3>
                  <p className="text-sm text-gray-400">Pagos encriptados y protección al comprador.</p>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2"></div>
            </div>

            {/* Small Card - Community */}
            <div className="relative group overflow-hidden rounded-3xl border border-white/10 bg-[#0f0f0f] hover:bg-white/5 transition-all">
              <div className="p-8 h-full flex flex-col justify-between relative z-10">
                <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center text-2xl border border-pink-500/20">👥</div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Comunidad</h3>
                  <p className="text-sm text-gray-400">Conecta con otros creadores y colabora.</p>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2"></div>
            </div>
          </div>
        </section>

        {/* Featured Content */}
        <section className="py-24 px-4 max-w-7xl mx-auto relative">
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-purple-900/5 blur-[150px] pointer-events-none"></div>

          <div className="relative z-10 flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Tendencias</h2>
              <p className="text-gray-400">Lo más popular de la semana</p>
            </div>
            <Link href="/explore" className="group flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors font-medium">
              Ver todo
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-96 bg-white/5 rounded-3xl animate-pulse border border-white/5"></div>
              ))}
            </div>
          ) : featuredContent.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredContent.map((content) => (
                <Link
                  key={content.id}
                  href={`/contenido/${content.id}`}
                  className="group relative overflow-hidden rounded-3xl bg-[#0f0f0f] border border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
                >
                  {/* Image Container */}
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img
                      src={content.coverImage || content.image || '/placeholder-content.jpg'}
                      alt={content.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>

                    {/* Price Tag */}
                    <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-sm font-bold text-white">
                      {content.isFree ? 'GRATIS' : `$${content.price}`}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="mb-4">
                      <span className="text-xs font-bold tracking-wider text-purple-400 uppercase mb-2 block">{content.contentType}</span>
                      <h3 className="font-bold text-xl text-white mb-1 line-clamp-1 group-hover:text-purple-300 transition-colors">{content.title}</h3>
                      <p className="text-sm text-gray-400">por <span className="text-white">{content.author || 'Takopi User'}</span></p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <span>★★★★★</span>
                        <span>(5.0)</span>
                      </div>
                      <span className="text-xs text-gray-400 group-hover:text-white transition-colors">Ver detalles</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 border border-dashed border-white/10 rounded-3xl bg-white/5">
              <div className="text-4xl mb-4 opacity-50">🔍</div>
              <p className="text-gray-400 text-lg">Explora el marketplace para ver contenido</p>
              <Link href="/explore" className="text-purple-400 hover:underline mt-2 inline-block">Ir al Explorador</Link>
            </div>
          )}
        </section>

        {/* CTA Final */}
        <section className="py-32 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] to-purple-900/20"></div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
              Comienza Tu <br />
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Viaje Creativo</span>
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Únete a la comunidad de creadores más innovadora de Latinoamérica.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/auth/register" className="px-10 py-5 bg-white text-black rounded-2xl font-bold text-xl hover:scale-105 transition-transform shadow-2xl">
                Crear Cuenta Gratis
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
