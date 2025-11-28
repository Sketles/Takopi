'use client';

import Layout from '@/components/shared/Layout';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ContentCard from '@/components/shared/ContentCard';
import ProductModal from '@/components/product/ProductModal';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/components/shared/Toast';
import FeaturesGrid from '@/components/landing/FeaturesGrid';
import ProfitCalculator from '@/components/landing/ProfitCalculator';
import PrintingService from '@/components/landing/PrintingService';
import SocialProof from '@/components/landing/SocialProof';
import FAQ from '@/components/landing/FAQ';

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
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [likesData, setLikesData] = useState<{ [key: string]: { isLiked: boolean; likesCount: number } }>({});
  const { user } = useAuth();
  const { addProductToCart, isProductInCart } = useCart();
  const { addToast } = useToast();
  const router = useRouter();

  // Fetch contenido destacado
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await fetch('/api/content/explore?limit=6');
        if (response.ok) {
          const result = await response.json();
          const data = result.data || result;
          const items = Array.isArray(data) ? data.slice(0, 6) : [];
          setFeaturedContent(items);

          // Cargar likes si hay usuario autenticado
          if (items.length > 0) {
            loadAllLikes(items);
          }
        }
      } catch (error) {
        console.error('Error fetching featured:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  // Cargar likes de todos los items
  const loadAllLikes = async (items: any[]) => {
    const token = localStorage.getItem('takopi_token');
    if (!token || items.length === 0) return;

    try {
      const contentIds = items.map(item => item.id).join(',');
      const response = await fetch(`/api/likes?contentIds=${contentIds}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          const likesMap: { [key: string]: { isLiked: boolean; likesCount: number } } = {};
          result.data.forEach((item: any) => {
            likesMap[item.contentId] = {
              isLiked: item.isLiked,
              likesCount: item.likesCount
            };
          });
          setLikesData(likesMap);
        }
      }
    } catch (error) {
      console.error('Error loading likes:', error);
    }
  };

  const openItemModal = (item: any) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleAddToBox = async (product: any) => {
    try {
      // Verificar autenticación
      const token = localStorage.getItem('takopi_token');
      if (!token || !user) {
        addToast({
          type: 'warning',
          title: 'Inicia sesión',
          message: 'Debes iniciar sesión para agregar productos al carrito'
        });
        router.push('/auth/login?redirect=/');
        return;
      }

      if (isProductInCart(product.id)) {
        addToast({
          type: 'warning',
          title: 'Ya está en tu Box',
          message: 'Este producto ya está en tu carrito'
        });
        return;
      }

      const result = addProductToCart({
        ...product,
        author: product.author || 'Usuario',
        authorUsername: typeof product.author === 'string' ? product.author : 'Usuario',
        coverImage: product.coverImage || product.image || '/placeholder-content.jpg'
      });

      if (result.success) {
        addToast({
          type: 'success',
          title: 'Agregado a tu Box',
          message: result.message
        });
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'No se pudo agregar al carrito'
      });
    }
  };

  const transformContentItem = (item: any) => {
    return {
      id: item.id,
      title: item.title,
      description: item.description || '',
      shortDescription: item.shortDescription,
      contentType: item.contentType,
      category: item.category,
      price: typeof item.price === 'string' ? parseFloat(item.price) || 0 : item.price,
      currency: item.currency || 'CLP',
      isFree: item.isFree,
      license: item.license || 'personal',
      isPublished: true,
      author: item.author,
      authorAvatar: item.authorAvatar,
      authorId: item.authorId,
      likes: item.likes,
      views: item.views,
      files: item.files || [],
      coverImage: item.image,
      additionalImages: [],
      tags: item.tags || [],
      createdAt: item.createdAt,
      updatedAt: item.createdAt
    };
  };

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

        {/* Interactive Features Grid */}
        <FeaturesGrid />

        {/* Profit Calculator (The "Toy") */}
        <ProfitCalculator />

        {/* 3D Printing Service Highlight */}
        <PrintingService />

        {/* Social Proof & Community */}
        <SocialProof />

        {/* FAQ Section */}
        <FAQ />

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
