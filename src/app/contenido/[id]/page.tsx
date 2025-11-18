'use client';

import { Suspense, useState, useEffect, use } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductPage from '@/components/product/ProductPage';
import ProductModal from '@/components/product/ProductModal';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/components/shared/Toast';

// Evitar pre-render estático
export const dynamic = 'force-dynamic';

interface Product {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  contentType: string;
  category: string;
  price: number;
  currency: string;
  isFree: boolean;
  license: string;
  customLicense?: string;
  visibility: string;
  status: string;
  author: string;
  authorAvatar?: string;
  authorId?: string;
  likes: number;
  views: number;
  files?: Array<{
    name: string;
    type: string;
    size: number;
    url: string;
    previewUrl?: string;
    isCover?: boolean;
  }>;
  coverImage?: string;
  additionalImages?: string[];
  tags: string[];
  customTags: string[];
  createdAt: string;
  updatedAt: string;
}

function ProductDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { addProductToCart, isProductInCart } = useCart();
  const { addToast } = useToast();

  // Desenvolver params con React.use()
  const resolvedParams = use(params);
  const isModal = searchParams.get('modal') === '1';
  const isOwner = user && product ? user.username === product.author : false;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/content/${resolvedParams.id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Producto no encontrado');
          } else {
            setError('Error al cargar el producto');
          }
          return;
        }

        const result = await response.json();
        if (result.success) {
          setProduct(result.data);
        } else {
          setError(result.error || 'Error al cargar el producto');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Error de conexión');
      } finally {
        setLoading(false);
      }
    };

    if (resolvedParams.id) {
      fetchProduct();
    }
  }, [resolvedParams.id]);

  const handleEdit = async (product: Product) => {
    console.log('Edit product:', product);
    // Implementar lógica de edición
  };

  const handleDelete = async (product: Product) => {
    try {
      const token = localStorage.getItem('takopi_token');
      const response = await fetch(`/api/content/${product.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Redirigir al perfil o explorador
        window.location.href = '/profile';
      } else {
        const errorData = await response.json();
        alert(`Error al eliminar: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error al eliminar el producto');
    }
  };

  const handleBuy = async (product: Product) => {
    console.log('Buy product:', product);
    // Implementar lógica de compra
    window.location.href = `/checkout?itemId=${product.id}`;
  };

  const handleAddToBox = async (product: Product) => {
    try {
      // Verificar si ya está en el carrito
      if (isProductInCart(product.id)) {
        addToast({
          type: 'warning',
          title: 'Ya está en tu Box',
          message: 'Este producto ya está en tu carrito'
        });
        return;
      }

      // Agregar al carrito
      const result = addProductToCart({
        ...product,
        author: product.author || 'Usuario',
        authorUsername: product.author || 'Usuario',
        coverImage: product.coverImage || '/placeholder-content.jpg'
      });

      if (result.success) {
        addToast({
          type: 'success',
          title: 'Agregado a tu Box',
          message: result.message
        });
      } else {
        addToast({
          type: 'error',
          title: 'Error',
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

  const handleLike = async (product: Product) => {
    console.log('Like product:', product);
    // Implementar lógica de like
  };

  const handleSave = async (product: Product) => {
    console.log('Save product:', product);
    // Implementar lógica de guardar
  };

  const handleShare = async (product: Product) => {
    console.log('Share product:', product);
    // Implementar lógica de compartir
  };

  const handleCloseModal = () => {
    // Cerrar modal y volver a la página anterior
    window.history.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mx-auto mb-4"></div>
          <div className="text-xl">Cargando producto...</div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">😞</div>
          <div className="text-2xl font-bold mb-2">Error</div>
          <div className="text-gray-400 mb-6">{error || 'Producto no encontrado'}</div>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
          >
            Volver atrás
          </button>
        </div>
      </div>
    );
  }

  // Verificar visibilidad para no propietarios
  if (!isOwner && (product.status !== 'published' || product.visibility !== 'public')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">🔒</div>
          <div className="text-2xl font-bold mb-2">Producto no disponible</div>
          <div className="text-gray-400 mb-6">Este producto no está disponible públicamente</div>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
          >
            Volver atrás
          </button>
        </div>
      </div>
    );
  }

  // Renderizar modal o página según el parámetro
  if (isModal) {
    return (
      <ProductModal
        product={product}
        isOpen={true}
        onClose={handleCloseModal}
        isOwner={isOwner}
        currentUserId={user?._id}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBuy={handleBuy}
        onAddToBox={handleAddToBox}
        onLike={handleLike}
        onSave={handleSave}
        onShare={handleShare}
      />
    );
  }

  return (
    <ProductPage
      product={product}
      isOwner={isOwner}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onBuy={handleBuy}
      onAddToBox={handleAddToBox}
      onLike={handleLike}
      onSave={handleSave}
      onShare={handleShare}
    />
  );
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div>Cargando producto...</div>}>
      <ProductDetailContent params={params} />
    </Suspense>
  );
}
