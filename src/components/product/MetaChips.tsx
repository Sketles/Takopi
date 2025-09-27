'use client';

interface MetaChipsProps {
  contentType: string;
  license: string;
  customLicense?: string;
  files?: Array<{
    type: string;
    size: number;
  }>;
  className?: string;
}

export default function MetaChips({
  contentType,
  license,
  customLicense,
  files = [],
  className = ''
}: MetaChipsProps) {
  // Mapeo de tipos de contenido
  const getContentTypeDisplay = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'avatares': 'Avatar',
      'modelos3d': 'Modelo 3D',
      'musica': 'Música',
      'texturas': 'Textura',
      'animaciones': 'Animación',
      'OBS': 'OBS Widget',
      'colecciones': 'Colección'
    };
    return typeMap[type] || type;
  };

  // Mapeo de licencias
  const getLicenseDisplay = (license: string, customLicense?: string) => {
    if (license === 'custom' && customLicense) {
      return customLicense;
    }
    
    const licenseMap: { [key: string]: string } = {
      'personal': 'Uso Personal',
      'commercial': 'Comercial',
      'streaming': 'Streaming',
      'royalty-free': 'Libre de Regalías',
      'custom': 'Personalizada'
    };
    return licenseMap[license] || license;
  };

  // Obtener formatos únicos de archivos
  const getFileFormats = () => {
    const formats = new Set<string>();
    files.forEach(file => {
      if (file.type) {
        const extension = file.type.split('/')[1]?.toUpperCase();
        if (extension) {
          formats.add(extension);
        }
      }
    });
    return Array.from(formats);
  };

  // Calcular tamaño total
  const getTotalSize = () => {
    const totalBytes = files.reduce((sum, file) => sum + (file.size || 0), 0);
    
    if (totalBytes === 0) return '0 B';
    
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = totalBytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  const fileFormats = getFileFormats();
  const totalSize = getTotalSize();

  const chips = [
    {
      label: getContentTypeDisplay(contentType),
      icon: '📁',
      color: 'bg-blue-500/20 text-blue-300 border-blue-500/30'
    },
    {
      label: getLicenseDisplay(license, customLicense),
      icon: '📄',
      color: 'bg-green-500/20 text-green-300 border-green-500/30'
    },
    ...fileFormats.map(format => ({
      label: format,
      icon: '📎',
      color: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
    })),
    {
      label: totalSize,
      icon: '💾',
      color: 'bg-orange-500/20 text-orange-300 border-orange-500/30'
    }
  ];

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {chips.map((chip, index) => (
        <div
          key={index}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border backdrop-blur-sm ${chip.color}`}
        >
          <span className="text-sm">{chip.icon}</span>
          <span>{chip.label}</span>
        </div>
      ))}
    </div>
  );
}
