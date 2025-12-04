'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/components/shared/Toast';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import Link from 'next/link';

interface Generation {
  id: string;
  taskId: string;
  taskType: string;
  prompt: string | null;
  imageUrl: string | null;
  status: 'PENDING' | 'IN_PROGRESS' | 'SUCCEEDED' | 'FAILED' | 'CANCELED';
  progress: number;
  modelUrl: string | null;
  thumbnailUrl: string | null;
  artStyle: string | null;
  aiModel: string;
  creditsUsed: number;
  errorMessage: string | null;
  createdAt: string;
  completedAt: string | null;
}

const statusConfig: Record<string, { label: string; color: string; icon: string }> = {
  PENDING: { label: 'Pendiente', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: '⏳' },
  IN_PROGRESS: { label: 'Generando', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: '⚙️' },
  SUCCEEDED: { label: 'Completado', color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: '✅' },
  FAILED: { label: 'Fallido', color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: '❌' },
  CANCELED: { label: 'Cancelado', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: '🚫' },
};

const taskTypeLabels: Record<string, string> = {
  'text-to-3d': 'Texto a 3D',
  'image-to-3d': 'Imagen a 3D',
  'text-to-3d-refine': 'Refinamiento 3D',
  'retexture': 'Retexturizado',
};

export default function GenerationsSection() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadGenerations = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('takopi_token');

      if (!token) {
        setError('No se encontró token de autenticación');
        return;
      }

      const response = await fetch('/api/user/generations', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        setGenerations(result.data || []);
        setError(null);
      } else {
        if (response.status >= 500) {
          setError('Error al cargar las generaciones');
        } else {
          setGenerations([]);
          setError(null);
        }
      }
    } catch (err) {
      console.error('Error loading generations:', err);
      setError('Error al cargar las generaciones');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusInfo = (status: string) => {
    return statusConfig[status] || statusConfig.PENDING;
  };

  useEffect(() => {
    loadGenerations();
  }, [user]);

  if (loading) {
    return (
      <div className="bg-[#0f0f0f] rounded-3xl p-8 border border-white/5">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
          <span className="ml-3 text-white/40">Cargando generaciones IA...</span>
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
          onClick={() => loadGenerations()}
          className="px-6 py-2 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (generations.length === 0) {
    return (
      <div className="bg-[#0f0f0f] rounded-3xl p-8 border border-white/5 text-center">
        <div className="text-6xl mb-4">🤖</div>
        <h3 className="text-xl font-bold text-white mb-2">Sin generaciones IA</h3>
        <p className="text-white/60 mb-6">
          Usa Takopi-IA para crear modelos 3D increíbles a partir de texto o imágenes.
        </p>
        <Link
          href="/takopi-ia"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:from-purple-400 hover:to-pink-400 transition-all"
        >
          <span className="mr-2">✨</span>
          Ir a Takopi-IA
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#0f0f0f] rounded-3xl p-6 border border-white/5">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🤖</span>
          <h2 className="text-xl font-bold text-white">Mis Generaciones IA</h2>
          <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm">
            {generations.length} modelo{generations.length !== 1 ? 's' : ''}
          </span>
        </div>
        <Link
          href="/takopi-ia"
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium text-sm hover:from-purple-400 hover:to-pink-400 transition-all"
        >
          + Nueva Generación
        </Link>
      </div>

      {/* Generations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {generations.map((gen) => {
          const statusInfo = getStatusInfo(gen.status);

          return (
            <div
              key={gen.id}
              className="group bg-white/5 hover:bg-white/10 rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-all"
            >
              {/* Thumbnail */}
              <div className="relative aspect-square bg-gradient-to-br from-purple-500/10 to-pink-500/10">
                {gen.thumbnailUrl ? (
                  <Image
                    src={gen.thumbnailUrl}
                    alt={gen.prompt || 'Generación IA'}
                    fill
                    className="object-cover"
                  />
                ) : gen.imageUrl ? (
                  <Image
                    src={gen.imageUrl}
                    alt={gen.prompt || 'Generación IA'}
                    fill
                    className="object-cover opacity-50"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-6xl opacity-50">🎲</span>
                  </div>
                )}

                {/* Status badge */}
                <div className="absolute top-3 right-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                    <span>{statusInfo.icon}</span>
                    <span>{statusInfo.label}</span>
                  </span>
                </div>

                {/* Progress bar for in-progress */}
                {gen.status === 'IN_PROGRESS' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                      style={{ width: `${gen.progress}%` }}
                    />
                  </div>
                )}

                {/* Download button for completed */}
                {gen.status === 'SUCCEEDED' && gen.modelUrl && (
                  <a
                    href={gen.modelUrl}
                    download
                    className="absolute bottom-3 right-3 px-3 py-1.5 bg-white text-black rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-200"
                  >
                    ⬇️ Descargar
                  </a>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                {/* Task type */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs font-medium">
                    {taskTypeLabels[gen.taskType] || gen.taskType}
                  </span>
                  {gen.artStyle && (
                    <span className="px-2 py-0.5 bg-white/10 text-white/60 rounded text-xs">
                      {gen.artStyle}
                    </span>
                  )}
                </div>

                {/* Prompt */}
                <p className="text-white/80 text-sm line-clamp-2 mb-2">
                  {gen.prompt || (gen.imageUrl ? 'Generado desde imagen' : 'Sin prompt')}
                </p>

                {/* Date */}
                <p className="text-white/40 text-xs">
                  {formatDate(gen.createdAt)}
                </p>

                {/* Error message */}
                {gen.status === 'FAILED' && gen.errorMessage && (
                  <p className="text-red-400 text-xs mt-2 line-clamp-2">
                    ⚠️ {gen.errorMessage}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
