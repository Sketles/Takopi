'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CardPreview from '@/components/CardPreview';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CloudArrowUpIcon,
  XMarkIcon,
  PhotoIcon,
  MusicalNoteIcon,
  CubeIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  LockClosedIcon,
  EyeSlashIcon,
  TagIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { Switch } from '@headlessui/react';
import ParticlesBackground from '@/components/shared/ParticlesBackground';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/shared/Toast';

// Tipos de contenido
const contentTypes = [
  { id: 'modelos3d', label: 'Modelo 3D', icon: CubeIcon, color: 'from-blue-500 to-cyan-500' },
  { id: 'avatares', label: 'Avatar', icon: UserIcon, color: 'from-purple-500 to-pink-500' },
  { id: 'texturas', label: 'Textura', icon: PhotoIcon, color: 'from-green-500 to-emerald-500' },
  { id: 'musica', label: 'Música', icon: MusicalNoteIcon, color: 'from-yellow-500 to-orange-500' },
  { id: 'animaciones', label: 'Animación', icon: VideoCameraIcon, color: 'from-red-500 to-rose-500' },
  { id: 'otros', label: 'Otro', icon: DocumentTextIcon, color: 'from-gray-500 to-slate-500' },
];

function UserIcon(props: any) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

// Licencias
const licenses = [
  { id: 'personal', label: 'Personal', description: 'Solo uso personal, no comercial.' },
  { id: 'commercial', label: 'Comercial', description: 'Permite uso en proyectos comerciales.' },
  { id: 'streaming', label: 'Streaming', description: 'Permite uso en transmisiones en vivo.' },
];

export default function UploadPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { addToast } = useToast();

  // Estados del formulario
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    contentType: '',
    category: 'Todo',
    price: '0',
    isFree: true,
    license: 'personal',
    visibility: 'public', // public, unlisted, private
    tags: [] as string[],
  });

  // Archivos
  const [files, setFiles] = useState<File[]>([]);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  // Estados de UI
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState('');

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Redireccionar si no hay usuario
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/upload');
    }
  }, [user, authLoading, router]);

  // Manejadores de Inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, value: boolean | string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Manejo de Tags (Estilo SoundCloud)
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim().replace(/^#/, '');
      if (newTag && !formData.tags.includes(newTag)) {
        setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
        setTagInput('');
      }
    } else if (e.key === 'Backspace' && !tagInput && formData.tags.length > 0) {
      setFormData(prev => ({ ...prev, tags: prev.tags.slice(0, -1) }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  // Manejo de Archivos
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setCoverPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Drag & Drop
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  // Navegación de Pasos
  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  // Validación
  const isStep1Valid = formData.title && formData.contentType && coverImage;
  const isStep2Valid = files.length > 0 && formData.description;
  const isStep3Valid = true; // Siempre válido por defaults

  // Submit
  const handleSubmit = async () => {
    if (!user) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Debes iniciar sesión para publicar contenido.'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Subir archivos (Simulado por ahora, implementar lógica real de upload)
      // TODO: Implementar subida real a Vercel Blob o S3
      const uploadedFiles = files.map(f => ({
        name: f.name,
        size: f.size,
        type: f.type,
        url: `/uploads/${f.name}` // Placeholder URL
      }));

      // 2. Preparar payload
      const payload = {
        title: formData.title,
        description: formData.description,
        shortDescription: formData.shortDescription,
        contentType: formData.contentType,
        category: formData.category || formData.contentType,
        price: formData.price,
        currency: 'CLP',
        isFree: formData.isFree,
        tags: formData.tags,
        license: formData.license,
        visibility: formData.visibility,
        coverImage: coverPreview || '/placeholder-cover.jpg',
        files: uploadedFiles,
        allowTips: false,
        allowCommissions: false
      };

      // 3. Obtener token de autenticación
      const token = localStorage.getItem('takopi_token');
      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }

      // 4. Llamar a la API
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Error al crear el contenido');
      }

      addToast({
        type: 'success',
        title: '¡Publicado!',
        message: 'Tu contenido se ha publicado exitosamente.'
      });

      // Redirigir al perfil después de 1 segundo
      setTimeout(() => {
        router.push('/profile');
      }, 1000);

    } catch (error) {
      console.error('Error al publicar:', error);
      addToast({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Hubo un problema al publicar tu contenido.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Cargando...</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden font-sans selection:bg-purple-500/30">
      <ParticlesBackground />

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 py-8 lg:py-12 min-h-screen flex flex-col">
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* COLUMNA IZQUIERDA: Formulario en Bloque */}
          <div className="lg:col-span-8">
            <div className="bg-gradient-to-b from-black/40 to-black/60 border border-purple-500/10 rounded-3xl p-8 backdrop-blur-xl h-full flex flex-col justify-between shadow-2xl relative overflow-hidden">
              {/* Glow Effect */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-50" />

              {/* Header Integrado */}
              <div className="space-y-6 mb-6 relative z-10">
                <header className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                      <XMarkIcon className="w-6 h-6 text-gray-400" />
                    </button>
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                      Crear Nuevo Post
                    </h1>
                  </div>

                  {/* Indicador de Pasos */}
                  <div className="flex items-center gap-2">
                    {[1, 2, 3].map((step) => (
                      <div
                        key={step}
                        className={`h-1.5 rounded-full transition-all duration-500 ${step === currentStep ? 'w-8 bg-purple-500 shadow-[0_0_10px_#a855f7]' :
                          step < currentStep ? 'w-8 bg-purple-900' : 'w-2 bg-gray-800'
                          }`}
                      />
                    ))}
                  </div>
                </header>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </div>

              {/* Contenido del Formulario */}
              <div className="flex-1 relative z-10">
                <AnimatePresence mode="wait">

                  {/* PASO 1: ESENCIA */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-6"
                    >
                      {/* Título */}
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Título del Proyecto</label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          placeholder="Ej. Cyberpunk City Pack Vol. 1"
                          className="w-full bg-transparent border-b-2 border-gray-800 focus:border-purple-500 text-3xl font-bold placeholder-gray-800 py-2 outline-none transition-colors"
                          autoFocus
                        />
                      </div>

                      {/* Descripción Corta */}
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Descripción Corta</label>
                          <span className="text-[10px] text-gray-500">{formData.shortDescription.length}/150</span>
                        </div>
                        <textarea
                          name="shortDescription"
                          value={formData.shortDescription}
                          onChange={(e) => {
                            if (e.target.value.length <= 150) handleInputChange(e);
                          }}
                          placeholder="Un pack increíble de assets cyberpunk..."
                          rows={2}
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-purple-500 outline-none transition-colors text-base resize-none"
                        />
                      </div>

                      {/* Tipo de Contenido */}
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Tipo de Contenido</label>
                        <div className="grid grid-cols-3 gap-4">
                          {contentTypes.map((type) => (
                            <button
                              key={type.id}
                              onClick={() => setFormData(prev => ({ ...prev, contentType: type.id }))}
                              className={`group relative p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-3 overflow-hidden ${formData.contentType === type.id
                                ? 'bg-purple-500/10 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.2)]'
                                : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                                }`}
                            >
                              <div className={`p-4 rounded-2xl bg-gradient-to-br ${type.color} bg-opacity-20 group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] transition-all duration-300`}>
                                <type.icon className="w-10 h-10 text-white drop-shadow-lg" />
                              </div>
                              <span className="text-sm font-bold text-gray-300 group-hover:text-white tracking-wide">{type.label}</span>

                              {formData.contentType === type.id && (
                                <motion.div
                                  layoutId="selectedType"
                                  className="absolute inset-0 border-2 border-purple-500 rounded-2xl pointer-events-none"
                                />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* PASO 2: DETALLES */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-10"
                    >
                      {/* Archivos */}
                      <div className="space-y-4">
                        <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">Archivos del Producto</label>
                        <div
                          onDragOver={onDragOver}
                          onDragLeave={onDragLeave}
                          onDrop={onDrop}
                          onClick={() => fileInputRef.current?.click()}
                          className={`border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all ${isDragging
                            ? 'border-purple-500 bg-purple-500/10 scale-[1.02]'
                            : 'border-gray-800 hover:border-gray-600 bg-white/5'
                            }`}
                        >
                          <CloudArrowUpIcon className="w-16 h-16 mx-auto text-gray-500 mb-4" />
                          <h3 className="text-xl font-semibold mb-2">Sube tus archivos aquí</h3>
                          <p className="text-gray-500">Arrastra y suelta o haz clic para explorar</p>
                          <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            onChange={handleFileSelect}
                            className="hidden"
                          />
                        </div>

                        {/* Lista de Archivos */}
                        {files.length > 0 && (
                          <div className="space-y-2">
                            {files.map((file, idx) => (
                              <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
                                    <DocumentTextIcon className="w-6 h-6" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-white">{file.name}</p>
                                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => setFiles(prev => prev.filter((_, i) => i !== idx))}
                                  className="p-2 hover:bg-red-500/20 hover:text-red-500 rounded-lg transition-colors"
                                >
                                  <XMarkIcon className="w-5 h-5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Descripción */}
                      <div className="space-y-4">
                        <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">Descripción Detallada</label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Cuenta la historia de tu creación..."
                          className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 min-h-[200px] focus:border-purple-500 outline-none transition-colors text-lg resize-y"
                        />
                      </div>

                      {/* Tags Interactivos */}
                      <div className="space-y-4">
                        <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">Etiquetas (Tags)</label>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-wrap gap-2 focus-within:border-purple-500 transition-colors">
                          <AnimatePresence>
                            {formData.tags.map(tag => (
                              <motion.span
                                key={tag}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-sm font-medium"
                              >
                                <TagIcon className="w-3 h-3" />
                                {tag}
                                <button onClick={() => removeTag(tag)} className="hover:text-white ml-1">
                                  <XMarkIcon className="w-3 h-3" />
                                </button>
                              </motion.span>
                            ))}
                          </AnimatePresence>
                          <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleTagKeyDown}
                            placeholder={formData.tags.length === 0 ? "Escribe tags y presiona Enter (ej. #cyberpunk, #3d)" : ""}
                            className="bg-transparent outline-none flex-1 min-w-[150px] text-white placeholder-gray-600"
                          />
                        </div>
                        <p className="text-xs text-gray-500">Presiona Enter, Espacio o Coma para agregar.</p>
                      </div>
                    </motion.div>
                  )}

                  {/* PASO 3: VALOR Y PUBLICACIÓN */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-12"
                    >
                      {/* SECCIÓN DE PRECIO - FEATURE STAR */}
                      <div className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-purple-600/20 transition-colors duration-700"></div>

                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                          <div className="space-y-2">
                            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                              <CurrencyDollarIcon className="w-8 h-8 text-purple-400" />
                              Precio del Producto
                            </h3>
                            <p className="text-gray-400">Define el valor de tu trabajo. Puedes ofrecerlo gratis o ponerle un precio justo.</p>
                          </div>

                          <div className="flex items-center gap-6 bg-black/40 p-2 rounded-2xl border border-white/5 backdrop-blur-sm">
                            <span className={`text-sm font-medium px-4 py-2 rounded-xl transition-colors ${formData.isFree ? 'text-white bg-white/10' : 'text-gray-500'}`}>
                              Gratis
                            </span>
                            <Switch
                              checked={!formData.isFree}
                              onChange={(checked) => {
                                setFormData(prev => ({ ...prev, isFree: !checked }));
                              }}
                              className={`${!formData.isFree ? 'bg-purple-600' : 'bg-gray-700'
                                } relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                            >
                              <span className="sr-only">Use setting</span>
                              <span
                                aria-hidden="true"
                                className={`${!formData.isFree ? 'translate-x-6' : 'translate-x-0'
                                  } pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                              />
                            </Switch>
                            <span className={`text-sm font-medium px-4 py-2 rounded-xl transition-colors ${!formData.isFree ? 'text-white bg-white/10' : 'text-gray-500'}`}>
                              De Pago
                            </span>
                          </div>
                        </div>

                        {/* Input de Precio Animado */}
                        <AnimatePresence>
                          {!formData.isFree && (
                            <motion.div
                              initial={{ height: 0, opacity: 0, marginTop: 0 }}
                              animate={{ height: 'auto', opacity: 1, marginTop: 32 }}
                              exit={{ height: 0, opacity: 0, marginTop: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="relative max-w-xs mx-auto">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-4xl text-gray-500 font-light">$</span>
                                <input
                                  type="text"
                                  name="price"
                                  value={formData.price === '0' ? '' : Number(formData.price).toLocaleString('es-CL')}
                                  onChange={(e) => {
                                    const rawValue = e.target.value.replace(/\./g, '').replace(/\D/g, '');
                                    setFormData(prev => ({ ...prev, price: rawValue === '' ? '0' : rawValue }));
                                  }}
                                  className="w-full bg-transparent border-b-2 border-purple-500/50 focus:border-purple-500 text-center text-6xl font-bold py-4 outline-none transition-colors"
                                  placeholder="0"
                                />
                                <p className="text-center text-gray-500 mt-2 text-sm">Moneda: CLP</p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Licencia */}
                      <div className="space-y-4">
                        <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">Licencia de Uso</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {licenses.map((lic) => (
                            <button
                              key={lic.id}
                              onClick={() => setFormData(prev => ({ ...prev, license: lic.id }))}
                              className={`p-6 rounded-2xl border text-left transition-all ${formData.license === lic.id
                                ? 'bg-white/10 border-purple-500 shadow-lg shadow-purple-500/10'
                                : 'bg-white/5 border-white/5 hover:bg-white/10'
                                }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-bold text-lg">{lic.label}</span>
                                {formData.license === lic.id && <div className="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_10px_#a855f7]"></div>}
                              </div>
                              <p className="text-sm text-gray-400">{lic.description}</p>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Visibilidad del Proyecto */}
                      <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${formData.visibility === 'public' ? 'bg-green-500/20 text-green-400' : 'bg-gray-700/50 text-gray-400'}`}>
                            {formData.visibility === 'public' ? <GlobeAltIcon className="w-6 h-6" /> : <LockClosedIcon className="w-6 h-6" />}
                          </div>
                          <div>
                            <h4 className="font-medium text-white">
                              {formData.visibility === 'public' ? 'Público (Listado)' : 'Privado (No Listado)'}
                            </h4>
                            <p className="text-sm text-gray-400 max-w-md">
                              {formData.visibility === 'public'
                                ? 'Tu producto será visible para todos en el marketplace.'
                                : 'Solo tú podrás ver este producto. No aparecerá en el marketplace.'}
                              <span className="block mt-1 text-xs text-gray-500">Podrás cambiar esto en cualquier momento desde tu panel.</span>
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={formData.visibility === 'public'}
                          onChange={(checked) => setFormData(prev => ({ ...prev, visibility: checked ? 'public' : 'unlisted' }))}
                          className={`${formData.visibility === 'public' ? 'bg-green-500' : 'bg-gray-600'
                            } relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}
                        >
                          <span
                            aria-hidden="true"
                            className={`${formData.visibility === 'public' ? 'translate-x-5' : 'translate-x-0'
                              } pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                          />
                        </Switch>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Botones de Navegación Modernos */}
              <div className="flex justify-between items-center pt-12">
                {currentStep > 1 ? (
                  <button
                    onClick={prevStep}
                    className="group flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all backdrop-blur-sm border border-white/5"
                  >
                    <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Atrás</span>
                  </button>
                ) : (
                  <div /> /* Spacer */
                )}

                {currentStep < 3 ? (
                  <button
                    onClick={nextStep}
                    disabled={currentStep === 1 ? !isStep1Valid : !isStep2Valid}
                    className="group flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                  >
                    <span>Siguiente Paso</span>
                    <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="group flex items-center gap-3 px-10 py-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>{isSubmitting ? 'Publicando...' : 'Publicar Proyecto'}</span>
                    {!isSubmitting && <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: Preview Sticky */}
          <div className="hidden lg:block lg:col-span-4 sticky top-8 h-full">
            <div className="bg-gradient-to-b from-black/40 to-black/60 border border-purple-500/10 rounded-3xl p-6 backdrop-blur-xl h-full flex flex-col shadow-2xl relative overflow-hidden">
              {/* Glow Effect */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-50" />

              <h3 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider text-center relative z-10">Vista Previa & Portada</h3>

              {/* Contenedor de Preview Interactivo para Subir Portada */}
              <div
                className="relative group cursor-pointer transform hover:scale-[1.02] transition-all duration-300 rounded-2xl overflow-hidden"
                onClick={() => coverInputRef.current?.click()}
              >
                <CardPreview
                  title={formData.title || 'Título del Proyecto'}
                  description={formData.shortDescription || 'Descripción del proyecto...'}
                  shortDescription={formData.shortDescription || 'Descripción del proyecto...'}
                  contentType={formData.contentType || 'modelos3d'}
                  category={formData.category}
                  price={formData.isFree ? 'Gratis' : formData.price}
                  isFree={formData.isFree}
                  coverImage={coverPreview || undefined}
                  tags={formData.tags}
                  author={{
                    name: user?.username || 'Tu Usuario',
                    avatar: user?.avatar || '/placeholder-avatar.jpg'
                  }}
                />

                {/* Overlay de Subida - Centrado Visualmente en la Imagen */}
                <div className={`absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center pb-24 transition-all duration-300 z-50 ${coverPreview ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="mb-4 p-4 rounded-full bg-white/10 border border-white/20 shadow-2xl"
                  >
                    <ArrowPathIcon className="w-8 h-8 text-white" />
                  </motion.div>
                  <p className="text-white font-bold text-lg tracking-wide">Subir Portada</p>
                  <p className="text-gray-300 text-xs mt-2 font-medium bg-black/50 px-3 py-1 rounded-full">1920x1080</p>
                </div>

                {/* Input Oculto */}
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleCoverSelect}
                  className="hidden"
                />
              </div>

              {/* Resumen Rápido */}
              <div className="mt-6 space-y-3 border-t border-white/5 pt-4">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Estado</span>
                  <span className="text-green-400 font-medium">Borrador</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Licencia</span>
                  <span className="text-white capitalize">{licenses.find(l => l.id === formData.license)?.label}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Visibilidad</span>
                  <span className="text-white capitalize">{formData.visibility === 'public' ? 'Público' : 'Oculto'}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}