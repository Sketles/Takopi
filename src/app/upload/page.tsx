'use client';

import Layout from '@/components/shared/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Tipos de contenido con iconos y metáforas visuales
const contentTypes = [
  {
    id: 'models',
    name: 'Modelos 3D',
    description: 'Objetos, props, escenarios y decoraciones',
    icon: '🧩',
    metaphor: '🧩',
    color: 'from-blue-500 to-cyan-500',
    fileTypes: ['.fbx', '.obj', '.blend', '.stl'],
    maxSize: 100,
    previewComponent: 'model-viewer'
  },
  {
    id: 'textures',
    name: 'Texturas',
    description: 'Imágenes 4K, sprites, ilustraciones',
    icon: '🖼️',
    metaphor: '🖼️',
    color: 'from-indigo-500 to-purple-500',
    fileTypes: ['.png', '.jpg', '.psd', '.tiff'],
    maxSize: 10,
    previewComponent: 'image-gallery'
  },
  {
    id: 'music',
    name: 'Música',
    description: 'Loops, FX, ambientes y soundtracks',
    icon: '🎶',
    metaphor: '💿',
    color: 'from-green-500 to-emerald-500',
    fileTypes: ['.mp3', '.wav', '.ogg', '.flac'],
    maxSize: 25,
    previewComponent: 'audio-player'
  },
  {
    id: 'avatars',
    name: 'Avatares',
    description: 'Para VTubers, VRChat o Roblox',
    icon: '🎭',
    metaphor: '💿',
    color: 'from-purple-500 to-pink-500',
    fileTypes: ['.fbx', '.vrm', '.glb', '.obj'],
    maxSize: 50,
    previewComponent: 'model-viewer'
  },
  {
    id: 'animations',
    name: 'Animaciones',
    description: 'Bailes, poses, motion graphics',
    icon: '🎬',
    metaphor: '🎬',
    color: 'from-orange-500 to-red-500',
    fileTypes: ['.mp4', '.mov', '.gif', '.webm'],
    maxSize: 200,
    previewComponent: 'video-player'
  },
  {
    id: 'obs',
    name: 'OBS Widgets',
    description: 'Overlays, alertas y temas para streaming',
    icon: '🎛️',
    metaphor: '🖼️',
    color: 'from-yellow-500 to-orange-500',
    fileTypes: ['.html', '.css', '.js', '.zip'],
    maxSize: 15,
    previewComponent: 'obs-frame'
  },
  {
    id: 'collections',
    name: 'Colecciones',
    description: 'Packs temáticos, bundles, ediciones especiales',
    icon: '📦',
    metaphor: '📦',
    color: 'from-pink-500 to-rose-500',
    fileTypes: ['.zip', '.rar', '.7z'],
    maxSize: 500,
    previewComponent: 'collection-preview'
  }
];

// Hashtags sugeridos automáticamente
const getSuggestedTags = (contentType: string, fileName: string) => {
  const baseTags = {
    avatars: [
      'vtuber', 'avatar', '3D', 'personaje', 'anime', 'chibi', 'cute', 'kawaii',
      'live2d', 'vtubing', 'streaming', 'twitch', 'youtube', 'persona', 'oc',
      'original', 'character', 'anime-style', 'manga', 'japanese', 'kawaii-style',
      'cute-avatar', 'anime-avatar', 'vtuber-model', 'live2d-model', 'rigging'
    ],
    music: [
      'música', 'audio', 'loop', 'fx', 'sound', 'beat', 'instrumental', 'ambient',
      'electronic', 'chill', 'lofi', 'hip-hop', 'pop', 'rock', 'jazz', 'classical',
      'royalty-free', 'background-music', 'intro-music', 'outro-music', 'transition',
      'sound-effect', 'sfx', 'audio-fx', 'music-loop', 'beats', 'melody', 'harmony'
    ],
    obs: [
      'obs', 'streaming', 'overlay', 'widget', 'stream', 'twitch', 'youtube', 'live',
      'broadcast', 'streaming-tools', 'streaming-overlay', 'streaming-widgets',
      'alerts', 'donations', 'followers', 'subscribers', 'chat', 'browser-source',
      'streaming-setup', 'streaming-design', 'streaming-graphics', 'streaming-elements',
      'streaming-layout', 'streaming-scenes', 'streaming-transitions', 'streaming-effects'
    ],
    models: [
      '3D', 'modelo', 'prop', 'escenario', 'asset', 'blender', 'maya', '3dsmax',
      'unity', 'unreal', 'game-asset', 'low-poly', 'high-poly', 'pbr', 'textured',
      'rigged', 'animated', 'game-ready', 'realistic', 'stylized', 'cartoon',
      'environment', 'character', 'vehicle', 'weapon', 'furniture', 'architecture',
      'nature', 'fantasy', 'sci-fi', 'medieval', 'modern', 'industrial', 'organic'
    ],
    animations: [
      'animación', 'video', 'motion', 'baila', 'animation', 'motion-graphics',
      'after-effects', 'premiere', 'davinci', 'video-editing', 'motion-design',
      'kinetic-typography', 'logo-animation', 'intro-animation', 'outro-animation',
      'transition', 'effect', 'visual-effects', 'vfx', 'compositing', 'rotoscoping',
      '2d-animation', '3d-animation', 'stop-motion', 'motion-capture', 'keyframe'
    ],
    textures: [
      'textura', 'imagen', 'sprite', 'arte', 'texture', 'material', 'seamless',
      'tileable', 'diffuse', 'normal', 'specular', 'roughness', 'metallic',
      'albedo', 'heightmap', 'bump', 'displacement', 'occlusion', 'emission',
      'wallpaper', 'background', 'pattern', 'design', 'graphic', 'illustration',
      'digital-art', 'concept-art', 'game-art', 'ui-design', 'icon', 'logo'
    ],
    collections: [
      'pack', 'colección', 'bundle', 'temático', 'collection', 'asset-pack',
      'game-assets', 'ui-pack', 'icon-pack', 'texture-pack', 'model-pack',
      'animation-pack', 'sound-pack', 'music-pack', 'theme', 'style', 'complete',
      'professional', 'premium', 'free', 'commercial', 'royalty-free', 'cc0'
    ]
  };

  // Tags basados en palabras clave del nombre del archivo
  const fileNameLower = fileName.toLowerCase();
  const dynamicTags = [];

  // Estilos y temáticas
  if (fileNameLower.includes('kawaii') || fileNameLower.includes('cute')) dynamicTags.push('kawaii', 'cute', 'adorable');
  if (fileNameLower.includes('cyberpunk') || fileNameLower.includes('futuro')) dynamicTags.push('cyberpunk', 'futuristic', 'sci-fi');
  if (fileNameLower.includes('anime') || fileNameLower.includes('manga')) dynamicTags.push('anime', 'manga', 'japanese');
  if (fileNameLower.includes('realistic') || fileNameLower.includes('realista')) dynamicTags.push('realistic', 'photorealistic');
  if (fileNameLower.includes('cartoon') || fileNameLower.includes('cartoon')) dynamicTags.push('cartoon', 'stylized');
  if (fileNameLower.includes('low-poly') || fileNameLower.includes('lowpoly')) dynamicTags.push('low-poly', 'minimalist');
  if (fileNameLower.includes('high-poly') || fileNameLower.includes('highpoly')) dynamicTags.push('high-poly', 'detailed');

  // Colores
  if (fileNameLower.includes('dark') || fileNameLower.includes('oscuro')) dynamicTags.push('dark', 'dark-theme');
  if (fileNameLower.includes('light') || fileNameLower.includes('claro')) dynamicTags.push('light', 'bright');
  if (fileNameLower.includes('neon') || fileNameLower.includes('fluorescente')) dynamicTags.push('neon', 'glowing');
  if (fileNameLower.includes('pastel') || fileNameLower.includes('suave')) dynamicTags.push('pastel', 'soft');

  // Géneros y temáticas
  if (fileNameLower.includes('fantasy') || fileNameLower.includes('fantasía')) dynamicTags.push('fantasy', 'magical');
  if (fileNameLower.includes('horror') || fileNameLower.includes('terror')) dynamicTags.push('horror', 'scary');
  if (fileNameLower.includes('nature') || fileNameLower.includes('naturaleza')) dynamicTags.push('nature', 'natural');
  if (fileNameLower.includes('urban') || fileNameLower.includes('ciudad')) dynamicTags.push('urban', 'city');
  if (fileNameLower.includes('space') || fileNameLower.includes('espacio')) dynamicTags.push('space', 'cosmic');
  if (fileNameLower.includes('ocean') || fileNameLower.includes('mar')) dynamicTags.push('ocean', 'underwater');

  // Tipos de archivo
  if (fileNameLower.includes('.fbx')) dynamicTags.push('fbx', 'game-ready');
  if (fileNameLower.includes('.obj')) dynamicTags.push('obj', '3d-model');
  if (fileNameLower.includes('.blend')) dynamicTags.push('blender', 'blend');
  if (fileNameLower.includes('.png')) dynamicTags.push('png', 'transparent');
  if (fileNameLower.includes('.jpg') || fileNameLower.includes('.jpeg')) dynamicTags.push('jpg', 'image');
  if (fileNameLower.includes('.mp3')) dynamicTags.push('mp3', 'audio');
  if (fileNameLower.includes('.wav')) dynamicTags.push('wav', 'lossless');
  if (fileNameLower.includes('.mp4')) dynamicTags.push('mp4', 'video');

  const contentTypeTags = baseTags[contentType as keyof typeof baseTags] || [];
  return [...contentTypeTags, ...dynamicTags];
};

// Licencias con iconos visuales
const licenses = [
  {
    id: 'personal',
    name: 'Personal',
    description: 'Solo uso personal',
    icon: '👤',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'commercial',
    name: 'Commercial',
    description: 'Uso comercial permitido',
    icon: '💼',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'streaming',
    name: 'Streaming',
    description: 'Perfecto para streamers',
    icon: '📺',
    color: 'from-purple-500 to-pink-500'
  }
];

export default function UploadPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    contentType: '',
    files: [] as File[],
    provisionalName: '',
    finalName: '',
    description: '',
    shortDescription: '',
    category: '',
    subcategory: '',
    suggestedTags: [] as string[],
    tags: [] as string[],
    customTags: [] as string[],
    coverImage: null as File | null,
    additionalImages: [] as File[],
    notes: '',
    externalLinks: '',
    price: '0',
    isFree: true,
    license: 'personal',
    customLicense: '',
    visibility: 'public',
    allowTips: false,
    allowCommissions: false
  });

  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [editingFile, setEditingFile] = useState<number | null>(null);
  const [projectId] = useState(Math.floor(Math.random() * 1000));

  // Redirigir si no está autenticado
  if (!isLoading && !user) {
    router.push('/auth/login');
    return null;
  }

  // Inicializar finalName con provisionalName cuando llegue al paso 6
  useEffect(() => {
    if (currentStep === 6 && formData.provisionalName && !formData.finalName) {
      setFormData(prev => ({ ...prev, finalName: prev.provisionalName }));
    }
  }, [currentStep, formData.provisionalName, formData.finalName]);

  const selectedContentType = contentTypes.find(ct => ct.id === formData.contentType);

  // Función para obtener la categoría por defecto basada en el tipo de contenido
  const getDefaultCategory = (contentType: string): string => {
    const categoryMap: { [key: string]: string } = {
      'models': 'characters',
      'textures': 'materials',
      'music': 'ambient',
      'avatars': 'anime',
      'animations': 'character',
      'obs': 'overlays',
      'collections': 'mixed'
    };
    return categoryMap[contentType] || '';
  };

  const handleContentTypeSelect = (typeId: string) => {
    const type = contentTypes.find(ct => ct.id === typeId);

    // Generar tags sugeridos basados en el tipo de contenido
    const suggestedTags = getSuggestedTags(typeId, 'ejemplo');

    // Establecer categoría por defecto basada en el tipo de contenido
    const defaultCategory = getDefaultCategory(typeId);

    setFormData({
      ...formData,
      contentType: typeId,
      category: defaultCategory,
      provisionalName: `Proyecto sin título #${projectId}`,
      files: [],
      suggestedTags,
      tags: [],
      customTags: []
    });
  };

  const handleFileUpload = (files: FileList) => {
    if (!selectedContentType) return;

    const validFiles = Array.from(files).filter(file => {
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      const isValidType = selectedContentType.fileTypes.includes(extension);
      const isValidSize = file.size <= selectedContentType.maxSize * 1024 * 1024;

      if (!isValidType) {
        alert(`Tipo de archivo no válido. Tipos permitidos: ${selectedContentType.fileTypes.join(', ')}`);
        return false;
      }
      if (!isValidSize) {
        alert(`Archivo muy grande. Tamaño máximo: ${selectedContentType.maxSize}MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      // Generar tags sugeridos automáticamente
      const suggestedTags = getSuggestedTags(formData.contentType, validFiles[0].name);

      setFormData({
        ...formData,
        files: [...formData.files, ...validFiles],
        suggestedTags
      });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const removeFile = (index: number) => {
    setFormData({
      ...formData,
      files: formData.files.filter((_, i) => i !== index)
    });
  };

  // Función para generar URL de preview
  const getFilePreviewUrl = (file: File) => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  // Función para cambiar el nombre de un archivo
  const renameFile = (index: number, newName: string) => {
    const newFiles = [...formData.files];
    const oldFile = newFiles[index];

    // Crear un nuevo File con el nombre actualizado
    const renamedFile = new File([oldFile], newName, {
      type: oldFile.type,
      lastModified: oldFile.lastModified
    });

    newFiles[index] = renamedFile;
    setFormData({ ...formData, files: newFiles });
    setEditingFile(null);
  };

  // Función para iniciar edición
  const startEditing = (index: number) => {
    setEditingFile(index);
  };

  // Función para cancelar edición
  const cancelEditing = () => {
    setEditingFile(null);
  };

  // Función para auto-resize del textarea
  const handleTextareaResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  };

  // Función helper para prevenir envío del formulario con Enter
  const preventFormSubmit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  // Función helper para prevenir envío del formulario con Enter (excepto Shift+Enter)
  const preventFormSubmitExceptShift = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
    }
  };

  const nextStep = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('🚀 Iniciando envío del formulario...');

    // Verificar que tenemos los datos mínimos requeridos
    if (!formData.provisionalName || !formData.description || !formData.contentType || !formData.category || formData.files.length === 0) {
      console.error('❌ Faltan datos requeridos:', {
        provisionalName: formData.provisionalName,
        description: formData.description,
        contentType: formData.contentType,
        category: formData.category,
        files: formData.files.length
      });
      alert('Por favor completa todos los campos requeridos');
      setUploading(false);
      return;
    }

    setUploading(true);
    try {
      // Obtener token del localStorage
      const token = localStorage.getItem('takopi_token');
      if (!token) {
        alert('❌ No estás autenticado. Por favor, inicia sesión primero.');
        router.push('/auth/login');
        return;
      }

      console.log('📤 Subiendo archivos...');

      // Subir archivos reales al servidor
      const uploadedFiles = [];
      for (const file of formData.files) {
        const formDataToUpload = new FormData();
        formDataToUpload.append('file', file);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formDataToUpload
        });

        if (!uploadResponse.ok) {
          throw new Error(`Error al subir archivo: ${file.name}`);
        }

        const uploadResult = await uploadResponse.json();
        uploadedFiles.push({
          name: uploadResult.data.fileName,
          originalName: uploadResult.data.originalName,
          size: uploadResult.data.size,
          type: uploadResult.data.type,
          url: uploadResult.data.url
        });

        console.log(`✅ Archivo subido: ${file.name} -> ${uploadResult.data.fileName}`);
      }

      console.log('📁 Todos los archivos subidos exitosamente');

      // Preparar datos para la API
      const submitData = {
        title: formData.provisionalName, // Usar provisionalName como título
        provisionalName: formData.provisionalName,
        description: formData.description,
        shortDescription: formData.shortDescription,
        contentType: formData.contentType,
        category: formData.category,
        subcategory: formData.subcategory,
        files: uploadedFiles, // Usar los archivos subidos reales
        coverImage: formData.coverImage,
        additionalImages: formData.additionalImages,
        price: formData.price,
        isFree: formData.isFree,
        license: formData.license,
        customLicense: formData.customLicense,
        tags: [...formData.tags, ...formData.customTags],
        customTags: formData.customTags,
        visibility: formData.visibility,
        allowTips: formData.allowTips,
        allowCommissions: formData.allowCommissions,
        externalLinks: formData.externalLinks,
        notes: formData.notes
      };

      console.log('📤 Enviando datos:', submitData);
      console.log('🔑 Token:', token ? 'Presente' : 'Ausente');

      const response = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(submitData)
      });

      const result = await response.json();
      console.log('📥 Respuesta del servidor:', result);
      console.log('📊 Status:', response.status);

      if (!response.ok) {
        throw new Error(result.error || 'Error al subir la creación');
      }

      alert('🎉 ¡Listo, tu creación ya está en Takopi!');
      router.push('/explore');

    } catch (error) {
      console.error('Error al subir la creación:', error);
      alert(`Error al subir la creación: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setUploading(false);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return '¿Qué vas a subir hoy?';
      case 2: return 'Suelta tu archivo, nosotros te mostramos cómo se ve';
      case 3: return 'Ponle un nombre, aunque sea temporal';
      case 4: return 'Cuenta en 2 frases qué incluye tu creación';
      case 5: return 'Adorna tu producto';
      case 6: return 'Ahora define tu precio y hazlo público';
      case 7: return '🎉 ¡Listo para publicar!';
      default: return '';
    }
  };

  const getStepMotivation = () => {
    switch (currentStep) {
      case 2: return '¡Genial! Ya tienes tu contenido base 🚀';
      case 3: return 'Tu creación empieza a tomar forma ✨';
      case 4: return '¡Perfecto! Ya tienes toda la info básica 📝';
      case 5: return '¡Excelente! Tu producto se ve profesional 🎨';
      case 6: return 'Ponle valor a tu trabajo. Puedes empezar gratis y cambiarlo después 💰';
      case 7: return '¡Todo listo! Tu creación está perfecta para compartir 🎊';
      default: return '';
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-white text-xl">Cargando...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Crear Nueva Publicación
            </span>
          </h1>
          <p className="text-xl text-gray-300">
            Comparte tu arte con la comunidad de creadores
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4, 5, 6, 7].map((step) => (
              <div
                key={step}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${step <= currentStep
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25'
                  : 'bg-gray-700 text-gray-400'
                  }`}
              >
                {step}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / 7) * 100}%` }}
            ></div>
          </div>
        </div>

        <form onSubmit={(e) => e.preventDefault()}>
          {/* Información sobre navegación */}
          <div className="text-center mb-6">
            <p className="text-gray-400 text-sm">
              💡 Usa los botones "Siguiente" y "Publicar Creación" para navegar. Presiona Enter en los campos para avanzar rápidamente.
            </p>
          </div>

          {/* Step 1: Elección visual */}
          {currentStep === 1 && (
            <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-purple-500/20 p-8">
              <h2 className="text-3xl font-bold text-white mb-2 text-center">
                {getStepTitle()}
              </h2>
              <p className="text-gray-300 text-center mb-8">
                Selecciona el tipo de contenido que quieres compartir
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {contentTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => handleContentTypeSelect(type.id)}
                    className={`group p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${formData.contentType === type.id
                      ? 'border-green-400 bg-green-500/20 shadow-lg shadow-green-500/25'
                      : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                      }`}
                  >
                    <div className="text-center">
                      <div className={`text-4xl mb-3 p-4 rounded-xl bg-gradient-to-r ${type.color} inline-block`}>
                        {type.icon}
                      </div>
                      <h3 className="font-bold text-white mb-2">{type.name}</h3>
                      <p className="text-sm text-gray-400">{type.description}</p>
                      <div className="mt-3 text-xs text-gray-500">
                        Max: {type.maxSize}MB
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {formData.contentType && (
                <div className="mt-8 text-center">
                  <div className="text-green-400 text-lg mb-4">
                    ¡Genial! Has elegido {selectedContentType?.name}
                  </div>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105"
                  >
                    Continuar →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Subida de archivos con preview */}
          {currentStep === 2 && selectedContentType && (
            <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-purple-500/20 p-8">
              <h2 className="text-3xl font-bold text-white mb-2 text-center">
                {getStepTitle()}
              </h2>
              <p className="text-gray-300 text-center mb-8">
                {getStepMotivation()}
              </p>

              {/* Zona de Drop con ícono dinámico */}
              <div
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${dragActive
                  ? 'border-green-400 bg-green-500/10'
                  : 'border-gray-600 bg-gray-800/30'
                  }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  multiple
                  accept={selectedContentType.fileTypes.join(',')}
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="text-6xl mb-4">{selectedContentType.metaphor}</div>
                  <div className="text-white font-medium mb-2 text-lg">
                    Arrastra archivos aquí o haz clic para seleccionar
                  </div>
                  <div className="text-gray-400 text-sm">
                    Tipos permitidos: {selectedContentType.fileTypes.join(', ')}
                    <br />
                    Tamaño máximo: {selectedContentType.maxSize}MB por archivo
                  </div>
                </label>
              </div>

              {/* Visualizador de archivos */}
              {formData.files.length > 0 && (
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-bold">Archivos subidos ({formData.files.length})</h3>

                    {/* Controles de vista */}
                    <div className="flex items-center gap-2 bg-gray-800/50 rounded-lg p-1">
                      <button
                        type="button"
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded transition-colors ${viewMode === 'grid'
                          ? 'bg-green-500 text-white'
                          : 'text-gray-400 hover:text-white'
                          }`}
                        title="Vista de cuadrícula"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded transition-colors ${viewMode === 'list'
                          ? 'bg-green-500 text-white'
                          : 'text-gray-400 hover:text-white'
                          }`}
                        title="Vista de lista"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Vista de cuadrícula responsiva */}
                  {viewMode === 'grid' && (
                    <div className={`grid gap-4 ${formData.files.length === 1
                      ? 'grid-cols-1 max-w-md mx-auto'
                      : formData.files.length === 2
                        ? 'grid-cols-1 md:grid-cols-2 max-w-2xl mx-auto'
                        : formData.files.length === 3
                          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto'
                          : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
                      }`}>
                      {formData.files.map((file, index) => {
                        const previewUrl = getFilePreviewUrl(file);
                        return (
                          <div key={index} className="bg-gray-800/50 rounded-lg overflow-hidden group hover:bg-gray-800/70 transition-colors">
                            {/* Preview del archivo */}
                            <div className="aspect-square bg-gray-700/50 flex items-center justify-center relative overflow-hidden">
                              {previewUrl ? (
                                <div className="w-full h-full flex items-center justify-center p-2">
                                  <img
                                    src={previewUrl}
                                    alt={file.name}
                                    className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                                  />
                                </div>
                              ) : (
                                <div className="text-center">
                                  <div className="text-3xl mb-2">{selectedContentType.icon}</div>
                                  <div className="text-gray-400 text-xs">Preview</div>
                                </div>
                              )}

                              {/* Botón eliminar */}
                              <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>

                            {/* Info del archivo */}
                            <div className="p-3">
                              {editingFile === index ? (
                                <div className="space-y-2">
                                  <input
                                    type="text"
                                    defaultValue={file.name}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        renameFile(index, e.currentTarget.value);
                                      } else if (e.key === 'Escape') {
                                        cancelEditing();
                                      }
                                    }}
                                    onBlur={(e) => {
                                      if (e.target.value.trim()) {
                                        renameFile(index, e.target.value);
                                      } else {
                                        cancelEditing();
                                      }
                                    }}
                                    className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:border-green-400 focus:outline-none"
                                    autoFocus
                                  />
                                  <div className="flex gap-1">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        const input = e.currentTarget.parentElement?.previousElementSibling as HTMLInputElement;
                                        if (input?.value.trim()) {
                                          renameFile(index, input.value);
                                        }
                                      }}
                                      className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
                                    >
                                      ✓
                                    </button>
                                    <button
                                      type="button"
                                      onClick={cancelEditing}
                                      className="px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div
                                    className="text-white font-medium text-sm truncate cursor-pointer hover:text-green-400 transition-colors group/edit"
                                    title="Haz clic para editar"
                                    onClick={() => startEditing(index)}
                                  >
                                    {file.name}
                                    <svg className="w-3 h-3 inline ml-1 opacity-0 group-hover/edit:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                  </div>
                                  <div className="text-gray-400 text-xs">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Vista de lista */}
                  {viewMode === 'list' && (
                    <div className="space-y-2">
                      {formData.files.map((file, index) => {
                        const previewUrl = getFilePreviewUrl(file);
                        return (
                          <div key={index} className="bg-gray-800/50 rounded-lg p-4 flex items-center gap-4 hover:bg-gray-800/70 transition-colors group">
                            {/* Preview pequeño */}
                            <div className="w-16 h-16 bg-gray-700/50 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                              {previewUrl ? (
                                <div className="w-full h-full flex items-center justify-center p-1">
                                  <img
                                    src={previewUrl}
                                    alt={file.name}
                                    className="max-w-full max-h-full object-contain rounded"
                                  />
                                </div>
                              ) : (
                                <div className="text-xl">{selectedContentType.icon}</div>
                              )}
                            </div>

                            {/* Info del archivo */}
                            <div className="flex-1 min-w-0">
                              {editingFile === index ? (
                                <div className="space-y-2">
                                  <input
                                    type="text"
                                    defaultValue={file.name}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        renameFile(index, e.currentTarget.value);
                                      } else if (e.key === 'Escape') {
                                        cancelEditing();
                                      }
                                    }}
                                    onBlur={(e) => {
                                      if (e.target.value.trim()) {
                                        renameFile(index, e.target.value);
                                      } else {
                                        cancelEditing();
                                      }
                                    }}
                                    className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:border-green-400 focus:outline-none"
                                    autoFocus
                                  />
                                  <div className="flex gap-1">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        const input = e.currentTarget.parentElement?.previousElementSibling as HTMLInputElement;
                                        if (input?.value.trim()) {
                                          renameFile(index, input.value);
                                        }
                                      }}
                                      className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
                                    >
                                      ✓
                                    </button>
                                    <button
                                      type="button"
                                      onClick={cancelEditing}
                                      className="px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div
                                    className="text-white font-medium truncate cursor-pointer hover:text-green-400 transition-colors group/edit"
                                    title="Haz clic para editar"
                                    onClick={() => startEditing(index)}
                                  >
                                    {file.name}
                                    <svg className="w-3 h-3 inline ml-1 opacity-0 group-hover/edit:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                  </div>
                                  <div className="text-gray-400 text-sm">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type}
                                  </div>
                                </>
                              )}
                            </div>

                            {/* Botón eliminar */}
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="text-red-400 hover:text-red-300 transition-colors p-2 opacity-0 group-hover:opacity-100"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 bg-gray-700 text-white rounded-xl font-semibold hover:bg-gray-600 transition-colors"
                >
                  ← Volver
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={formData.files.length === 0}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuar →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Nombre provisional */}
          {currentStep === 3 && (
            <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-purple-500/20 p-8">
              <h2 className="text-3xl font-bold text-white mb-2 text-center">
                {getStepTitle()}
              </h2>
              <p className="text-gray-300 text-center mb-8">
                {getStepMotivation()}
              </p>

              <div className="max-w-2xl mx-auto">
                <label className="block text-white font-medium mb-3">Nombre</label>
                <input
                  type="text"
                  value={formData.provisionalName}
                  onChange={(e) => setFormData({ ...formData, provisionalName: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (formData.provisionalName.trim()) {
                        nextStep();
                      }
                    }
                  }}
                  className="w-full px-4 py-4 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-green-400 focus:outline-none text-lg"
                  placeholder="Ej: Proyecto sin título #123"
                  required
                />
                <p className="text-gray-400 text-sm mt-2">
                  No te preocupes, puedes cambiarlo después
                </p>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 bg-gray-700 text-white rounded-xl font-semibold hover:bg-gray-600 transition-colors"
                >
                  ← Volver
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!formData.provisionalName}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuar →
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Detalles básicos */}
          {currentStep === 4 && (
            <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-purple-500/20 p-8">
              <h2 className="text-3xl font-bold text-white mb-2 text-center">
                {getStepTitle()}
              </h2>
              <p className="text-gray-300 text-center mb-8">
                {getStepMotivation()}
              </p>

              <div className="max-w-2xl mx-auto space-y-6">
                <div>
                  <label className="block text-white font-medium mb-3">Descripción breve *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => {
                      setFormData({ ...formData, description: e.target.value });
                      handleTextareaResize(e);
                    }}
                    onInput={handleTextareaResize}
                    onKeyDown={preventFormSubmitExceptShift}
                    className="w-full px-4 py-4 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-green-400 focus:outline-none min-h-[6rem] max-h-[20rem] overflow-y-auto resize-none"
                    placeholder="Describe qué incluye tu creación en 1-3 frases..."
                    style={{ height: 'auto' }}
                    required
                  />
                  <p className="text-gray-400 text-sm mt-2">
                    Ejemplo: "Avatar kawaii con 3 expresiones para VRChat. Incluye texturas HD y archivos de configuración."
                  </p>
                </div>

                <div>
                  <label className="block text-white font-medium mb-3">Hashtags sugeridos</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.suggestedTags.map((tag, index) => {
                      const isSelected = formData.customTags.includes(tag);
                      return (
                        <button
                          key={index}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              // Remover tag si ya está seleccionado
                              setFormData({
                                ...formData,
                                customTags: formData.customTags.filter(t => t !== tag)
                              });
                            } else {
                              // Agregar tag si no está seleccionado
                              setFormData({
                                ...formData,
                                customTags: [...formData.customTags, tag]
                              });
                            }
                          }}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${isSelected
                            ? 'bg-green-500/20 text-green-300 border border-green-500/50 shadow-lg shadow-green-500/25'
                            : 'bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30 hover:border-purple-400/50'
                            }`}
                        >
                          #{tag}
                        </button>
                      );
                    })}
                  </div>
                  <input
                    type="text"
                    value={formData.customTags.join(', ')}
                    onChange={(e) => {
                      const tagsArray = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
                      setFormData({ ...formData, customTags: tagsArray });
                    }}
                    onKeyDown={preventFormSubmit}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-green-400 focus:outline-none"
                    placeholder="Agrega más hashtags separados por comas..."
                  />
                  <p className="text-gray-400 text-sm mt-2">
                    💡 Haz clic en los hashtags sugeridos para agregarlos automáticamente
                  </p>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 bg-gray-700 text-white rounded-xl font-semibold hover:bg-gray-600 transition-colors"
                >
                  ← Volver
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!formData.description}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuar →
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Extras opcionales (adornar) */}
          {currentStep === 5 && (
            <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-purple-500/20 p-8">
              <h2 className="text-3xl font-bold text-white mb-2 text-center">
                {getStepTitle()}
              </h2>
              <p className="text-gray-300 text-center mb-8">
                {getStepMotivation()}
              </p>

              <div className="max-w-2xl mx-auto space-y-6">
                <div>
                  <label className="block text-white font-medium mb-3">Notas personales</label>
                  <textarea
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    onKeyDown={preventFormSubmitExceptShift}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-green-400 focus:outline-none h-20 resize-none"
                    placeholder="Notas internas, instrucciones especiales, etc... (opcional)"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-3">Links externos</label>
                  <input
                    type="text"
                    value={formData.externalLinks || ''}
                    onChange={(e) => setFormData({ ...formData, externalLinks: e.target.value })}
                    onKeyDown={preventFormSubmit}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-green-400 focus:outline-none"
                    placeholder="YouTube, Instagram, Twitter... (opcional)"
                  />
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 bg-gray-700 text-white rounded-xl font-semibold hover:bg-gray-600 transition-colors"
                >
                  ← Volver
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300"
                >
                  Continuar →
                </button>
              </div>
            </div>
          )}

          {/* Step 6: Precio y licencia */}
          {currentStep === 6 && (
            <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-purple-500/20 p-8">
              <h2 className="text-3xl font-bold text-white mb-2 text-center">
                {getStepTitle()}
              </h2>
              <p className="text-gray-300 text-center mb-8">
                {getStepMotivation()}
              </p>

              <div className="max-w-2xl mx-auto space-y-8">
                {/* Precio */}
                <div>
                  <label className="block text-white font-medium mb-4 text-center">Precio</label>

                  <div className="relative max-w-md mx-auto">
                    {/* Input de Precio */}
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-xl font-bold">$</span>
                      <input
                        type="text"
                        value={formData.isFree ? '0' : formData.price ? Number(formData.price).toLocaleString('es-CL') : ''}
                        onChange={(e) => {
                          // Remover puntos y convertir a número
                          const numericValue = e.target.value.replace(/\./g, '');
                          if (numericValue === '' || /^\d+$/.test(numericValue)) {
                            const newPrice = numericValue;
                            // Si escribe algo que no sea 0, cambia automáticamente a PRICE
                            const newIsFree = newPrice === '' || newPrice === '0';
                            setFormData({
                              ...formData,
                              price: newPrice,
                              isFree: newIsFree
                            });
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (formData.price && formData.price !== '0') {
                              nextStep();
                            }
                          }
                        }}
                        className="w-full pl-12 pr-20 py-4 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-green-400 focus:outline-none text-2xl text-center font-bold"
                        placeholder="0"
                        required={!formData.isFree}
                      />

                      {/* Toggle Button - A la derecha */}
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, isFree: !formData.isFree, price: formData.isFree ? formData.price : '0' })}
                          className={`px-3 py-1.5 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 text-sm ${formData.isFree
                            ? 'bg-green-500 text-white shadow-lg shadow-green-500/25'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                          {formData.isFree ? 'FREE' : 'PRICE'}
                        </button>
                      </div>
                    </div>

                    {/* Mensaje motivador */}
                    <div className="mt-4 text-center">
                      {formData.isFree ? (
                        <div className="text-green-400 text-sm">
                          Tu creación será gratuita para toda la comunidad
                        </div>
                      ) : (
                        <div className="text-gray-400 text-sm">
                          💰 Puedes cambiar el precio después si quieres
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Licencia */}
                <div>
                  <label className="block text-white font-medium mb-4 text-center">Licencia</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {licenses.map((license) => (
                      <button
                        key={license.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, license: license.id })}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 ${formData.license === license.id
                          ? 'border-green-400 bg-green-500/20'
                          : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                          }`}
                      >
                        <div className="text-center">
                          <div className="text-3xl mb-2">{license.icon}</div>
                          <div className="font-medium text-white mb-1">{license.name}</div>
                          <div className="text-sm text-gray-400">{license.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 bg-gray-700 text-white rounded-xl font-semibold hover:bg-gray-600 transition-colors"
                >
                  ← Volver
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!formData.isFree && !formData.price}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuar →
                </button>
              </div>
            </div>
          )}

          {/* Step 7: Resumen final y publicación */}
          {currentStep === 7 && (
            <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-purple-500/20 p-8">
              <h2 className="text-3xl font-bold text-white mb-2 text-center">
                {getStepTitle()}
              </h2>
              <p className="text-gray-300 text-center mb-8">
                {getStepMotivation()}
              </p>

              <div className="max-w-3xl mx-auto">
                {/* Resumen */}
                <div className="bg-gray-800/30 rounded-xl p-6 mb-6">
                  <h3 className="text-xl font-bold text-white mb-4">Resumen de tu creación:</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-white">Tipo: {selectedContentType?.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-white">Archivos: {formData.files.length}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-white">Nombre: {formData.provisionalName}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-white">Precio: {formData.isFree ? 'Gratis' : `$${formData.price} CLP`}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-white">Licencia: {licenses.find(l => l.id === formData.license)?.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-white">Visibilidad: {formData.visibility === 'public' ? 'Público' : formData.visibility === 'unlisted' ? 'No listado' : 'Borrador'}</span>
                    </div>
                  </div>
                </div>

                {/* Configuración de Publicación */}
                <div className="bg-gray-800/30 rounded-xl p-6 mb-6">
                  <h3 className="text-xl font-bold text-white mb-4">⚙️ Configuración de Publicación</h3>

                  <div className="space-y-4">
                    {/* Visibilidad */}
                    <div>
                      <label className="block text-white font-medium mb-3">Visibilidad</label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {[
                          { id: 'public', name: 'Público', desc: 'Visible para todos', icon: '🌍' },
                          { id: 'unlisted', name: 'No listado', desc: 'Solo con enlace', icon: '🔗' },
                          { id: 'draft', name: 'Borrador', desc: 'Solo para ti', icon: '📝' }
                        ].map((visibility) => (
                          <button
                            key={visibility.id}
                            type="button"
                            onClick={() => setFormData({ ...formData, visibility: visibility.id as any })}
                            className={`p-4 rounded-xl border-2 transition-all duration-300 ${formData.visibility === visibility.id
                              ? 'border-green-400 bg-green-400/10'
                              : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                              }`}
                          >
                            <div className="text-center">
                              <div className="text-2xl mb-2">{visibility.icon}</div>
                              <div className="font-medium text-white mb-1">{visibility.name}</div>
                              <div className="text-sm text-gray-400">{visibility.desc}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Opciones de Monetización */}
                    <div>
                      <label className="block text-white font-medium mb-3">💡 Opciones de Monetización</label>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.allowTips}
                            onChange={(e) => setFormData({ ...formData, allowTips: e.target.checked })}
                            className="w-4 h-4 text-green-500 bg-gray-600 border-gray-500 rounded focus:ring-green-400"
                          />
                          <div>
                            <div className="text-white font-medium">💸 Permitir propinas</div>
                            <div className="text-gray-400 text-sm">Los usuarios podrán darte propinas por tu trabajo</div>
                          </div>
                        </label>

                        <label className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.allowCommissions}
                            onChange={(e) => setFormData({ ...formData, allowCommissions: e.target.checked })}
                            className="w-4 h-4 text-green-500 bg-gray-600 border-gray-500 rounded focus:ring-green-400"
                          />
                          <div>
                            <div className="text-white font-medium">🎨 Aceptar comisiones</div>
                            <div className="text-gray-400 text-sm">Los usuarios podrán solicitar trabajos personalizados</div>
                          </div>
                        </label>

                      </div>
                    </div>

                  </div>
                </div>

              </div>

              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 bg-gray-700 text-white rounded-xl font-semibold hover:bg-gray-600 transition-colors"
                >
                  ← Volver
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={uploading}
                  className="px-12 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-500/25"
                >
                  {uploading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Publicando...
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span>🚀</span>
                      Publicar Creación
                    </div>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </Layout>
  );
}