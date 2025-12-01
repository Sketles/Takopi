'use client';

import { useState, useEffect, useRef } from 'react';
import { useAIGenerator, type GenerationTask } from '@/hooks';
import Layout from '@/components/shared/Layout';
import ModelViewer3D from '@/components/ModelViewer3D';

// ============================================================================
// CONSTANTES
// ============================================================================

type GenerationMode = 'text-to-3d' | 'image-to-3d';

const STYLE_PRESETS = [
  { id: 'realistic', name: 'Realista', icon: '📷' },
  { id: 'cartoon', name: 'Cartoon', icon: '🎨' },
  { id: 'low-poly', name: 'Low Poly', icon: '💎' },
  { id: 'sculpture', name: 'Escultura', icon: '🗿' },
  { id: 'pbr', name: 'PBR', icon: '✨' },
];

const AI_MODELS = [
  { id: 'meshy-4', name: 'Meshy-4', credits: 5, desc: 'Rápido' },
  { id: 'meshy-6', name: 'Meshy-6', credits: 20, desc: 'Alta calidad' },
];

// ============================================================================
// COMPONENTE: Panel de Visualización 3D
// ============================================================================

function AIModelViewer({ 
  task, 
  isGenerating, 
  onRefine,
  isRefining,
}: { 
  task: GenerationTask | null; 
  isGenerating: boolean;
  onRefine?: (taskId: string) => void;
  isRefining?: boolean;
}) {
  // Vacío
  if (!task && !isGenerating) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 w-32 h-32 bg-purple-500/20 rounded-full blur-[50px] animate-pulse" />
          <div className="relative w-32 h-32 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center">
            <svg className="w-14 h-14 text-purple-400/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
            </svg>
          </div>
        </div>
        <p className="mt-6 text-gray-500">Tu modelo aparecerá aquí</p>
        <p className="mt-1 text-gray-600 text-sm">Describe tu idea y genera</p>
      </div>
    );
  }

  // Generando
  if (isGenerating || (task && !['SUCCEEDED', 'FAILED', 'CANCELED'].includes(task.status))) {
    const progress = task?.progress || 0;
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div className="relative w-28 h-28">
          <div className="absolute inset-0 bg-purple-500/30 rounded-full blur-[40px] animate-pulse" />
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
            <circle cx="50" cy="50" r="42" fill="none" stroke="url(#prog)" strokeWidth="4" strokeLinecap="round"
              strokeDasharray={`${progress * 2.64} 264`} className="transition-all duration-500" />
            <defs>
              <linearGradient id="prog" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">{Math.round(progress)}%</span>
          </div>
        </div>
        <p className="mt-6 text-white font-medium">
          {task?.taskType === 'text-to-3d-refine' ? 'Aplicando texturas...' : 'Generando modelo...'}
        </p>
        {task?.prompt && (
          <p className="mt-2 text-gray-500 text-sm max-w-xs text-center line-clamp-1">&quot;{task.prompt}&quot;</p>
        )}
      </div>
    );
  }

  // Error
  if (task?.status === 'FAILED') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <span className="text-3xl">❌</span>
        </div>
        <p className="mt-4 text-red-400 font-medium">Error en generación</p>
        <p className="mt-1 text-gray-500 text-sm">{task.errorMessage || 'Intenta de nuevo'}</p>
      </div>
    );
  }

  // Éxito - Mostrar modelo 3D interactivo
  if (task?.status === 'SUCCEEDED') {
    // Usar proxy para URLs de Meshy (evitar CORS)
    const getProxiedUrl = (url: string | undefined) => {
      if (!url) return undefined;
      if (url.includes('assets.meshy.ai')) {
        return `/api/ai/proxy?url=${encodeURIComponent(url)}`;
      }
      return url;
    };

    const modelSrc = getProxiedUrl(task.modelUrl);
    const thumbnailSrc = getProxiedUrl(task.thumbnailUrl);
    
    // Determinar si el modelo tiene texturas
    const hasTextures = task.hasTextures || task.mode === 'refine' || task.taskType === 'text-to-3d-refine';
    const canRefine = task.taskType === 'text-to-3d' && task.mode === 'preview' && !hasTextures;

    return (
      <div className="w-full h-full flex flex-col">
        <div className="flex-1 relative rounded-2xl overflow-hidden">
          {/* Badge de estado de texturas */}
          {hasTextures ? (
            <div className="absolute top-3 left-3 z-20 px-2.5 py-1 bg-green-500/20 backdrop-blur-md border border-green-500/30 rounded-lg">
              <span className="text-green-400 text-xs font-medium flex items-center gap-1">
                <span>✨</span> Con texturas
              </span>
            </div>
          ) : task.taskType === 'text-to-3d' && (
            <div className="absolute top-3 left-3 z-20 px-2.5 py-1 bg-amber-500/20 backdrop-blur-md border border-amber-500/30 rounded-lg">
              <span className="text-amber-400 text-xs font-medium flex items-center gap-1">
                <span>🔶</span> Sin texturas
              </span>
            </div>
          )}
          
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
            <div className="w-full h-full bg-gradient-to-br from-purple-900/20 to-black/40 border border-white/5 flex items-center justify-center">
              <img src={thumbnailSrc} alt="Modelo 3D" className="max-w-full max-h-full object-contain" />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white/5">
              <span className="text-7xl">✅</span>
            </div>
          )}
        </div>
        
        {/* Botones de acción */}
        <div className="mt-4 flex gap-3">
          {/* Botón de Texturizar (solo si no tiene texturas) */}
          {canRefine && onRefine && (
            <button
              onClick={() => onRefine(task.taskId)}
              disabled={isRefining}
              className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                isRefining
                  ? 'bg-purple-500/20 text-purple-400 cursor-wait'
                  : 'bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white hover:scale-[1.02] shadow-lg shadow-purple-500/20'
              }`}
            >
              {isRefining ? (
                <>
                  <span className="w-4 h-4 border-2 border-purple-400 border-t-white rounded-full animate-spin" />
                  Texturizando...
                </>
              ) : (
                <>
                  <span>🎨</span>
                  Texturizar
                  <span className="opacity-60 text-xs">(10 💎)</span>
                </>
              )}
            </button>
          )}
          
          {/* Botón de descarga */}
          {task.modelUrl && (
            <a
              href={task.modelUrl}
              download={`modelo-${task.id}.glb`}
              className={`py-3 bg-white text-black rounded-xl font-bold text-center hover:scale-[1.02] transition-transform shadow-lg shadow-white/10 flex items-center justify-center gap-2 ${
                canRefine && onRefine ? 'flex-1' : 'flex-1'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Descargar GLB
            </a>
          )}
        </div>
      </div>
    );
  }

  return null;
}

// ============================================================================
// PÁGINA PRINCIPAL
// ============================================================================

export default function TakopiIAPage() {
  const {
    isGenerating, task: currentTask, history, balance, error,
    generate, refine, poll, loadHistory, loadBalance,
  } = useAIGenerator();

  const [mode, setMode] = useState<GenerationMode>('text-to-3d');
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('realistic');
  const [aiModel, setAiModel] = useState('meshy-4');
  const [image, setImage] = useState<File | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<GenerationTask | null>(null);
  const [loadingTask, setLoadingTask] = useState(false);
  const [showSuccessBadge, setShowSuccessBadge] = useState(false);
  
  // Opción para incluir texturas (Refine automático)
  const [includeTextures, setIncludeTextures] = useState(true);
  
  // Para refine desde el visor
  const [isRefining, setIsRefining] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tarea a mostrar: la seleccionada del historial o la actual
  const displayTask = selectedTask || currentTask;
  
  // Auto-refine cuando termine el preview si includeTextures está activado
  const shouldAutoRefine = useRef(false);

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
  
  // Auto-refine cuando termine preview
  useEffect(() => {
    if (
      currentTask?.status === 'SUCCEEDED' && 
      currentTask?.taskType === 'text-to-3d' &&
      currentTask?.mode === 'preview' &&
      shouldAutoRefine.current &&
      !isRefining
    ) {
      shouldAutoRefine.current = false;
      handleRefine(currentTask.taskId);
    }
  }, [currentTask?.status, currentTask?.taskType, currentTask?.mode, currentTask?.taskId]);

  // Mostrar badge "Listo" por 2 segundos cuando termina una generación
  useEffect(() => {
    if (currentTask?.status === 'SUCCEEDED') {
      setShowSuccessBadge(true);
      const timer = setTimeout(() => setShowSuccessBadge(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [currentTask?.status]);

  useEffect(() => {
    if (!currentTask || ['SUCCEEDED', 'FAILED', 'CANCELED'].includes(currentTask.status)) return;
    const interval = setInterval(() => poll(currentTask.id), 3000);
    return () => clearInterval(interval);
  }, [currentTask, poll]);

  // Seleccionar tarea del historial (obtiene URLs frescas)
  const handleSelectFromHistory = async (task: GenerationTask) => {
    if (task.status !== 'SUCCEEDED') return;
    
    setLoadingTask(true);
    try {
      // Obtener URLs frescas de la API
      const freshTask = await poll(task.id);
      if (freshTask) {
        setSelectedTask(freshTask);
      } else {
        setSelectedTask(task); // Fallback
      }
    } catch {
      setSelectedTask(task); // Fallback
    } finally {
      setLoadingTask(false);
    }
  };

  // Manejar refine desde el visor
  const handleRefine = async (taskId: string) => {
    setIsRefining(true);
    try {
      await refine(taskId, { enablePbr: true });
      // Recargar balance después de unos segundos
      setTimeout(() => {
        loadBalance();
        loadHistory();
      }, 2000);
    } finally {
      setIsRefining(false);
    }
  };

  const handleGenerate = async () => {
    if (mode === 'text-to-3d' && !prompt.trim()) return;
    if (mode === 'image-to-3d' && !image) return;
    
    // Marcar si debe hacer auto-refine
    if (mode === 'text-to-3d' && includeTextures) {
      shouldAutoRefine.current = true;
    }
    
    // Para image-to-3d, necesitamos subir la imagen primero
    let imageUrl: string | undefined;
    if (mode === 'image-to-3d' && image) {
      // TODO: Implementar upload de imagen
      // Por ahora usar URL temporal
      imageUrl = URL.createObjectURL(image);
    }
    
    await generate({
      type: mode,
      prompt: prompt.trim(),
      imageUrl,
      artStyle: style as 'realistic' | 'sculpture',
      aiModel: aiModel as 'meshy-4' | 'meshy-5' | 'latest',
    });
    setTimeout(() => loadBalance(), 2000);
  };

  const selectedModel = AI_MODELS.find(m => m.id === aiModel);
  
  // Calcular créditos estimados
  const getEstimatedCredits = () => {
    if (mode === 'text-to-3d') {
      const baseCredits = aiModel === 'meshy-6' ? 20 : 5;
      return includeTextures ? baseCredits + 10 : baseCredits;
    }
    // image-to-3d (siempre con texturas)
    return 30;
  };

  return (
    <Layout>
      <div className="min-h-screen pt-28 pb-12 px-4 sm:px-6">
        {/* Container principal con el mismo estilo del navbar */}
        <div className="max-w-6xl mx-auto">
          
          {/* Header de la página - estilo integrado con navbar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
                <span className="text-lg">🎨</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Generador 3D con IA</h1>
                <p className="text-xs text-gray-500">Powered by Meshy AI</p>
              </div>
            </div>
            
            {/* Credits - mismo estilo que nav pill */}
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full">
              <span className="text-purple-400">💎</span>
              <span className="text-white font-semibold">{balanceLoading ? '...' : balance ?? '—'}</span>
              <span className="text-gray-500 text-sm">créditos</span>
            </div>
          </div>

          {/* Main Grid - Cajas integradas */}
          <div className="grid lg:grid-cols-12 gap-5">
            
            {/* Panel Izquierdo - Controles */}
            <div className="lg:col-span-5 xl:col-span-4">
              <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl shadow-black/20">
                
                {/* Mode Tabs - mismo estilo que navbar pills */}
                <div className="p-4 border-b border-white/[0.05]">
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-full p-1 flex">
                    <button
                      onClick={() => setMode('text-to-3d')}
                      className={`flex-1 py-2 px-3 rounded-full text-sm font-medium transition-all duration-300 ${
                        mode === 'text-to-3d'
                          ? 'bg-white/10 text-white shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      ✍️ Texto a 3D
                    </button>
                    <button
                      onClick={() => setMode('image-to-3d')}
                      className={`flex-1 py-2 px-3 rounded-full text-sm font-medium transition-all duration-300 ${
                        mode === 'image-to-3d'
                          ? 'bg-white/10 text-white shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      📷 Imagen a 3D
                    </button>
                  </div>
                </div>

                {/* Form Content */}
                <div className="p-5 space-y-5">
                  
                  {/* Input */}
                  {mode === 'text-to-3d' ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Descripción</label>
                      <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Un dragón de cristal con alas iridiscentes..."
                        className="w-full h-28 p-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.07] transition-all resize-none"
                        maxLength={1000}
                      />
                      <div className="flex justify-between mt-1">
                        <span className="text-[10px] text-gray-600">
                          💡 Describe forma, color y materiales
                        </span>
                        <span className="text-xs text-gray-600">{prompt.length}/1000</span>
                      </div>
                      
                      {/* Toggle de Texturas - Debajo del textarea */}
                      <div className="mt-4 -mx-5 px-5 py-4 bg-white/[0.03] backdrop-blur-xl border-y border-white/[0.08]">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                              <span className="text-lg">✨</span>
                            </div>
                            <div>
                              <h3 className="text-sm font-semibold text-white">Incluir Texturas</h3>
                              <p className="text-xs text-gray-500 leading-tight">Aplica colores y materiales automáticamente</p>
                            </div>
                          </div>
                          
                          {/* Toggle Switch Moderno */}
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="text-xs font-medium text-amber-400">+10 💎</div>
                              <div className="text-[10px] text-gray-500">Refine</div>
                            </div>
                            <button
                              onClick={() => setIncludeTextures(!includeTextures)}
                              className={`relative w-14 h-7 rounded-full transition-all duration-300 flex-shrink-0 ${
                                includeTextures 
                                  ? 'bg-gradient-to-r from-purple-500 via-fuchsia-500 to-purple-500 shadow-lg shadow-purple-500/30' 
                                  : 'bg-white/10 border border-white/20'
                              }`}
                            >
                              <span
                                className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-lg transition-all duration-300 flex items-center justify-center ${
                                  includeTextures ? 'left-[calc(100%-1.625rem)]' : 'left-0.5'
                                }`}
                              >
                                {includeTextures ? (
                                  <span className="text-xs">✨</span>
                                ) : (
                                  <span className="text-xs opacity-40">○</span>
                                )}
                              </span>
                            </button>
                          </div>
                        </div>
                        
                        {/* Info adicional cuando está activado */}
                        {includeTextures && (
                          <div className="mt-3 p-2.5 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                            <p className="text-xs text-purple-300 flex items-start gap-2 leading-relaxed">
                              <span className="text-sm flex-shrink-0">ℹ️</span>
                              <span>
                                Se generará el modelo (preview) y luego se aplicarán texturas automáticamente.
                                <strong className="text-purple-200"> Total: {getEstimatedCredits()} créditos</strong>
                              </span>
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Imagen</label>
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`aspect-video rounded-xl border-2 border-dashed cursor-pointer transition-all flex items-center justify-center ${
                          image ? 'border-purple-500/50 bg-purple-500/5' : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} className="hidden" />
                        {image ? (
                          <div className="relative w-full h-full p-2">
                            <img src={URL.createObjectURL(image)} alt="" className="w-full h-full object-contain rounded-lg" />
                            <button onClick={(e) => { e.stopPropagation(); setImage(null); }} className="absolute top-3 right-3 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">✕</button>
                          </div>
                        ) : (
                          <div className="text-center p-4">
                            <span className="text-3xl block mb-2">📷</span>
                            <p className="text-gray-500 text-sm">Arrastra o selecciona</p>
                          </div>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-600 mt-1">💡 Los modelos desde imagen incluyen texturas automáticamente basadas en la foto</p>
                    </div>
                  )}

                  {/* Estilos */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Estilo</label>
                    <div className="grid grid-cols-5 gap-2">
                      {STYLE_PRESETS.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => setStyle(s.id)}
                          className={`p-2.5 rounded-xl border text-center transition-all ${
                            style === s.id
                              ? 'border-purple-500/50 bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                              : 'border-white/10 bg-white/5 hover:border-white/20'
                          }`}
                        >
                          <span className="text-lg block">{s.icon}</span>
                          <span className="text-[10px] text-gray-400 mt-1 block">{s.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Modelo IA */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Modelo IA</label>
                    <div className="grid grid-cols-2 gap-2">
                      {AI_MODELS.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => setAiModel(m.id)}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            aiModel === m.id
                              ? 'border-purple-500/50 bg-purple-500/10'
                              : 'border-white/10 bg-white/5 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-white font-medium text-sm">{m.name}</span>
                            <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">{m.credits}💎</span>
                          </div>
                          <p className="text-gray-500 text-xs mt-1">{m.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}
                </div>

                {/* Generate Button */}
                <div className="p-4 border-t border-white/[0.05]">
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating || (mode === 'text-to-3d' && !prompt.trim()) || (mode === 'image-to-3d' && !image)}
                    className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all relative overflow-hidden group ${
                      isGenerating || (mode === 'text-to-3d' && !prompt.trim()) || (mode === 'image-to-3d' && !image)
                        ? 'bg-white/10 text-gray-500 cursor-not-allowed'
                        : 'bg-white text-black hover:scale-[1.02] shadow-lg shadow-white/10'
                    }`}
                  >
                    <span className="relative flex items-center justify-center gap-2">
                      {isGenerating ? (
                        <>
                          <span className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin" />
                          Generando...
                        </>
                      ) : (
                        <>
                          ✨ Generar 3D
                          <span className="opacity-60">({getEstimatedCredits()} 💎)</span>
                        </>
                      )}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Panel Central - Visualizador */}
            <div className="lg:col-span-7 xl:col-span-5">
              <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 h-full min-h-[400px] shadow-2xl shadow-black/20 relative overflow-hidden">
                {/* Glow background */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-fuchsia-600/5 pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />
                
                {/* Badge "Listo" temporal (2 segundos) */}
                {showSuccessBadge && (
                  <div className="absolute top-3 right-3 z-20 px-3 py-1.5 bg-green-500/20 backdrop-blur-md border border-green-500/30 rounded-lg animate-pulse">
                    <span className="text-green-400 text-xs font-medium">✓ Listo</span>
                  </div>
                )}
                
                <div className="relative h-full">
                  <AIModelViewer 
                    task={displayTask} 
                    isGenerating={(isGenerating && !selectedTask) || loadingTask}
                    onRefine={handleRefine}
                    isRefining={isRefining}
                  />
                </div>
              </div>
            </div>

            {/* Panel Derecho - Historial */}
            <div className="lg:col-span-12 xl:col-span-3">
              <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl shadow-black/20 h-full">
                <div className="p-4 border-b border-white/[0.05]">
                  <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-xs">📜</span>
                    Historial
                  </h3>
                </div>
                
                <div className="p-3 max-h-[400px] xl:max-h-none overflow-y-auto">
                  {history.length === 0 ? (
                    <div className="py-12 text-center">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-3">
                        <span className="text-xl opacity-40">🫥</span>
                      </div>
                      <p className="text-gray-500 text-sm">Sin generaciones</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {history.map((t) => {
                        const hasTextures = t.hasTextures || t.mode === 'refine' || t.taskType === 'text-to-3d-refine';
                        return (
                          <div 
                            key={t.id} 
                            onClick={() => t.status === 'SUCCEEDED' && handleSelectFromHistory(t)}
                            className={`p-2.5 rounded-xl border transition-all cursor-pointer group ${
                              selectedTask?.id === t.id 
                                ? 'bg-purple-500/10 border-purple-500/30' 
                                : 'bg-white/5 hover:bg-white/[0.08] border-white/5'
                            }`}
                          >
                            <div className="flex gap-2.5">
                              {t.thumbnailUrl ? (
                                <div className="relative">
                                  <img src={t.thumbnailUrl} alt="" className="w-10 h-10 rounded-lg object-cover" />
                                  {hasTextures && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-[8px]">✨</span>
                                  )}
                                </div>
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-sm">
                                  {t.status === 'SUCCEEDED' ? '✅' : t.status === 'FAILED' ? '❌' : '⏳'}
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className={`text-xs font-medium truncate transition-colors ${
                                  selectedTask?.id === t.id ? 'text-purple-400' : 'text-white group-hover:text-purple-400'
                                }`}>
                                  {t.prompt || (t.taskType === 'text-to-3d-refine' ? 'Texturizado' : 'Sin prompt')}
                                </p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <p className="text-gray-600 text-[10px]">
                                    {new Date(t.createdAt).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })}
                                  </p>
                                  {t.taskType === 'image-to-3d' && (
                                    <span className="text-[9px] px-1 py-0.5 rounded bg-blue-500/20 text-blue-400">📷</span>
                                  )}
                                  {t.taskType === 'text-to-3d-refine' && (
                                    <span className="text-[9px] px-1 py-0.5 rounded bg-green-500/20 text-green-400">🎨</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
