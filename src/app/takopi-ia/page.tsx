'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAIGenerator, type GenerationTask } from '@/hooks';
import { useRequireAuth, useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch';
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
      <div className="w-full h-full flex flex-col items-center justify-center relative z-10 px-8">
        
        {/* Indicador de Pasos (solo si hay 2 pasos) */}
        {showTwoSteps && (
          <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-3">
            {/* Paso 1: Modelado */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-500 ${
              !isRefinePhase 
                ? 'bg-purple-500/20 border-purple-500/50 text-purple-300' 
                : 'bg-green-500/10 border-green-500/30 text-green-400'
            }`}>
              <span className="text-lg">{!isRefinePhase ? '🔨' : '✓'}</span>
              <span className="text-sm font-medium">Modelado 3D</span>
            </div>
            
            {/* Conector */}
            <div className={`w-8 h-0.5 transition-all duration-500 ${
              isRefinePhase ? 'bg-gradient-to-r from-green-500 to-fuchsia-500' : 'bg-white/20'
            }`} />
            
            {/* Paso 2: Texturas */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-500 ${
              isRefinePhase 
                ? 'bg-fuchsia-500/20 border-fuchsia-500/50 text-fuchsia-300' 
                : 'bg-white/5 border-white/10 text-gray-500'
            }`}>
              <span className="text-lg">{isRefinePhase ? '🎨' : '⏳'}</span>
              <span className="text-sm font-medium">Texturizado</span>
            </div>
          </div>
        )}

        {/* Círculo de Progreso Principal */}
        <div className="relative w-48 h-48">
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
            <span className="text-4xl font-black text-white tracking-tighter">
              {Math.round(showTwoSteps ? totalProgress : progress)}%
            </span>
            <span className={`text-xs uppercase tracking-widest mt-1 font-bold ${isRefinePhase ? 'text-fuchsia-300' : 'text-purple-300'}`}>
              {isRefinePhase ? 'Texturizando' : 'Modelando'}
            </span>
          </div>
        </div>

        {/* Mensaje de Estado */}
        <div className={`mt-8 px-6 py-3 backdrop-blur-md border rounded-full ${isRefinePhase ? 'bg-fuchsia-500/5 border-fuchsia-500/20' : 'bg-white/5 border-white/10'}`}>
          <p className="text-gray-300 text-sm font-medium animate-pulse">
            {isRefinePhase 
              ? "Aplicando colores, materiales y texturas PBR..." 
              : (task?.prompt ? `Creando: "${task.prompt.length > 40 ? task.prompt.slice(0, 40) + '...' : task.prompt}"` : "Generando geometría 3D...")}
          </p>
        </div>

        {/* Barra de progreso lineal (visual secundario) */}
        {showTwoSteps && (
          <div className="mt-6 w-full max-w-md">
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  isRefinePhase 
                    ? 'bg-gradient-to-r from-green-500 via-fuchsia-500 to-fuchsia-400' 
                    : 'bg-gradient-to-r from-purple-600 to-purple-400'
                }`}
                style={{ width: `${totalProgress}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Inicio</span>
              <span className={isRefinePhase ? 'text-green-400' : 'text-purple-400'}>
                {!isRefinePhase ? `Modelando... ${Math.round(progress)}%` : '✓ Modelo listo'}
              </span>
              <span className={isRefinePhase ? 'text-fuchsia-400' : ''}>
                {isRefinePhase ? `Texturas... ${Math.round(progress)}%` : 'Texturas'}
              </span>
              <span>Listo</span>
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
  // Proteger la ruta
  const { isReady, user } = useRequireAuth();

  const {
    isGenerating, task: currentTask, history, balance, error,
    generate, refine, poll, loadHistory, loadBalance,
  } = useAIGenerator();

  const [mode, setMode] = useState<GenerationMode>('text-to-3d');
  const [prompt, setPrompt] = useState('');
  const [aiModel, setAiModel] = useState('meshy-4');
  const [image, setImage] = useState<File | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<GenerationTask | null>(null);
  const [loadingTask, setLoadingTask] = useState(false);
  const [showSuccessBadge, setShowSuccessBadge] = useState(false);
  const [includeTextures, setIncludeTextures] = useState(true);
  const [isRefining, setIsRefining] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<GenerationTask | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { authDelete } = useAuthenticatedFetch();
  
  // Ref para trackear si debe auto-refinar cuando termine el preview
  const shouldAutoRefineRef = useRef(false);
  const lastRefineTaskIdRef = useRef<string | null>(null);

  // Tarea a mostrar: la seleccionada del historial o la actual
  const displayTask = selectedTask || currentTask;

  useEffect(() => {
    const init = async () => {
      await Promise.all([loadHistory(), loadBalance()]);
      setBalanceLoading(false);
    };
    init();
  }, [loadHistory, loadBalance]);

  // Limpiar selección cuando hay una nueva generación
  useEffect(() => {
    if (isGenerating) {
      setSelectedTask(null);
    }
  }, [isGenerating]);

  // AUTO-REFINE: Cuando el preview termina, aplicar texturas automáticamente
  useEffect(() => {
    console.log('🔍 Auto-refine check:', {
      status: currentTask?.status,
      taskType: currentTask?.taskType,
      mode: currentTask?.mode,
      shouldAutoRefine: shouldAutoRefineRef.current,
      isRefining,
      lastRefineTaskId: lastRefineTaskIdRef.current,
      currentTaskId: currentTask?.taskId,
    });

    const shouldRefine = 
      currentTask?.status === 'SUCCEEDED' &&
      currentTask?.taskType === 'text-to-3d' &&
      currentTask?.mode === 'preview' &&
      shouldAutoRefineRef.current &&
      !isRefining &&
      lastRefineTaskIdRef.current !== currentTask.taskId;

    console.log('🎯 shouldRefine:', shouldRefine);

    if (shouldRefine && currentTask) {
      console.log('🚀 Iniciando auto-refine para:', currentTask.taskId);
      lastRefineTaskIdRef.current = currentTask.taskId;
      shouldAutoRefineRef.current = false;
      setIsRefining(true);
      
      refine(currentTask.taskId, { enablePbr: true, aiModel: currentTask.aiModel })
        .then(() => {
          console.log('✅ Refine iniciado exitosamente');
          setTimeout(() => loadBalance(), 2000);
        })
        .catch((err) => {
          console.error('❌ Error iniciando refine:', err);
          setIsRefining(false);
        });
    }
  }, [currentTask?.status, currentTask?.taskType, currentTask?.mode, currentTask?.taskId, isRefining, refine, loadBalance]);
  
  // Detectar cuando refine termina
  useEffect(() => {
    if (currentTask?.taskType === 'text-to-3d-refine' && 
        ['SUCCEEDED', 'FAILED', 'CANCELED'].includes(currentTask?.status || '')) {
      setIsRefining(false);
    }
  }, [currentTask?.taskType, currentTask?.status]);

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
    if (task.status !== 'SUCCEEDED') return;

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

  const handleGenerate = async () => {
    if (mode === 'text-to-3d' && !prompt.trim()) return;
    if (mode === 'image-to-3d' && !image) return;
    
    console.log('🎬 handleGenerate llamado:', { mode, includeTextures });
    
    // Si es text-to-3d con texturas, activar auto-refine
    if (mode === 'text-to-3d' && includeTextures) {
      shouldAutoRefineRef.current = true;
      lastRefineTaskIdRef.current = null;
      console.log('✅ shouldAutoRefineRef seteado a TRUE');
    }
    
    await generate({
      type: mode,
      prompt: prompt.trim(),
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


        {/* Ambient Glows */}
        <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Header Flotante - MOVIDO dentro del main layout flow */}
        <div className="absolute top-6 right-6 z-50 flex items-center gap-4 pointer-events-none">
          {/* Coin Balance */}
          <div className="pointer-events-auto flex items-center gap-3 px-5 py-2.5 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl shadow-purple-900/20 hover:border-purple-500/30 transition-colors group">
            <div className="relative w-8 h-8 group-hover:scale-110 transition-transform duration-300">
              <Image
                src="/icons/takopi-coin.png"
                alt="Takopi Coin"
                width={32}
                height={32}
                className="drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-white font-bold text-lg tracking-tight">
                {balanceLoading ? '...' : balance ?? '—'}
              </span>
              <span className="text-[10px] text-purple-300 font-medium uppercase tracking-wider">Takopi Coins</span>
            </div>
          </div>
        </div>

        {/* Main Layout */}
        <main className="relative z-10 h-screen pt-24 pb-6 px-6 flex gap-6">

          {/* Left: Floating Config Panel */}
          <div className="w-[400px] flex flex-col justify-center h-full py-10">
            
            {/* Mode Switcher - Estilo Navbar (fuera del contenedor) */}
            <div className="flex justify-center mb-4">
              <div className="bg-[#0D0D0D]/80 backdrop-blur-xl border border-white/10 rounded-full p-1.5 flex gap-1 shadow-xl">
                <button
                  onClick={() => setMode('text-to-3d')}
                  className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${mode === 'text-to-3d'
                    ? 'bg-white/10 text-white'
                    : 'text-gray-400 hover:text-white'
                    }`}
                >
                  Texto a 3D
                </button>
                <button
                  onClick={() => setMode('image-to-3d')}
                  className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${mode === 'image-to-3d'
                    ? 'bg-white/10 text-white'
                    : 'text-gray-400 hover:text-white'
                    }`}
                >
                  Imagen a 3D
                </button>
              </div>
            </div>

            <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-6 shadow-2xl shadow-black/50 overflow-y-auto custom-scrollbar hover:border-white/20 transition-colors duration-500">

              <div className="space-y-8">
                {/* Input Area */}
                {mode === 'text-to-3d' ? (
                  <div className="group">
                    <label className="block text-xs font-bold text-purple-300 uppercase tracking-wider mb-3 ml-1">Prompt Creativo</label>
                    <div className="relative">
                      <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Describe tu imaginación... (ej: Un dragón cyberpunk de cristal)"
                        className="w-full h-40 p-5 bg-black/30 border border-white/10 rounded-3xl text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.03] transition-all resize-none text-lg leading-relaxed shadow-inner"
                        maxLength={1000}
                      />
                      <div className="absolute bottom-4 right-4 text-xs text-gray-600 font-mono bg-black/50 px-2 py-1 rounded-md">
                        {prompt.length}/1000
                      </div>
                    </div>

                    {/* Texture Switch */}
                    <div className="mt-4 flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${includeTextures ? 'bg-purple-500/20 text-purple-400' : 'bg-white/5 text-gray-500'}`}>
                          <span className="text-lg">🎨</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-200 block">Incluir Texturas</span>
                          <span className="text-[10px] text-gray-500 block">Genera materiales PBR detallados</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setIncludeTextures(!includeTextures)}
                        className={`relative w-12 h-6 rounded-full transition-all duration-300 ${includeTextures ? 'bg-purple-600 shadow-[0_0_10px_rgba(168,85,247,0.4)]' : 'bg-white/10'
                          }`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${includeTextures ? 'left-7' : 'left-1'
                          }`} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-purple-300 uppercase tracking-wider mb-3 ml-1">Referencia Visual</label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className={`aspect-square rounded-3xl border-2 border-dashed cursor-pointer transition-all duration-300 flex flex-col items-center justify-center relative overflow-hidden group ${image ? 'border-purple-500/50 bg-purple-500/5' : 'border-white/10 bg-black/20 hover:border-purple-500/30 hover:bg-white/5'
                        }`}
                    >
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} className="hidden" />
                      {image ? (
                        <>
                          <img src={URL.createObjectURL(image)} alt="" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                          <button
                            onClick={(e) => { e.stopPropagation(); setImage(null); }}
                            className="absolute top-4 right-4 w-8 h-8 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-red-500/80 transition-colors border border-white/10"
                          >
                            ✕
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-white/5">
                            <span className="text-3xl">📷</span>
                          </div>
                          <p className="text-gray-400 font-medium">Sube tu imagen</p>
                          <p className="text-gray-600 text-xs mt-1">PNG, JPG hasta 10MB</p>
                        </>
                      )}
                    </div>
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
                        className={`p-3 rounded-xl border text-left transition-all duration-300 relative overflow-hidden group ${aiModel === m.id
                          ? 'border-purple-500/50 bg-gradient-to-br from-purple-900/40 to-black'
                          : 'border-white/10 bg-black/20 hover:bg-white/5'
                          }`}
                      >
                        <div className="relative z-10">
                          <div className="flex justify-between items-start mb-0.5">
                            <span className="text-white font-bold text-sm">{m.name}</span>
                            {aiModel === m.id && <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_10px_#4ade80]" />}
                          </div>
                          <p className="text-[10px] text-gray-400 mb-1.5">{m.desc}</p>
                          <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white/5 border border-white/5">
                            <Image src="/icons/takopi-coin.png" alt="coin" width={10} height={10} />
                            <span className="text-[10px] font-mono text-yellow-500">{m.credits}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl backdrop-blur-sm animate-shake">
                    <p className="text-red-400 text-sm font-medium flex items-center gap-2">
                      <span>⚠️</span> {error}
                    </p>
                  </div>
                )}
              </div>

              {/* Generate Button */}
              <div className="mt-8">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || (mode === 'text-to-3d' && !prompt.trim()) || (mode === 'image-to-3d' && !image)}
                  className={`w-full py-5 rounded-2xl font-black text-lg tracking-wide transition-all duration-500 relative overflow-hidden group ${isGenerating || (mode === 'text-to-3d' && !prompt.trim()) || (mode === 'image-to-3d' && !image)
                    ? 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/5'
                    : 'bg-white text-black hover:scale-[1.02] shadow-[0_0_40px_rgba(255,255,255,0.2)]'
                    }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-shimmer" />
                  <span className="relative flex items-center justify-center gap-3">
                    {isGenerating ? (
                      <>
                        <span className="w-5 h-5 border-2 border-gray-400 border-t-black rounded-full animate-spin" />
                        MATERIALIZANDO...
                      </>
                    ) : (
                      <>
                        CREAR AHORA
                        <span className="text-xs opacity-60 font-normal ml-1 inline-flex items-center gap-1">
                          ({getEstimatedCredits()} <Image src="/icons/takopi-coin.png" alt="coin" width={12} height={12} className="inline" />)
                        </span>
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Center: Massive 3D Viewer */}
          <div className="flex-1 h-full py-4 relative">
            {/* Gradient removed as per user request */}

            <div className="h-full w-full rounded-[3rem] border border-white/10 bg-black/20 backdrop-blur-sm relative overflow-hidden shadow-2xl shadow-black/80 group">
              {/* Grid Background Effect */}
              <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20 pointer-events-none" />

              {/* Success Badge */}
              {showSuccessBadge && (
                <div className="absolute top-8 left-1/2 -translate-x-1/2 z-30 px-6 py-2 bg-green-500/20 backdrop-blur-xl border border-green-500/30 rounded-full animate-bounce-in shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                  <span className="text-green-400 font-bold tracking-wide flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
                    GENERACIÓN COMPLETADA
                  </span>
                </div>
              )}

              <AIModelViewer 
                task={displayTask} 
                isGenerating={isGenerating && !selectedTask} 
                isRefining={isRefining} 
                isLoadingHistory={loadingTask}
                includeTextures={includeTextures}
              />
              
              {/* Botón Manual de Refine - Para testing */}
              {displayTask?.status === 'SUCCEEDED' && 
               displayTask?.taskType === 'text-to-3d' && 
               displayTask?.mode === 'preview' && 
               !isRefining && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
                  <button
                    onClick={() => {
                      setIsRefining(true);
                      refine(displayTask.taskId, { enablePbr: true, aiModel: displayTask.aiModel })
                        .catch(() => setIsRefining(false));
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-bold rounded-full shadow-lg shadow-orange-500/30 transition-all hover:scale-105 flex items-center gap-2"
                  >
                    <span>🎨</span>
                    <span>AGREGAR TEXTURAS (10 💎)</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right: Compact History Strip */}
          <div className="w-24 h-full py-10 flex flex-col gap-4">
            <div className="flex-1 bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-3 flex flex-col items-center gap-4 overflow-y-auto custom-scrollbar shadow-xl">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-lg mb-2 shrink-0 border border-white/5">
                📜
              </div>

              {history.map((t) => {
                const thumbSrc = getProxiedUrl(t.thumbnailUrl);
                const hasTextures = t.taskType === 'text-to-3d-refine' || t.taskType === 'image-to-3d' || t.mode === 'refine';
                const isInProgress = !['SUCCEEDED', 'FAILED', 'CANCELED'].includes(t.status);
                
                return (
                <div
                  key={t.id}
                  onClick={() => t.status === 'SUCCEEDED' && handleSelectFromHistory(t)}
                  className={`w-16 h-16 shrink-0 rounded-2xl overflow-visible transition-all duration-300 relative group ${
                    isInProgress ? 'cursor-wait' : t.status === 'SUCCEEDED' ? 'cursor-pointer' : 'cursor-not-allowed'
                  } ${selectedTask?.id === t.id
                    ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-black scale-105'
                    : 'opacity-60 hover:opacity-100 hover:scale-110'
                    }`}
                >
                  <div className="w-full h-full rounded-2xl overflow-hidden">
                  {thumbSrc ? (
                    <img 
                      src={thumbSrc} 
                      alt="" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  {/* Fallback placeholder */}
                  <div className={`w-full h-full flex items-center justify-center ${thumbSrc ? 'hidden' : ''} ${
                    t.status === 'FAILED' ? 'bg-red-500/20' : 
                    isInProgress ? 'bg-purple-500/20' : 'bg-white/10'
                  }`}>
                    <span className="text-xl">
                      {t.status === 'SUCCEEDED' ? '🎨' : 
                       t.status === 'FAILED' ? '❌' : 
                       '🔄'}
                    </span>
                  </div>
                  </div>

                  {/* Indicador de que está en progreso */}
                  {isInProgress && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-2xl">
                      <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}

                  {/* Badge de texturas (solo para completados) */}
                  {t.status === 'SUCCEEDED' && hasTextures && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-fuchsia-500 rounded-full flex items-center justify-center shadow-lg border-2 border-black z-10">
                      <span className="text-[10px]">🎨</span>
                    </div>
                  )}

                  {/* Loading overlay cuando se está cargando este item del historial */}
                  {loadingTask && selectedTask?.id === t.id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-2xl">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}

                  {/* Botón eliminar (aparece en hover, sobresale del contenedor) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteTarget(t);
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 hover:scale-125 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg z-20 border-2 border-black"
                    title="Eliminar"
                  >
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  {/* Tooltip on Hover */}
                  <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                    {t.prompt?.slice(0, 20) || 'Sin título'}...
                  </div>
                </div>
              );})}

              {history.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center opacity-30">
                  <div className="w-1 h-16 bg-white/20 rounded-full" />
                </div>
              )}
            </div>
          </div>

        </main>

        {/* Modal de confirmación para eliminar */}
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => !isDeleting && setDeleteTarget(null)}
            />
            
            {/* Modal */}
            <div className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              {/* Icono */}
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              
              {/* Título */}
              <h3 className="text-lg font-bold text-white text-center mb-2">
                ¿Eliminar modelo?
              </h3>
              
              {/* Descripción */}
              <p className="text-sm text-gray-400 text-center mb-1">
                Esta acción no se puede deshacer.
              </p>
              <p className="text-xs text-gray-500 text-center mb-6 truncate px-4">
                &quot;{deleteTarget.prompt?.slice(0, 30) || 'Sin título'}{deleteTarget.prompt && deleteTarget.prompt.length > 30 ? '...' : ''}&quot;
              </p>
              
              {/* Botones */}
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium text-gray-300 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteGeneration}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 rounded-xl text-sm font-bold text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Eliminando...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Eliminar
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
