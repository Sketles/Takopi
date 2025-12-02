'use client';

import Layout from '@/components/shared/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useCallback, useRef } from 'react';
import ProductModal from '@/components/product/ProductModal';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/components/shared/Toast';
import { useExploreState, type ContentItem } from '@/hooks/useExploreState';
import ExploreFilters from './ExploreFilters';
import TrendingCarousel from './TrendingCarousel';
import ContentGrid from './ContentGrid';

// Particle Background Component - Purple themed
const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight;
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
        this.size = Math.random() * 2.5 + 0.5;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = Math.random() * 0.4 - 0.2;
        this.alpha = Math.random() * 0.6 + 0.1;
        // Purple, fuchsia, and cyan colors
        const colors = [
          `rgba(${147 + Math.random() * 50}, ${51 + Math.random() * 50}, 234, ${this.alpha})`, // Purple
          `rgba(${217 + Math.random() * 30}, ${70 + Math.random() * 30}, 239, ${this.alpha})`, // Fuchsia
          `rgba(${34 + Math.random() * 20}, ${211 + Math.random() * 30}, 238, ${this.alpha * 0.7})`, // Cyan (less frequent)
        ];
        this.color = colors[Math.floor(Math.random() * 3)];
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
      // More particles for full page coverage
      const particleCount = Math.min(150, Math.floor((canvas.width * canvas.height) / 15000));
      for (let i = 0; i < particleCount; i++) {
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

    const handleResize = () => {
      resize();
      init();
    };

    window.addEventListener('resize', handleResize);
    resize();
    init();
    animate();

    // Re-check height on scroll for dynamic content
    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    resizeObserver.observe(document.body);

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none" 
      style={{ opacity: 0.6, zIndex: 5 }}
    />
  );
};

export default function ExplorePage() {
  const { user, isLoading } = useAuth();
  const { addProductToCart, isProductInCart } = useCart();
  const { addToast } = useToast();
  const router = useRouter();
  const [state, dispatch] = useExploreState();

  const mapCategoryToContentType = useCallback((category: string): string => {
    const categoryMap: { [key: string]: string } = {
      'Todo': 'all',
      'Avatares': 'avatares',
      'Modelos 3D': 'modelos3d',
      'Música': 'musica',
      'Texturas': 'texturas',
      'Animaciones': 'animaciones',
      'Otros': 'otros'
    };
    return categoryMap[category] || 'all';
  }, []);

  const fetchContent = useCallback(
    async (category: string = 'Todo', page: number = 1, append: boolean = false) => {
      try {
        if (!append) dispatch({ type: 'SET_LOADING', payload: true });
        else dispatch({ type: 'SET_LOADING_MORE', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        const contentTypeParam = mapCategoryToContentType(category);
        const token = localStorage.getItem('takopi_token');
        const url = `/api/content/explore?category=${encodeURIComponent(contentTypeParam)}&page=${page}&limit=20`;

        const headers: HeadersInit = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(url, { headers });
        if (!response.ok) throw new Error('Error al cargar contenido');

        const result = await response.json();
        if (!result.success) throw new Error(result.error || 'Error al cargar contenido');

        let filteredData = result.data;

        if (state.priceFilter === 'free') filteredData = filteredData.filter((item: ContentItem) => item.isFree);
        if (state.priceFilter === 'paid') filteredData = filteredData.filter((item: ContentItem) => !item.isFree);

        if (state.sortBy === 'price_asc') {
          filteredData.sort((a: ContentItem, b: ContentItem) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0));
        } else if (state.sortBy === 'price_desc') {
          filteredData.sort((a: ContentItem, b: ContentItem) => (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0));
        }

        if (append) {
          dispatch({ type: 'SET_CONTENT', payload: [...state.content, ...filteredData] });
        } else {
          dispatch({ type: 'SET_CONTENT', payload: filteredData });
          if (state.trendingContent.length === 0 && filteredData.length > 0) {
            dispatch({ type: 'SET_TRENDING', payload: filteredData.slice(0, 5) });
          }
        }

        dispatch({ type: 'SET_HAS_MORE', payload: result.pagination?.hasMore || false });
        dispatch({ type: 'SET_CURRENT_PAGE', payload: page });
      } catch (err) {
        dispatch({ type: 'SET_ERROR', payload: err instanceof Error ? err.message : 'Error desconocido' });
        if (!append) dispatch({ type: 'SET_CONTENT', payload: [] });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
        dispatch({ type: 'SET_LOADING_MORE', payload: false });
      }
    },
    [state.priceFilter, state.sortBy, state.trendingContent.length, mapCategoryToContentType, dispatch]
  );

  const handleLoadMore = useCallback(() => {
    fetchContent(state.selectedCategory, state.currentPage + 1, true);
  }, [fetchContent, state.selectedCategory, state.currentPage]);

  const handleItemClick = useCallback((item: ContentItem) => {
    dispatch({ type: 'SET_SELECTED_ITEM', payload: item });
    dispatch({ type: 'SET_MODAL_OPEN', payload: true });
  }, [dispatch]);

  const handleCloseModal = useCallback(() => {
    dispatch({ type: 'SET_MODAL_OPEN', payload: false });
    dispatch({ type: 'SET_SELECTED_ITEM', payload: null });
  }, [dispatch]);

  const handleLikeFromModal = useCallback(() => {
    if (!state.selectedItem) return;
    const updateItem = (item: ContentItem) => {
      if (item.id === state.selectedItem!.id) {
        const isLiked = (item as any).isLiked || false;
        return { ...item, likes: isLiked ? (item.likes || 1) - 1 : (item.likes || 0) + 1, isLiked: !isLiked } as ContentItem;
      }
      return item;
    };
    dispatch({ type: 'SET_CONTENT', payload: state.content.map(updateItem) });
    if (state.isSearching) dispatch({ type: 'SET_SEARCH_RESULTS', payload: state.searchResults.map(updateItem) });
  }, [state.selectedItem, state.content, state.searchResults, state.isSearching, dispatch]);

  const handleAddToBox = useCallback(async (product: ContentItem) => {
    const token = localStorage.getItem('takopi_token');
    if (!token || !user) {
      addToast({ type: 'warning', title: 'Inicia sesión', message: 'Debes iniciar sesión para agregar productos al carrito' });
      router.push('/auth/login?redirect=/explore');
      return;
    }
    if (isProductInCart(product.id)) {
      addToast({ type: 'warning', title: 'Ya está en tu Box', message: 'Este producto ya está en tu carrito' });
      return;
    }
    const result = addProductToCart({
      ...product,
      author: product.author || 'Usuario',
      authorUsername: typeof product.author === 'string' ? product.author : 'Usuario',
      coverImage: product.coverImage || product.image || '/placeholder-content.jpg'
    });
    addToast({ type: result.success ? 'success' : 'error', title: result.success ? 'Agregado a tu Box' : 'Error', message: result.message });
  }, [user, isProductInCart, addProductToCart, addToast, router]);

  const handleDeleteContent = useCallback(async (product: ContentItem) => {
    try {
      const token = localStorage.getItem('takopi_token');
      const response = await fetch(`/api/content/${product.id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (response.ok) {
        dispatch({ type: 'SET_CONTENT', payload: state.content.filter(item => item.id !== product.id) });
        return { success: true };
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Error al eliminar el contenido');
    } catch (error) {
      console.error('Error eliminando contenido:', error);
      addToast({ type: 'error', title: 'Error', message: 'Error al eliminar el contenido' });
      throw error;
    }
  }, [state.content, dispatch, addToast]);

  const handleResetFilters = useCallback(() => {
    dispatch({ type: 'SET_PRICE_FILTER', payload: 'all' });
    dispatch({ type: 'SET_SORT_BY', payload: 'newest' });
    dispatch({ type: 'SET_SEARCH_QUERY', payload: '' });
    dispatch({ type: 'SET_CATEGORY', payload: 'Todo' });
  }, [dispatch]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!isLoading) fetchContent(state.selectedCategory, 1, false);
  }, [state.selectedCategory, state.priceFilter, state.sortBy, isLoading]);

  const categories = ['Todo', 'Avatares', 'Modelos 3D', 'Música', 'Texturas', 'Animaciones', 'Otros'];
  const displayItems = state.isSearching ? state.searchResults : state.content;

  return (
    <Layout>
      {/* Purple Particle Background - Full page */}
      <ParticleBackground />
      
      <div className="min-h-screen text-white relative z-10">
        <div className="relative pt-24 sm:pt-28 lg:pt-32 pb-10 sm:pb-12 lg:pb-16 px-4 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
            <div className="absolute top-0 left-1/4 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-purple-600/20 rounded-full blur-[80px] sm:blur-[100px] lg:blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-blue-600/10 rounded-full blur-[80px] sm:blur-[100px] lg:blur-[120px]"></div>
          </div>

          <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6 sm:space-y-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter leading-none">
              Explorar
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-600 drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]">
                Marketplace
              </span>
            </h1>

            <TrendingCarousel items={state.trendingContent} onItemClick={handleItemClick} />
            <ExploreFilters state={state} dispatch={dispatch} />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20 lg:pb-24">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-10 lg:mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => dispatch({ type: 'SET_CATEGORY', payload: category })}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-medium text-xs sm:text-sm transition-all duration-300 border ${
                  state.selectedCategory === category
                    ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white hover:border-white/30'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <ContentGrid
            items={displayItems}
            loading={state.loading}
            isLoadingMore={state.isLoadingMore}
            hasMore={state.hasMore}
            isSearching={state.isSearching}
            error={state.error}
            onItemClick={handleItemClick}
            onLoadMore={handleLoadMore}
            onResetFilters={handleResetFilters}
          />
        </div>

        {state.selectedItem && (
          <ProductModal
            product={{
              id: state.selectedItem.id,
              title: state.selectedItem.title,
              description: state.selectedItem.description || '',
              shortDescription: state.selectedItem.shortDescription,
              contentType: state.selectedItem.contentType,
              category: state.selectedItem.category,
              price: typeof state.selectedItem.price === 'string' ? parseFloat(state.selectedItem.price) || 0 : state.selectedItem.price,
              currency: state.selectedItem.currency || 'CLP',
              isFree: state.selectedItem.isFree,
              license: state.selectedItem.license || 'personal',
              customLicense: undefined,
              isPublished: true,
              author: state.selectedItem.author,
              authorAvatar: (state.selectedItem as any).authorAvatar,
              authorId: (state.selectedItem as any).authorId,
              likes: state.selectedItem.likes,
              views: state.selectedItem.views,
              files: (state.selectedItem as any).files || [],
              coverImage: state.selectedItem.image,
              additionalImages: [],
              tags: state.selectedItem.tags || [],
              customTags: [],
              createdAt: state.selectedItem.createdAt,
              updatedAt: (state.selectedItem as any).updatedAt || state.selectedItem.createdAt
            }}
            isOpen={state.isModalOpen}
            onClose={handleCloseModal}
            isOwner={user?.username === state.selectedItem.author}
            currentUserId={user?._id}
            onEdit={() => {}}
            onDelete={handleDeleteContent}
            onBuy={() => {}}
            onAddToBox={handleAddToBox}
            onLike={handleLikeFromModal}
            onSave={() => {}}
            onShare={() => {}}
            source="explore"
          />
        )}
      </div>
    </Layout>
  );
}