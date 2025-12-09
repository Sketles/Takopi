'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAIGenerator, type GenerationTask } from '@/hooks';
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/shared/Layout';
import ModelViewer3D from '@/components/ModelViewer3D';
import Image from 'next/image';

// ============================================================================
// CONSTANTES
// ============================================================================

type GenerationMode = 'text-to-3d' | 'image-to-3d';

const AI_MODELS = [
  { id: 'meshy-4', name: 'Meshy-4', credits: 5, desc: 'Rápido, menor detalle' },
  { id: 'latest', name: 'Meshy-6', credits: 20, desc: 'Alta calidad, más detalle' },
];

// Helper: Obtener URL del modelo (Blob o Meshy directo)
const getProxiedUrl = (url: string | undefined | null): string | undefined => {
  if (!url) return undefined;
  return url; // Tanto Blob como Meshy funcionan directo
};

// ============================================================================
// COMPONENTE: Panel de Visualización 3D
// ============================================================================

function AIModelViewer({ task, isGenerating, isRefining, isLoadingHistory, includeTextures }: {
  task: GenerationTask | null;
  isGenerating: boolean;
  isRefining?: boolean;
  isLoadingHistory?: boolean;
  includeTextures?: boolean;
}) {
  // Cargando desde historial
  if (isLoadingHistory) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center relative z-10 bg-black/80">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-[40px] animate-pulse" />
          <div className="absolute inset-0 rounded-full border-2 border-purple-500/30 border-t-purple-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl">📦</span>
          </div>
        </div>
        <p className="mt-6 text-gray-300 text-sm font-medium animate-pulse">Cargando modelo...</p>
      </div>
    );
  }

  // Vacío
  if (!task && !isGenerating && !isRefining) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center relative z-10 bg-black/80">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 to-transparent pointer-events-none" />
        <div className="relative group cursor-default flex flex-col items-center">
          <div className="absolute inset-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] animate-pulse group-hover:bg-purple-500/20 transition-all duration-700" />
          <div className="relative w-32 h-32 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.1)] group-hover:scale-105 transition-transform duration-500">
            <svg className="w-16 h-16 text-purple-400/60 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
            </svg>
          </div>
        </div>
        <h2 className="mt-8 text-2xl font-bold text-white tracking-tight drop-shadow-lg text-center">Workbench Creativo</h2>
        <p className="mt-2 text-gray-400 text-base font-light text-center">Materializa tus ideas en 3D</p>
      </div>
    );
  }

  // Generando o Refinando - UI LINEAL CON PASOS
  if (isGenerating || isRefining || (task && !['SUCCEEDED', 'FAILED', 'CANCELED'].includes(task.status))) {
    // Detectar si estamos en fase de refine
    const isRefinePhase = isRefining || task?.taskType === 'text-to-3d-refine';

    // Cuando isRefining es true pero task aún es el preview completado,
    // el progreso del refine es 0 (está iniciando)
    const isWaitingForRefineTask = isRefining && task?.taskType !== 'text-to-3d-refine';
    const progress = isWaitingForRefineTask ? 0 : (task?.progress || 0);

    const showTwoSteps = includeTextures || isRefinePhase;

    // Calcular progreso total cuando hay 2 pasos
    // Paso 1 (Modelado): 0-50%, Paso 2 (Texturas): 50-100%
    const totalProgress = showTwoSteps
      ? (isRefinePhase ? 50 + (progress / 2) : progress / 2)
      : progress;

    return (
      <div className="w-full h-full flex flex-col items-center justify-center relative z-10 px-4 sm:px-8">

        {/* Indicador de Pasos (solo si hay 2 pasos) */}
        {showTwoSteps && (
          <div className="absolute top-4 sm:top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-3">
            {/* Paso 1: Modelado */}
            <div className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full border transition-all duration-500 ${!isRefinePhase
              ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
              : 'bg-green-500/10 border-green-500/30 text-green-400'
              }`}>
              <span className="text-sm sm:text-lg">{!isRefinePhase ? '🔨' : '✓'}</span>
              <span className="text-xs sm:text-sm font-medium hidden xs:inline">Modelado 3D</span>
            </div>

            {/* Conector */}
            <div className={`w-4 sm:w-8 h-0.5 transition-all duration-500 ${isRefinePhase ? 'bg-gradient-to-r from-green-500 to-fuchsia-500' : 'bg-white/20'
              }`} />

            {/* Paso 2: Texturas */}
            <div className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full border transition-all duration-500 ${isRefinePhase
              ? 'bg-fuchsia-500/20 border-fuchsia-500/50 text-fuchsia-300'
              : 'bg-white/5 border-white/10 text-gray-500'
              }`}>
              <span className="text-sm sm:text-lg">{isRefinePhase ? '🎨' : '⏳'}</span>
              <span className="text-xs sm:text-sm font-medium hidden xs:inline">Texturizado</span>
            </div>
          </div>
        )}

        {/* Círculo de Progreso Principal */}
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48">
          <div className={`absolute inset-0 rounded-full blur-[60px] animate-pulse ${isRefinePhase ? 'bg-fuchsia-500/20' : 'bg-purple-500/20'}`} />

          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border border-white/5 animate-[spin_3s_linear_infinite]" />
          <div className={`absolute inset-2 rounded-full border border-t-2 animate-[spin_2s_linear_infinite] ${isRefinePhase ? 'border-fuchsia-500/20 border-t-fuchsia-500' : 'border-purple-500/20 border-t-purple-500'}`} />

          {/* Progress Circle */}
          <svg className="w-full h-full -rotate-90 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
            <circle cx="50" cy="50" r="42" fill="none" stroke={isRefinePhase ? "url(#progRefine)" : "url(#prog)"} strokeWidth="3" strokeLinecap="round"
              strokeDasharray={`${(showTwoSteps ? totalProgress : progress) * 2.64} 264`} className="transition-all duration-500" />
            <defs>
              <linearGradient id="prog" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="50%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
              <linearGradient id="progRefine" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#d946ef" />
                <stop offset="50%" stopColor="#f472b6" />
                <stop offset="100%" stopColor="#d946ef" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tighter">
              {Math.round(showTwoSteps ? totalProgress : progress)}%
            </span>
            <span className={`text-[10px] sm:text-xs uppercase tracking-widest mt-0.5 sm:mt-1 font-bold ${isRefinePhase ? 'text-fuchsia-300' : 'text-purple-300'}`}>
              {isRefinePhase ? 'Texturizando' : 'Modelando'}
            </span>
          </div>
        </div>

        {/* Mensaje de Estado */}
        <div className={`mt-4 sm:mt-8 px-3 sm:px-6 py-2 sm:py-3 backdrop-blur-md border rounded-full ${isRefinePhase ? 'bg-fuchsia-500/5 border-fuchsia-500/20' : 'bg-white/5 border-white/10'}`}>
          <p className="text-gray-300 text-xs sm:text-sm font-medium animate-pulse text-center">
            {isRefinePhase
              ? "Aplicando colores, materiales y texturas PBR..."
              : (task?.prompt ? `Creando: "${task.prompt.length > 40 ? task.prompt.slice(0, 40) + '...' : task.prompt}"` : "Generando geometría 3D...")}
          </p>
        </div>

        {/* Barra de progreso lineal (visual secundario) */}
        {showTwoSteps && (
          <div className="mt-4 sm:mt-6 w-full max-w-xs sm:max-w-md px-4 sm:px-0">
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${isRefinePhase
                  ? 'bg-gradient-to-r from-green-500 via-fuchsia-500 to-fuchsia-400'
                  : 'bg-gradient-to-r from-purple-600 to-purple-400'
                  }`}
                style={{ width: `${totalProgress}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-[10px] sm:text-xs text-gray-500">
              <span className="hidden sm:inline">Inicio</span>
              <span className={`${isRefinePhase ? 'text-green-400' : 'text-purple-400'} truncate max-w-[80px] sm:max-w-none`}>
                {!isRefinePhase ? `${Math.round(progress)}%` : '✓ Listo'}
              </span>
              <span className={`${isRefinePhase ? 'text-fuchsia-400' : ''} truncate max-w-[80px] sm:max-w-none`}>
                {isRefinePhase ? `${Math.round(progress)}%` : 'Texturas'}
              </span>
              <span className="hidden sm:inline">Listo</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Error
  if (task?.status === 'FAILED') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center relative z-10">
        <div className="w-24 h-24 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center backdrop-blur-md shadow-[0_0_30px_rgba(239,68,68,0.2)]">
          <span className="text-4xl">❌</span>
        </div>
        <p className="mt-6 text-red-400 font-bold text-xl">Error en generación</p>
        <p className="mt-2 text-gray-400 text-sm max-w-md text-center bg-black/40 px-4 py-2 rounded-lg border border-white/5">
          {task.errorMessage || 'Intenta de nuevo'}
        </p>
      </div>
    );
  }

  // Éxito - Mostrar modelo 3D interactivo
  if (task?.status === 'SUCCEEDED') {
    const modelSrc = getProxiedUrl(task.modelUrl);
    const thumbnailSrc = getProxiedUrl(task.thumbnailUrl);

    // Si no hay URL de modelo, mostrar thumbnail o placeholder
    if (!modelSrc) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center relative z-10 bg-black/80">
          {thumbnailSrc ? (
            <img src={thumbnailSrc} alt="Modelo 3D" className="max-w-full max-h-full object-contain rounded-xl" />
          ) : (
            <div className="text-center">
              <span className="text-7xl">✅</span>
              <p className="mt-4 text-gray-400">Modelo generado (sin preview)</p>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="w-full h-full flex flex-col relative group bg-black/90">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black pointer-events-none" />
        <div className="flex-1 relative overflow-hidden flex items-center justify-center z-10">
          {/* Visor 3D interactivo */}
          {modelSrc ? (
            <ModelViewer3D
              src={modelSrc}
              alt={task.prompt || 'Modelo generado por IA'}
              width="100%"
              height="100%"
              autoRotate={true}
              cameraControls={true}
              fallbackImage={thumbnailSrc || '/placeholders/placeholder-3d.svg'}
              className="w-full h-full"
            />
          ) : thumbnailSrc ? (
            <div className="w-full h-full flex items-center justify-center">
              <img src={thumbnailSrc} alt="Modelo 3D" className="max-w-full max-h-full object-contain drop-shadow-2xl" />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white/5">
              <span className="text-7xl">✅</span>
            </div>
          )}
        </div>

        {/* Botón de descarga flotante */}
        {task.modelUrl && (
          <div className="absolute bottom-8 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 z-50">
            <a
              href={task.modelUrl}
              download={`modelo-${task.id}.glb`}
              className="px-8 py-3 bg-white text-black rounded-full font-bold hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.3)] flex items-center gap-2 backdrop-blur-xl"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Descargar GLB
            </a>
          </div>
        )}
      </div>
    );
  }

  return null;
}

// ============================================================================
// PÁGINA PRINCIPAL
// ============================================================================

export default function TakopiIAPage() {
  // Auth sin redirección automática - permitir ver la página sin login
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const {
    isGenerating, task: currentTask, history, balance, error,
    generate, refine, poll, loadHistory, loadBalance,
  } = useAIGenerator();

  const [mode, setMode] = useState<GenerationMode>('text-to-3d');
  const [prompt, setPrompt] = useState('');
  const [aiModel, setAiModel] = useState('meshy-4');
  const [image, setImage] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [showCoinModal, setShowCoinModal] = useState(false);
  const [purchasingPackage, setPurchasingPackage] = useState<string | null>(null);

  // Formatos soportados por Meshy API
  const MESHY_SUPPORTED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png'];
  const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

  // Paquetes de monedas
  const COIN_PACKAGES = [
    { 
      id: 'starter', 
      coins: 1000, 
      price: 2990, 
      popular: false,
      badge: '🌟 Inicio',
      desc: 'Perfecto para probar'
    },
    { 
      id: 'creator', 
      coins: 3500, 
      price: 9990, 
      popular: true,
      badge: '🔥 Popular',
      desc: 'Para creadores activos',
      bonus: '+500 monedas extra'
    },
    { 
      id: 'pro', 
      coins: 8000, 
      price: 19990, 
      popular: false,
      badge: '💎 Pro',
      desc: 'Máximo rendimiento',
      bonus: '+1500 monedas extra'
    },
    { 
      id: 'ultimate', 
      coins: 15000, 
      price: 25000, 
      popular: false,
      badge: '👑 Ultimate',
      desc: 'El mejor valor',
      bonus: '+5000 monedas extra'
    }
  ];

  // Función para comprar monedas
  const handlePurchaseCoins = async (packageId: string) => {
    const pkg = COIN_PACKAGES.find(p => p.id === packageId);
    
    if (!pkg) {
      alert('Paquete no encontrado');
      return;
    }

    if (!user || !user._id) {
      alert('Debes iniciar sesión para comprar monedas');
      router.push('/auth/login');
      return;
    }

    setPurchasingPackage(packageId);
    try {
      console.log('💰 Iniciando compra:', {
        userId: user._id,
        packageId: pkg.id,
        coins: pkg.coins,
        price: pkg.price
      });

      // Llamar a la API para crear la transacción de Webpay
      const response = await fetch('/api/webpay/create-coins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user._id,
          packageId: pkg.id,
          coins: pkg.coins,
          price: pkg.price,
        }),
      });

      const data = await response.json();

      console.log('📦 Respuesta del servidor:', data);

      if (!data.success) {
        throw new Error(data.error || 'Error al crear la transacción');
      }

      console.log('✅ Redirecting to Webpay:', data.url);

      // Redirigir a Webpay
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = data.url;

      const tokenInput = document.createElement('input');
      tokenInput.type = 'hidden';
      tokenInput.name = 'token_ws';
      tokenInput.value = data.token;

      form.appendChild(tokenInput);
      document.body.appendChild(form);
      form.submit();
      
    } catch (error: any) {
      console.error('Error al comprar monedas:', error);
      alert(`Error: ${error.message}`);
      setPurchasingPackage(null);
    }
  };

  // Validar imagen para Meshy
  const validateImageForMeshy = (file: File): string | null => {
    // Validar tipo MIME
    if (!MESHY_SUPPORTED_FORMATS.includes(file.type)) {
      const ext = file.name.split('.').pop()?.toLowerCase();
      return `Formato "${ext?.toUpperCase() || 'desconocido'}" no soportado. Meshy solo acepta JPG y PNG.`;
    }
    // Validar tamaño
    if (file.size > MAX_IMAGE_SIZE) {
      const sizeMB = (file.size / 1024 / 1024).toFixed(1);
      return `Imagen muy grande (${sizeMB}MB). Máximo 10MB.`;
    }
    return null;
  };

  // Handler para selección de imagen con validación
  const handleImageSelect = (file: File | null) => {
    setImageError(null);
    if (!file) {
      setImage(null);
      return;
    }
    const error = validateImageForMeshy(file);
    if (error) {
      setImageError(error);
      setImage(null);
      // Auto-limpiar error después de 5 segundos
      setTimeout(() => setImageError(null), 5000);
      return;
    }
    setImage(file);
  };
  const [selectedTask, setSelectedTask] = useState<GenerationTask | null>(null);
  const [loadingTask, setLoadingTask] = useState(false);
  const [showSuccessBadge, setShowSuccessBadge] = useState(false);
  const [includeTextures, setIncludeTextures] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<GenerationTask | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState<{coins: number, packageId: string} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { authDelete, getToken } = useAuthenticatedFetch();

  // Detectar si venimos de un pago exitoso
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const purchase = searchParams.get('purchase');
    const coins = searchParams.get('coins');
    const packageId = searchParams.get('package');

    if (purchase === 'success' && coins && packageId) {
      setPurchaseSuccess({ coins: parseInt(coins), packageId });
      // Limpiar URL
      window.history.replaceState({}, '', '/takopi-ia');
      // Auto-ocultar después de 5 segundos
      setTimeout(() => setPurchaseSuccess(null), 5000);
    }
  }, []);

  // Ref para trackear si debe auto-refinar cuando termine el preview
  const shouldAutoRefineRef = useRef(false);
  const lastRefineTaskIdRef = useRef<string | null>(null);

  // Tarea a mostrar: la seleccionada del historial o la actual
  const displayTask = selectedTask || currentTask;

  // Cargar historial y balance solo si está autenticado
  useEffect(() => {
    if (!user) {
      setBalanceLoading(false);
      return;
    }

    const init = async () => {
      await Promise.all([loadHistory(), loadBalance()]);
      setBalanceLoading(false);
    };
    init();
  }, [loadHistory, loadBalance, user]);

  // Limpiar selección cuando hay una nueva generación
  useEffect(() => {
    if (isGenerating) {
      setSelectedTask(null);
    }
  }, [isGenerating]);

  // AUTO-REFINE: Cuando el preview termina, aplicar texturas automáticamente
  useEffect(() => {
    const shouldRefine =
      currentTask?.status === 'SUCCEEDED' &&
      currentTask?.taskType === 'text-to-3d' &&
      currentTask?.mode === 'preview' &&
      shouldAutoRefineRef.current &&
      !isRefining &&
      lastRefineTaskIdRef.current !== currentTask.taskId;

    if (shouldRefine && currentTask) {
      lastRefineTaskIdRef.current = currentTask.taskId;
      shouldAutoRefineRef.current = false;
      setIsRefining(true);

      refine(currentTask.taskId, { enablePbr: true, aiModel: currentTask.aiModel })
        .then(() => {
          setTimeout(() => loadBalance(), 2000);
        })
        .catch((err) => {
          console.error('❌ Error iniciando refine:', err);
          setIsRefining(false);
        });
    }
  }, [currentTask?.status, currentTask?.taskType, currentTask?.mode, currentTask?.taskId, isRefining, refine, loadBalance]);

  // Detectar cuando refine termina y actualizar historial
  useEffect(() => {
    if (currentTask?.taskType === 'text-to-3d-refine' &&
      ['SUCCEEDED', 'FAILED', 'CANCELED'].includes(currentTask?.status || '')) {
      setIsRefining(false);
      // Recargar historial para mostrar el modelo con texturas
      loadHistory();
    }
  }, [currentTask?.taskType, currentTask?.status, loadHistory]);

  // Actualizar historial cuando CUALQUIER tarea termina (no solo refine)
  useEffect(() => {
    if (currentTask && ['SUCCEEDED', 'FAILED', 'CANCELED'].includes(currentTask.status)) {
      // Pequeño delay para asegurar que el backend actualizó
      const timer = setTimeout(() => loadHistory(), 500);
      return () => clearTimeout(timer);
    }
  }, [currentTask?.status, currentTask?.id, loadHistory]);

  // Si selectedTask está en el historial y se actualizó, sincronizar
  useEffect(() => {
    if (selectedTask) {
      const updatedTask = history.find(h => h.id === selectedTask.id);
      if (updatedTask && updatedTask.status !== selectedTask.status) {
        setSelectedTask(updatedTask);
      }
    }
  }, [history, selectedTask]);

  // Mostrar badge "Listo" por 2 segundos cuando termina una generación (refine o final)
  useEffect(() => {
    // Solo mostrar badge cuando el modelo final está listo (no preview si hay auto-refine pendiente)
    const isReallyDone = currentTask?.status === 'SUCCEEDED' &&
      (currentTask?.taskType === 'text-to-3d-refine' ||
        currentTask?.taskType === 'image-to-3d' ||
        (currentTask?.taskType === 'text-to-3d' && currentTask?.mode !== 'preview'));

    if (isReallyDone) {
      setShowSuccessBadge(true);
      const timer = setTimeout(() => setShowSuccessBadge(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [currentTask?.status, currentTask?.taskType, currentTask?.mode]);

  useEffect(() => {
    if (!currentTask || ['SUCCEEDED', 'FAILED', 'CANCELED'].includes(currentTask.status)) return;
    const interval = setInterval(() => poll(currentTask.id), 3000);
    return () => clearInterval(interval);
  }, [currentTask, poll]);

  // Eliminar modelo del historial (Blob + DB)
  const handleDeleteGeneration = useCallback(async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      const { error } = await authDelete(`/api/ai/tasks/${deleteTarget.id}`);
      if (error) {
        alert('Error al eliminar el modelo');
      } else {
        await loadHistory();
        if (selectedTask?.id === deleteTarget.id) {
          setSelectedTask(null);
        }
      }
    } catch {
      alert('Error al eliminar el modelo');
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  }, [deleteTarget, authDelete, loadHistory, selectedTask]);

  // Seleccionar tarea del historial (obtiene URLs frescas)
  const handleSelectFromHistory = async (task: GenerationTask) => {
    // Si es la tarea actual en progreso, limpiar selección para mostrar el progreso
    if (currentTask && task.id === currentTask.id) {
      setSelectedTask(null);
      return;
    }

    // Si la tarea está en progreso (no es la actual), no hacer nada
    // El usuario verá el indicador de loading en el historial
    if (!['SUCCEEDED', 'FAILED', 'CANCELED'].includes(task.status)) {
      return;
    }

    setLoadingTask(true);
    setIsRefining(false);
    try {
      const freshTask = await poll(task.id);
      setSelectedTask(freshTask || task);
    } catch {
      setSelectedTask(task);
    } finally {
      setLoadingTask(false);
    }
  };

  // Función para volver a ver el progreso actual
  const handleBackToCurrentTask = () => {
    setSelectedTask(null);
  };

  // Determinar si hay una tarea en progreso que no estamos viendo
  const hasActiveTaskNotViewing = currentTask &&
    !['SUCCEEDED', 'FAILED', 'CANCELED'].includes(currentTask.status) &&
    selectedTask !== null;

  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleGenerate = async () => {
    // Verificar autenticación antes de generar
    if (!user) {
      router.push(`/auth/login?redirect=${encodeURIComponent('/takopi-ia')}`);
      return;
    }

    if (mode === 'text-to-3d' && !prompt.trim()) return;
    if (mode === 'image-to-3d' && !image) return;

    // Si es text-to-3d con texturas, activar auto-refine
    if (mode === 'text-to-3d' && includeTextures) {
      shouldAutoRefineRef.current = true;
      lastRefineTaskIdRef.current = null;
    }

    let imageUrl: string | undefined;

    // Si es image-to-3d, primero subir la imagen a Blob
    if (mode === 'image-to-3d' && image) {
      try {
        setIsUploadingImage(true);
        const formData = new FormData();
        formData.append('file', image);

        const token = getToken();
        const response = await fetch('/api/upload/ai-image', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || 'Error al subir imagen');
        }

        const data = await response.json();
        imageUrl = data.url;
      } catch (err) {
        console.error('❌ Error subiendo imagen:', err);
        setIsUploadingImage(false);
        return;
      } finally {
        setIsUploadingImage(false);
      }
    }

    await generate({
      type: mode,
      prompt: prompt.trim(),
      imageUrl,
      aiModel: aiModel as 'meshy-4' | 'meshy-5' | 'latest',
    });
    setTimeout(() => loadBalance(), 2000);
  };

  const selectedModel = AI_MODELS.find(m => m.id === aiModel);

  // Calcular créditos estimados
  const getEstimatedCredits = () => {
    if (mode === 'text-to-3d') {
      const baseCredits = selectedModel?.credits || 5;
      // Refine cuesta 10 créditos adicionales
      return includeTextures ? baseCredits + 10 : baseCredits;
    }
    return 20; // Image to 3D default
  };

  return (
    <Layout>
      <div className="relative min-h-screen bg-[#050505] overflow-hidden font-sans selection:bg-purple-500/30">

        {/* Ambient Glows - más sutiles en mobile */}
        <div className="fixed top-0 left-1/4 w-[200px] h-[200px] sm:w-[500px] sm:h-[500px] bg-purple-600/8 sm:bg-purple-600/10 rounded-full blur-[60px] sm:blur-[120px] pointer-events-none" />
        <div className="fixed bottom-0 right-1/4 w-[200px] h-[200px] sm:w-[500px] sm:h-[500px] bg-blue-600/5 rounded-full blur-[60px] sm:blur-[120px] pointer-events-none" />

        {/* ==================== MOBILE LAYOUT ==================== */}
        <div className="lg:hidden relative min-h-screen flex flex-col pt-16">

          {/* Main Content - Scrollable */}
          <main className="flex-1 pb-6 px-4 overflow-y-auto">
            
            {/* 3D Viewer - Prominente */}
            <section className="mb-4">
              <div className="aspect-square max-h-[45vh] w-full rounded-2xl border border-white/10 bg-black/30 backdrop-blur-sm relative overflow-hidden shadow-xl">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 pointer-events-none" />
                
                {/* Success Badge */}
                {showSuccessBadge && (
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 px-3 py-1 bg-green-500/20 backdrop-blur-xl border border-green-500/30 rounded-full">
                    <span className="text-green-400 font-bold text-xs flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" />
                      ¡Listo!
                    </span>
                  </div>
                )}

                {/* Purchase Success Badge */}
                {purchaseSuccess && (
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 px-4 py-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 backdrop-blur-xl border border-amber-500/30 rounded-full shadow-lg">
                    <span className="text-amber-400 font-bold text-xs flex items-center gap-2">
                      <Image src="/icons/takopi-coin.png" alt="coin" width={16} height={16} />
                      ¡Compra exitosa! +{purchaseSuccess.coins.toLocaleString()} monedas
                    </span>
                  </div>
                )}

                {/* Back to Progress Button */}
                {hasActiveTaskNotViewing && (
                  <button
                    onClick={handleBackToCurrentTask}
                    className="absolute top-3 left-1/2 -translate-x-1/2 z-30 px-3 py-1.5 bg-purple-600/90 backdrop-blur-xl border border-purple-400/30 rounded-full shadow-lg animate-pulse"
                  >
                    <span className="text-white font-bold text-xs flex items-center gap-1.5">
                      <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Ver Progreso
                    </span>
                  </button>
                )}

                <AIModelViewer
                  task={displayTask}
                  isGenerating={isGenerating && !selectedTask}
                  isRefining={isRefining}
                  isLoadingHistory={loadingTask}
                  includeTextures={includeTextures}
                />

                {/* Manual Refine Button */}
                {displayTask?.status === 'SUCCEEDED' &&
                  displayTask?.taskType === 'text-to-3d' &&
                  displayTask?.mode === 'preview' &&
                  !isRefining && (
                    <button
                      onClick={() => {
                        setIsRefining(true);
                        refine(displayTask.taskId, { enablePbr: true, aiModel: displayTask.aiModel })
                          .catch(() => setIsRefining(false));
                      }}
                      className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs rounded-full shadow-lg"
                    >
                      🎨 +Texturas
                    </button>
                  )}
              </div>
            </section>

            {/* Controls Card - Compacto y elegante */}
            <section className="mb-4">
              <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 space-y-4">
                
                {/* Mode Switcher - Same style as desktop */}
                <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-full p-1 flex">
                  <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white/10 rounded-full transition-all duration-300 ease-out ${mode === 'image-to-3d' ? 'translate-x-[calc(100%+4px)]' : 'translate-x-0'}`} />
                  <button
                    onClick={() => setMode('text-to-3d')}
                    className={`relative flex-1 py-2 px-4 rounded-full text-xs font-medium transition-colors z-10 ${mode === 'text-to-3d' ? 'text-white' : 'text-gray-400'}`}
                  >
                    Texto a 3D
                  </button>
                  <button
                    onClick={() => setMode('image-to-3d')}
                    className={`relative flex-1 py-2 px-4 rounded-full text-xs font-medium transition-colors z-10 ${mode === 'image-to-3d' ? 'text-white' : 'text-gray-400'}`}
                  >
                    Imagen a 3D
                  </button>
                </div>

                {/* Input Area */}
                {mode === 'text-to-3d' ? (
                  <>
                    {/* Prompt */}
                    <div className="relative">
                      <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Describe lo que quieres crear..."
                        className="w-full h-20 p-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500/50 resize-none text-sm"
                        maxLength={1000}
                      />
                      <span className="absolute bottom-2 right-2 text-[10px] text-gray-600">{prompt.length}/1000</span>
                    </div>

                    {/* Texture Toggle - Inline */}
                    <div className="flex items-center justify-between py-2 px-3 bg-white/5 rounded-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">🎨</span>
                        <span className="text-xs text-gray-300">Texturas PBR</span>
                      </div>
                      <button
                        onClick={() => setIncludeTextures(!includeTextures)}
                        className={`w-9 h-5 rounded-full transition-all ${includeTextures ? 'bg-purple-600' : 'bg-white/10'}`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white transition-all ${includeTextures ? 'translate-x-4' : 'translate-x-0.5'}`} />
                      </button>
                    </div>
                  </>
                ) : (
                  /* Image Upload - Compact */
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 border-dashed cursor-pointer transition-all ${image ? 'border-purple-500/50 bg-purple-500/5' : 'border-white/10 bg-black/20'}`}
                  >
                    <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png" onChange={(e) => handleImageSelect(e.target.files?.[0] || null)} className="hidden" />
                    {image ? (
                      <>
                        <img src={URL.createObjectURL(image)} alt="" className="w-12 h-12 object-cover rounded-lg" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-white truncate">{image.name}</p>
                          <p className="text-[10px] text-gray-500">Toca para cambiar</p>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); setImage(null); }}
                          className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center text-red-400 text-xs"
                        >
                          ✕
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                          <span className="text-lg">📷</span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-300">Subir imagen</p>
                          <p className="text-[10px] text-gray-500">PNG/JPG hasta 10MB</p>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {imageError && (
                  <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                    <p className="text-red-400 text-xs">{imageError}</p>
                  </div>
                )}

                {/* AI Model Selector - Compact Pills */}
                <div className="flex gap-2">
                  {AI_MODELS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setAiModel(m.id)}
                      className={`flex-1 py-2 px-3 rounded-xl border text-left transition-all ${aiModel === m.id
                        ? 'border-purple-500/50 bg-purple-900/30'
                        : 'border-white/10 bg-black/20'}`}
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-white font-semibold text-xs">{m.name}</span>
                        {aiModel === m.id && <div className="w-1.5 h-1.5 rounded-full bg-green-400" />}
                      </div>
                      <div className="flex items-center gap-1">
                        <Image src="/icons/takopi-coin.png" alt="coin" width={10} height={10} />
                        <span className="text-[10px] text-yellow-500 font-mono">{m.credits}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-400 text-xs">⚠️ {error}</p>
                  </div>
                )}
              </div>
            </section>

            {/* History - Horizontal Scroll */}
            {history.length > 0 && (
              <section>
                <div className="flex items-center gap-1.5 mb-1.5 px-1">
                  <span className="text-xs">📜</span>
                  <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Recientes</h3>
                </div>
                <div className="flex gap-1.5 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                  {history.slice(0, 10).map((t) => {
                    const thumbSrc = getProxiedUrl(t.thumbnailUrl);
                    const isViewing = selectedTask?.id === t.id || (currentTask?.id === t.id && !selectedTask);
                    return (
                      <div
                        key={t.id}
                        onClick={() => handleSelectFromHistory(t)}
                        className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${isViewing ? 'border-purple-500 shadow-lg shadow-purple-500/20' : 'border-transparent'}`}
                      >
                        {thumbSrc ? (
                          <img src={thumbSrc} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-white/5 flex items-center justify-center text-sm">
                            {t.status === 'SUCCEEDED' ? '🎨' : t.status === 'FAILED' ? '❌' : '🔄'}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
            {/* Generate Button - Inline */}
            <section className="mt-4 mb-6">
              <button
                onClick={handleGenerate}
                disabled={isGenerating || isUploadingImage || (mode === 'text-to-3d' && !prompt.trim()) || (mode === 'image-to-3d' && !image)}
                className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${isGenerating || isUploadingImage || (mode === 'text-to-3d' && !prompt.trim()) || (mode === 'image-to-3d' && !image)
                  ? 'bg-white/5 text-gray-500 border border-white/5'
                  : 'bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.15)]'
                }`}
              >
                {isUploadingImage ? (
                  <><span className="w-4 h-4 border-2 border-gray-400 border-t-black rounded-full animate-spin" />Subiendo...</>
                ) : isGenerating ? (
                  <><span className="w-4 h-4 border-2 border-gray-400 border-t-black rounded-full animate-spin" />Creando...</>
                ) : (
                  <>✨ Crear <span className="text-xs opacity-60 flex items-center gap-1">({getEstimatedCredits()} <Image src="/icons/takopi-coin.png" alt="coin" width={12} height={12} />)</span></>
                )}
              </button>
            </section>
          </main>
        </div>

        {/* ==================== DESKTOP LAYOUT ==================== */}
        <main className="hidden lg:flex relative z-10 h-screen pt-28 pb-6 px-6 flex-row gap-6 overflow-hidden">

          {/* Left: Config Panel */}
          <div className="w-[400px] flex flex-col h-full py-10">
            {/* Mode Switcher */}
            <div className="flex justify-center mb-4">
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-full p-1 flex w-full max-w-[300px]">
                <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white/10 rounded-full transition-all duration-300 ease-out ${mode === 'image-to-3d' ? 'translate-x-[calc(100%+4px)]' : 'translate-x-0'}`} />
                <button onClick={() => setMode('text-to-3d')} className={`relative flex-1 py-2 rounded-full text-sm font-medium transition-colors z-10 ${mode === 'text-to-3d' ? 'text-white' : 'text-gray-400 hover:text-white'}`}>
                  Texto a 3D
                </button>
                <button onClick={() => setMode('image-to-3d')} className={`relative flex-1 py-2 rounded-full text-sm font-medium transition-colors z-10 ${mode === 'image-to-3d' ? 'text-white' : 'text-gray-400 hover:text-white'}`}>
                  Imagen a 3D
                </button>
              </div>
            </div>

            <div className="flex-1 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-6 shadow-2xl shadow-black/50 overflow-y-auto custom-scrollbar hover:border-white/20 transition-colors duration-500">
              <div className="space-y-8">
                {/* Input Area */}
                {mode === 'text-to-3d' ? (
                  <div className="group">
                    <label className="block text-xs font-bold text-purple-300 uppercase tracking-wider mb-3 ml-1">Prompt Creativo</label>
                    <div className="relative">
                      <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Describe tu imaginación..."
                        className="w-full h-40 p-5 bg-black/30 border border-white/10 rounded-3xl text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.03] transition-all resize-none text-lg leading-relaxed shadow-inner"
                        maxLength={1000}
                      />
                      <div className="absolute bottom-4 right-4 text-xs text-gray-600 font-mono bg-black/50 px-2 py-1 rounded-md">{prompt.length}/1000</div>
                    </div>
                    {/* Texture Switch */}
                    <div className="mt-4 flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${includeTextures ? 'bg-purple-500/20 text-purple-400' : 'bg-white/5 text-gray-500'}`}>
                          <span className="text-lg">🎨</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-200 block">Incluir Texturas</span>
                          <span className="text-[10px] text-gray-500 block">Genera materiales PBR</span>
                        </div>
                      </div>
                      <button onClick={() => setIncludeTextures(!includeTextures)} className={`relative w-12 h-6 rounded-full transition-all duration-300 ${includeTextures ? 'bg-purple-600 shadow-[0_0_10px_rgba(168,85,247,0.4)]' : 'bg-white/10'}`}>
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${includeTextures ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-purple-300 uppercase tracking-wider mb-3 ml-1">Referencia Visual</label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className={`aspect-square rounded-3xl border-2 border-dashed cursor-pointer transition-all duration-300 flex flex-col items-center justify-center relative overflow-hidden group ${image ? 'border-purple-500/50 bg-purple-500/5' : 'border-white/10 bg-black/20 hover:border-purple-500/30 hover:bg-white/5'}`}
                    >
                      <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png" onChange={(e) => handleImageSelect(e.target.files?.[0] || null)} className="hidden" />
                      {image ? (
                        <>
                          <img src={URL.createObjectURL(image)} alt="" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                          <button onClick={(e) => { e.stopPropagation(); setImage(null); }} className="absolute top-4 right-4 w-8 h-8 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-red-500/80 transition-colors border border-white/10">✕</button>
                        </>
                      ) : (
                        <>
                          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-white/5">
                            <span className="text-3xl">📷</span>
                          </div>
                          <p className="mt-4 text-gray-400 font-medium">Sube tu imagen</p>
                          <p className="text-gray-600 text-xs">PNG/JPG (máx 10MB)</p>
                        </>
                      )}
                    </div>
                    {imageError && (
                      <div className="mt-3 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2">
                        <span className="text-red-400 text-lg">⚠️</span>
                        <div>
                          <p className="text-red-400 text-sm font-medium">{imageError}</p>
                          <p className="text-red-400/60 text-xs mt-1">Convierte tu imagen a JPG o PNG.</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Model Selector */}
                <div>
                  <label className="block text-xs font-bold text-purple-300 uppercase tracking-wider mb-3 ml-1">Motor de IA</label>
                  <div className="grid grid-cols-2 gap-2">
                    {AI_MODELS.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setAiModel(m.id)}
                        className={`p-3 rounded-xl border text-left transition-all duration-300 ${aiModel === m.id ? 'border-purple-500/50 bg-gradient-to-br from-purple-900/40 to-black' : 'border-white/10 bg-black/20 hover:bg-white/5'}`}
                      >
                        <div className="flex justify-between items-start mb-0.5">
                          <span className="text-white font-bold text-sm">{m.name}</span>
                          {aiModel === m.id && <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_10px_#4ade80]" />}
                        </div>
                        <p className="text-[10px] text-gray-400 mb-1.5">{m.desc}</p>
                        <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white/5 border border-white/5">
                          <Image src="/icons/takopi-coin.png" alt="coin" width={10} height={10} />
                          <span className="text-[10px] font-mono text-yellow-500">{m.credits}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl backdrop-blur-sm">
                    <p className="text-red-400 text-sm font-medium flex items-center gap-2"><span>⚠️</span> {error}</p>
                  </div>
                )}
              </div>

              {/* Generate Button */}
              <div className="mt-8">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || isUploadingImage || (mode === 'text-to-3d' && !prompt.trim()) || (mode === 'image-to-3d' && !image)}
                  className={`w-full py-5 rounded-2xl font-black text-lg tracking-wide transition-all duration-500 relative overflow-hidden group ${isGenerating || isUploadingImage || (mode === 'text-to-3d' && !prompt.trim()) || (mode === 'image-to-3d' && !image) ? 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/5' : 'bg-white text-black hover:scale-[1.02] shadow-[0_0_40px_rgba(255,255,255,0.2)]'}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-shimmer" />
                  <span className="relative flex items-center justify-center gap-3">
                    {isUploadingImage ? (
                      <><span className="w-5 h-5 border-2 border-gray-400 border-t-black rounded-full animate-spin" />SUBIENDO IMAGEN...</>
                    ) : isGenerating ? (
                      <><span className="w-5 h-5 border-2 border-gray-400 border-t-black rounded-full animate-spin" />MATERIALIZANDO...</>
                    ) : (
                      <>CREAR AHORA<span className="text-xs opacity-60 font-normal ml-1 inline-flex items-center gap-1">({getEstimatedCredits()} <Image src="/icons/takopi-coin.png" alt="coin" width={12} height={12} className="inline" />)</span></>
                    )}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Center: 3D Viewer */}
          <div className="flex-1 h-full py-4 relative">
            <div className="h-full w-full rounded-[3rem] border border-white/10 bg-black/20 backdrop-blur-sm relative overflow-hidden shadow-2xl shadow-black/80 group">
              <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20 pointer-events-none" />
              {showSuccessBadge && (
                <div className="absolute top-8 left-1/2 -translate-x-1/2 z-30 px-6 py-2 bg-green-500/20 backdrop-blur-xl border border-green-500/30 rounded-full animate-bounce-in shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                  <span className="text-green-400 font-bold tracking-wide flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />GENERACIÓN COMPLETADA
                  </span>
                </div>
              )}
              {hasActiveTaskNotViewing && (
                <button onClick={handleBackToCurrentTask} className="absolute top-8 left-1/2 -translate-x-1/2 z-30 px-6 py-3 bg-purple-600/90 hover:bg-purple-500 backdrop-blur-xl border border-purple-400/30 rounded-full shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all hover:scale-105 animate-pulse">
                  <span className="text-white font-bold tracking-wide flex items-center gap-2 text-sm">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {isRefining ? 'TEXTURIZANDO...' : 'GENERANDO...'} — Ver Progreso
                  </span>
                </button>
              )}
              <AIModelViewer task={displayTask} isGenerating={isGenerating && !selectedTask} isRefining={isRefining} isLoadingHistory={loadingTask} includeTextures={includeTextures} />
              {displayTask?.status === 'SUCCEEDED' && displayTask?.taskType === 'text-to-3d' && displayTask?.mode === 'preview' && !isRefining && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
                  <button onClick={() => { setIsRefining(true); refine(displayTask.taskId, { enablePbr: true, aiModel: displayTask.aiModel }).catch(() => setIsRefining(false)); }} className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-bold rounded-full shadow-lg shadow-orange-500/30 transition-all hover:scale-105 flex items-center gap-2">
                    <span>🎨</span>AGREGAR TEXTURAS (10 💎)
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right: History Sidebar */}
          <div className="w-48 h-full py-10 flex flex-col gap-3">
            {/* Coin Balance - Modern with hover buy button */}
            <div 
              onClick={() => setShowCoinModal(true)}
              className="group relative flex items-center gap-4 px-5 py-3.5 bg-gradient-to-br from-amber-950/40 via-yellow-950/30 to-amber-950/40 border border-amber-500/30 rounded-2xl hover:border-amber-400/50 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/5 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute -top-10 -left-10 w-20 h-20 bg-amber-500/20 rounded-full blur-2xl opacity-50" />
              
              {/* Coin icon with ring */}
              <div className="relative">
                <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-md animate-pulse" />
                <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-amber-900/50 to-amber-950/50 border border-amber-500/30 flex items-center justify-center">
                  <Image src="/icons/takopi-coin.png" alt="Coins" width={26} height={26} className="drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
                </div>
              </div>
              
              {/* Balance text */}
              <div className="relative flex flex-col flex-1">
                <span className="font-bold text-xl text-white tracking-tight">
                  {balance?.toLocaleString() ?? '—'}
                </span>
                <span className="text-[9px] text-amber-400/70 uppercase tracking-widest font-semibold">Takopi Coins</span>
              </div>
              
              {/* Add button - shows on hover */}
              <div className="absolute right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0 translate-x-2">
                <div className="w-8 h-8 rounded-full bg-amber-500 hover:bg-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/30 transition-colors">
                  <span className="text-black font-bold text-lg leading-none">+</span>
                </div>
              </div>
            </div>
            
            <div className="flex-1 bg-black/40 backdrop-blur-xl border border-white/10 rounded-[1.5rem] p-3 flex flex-col shadow-xl overflow-hidden">
              <div className="flex items-center gap-2 mb-4 px-1">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                  <span className="text-base">📜</span>
                </div>
                <div>
                  <h3 className="font-bold text-white text-xs tracking-wide">HISTORIAL</h3>
                  <p className="text-[9px] text-gray-500 font-medium leading-none">Recientes</p>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
                {history.map((t) => {
                  const thumbSrc = getProxiedUrl(t.thumbnailUrl);
                  const hasTextures = t.taskType === 'text-to-3d-refine' || t.taskType === 'image-to-3d' || t.mode === 'refine';
                  const isCurrentTask = currentTask?.id === t.id;
                  const isViewingThis = selectedTask?.id === t.id || (isCurrentTask && !selectedTask);
                  return (
                    <div key={t.id} onClick={() => handleSelectFromHistory(t)} className={`group relative rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden ${isViewingThis ? 'bg-white/10 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.15)]' : 'bg-black/20 border-white/5 hover:bg-white/5 hover:border-white/10'}`}>
                      <div className="aspect-[2/1] w-full bg-black/50 relative">
                        {thumbSrc ? <img src={thumbSrc} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" /> : <div className="w-full h-full flex items-center justify-center text-xl">{t.status === 'SUCCEEDED' ? '🎨' : t.status === 'FAILED' ? '❌' : '🔄'}</div>}
                        {hasTextures && <div className="absolute top-1 left-1 w-4 h-4 bg-fuchsia-500 flex items-center justify-center rounded-full shadow-sm z-10"><span className="text-[8px]">✨</span></div>}
                        <div className="absolute bottom-0 inset-x-0 p-1.5 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                          <div className="flex justify-between items-end">
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold backdrop-blur-sm ${t.status === 'SUCCEEDED' ? 'bg-green-500/20 text-green-400' : t.status === 'FAILED' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400 animate-pulse'}`}>
                              {t.status === 'SUCCEEDED' ? 'Listo' : t.status === 'FAILED' ? 'Error' : 'Procesando'}
                            </span>
                            <span className="text-[9px] text-gray-300 font-medium drop-shadow-md truncate max-w-[50px]">{new Date(t.createdAt).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' })}</span>
                          </div>
                        </div>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(t); }} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm z-20">
                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  );
                })}
                {history.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-10 opacity-40">
                    <span className="text-4xl mb-2">🕸️</span>
                    <p className="text-sm text-gray-500">Sin historial aún</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Modal de confirmación para eliminar */}
        {
          deleteTarget && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={() => !isDeleting && setDeleteTarget(null)}
              />

              {/* Modal */}
              <div className="relative bg-[#0a0a0a] border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                {/* Icono */}
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>

                {/* Título */}
                <h3 className="text-base sm:text-lg font-bold text-white text-center mb-2">
                  ¿Eliminar modelo?
                </h3>

                {/* Descripción */}
                <p className="text-xs sm:text-sm text-gray-400 text-center mb-1">
                  Esta acción no se puede deshacer.
                </p>
                <p className="text-[10px] sm:text-xs text-gray-500 text-center mb-4 sm:mb-6 truncate px-4">
                  &quot;{deleteTarget?.prompt?.slice(0, 30) || 'Sin título'}{deleteTarget?.prompt && deleteTarget.prompt.length > 30 ? '...' : ''}&quot;
                </p>

                {/* Botones */}
                <div className="flex gap-2 sm:gap-3">
                  <button
                    onClick={() => setDeleteTarget(null)}
                    disabled={isDeleting}
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-gray-300 transition-colors disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDeleteGeneration}
                    disabled={isDeleting}
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-red-500 hover:bg-red-600 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 sm:gap-2"
                  >
                    {isDeleting ? (
                      <>
                        <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span className="hidden sm:inline">Eliminando...</span>
                        <span className="sm:hidden">...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Eliminar
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )
        }

        {/* Modal de compra de monedas */}
        {showCoinModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => !purchasingPackage && setShowCoinModal(false)}
            />

            {/* Modal */}
            <div className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-4xl w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
              {/* Close Button */}
              <button
                onClick={() => !purchasingPackage && setShowCoinModal(false)}
                disabled={!!purchasingPackage}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors disabled:opacity-50"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border border-amber-500/30 mb-4">
                  <Image src="/icons/takopi-coin.png" alt="Coins" width={48} height={48} className="drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-white mb-2">
                  <span className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                    Comprar Monedas
                  </span>
                </h2>
                <p className="text-gray-400 text-sm sm:text-base">
                  Monedas de Meshy compartidas por todos los usuarios
                </p>
              </div>

              {/* Packages Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                {COIN_PACKAGES.map((pkg) => (
                  <div
                    key={pkg.id}
                    className={`relative group bg-gradient-to-b from-white/5 to-white/[0.02] border rounded-2xl p-5 sm:p-6 hover:border-amber-500/50 transition-all duration-300 ${
                      pkg.popular ? 'border-amber-500/50 shadow-[0_0_30px_rgba(251,191,36,0.15)] sm:scale-105' : 'border-white/10'
                    }`}
                  >
                    {/* Popular Badge */}
                    {pkg.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full text-xs font-bold text-black shadow-lg">
                        MÁS POPULAR
                      </div>
                    )}

                    {/* Glow Effect */}
                    <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                      pkg.popular ? 'bg-gradient-to-b from-amber-500/10 to-transparent' : ''
                    }`} />

                    {/* Content */}
                    <div className="relative flex flex-col h-full">
                      {/* Badge Icon and Title */}
                      <div className="text-center mb-3 sm:mb-4">
                        <div className="text-3xl sm:text-4xl mb-2">{pkg.badge.split(' ')[0]}</div>
                        <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider mb-1">
                          {pkg.badge.split(' ')[1]}
                        </h3>
                        <p className="text-xs text-gray-500">{pkg.desc}</p>
                      </div>

                      {/* Coins Amount */}
                      <div className="flex-1 flex flex-col justify-center py-3 sm:py-4">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <Image src="/icons/takopi-coin.png" alt="coin" width={28} height={28} className="sm:w-8 sm:h-8" />
                          <span className="text-3xl sm:text-4xl font-black text-white">
                            {pkg.coins.toLocaleString()}
                          </span>
                        </div>
                        {pkg.bonus && (
                          <p className="text-xs text-amber-400 text-center font-medium mt-1">
                            {pkg.bonus}
                          </p>
                        )}
                      </div>

                      {/* Price */}
                      <div className="text-center mb-4">
                        <div className="inline-flex items-baseline gap-1">
                          <span className="text-2xl sm:text-3xl font-black text-white">
                            ${pkg.price.toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-400">CLP</span>
                        </div>
                      </div>

                      {/* Buy Button */}
                      <button
                        onClick={() => handlePurchaseCoins(pkg.id)}
                        disabled={!!purchasingPackage}
                        className={`w-full py-3 sm:py-3.5 rounded-xl font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                          pkg.popular
                            ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black hover:shadow-[0_0_20px_rgba(251,191,36,0.4)] hover:scale-[1.02]'
                            : 'bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20'
                        }`}
                      >
                        {purchasingPackage === pkg.id ? (
                          <>
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            <span>Procesando...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span>Comprar Ahora</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
