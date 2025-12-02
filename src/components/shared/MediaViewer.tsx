'use client';

import { useState } from 'react';
import { ModelViewerModal } from '../ModelViewer3D';

interface MediaFile {
    name: string;
    type: string;
    size: number;
    url: string;
    previewUrl?: string;
    originalName?: string;
}

interface MediaViewerProps {
    files: MediaFile[];
    coverImage?: string;
    contentType: string;
    title: string;
    isOwner?: boolean;
    className?: string;
}

export default function MediaViewer({
    files,
    coverImage,
    contentType,
    title,
    isOwner = false,
    className = ''
}: MediaViewerProps) {
    const [previewFile, setPreviewFile] = useState<MediaFile | null>(null);

    const getFileIcon = (file: MediaFile) => {
        if (file.type?.includes('gltf') || file.type?.includes('glb') || file.type?.includes('application/octet-stream') ||
            file.name?.endsWith('.glb') || file.name?.endsWith('.gltf') || file.name?.endsWith('.vrm')) {
            return '🧊';
        }
        if (file.type?.startsWith('image/')) return '🖼️';
        if (file.type?.startsWith('video/')) return '🎬';
        if (file.type?.startsWith('audio/')) return '🎵';
        if (file.type?.includes('text/') || file.name?.match(/\.(html|css|js|json)$/i)) return '📄';
        if (file.type?.includes('application/zip') || file.name?.match(/\.(zip|rar|7z)$/i)) return '📦';
        return '📁';
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const isImage = (file: MediaFile) => file.type?.startsWith('image/') || file.name?.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i);
    const isVideo = (file: MediaFile) => file.type?.startsWith('video/') || file.name?.match(/\.(mp4|webm|ogg|avi|mov)$/i);
    const isAudio = (file: MediaFile) => file.type?.startsWith('audio/') || file.name?.match(/\.(mp3|wav|ogg|flac|m4a)$/i);
    const is3D = (file: MediaFile) => file.type?.includes('gltf') || file.type?.includes('glb') || 
        file.type?.includes('application/octet-stream') || file.name?.endsWith('.glb') || 
        file.name?.endsWith('.gltf') || file.name?.endsWith('.vrm');

    const getThumbnail = (file: MediaFile) => {
        if (isImage(file)) return file.url;
        if (file.previewUrl) return file.previewUrl;
        return null;
    };

    const canPreview = (file: MediaFile) => isImage(file) || isVideo(file) || isAudio(file) || is3D(file);

    return (
        <div className={`flex flex-col h-full w-full ${className}`}>
            {/* Header estilo explorador */}
            <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border-b border-white/10">
                <span className="text-white/40 text-xs">📁</span>
                <span className="text-white/60 text-xs font-medium">Archivos</span>
                <span className="text-white/30 text-xs">({files?.length || 0})</span>
            </div>

            {/* Lista de archivos estilo Windows */}
            <div className="flex-1 overflow-y-auto">
                {files && files.length > 0 ? (
                    <div className="divide-y divide-white/5">
                        {files.map((file, index) => {
                            const thumbnail = getThumbnail(file);
                            const previewable = canPreview(file);
                            
                            return (
                                <button
                                    key={index}
                                    onClick={() => previewable && setPreviewFile(file)}
                                    disabled={!previewable}
                                    className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${
                                        previewable 
                                            ? 'hover:bg-white/5 cursor-pointer' 
                                            : 'cursor-default opacity-60'
                                    }`}
                                >
                                    {/* Thumbnail o icono */}
                                    <div className="w-8 h-8 flex-shrink-0 rounded overflow-hidden bg-white/5 flex items-center justify-center">
                                        {thumbnail ? (
                                            <img src={thumbnail} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-base">{getFileIcon(file)}</span>
                                        )}
                                    </div>

                                    {/* Nombre */}
                                    <span className="flex-1 text-sm text-white/80 truncate">
                                        {file.originalName || file.name}
                                    </span>

                                    {/* Tamaño */}
                                    <span className="text-xs text-white/30 flex-shrink-0">
                                        {formatFileSize(file.size)}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-white/30 text-sm">
                        <span className="text-2xl mb-2">📂</span>
                        <span>Sin archivos</span>
                    </div>
                )}
            </div>

            {/* Modal de preview */}
            {previewFile && (
                <div 
                    className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setPreviewFile(null)}
                >
                    <div 
                        className="relative max-w-4xl max-h-[90vh] w-full"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Botón cerrar */}
                        <button
                            onClick={() => setPreviewFile(null)}
                            className="absolute -top-10 right-0 text-white/60 hover:text-white text-sm flex items-center gap-2"
                        >
                            Cerrar
                            <span className="text-xs bg-white/10 px-2 py-0.5 rounded">ESC</span>
                        </button>

                        {/* Contenido del preview */}
                        <div className="bg-[#0a0a0a] rounded-xl overflow-hidden border border-white/10">
                            {/* Header */}
                            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-white/5">
                                <span className="text-lg">{getFileIcon(previewFile)}</span>
                                <span className="text-white font-medium truncate">{previewFile.originalName || previewFile.name}</span>
                                <span className="text-white/40 text-sm ml-auto">{formatFileSize(previewFile.size)}</span>
                            </div>

                            {/* Preview content */}
                            <div className="flex items-center justify-center bg-black/50 min-h-[300px] max-h-[70vh]">
                                {isImage(previewFile) && (
                                    <img 
                                        src={previewFile.url} 
                                        alt={previewFile.originalName || previewFile.name}
                                        className="max-w-full max-h-[70vh] object-contain"
                                    />
                                )}
                                
                                {isVideo(previewFile) && (
                                    <video 
                                        src={previewFile.url} 
                                        controls 
                                        autoPlay
                                        className="max-w-full max-h-[70vh]"
                                    />
                                )}
                                
                                {isAudio(previewFile) && (
                                    <div className="p-8 flex flex-col items-center gap-4">
                                        <span className="text-6xl">🎵</span>
                                        <audio src={previewFile.url} controls autoPlay className="w-full max-w-md" />
                                    </div>
                                )}
                                
                                {is3D(previewFile) && (
                                    <div className="w-full h-[400px]">
                                        <ModelViewerModal
                                            src={previewFile.url}
                                            alt={previewFile.originalName || previewFile.name}
                                            width="100%"
                                            height="100%"
                                            autoRotate={true}
                                            cameraControls={true}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Footer con acciones */}
                            {isOwner && (
                                <div className="flex justify-end px-4 py-3 border-t border-white/10">
                                    <button
                                        onClick={() => {
                                            const link = document.createElement('a');
                                            link.href = previewFile.url;
                                            link.download = previewFile.originalName || previewFile.name;
                                            link.click();
                                        }}
                                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm rounded-lg transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        Descargar
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
