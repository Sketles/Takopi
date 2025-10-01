'use client';

import { useState, useRef, useEffect } from 'react';

interface MusicPlayerProps {
  files: Array<{
    name: string;
    type: string;
    size: number;
    url: string;
    originalName?: string;
  }>;
  title: string;
  coverImage?: string;
  className?: string;
}

export default function MusicPlayer({ files, title, coverImage, className = '' }: MusicPlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Filtrar solo archivos de audio
  const audioFiles = files.filter(file => 
    file.type?.includes('audio') || 
    file.name?.match(/\.(mp3|wav|ogg|m4a|flac)$/i)
  );

  const currentTrack = audioFiles[currentTrackIndex];

  // Efectos del audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      // Ir al siguiente track
      if (currentTrackIndex < audioFiles.length - 1) {
        setCurrentTrackIndex(prev => prev + 1);
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrackIndex, audioFiles.length]);

  // Control de reproducción
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  // Control de volumen
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (audio) {
      const newTime = parseFloat(e.target.value);
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const nextTrack = () => {
    if (currentTrackIndex < audioFiles.length - 1) {
      setCurrentTrackIndex(prev => prev + 1);
    }
  };

  const prevTrack = () => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(prev => prev - 1);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-gray-900/50 rounded-xl ${className}`}>
        <div className="text-center text-gray-400">
          <div className="text-4xl mb-2">🎵</div>
          <div className="text-lg font-medium">No hay archivos de audio</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full bg-gradient-to-br from-gray-900/90 to-purple-900/50 rounded-xl p-6 ${className}`}>
      <audio
        ref={audioRef}
        src={currentTrack.url}
        preload="metadata"
      />
      
      {/* Carátula y info del álbum */}
      <div className="flex items-center gap-6 mb-6">
        {/* Carátula */}
        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg flex items-center justify-center overflow-hidden">
          {coverImage ? (
            <img
              src={coverImage}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-2xl">🎵</div>
          )}
        </div>
        
        {/* Info del track */}
        <div className="flex-1">
          <h3 className="text-white text-lg font-semibold truncate">
            {currentTrack.originalName || currentTrack.name}
          </h3>
          <p className="text-gray-400 text-sm truncate">{title}</p>
          <p className="text-gray-500 text-xs">
            {currentTrackIndex + 1} de {audioFiles.length} canciones
          </p>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="mb-4">
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controles */}
      <div className="flex items-center justify-between">
        {/* Botones de navegación */}
        <div className="flex items-center gap-3">
          <button
            onClick={prevTrack}
            disabled={currentTrackIndex === 0}
            className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z"/>
            </svg>
          </button>

          <button
            onClick={togglePlay}
            className="p-3 bg-white text-gray-900 rounded-full hover:bg-gray-200 transition-colors shadow-lg"
          >
            {isPlaying ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
              </svg>
            )}
          </button>

          <button
            onClick={nextTrack}
            disabled={currentTrackIndex === audioFiles.length - 1}
            className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z"/>
            </svg>
          </button>
        </div>

        {/* Control de volumen */}
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.618 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.618l3.765-3.793a1 1 0 011-.131zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd"/>
          </svg>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-16 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </div>

      {/* Lista de canciones */}
      {audioFiles.length > 1 && (
        <div className="mt-6">
          <h4 className="text-white text-sm font-medium mb-3">Canciones</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {audioFiles.map((track, index) => (
              <button
                key={index}
                onClick={() => setCurrentTrackIndex(index)}
                className={`w-full text-left p-2 rounded-lg transition-colors ${
                  index === currentTrackIndex
                    ? 'bg-purple-600/30 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 flex items-center justify-center">
                    {index === currentTrackIndex && isPlaying ? (
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    ) : (
                      <span className="text-xs">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">
                      {track.originalName || track.name}
                    </p>
                  </div>
                  <div className="text-xs text-gray-500">
                    {Math.round(track.size / 1024 / 1024 * 10) / 10} MB
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
