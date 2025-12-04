'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/components/shared/Toast';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import PrintOrderModal from './PrintOrderModal';

interface PrintOrderItem {
  id: string;
  status: string;
  statusHistory: Array<{ status: string; timestamp: string; note: string }>;
  content: {
    id: string;
    title: string;
    coverImage: string | null;
    contentType: string;
    author: {
      id: string;
      username: string;
      avatar: string | null;
    };
  } | null;
  printConfig: {
    material: string;
    quality: string;
    scale: number;
    color: string | null;
    infill: number;
    notes: string | null;
  };
  pricing: {
    printPrice: number;
    modelPrice: number;
    shippingPrice: number;
    totalPrice: number;
    currency: string;
  };
  shipping: {
    address: {
      fullName: string;
      phone: string;
      street: string;
      city: string;
      region: string;
      postalCode: string;
    } | null;
    method: string | null;
    trackingNumber: string | null;
    trackingUrl: string | null;
    carrier: string | null;
    estimatedDays: number | null;
  };
  timestamps: {
    createdAt: string;
    confirmedAt: string | null;
    startedAt: string | null;
    shippedAt: string | null;
    deliveredAt: string | null;
  };
}

const statusConfig: Record<string, { label: string; color: string; icon: string }> = {
  PENDING: { label: 'Pendiente', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: '⏳' },
  CONFIRMED: { label: 'Confirmado', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: '✅' },
  PROCESSING: { label: 'Preparando', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: '⚙️' },
  PRINTING: { label: 'Imprimiendo', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30', icon: '🖨️' },
  QUALITY_CHECK: { label: 'Control de Calidad', color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30', icon: '🔍' },
  SHIPPED: { label: 'Enviado', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30', icon: '📦' },
  DELIVERED: { label: 'Entregado', color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: '🎉' },
  CANCELLED: { label: 'Cancelado', color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: '❌' },
  FAILED: { label: 'Fallido', color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: '⚠️' },
};

export default function PrintOrdersSection() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [orders, setOrders] = useState<PrintOrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<PrintOrderItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadOrders = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('takopi_token');

      if (!token) {
        setError('No se encontró token de autenticación');
        return;
      }

      const response = await fetch('/api/user/print-orders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        setOrders(result.data || []);
        setError(null);
      } else {
        if (response.status >= 500) {
          setError('Error al cargar las órdenes de impresión');
        } else {
          setOrders([]);
          setError(null);
        }
      }
    } catch (err) {
      console.error('Error loading print orders:', err);
      setError('Error al cargar las órdenes de impresión');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatPrice = (amount: number, currency: string = 'CLP') => {
    if (amount === 0) return 'Gratis';
    return `$${amount.toLocaleString('es-CL')} ${currency}`;
  };

  const getStatusInfo = (status: string) => {
    return statusConfig[status] || statusConfig.PENDING;
  };

  const handleViewOrder = (order: PrintOrderItem) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  useEffect(() => {
    loadOrders();
  }, [user]);

  if (loading) {
    return (
      <div className="bg-[#0f0f0f] rounded-3xl p-8 border border-white/5">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
          <span className="ml-3 text-white/40">Cargando órdenes de impresión...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#0f0f0f] rounded-3xl p-8 border border-white/5 text-center">
        <div className="text-red-500 text-xl mb-4">⚠️</div>
        <p className="text-white/60 mb-6">{error}</p>
        <button
          onClick={() => loadOrders()}
          className="px-6 py-2 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-[#0f0f0f] rounded-3xl p-8 border border-white/5 text-center">
        <div className="text-6xl mb-4">🖨️</div>
        <h3 className="text-xl font-bold text-white mb-2">Sin órdenes de impresión</h3>
        <p className="text-white/60 mb-6">
          Cuando solicites impresión 3D de un modelo, aparecerá aquí con el tracking completo.
        </p>
        <a
          href="/explore"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-bold hover:from-cyan-400 hover:to-blue-400 transition-all"
        >
          <span className="mr-2">🎨</span>
          Explorar Modelos 3D
        </a>
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#0f0f0f] rounded-3xl p-6 border border-white/5">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🖨️</span>
            <h2 className="text-xl font-bold text-white">Mis Impresiones 3D</h2>
            <span className="bg-white/10 text-white/60 px-3 py-1 rounded-full text-sm">
              {orders.length} orden{orders.length !== 1 ? 'es' : ''}
            </span>
          </div>
        </div>

        {/* Orders Grid */}
        <div className="grid gap-4">
          {orders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            
            return (
              <div
                key={order.id}
                onClick={() => handleViewOrder(order)}
                className="group bg-white/5 hover:bg-white/10 rounded-2xl p-4 border border-white/5 hover:border-white/10 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  {/* Imagen del modelo */}
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white/5 shrink-0">
                    {order.content?.coverImage ? (
                      <Image
                        src={order.content.coverImage}
                        alt={order.content.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">
                        🎲
                      </div>
                    )}
                    {/* Indicador de impresión 3D */}
                    <div className="absolute bottom-1 right-1 bg-cyan-500 rounded-lg p-1">
                      <span className="text-xs">🖨️</span>
                    </div>
                  </div>

                  {/* Info principal */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white truncate group-hover:text-cyan-400 transition-colors">
                      {order.content?.title || 'Impresión 3D'}
                    </h3>
                    
                    {/* Detalles de impresión */}
                    <div className="flex items-center gap-2 mt-1 text-sm text-white/60">
                      <span>{order.printConfig.material}</span>
                      <span>•</span>
                      <span className="capitalize">{order.printConfig.quality}</span>
                      <span>•</span>
                      <span>Escala {order.printConfig.scale}x</span>
                    </div>

                    {/* Fecha y precio */}
                    <div className="flex items-center gap-3 mt-2 text-sm">
                      <span className="text-white/40">
                        {formatDate(order.timestamps.createdAt)}
                      </span>
                      <span className="text-white font-medium">
                        {formatPrice(order.pricing.totalPrice, order.pricing.currency)}
                      </span>
                    </div>
                  </div>

                  {/* Status badge */}
                  <div className="shrink-0">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${statusInfo.color}`}>
                      <span>{statusInfo.icon}</span>
                      <span>{statusInfo.label}</span>
                    </span>
                  </div>

                  {/* Arrow */}
                  <div className="text-white/20 group-hover:text-white/60 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                {/* Tracking info (si está enviado) */}
                {order.shipping.trackingNumber && (
                  <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2 text-sm">
                    <span className="text-white/40">📦 Tracking:</span>
                    <span className="text-cyan-400 font-mono">{order.shipping.trackingNumber}</span>
                    {order.shipping.carrier && (
                      <span className="text-white/40">({order.shipping.carrier})</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de detalle */}
      {isModalOpen && selectedOrder && (
        <PrintOrderModal order={selectedOrder} onClose={closeModal} />
      )}
    </>
  );
}