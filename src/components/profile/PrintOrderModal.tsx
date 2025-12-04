'use client';

import Image from 'next/image';
import Link from 'next/link';

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

interface PrintOrderModalProps {
  order: PrintOrderItem;
  onClose: () => void;
}

const statusConfig: Record<string, { label: string; color: string; icon: string; bgColor: string }> = {
  PENDING: { label: 'Pendiente', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20', icon: '⏳' },
  CONFIRMED: { label: 'Confirmado', color: 'text-blue-400', bgColor: 'bg-blue-500/20', icon: '✅' },
  PROCESSING: { label: 'Preparando', color: 'text-purple-400', bgColor: 'bg-purple-500/20', icon: '⚙️' },
  PRINTING: { label: 'Imprimiendo', color: 'text-cyan-400', bgColor: 'bg-cyan-500/20', icon: '🖨️' },
  QUALITY_CHECK: { label: 'Control de Calidad', color: 'text-indigo-400', bgColor: 'bg-indigo-500/20', icon: '🔍' },
  SHIPPED: { label: 'Enviado', color: 'text-orange-400', bgColor: 'bg-orange-500/20', icon: '📦' },
  DELIVERED: { label: 'Entregado', color: 'text-green-400', bgColor: 'bg-green-500/20', icon: '🎉' },
  CANCELLED: { label: 'Cancelado', color: 'text-red-400', bgColor: 'bg-red-500/20', icon: '❌' },
  FAILED: { label: 'Fallido', color: 'text-red-400', bgColor: 'bg-red-500/20', icon: '⚠️' },
};

const materialLabels: Record<string, string> = {
  PLA: 'PLA (Ecológico)',
  ABS: 'ABS (Resistente)',
  PETG: 'PETG (Flexible)',
  Resina: 'Resina (Alta Definición)',
};

const qualityLabels: Record<string, string> = {
  draft: 'Borrador (Rápido)',
  standard: 'Estándar',
  high: 'Alta Calidad',
};

export default function PrintOrderModal({ order, onClose }: PrintOrderModalProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (amount: number, currency: string = 'CLP') => {
    if (amount === 0) return 'Gratis';
    return `$${amount.toLocaleString('es-CL')} ${currency}`;
  };

  const getStatusInfo = (status: string) => {
    return statusConfig[status] || statusConfig.PENDING;
  };

  const statusInfo = getStatusInfo(order.status);

  // Calcular progreso del status
  const statusOrder = ['PENDING', 'CONFIRMED', 'PROCESSING', 'PRINTING', 'QUALITY_CHECK', 'SHIPPED', 'DELIVERED'];
  const currentIndex = statusOrder.indexOf(order.status);
  const progressPercent = order.status === 'CANCELLED' || order.status === 'FAILED' 
    ? 0 
    : ((currentIndex + 1) / statusOrder.length) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#1a1a1a] rounded-3xl border border-white/10 shadow-2xl">
        {/* Header con imagen */}
        <div className="relative h-48 bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
          {order.content?.coverImage ? (
            <Image
              src={order.content.coverImage}
              alt={order.content.title}
              fill
              className="object-cover opacity-50"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent" />
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white/60 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Title overlay */}
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">🖨️</span>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {order.content?.title || 'Orden de Impresión 3D'}
                </h2>
                {order.content?.author && (
                  <p className="text-white/60">por @{order.content.author.username}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Banner */}
          <div className={`${statusInfo.bgColor} rounded-2xl p-4`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{statusInfo.icon}</span>
                <span className={`text-lg font-bold ${statusInfo.color}`}>{statusInfo.label}</span>
              </div>
              {order.shipping.estimatedDays && order.status !== 'DELIVERED' && (
                <span className="text-white/60 text-sm">
                  ~{order.shipping.estimatedDays} días estimados
                </span>
              )}
            </div>
            
            {/* Progress bar */}
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            
            {/* Timeline mini */}
            <div className="flex justify-between mt-2 text-xs text-white/40">
              <span>Pedido</span>
              <span>Imprimiendo</span>
              <span>Enviado</span>
              <span>Entregado</span>
            </div>
          </div>

          {/* Grid de información */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Configuración de Impresión */}
            <div className="bg-white/5 rounded-2xl p-4">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span>⚙️</span> Configuración
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/60">Material</span>
                  <span className="text-white font-medium">
                    {materialLabels[order.printConfig.material] || order.printConfig.material}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Calidad</span>
                  <span className="text-white font-medium">
                    {qualityLabels[order.printConfig.quality] || order.printConfig.quality}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Escala</span>
                  <span className="text-white font-medium">{order.printConfig.scale}x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Relleno</span>
                  <span className="text-white font-medium">{order.printConfig.infill}%</span>
                </div>
                {order.printConfig.color && (
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Color</span>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full border border-white/20"
                        style={{ backgroundColor: order.printConfig.color }}
                      />
                      <span className="text-white font-medium">{order.printConfig.color}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Desglose de Precio */}
            <div className="bg-white/5 rounded-2xl p-4">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span>💰</span> Desglose
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/60">Impresión</span>
                  <span className="text-white">{formatPrice(order.pricing.printPrice)}</span>
                </div>
                {order.pricing.modelPrice > 0 && (
                  <div className="flex justify-between">
                    <span className="text-white/60">Modelo</span>
                    <span className="text-white">{formatPrice(order.pricing.modelPrice)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-white/60">Envío</span>
                  <span className="text-white">{formatPrice(order.pricing.shippingPrice)}</span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between">
                  <span className="text-white font-bold">Total</span>
                  <span className="text-cyan-400 font-bold text-lg">
                    {formatPrice(order.pricing.totalPrice, order.pricing.currency)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Dirección de Envío */}
          {order.shipping.address && (
            <div className="bg-white/5 rounded-2xl p-4">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span>📍</span> Dirección de Envío
              </h3>
              <div className="text-white/80">
                <p className="font-medium">{order.shipping.address.fullName}</p>
                <p>{order.shipping.address.street}</p>
                <p>{order.shipping.address.city}, {order.shipping.address.region}</p>
                {order.shipping.address.postalCode && (
                  <p>CP: {order.shipping.address.postalCode}</p>
                )}
                <p className="text-white/60 mt-2">📞 {order.shipping.address.phone}</p>
              </div>
            </div>
          )}

          {/* Tracking */}
          {order.shipping.trackingNumber && (
            <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-2xl p-4">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <span>📦</span> Seguimiento de Envío
              </h3>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-white/60 text-sm">Número de seguimiento</p>
                  <p className="text-white font-mono text-lg">{order.shipping.trackingNumber}</p>
                  {order.shipping.carrier && (
                    <p className="text-white/60 text-sm">Transportista: {order.shipping.carrier}</p>
                  )}
                </div>
                {order.shipping.trackingUrl && (
                  <a
                    href={order.shipping.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-colors"
                  >
                    Rastrear Envío →
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Timeline de Estados */}
          <div className="bg-white/5 rounded-2xl p-4">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span>📋</span> Historial
            </h3>
            <div className="space-y-3">
              {(order.statusHistory as Array<{ status: string; timestamp: string; note: string }>)
                .slice()
                .reverse()
                .map((entry, index) => {
                  const entryStatus = getStatusInfo(entry.status);
                  return (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full ${entryStatus.bgColor} flex items-center justify-center shrink-0`}>
                        <span className="text-sm">{entryStatus.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium ${entryStatus.color}`}>{entryStatus.label}</p>
                        <p className="text-white/40 text-sm">{formatDate(entry.timestamp)}</p>
                        {entry.note && <p className="text-white/60 text-sm mt-1">{entry.note}</p>}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Footer con acciones */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
            {order.content && (
              <Link
                href={`/product/${order.content.id}`}
                className="flex-1 py-3 px-6 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium text-center transition-colors"
              >
                Ver Modelo Original
              </Link>
            )}
            <button
              onClick={onClose}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-xl font-bold transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}