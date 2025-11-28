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
  author?: string;
  className?: string;
}

export default function MusicPlayer({ files, title, coverImage, author, className = '' }: MusicPlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [trackDurations, setTrackDurations] = useState<Record<number, number>>({});
  const audioRef = useRef<HTMLAudioElement>(null);

  // Filtrar solo archivos de audio
  const audioFiles = files.filter(file =>
    file.type?.includes('audio') ||
    file.name?.match(/\.(mp3|wav|ogg|m4a|flac)$/i)
  );

  const currentTrack = audioFiles[currentTrackIndex];

  // Cargar duraciones de todos los tracks
  useEffect(() => {
    audioFiles.forEach((file, index) => {
      const audio = new Audio(file.url);
      audio.addEventListener('loadedmetadata', () => {
        setTrackDurations(prev => ({ ...prev, [index]: audio.duration }));
      });
    });
  }, [files]);

  // Efectos del audio principal
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (currentTrackIndex < audioFiles.length - 1) {
        setCurrentTrackIndex(prev => prev + 1);
      } else {
        setIsPlaying(false);
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

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.volume = volume;
  }, [volume]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (audio) {
      const newTime = parseFloat(e.target.value);
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const nextTrack = () => {
    if (currentTrackIndex < audioFiles.length - 1) setCurrentTrackIndex(prev => prev + 1);
  };

  const prevTrack = () => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
    } else if (currentTrackIndex > 0) {
      setCurrentTrackIndex(prev => prev - 1);
    }
  };

  const playTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const cleanTrackName = (name: string) => {
    return name
      .replace(/\.(mp3|wav|ogg|m4a|flac)$/i, '')
      .replace(/^\d+-[a-z0-9]+-/i, '')
      .replace(/_/g, ' ')
      .trim();
  };

  if (!currentTrack) {
    return (
      <div className={`flex items-center justify-center bg-[#121212] rounded-xl p-8 ${className}`}>
        <div className="text-center text-gray-400">
          <div className="text-4xl mb-2">🎵</div>
          <div>No hay archivos de audio</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col bg-[#121212] rounded-xl overflow-hidden ${className}`}>
      <audio ref={audioRef} src={currentTrack.url} preload="metadata" />

      {/* Cover Image - Grande y centrado */}
      <div className="flex justify-center py-6 bg-gradient-to-b from-purple-900/20 to-transparent">
        <div className="relative w-44 h-44 md:w-56 md:h-56 rounded-lg overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
          {coverImage ? (
            <img
              src={coverImage}
              alt={title}
              className={`w-full h-full object-cover transition-transform duration-500 ${isPlaying ? 'scale-105' : 'scale-100'}`}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-800 to-purple-950 flex items-center justify-center">
              <span className="text-6xl">🎵</span>
            </div>
          )}
          {/* Playing indicator */}
          {isPlaying && (
            <div className="absolute bottom-2 right-2 flex items-end gap-[2px] h-4 bg-black/50 px-1.5 py-1 rounded">
              <div className="w-[3px] bg-green-500 rounded-sm animate-[bar1_0.5s_ease-in-out_infinite]" style={{height: '6px'}}></div>
              <div className="w-[3px] bg-green-500 rounded-sm animate-[bar2_0.7s_ease-in-out_infinite]" style={{height: '10px'}}></div>
              <div className="w-[3px] bg-green-500 rounded-sm animate-[bar3_0.6s_ease-in-out_infinite]" style={{height: '5px'}}></div>
            </div>
          )}
        </div>
      </div>

      {/* Track List */}
      {audioFiles.length > 0 && (
        <div className="flex-1 overflow-y-auto">
          {/* Header de lista */}
          <div className="sticky top-0 bg-[#121212] border-b border-white/10 px-4 py-2 flex items-center text-xs text-gray-500 uppercase tracking-wider">
            <div className="w-8 text-center">#</div>
            <div className="flex-1 pl-3">Título</div>
            <div className="w-14 text-right pr-2">
              <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          {/* Lista de tracks */}
          {audioFiles.map((track, index) => {
            const isCurrentTrack = index === currentTrackIndex;
            const trackName = cleanTrackName(track.originalName || track.name);
            
            return (
              <button
                key={index}
                onClick={() => playTrack(index)}
                className={`w-full flex items-center px-4 py-3 hover:bg-white/5 transition-colors group ${
                  isCurrentTrack ? 'bg-white/10' : ''
                }`}
              >
                {/* Número / Indicador */}
                <div className="w-8 text-center flex-shrink-0">
                  {isCurrentTrack && isPlaying ? (
                    <div className="flex gap-[2px] justify-center items-end h-4">
                      <div className="w-[3px] bg-green-500 rounded-sm animate-[bar1_0.5s_ease-in-out_infinite]" style={{height: '8px'}}></div>
                      <div className="w-[3px] bg-green-500 rounded-sm animate-[bar2_0.7s_ease-in-out_infinite]" style={{height: '12px'}}></div>
                      <div className="w-[3px] bg-green-500 rounded-sm animate-[bar3_0.6s_ease-in-out_infinite]" style={{height: '6px'}}></div>
                    </div>
                  ) : (
                    <>
                      <span className={`group-hover:hidden ${isCurrentTrack ? 'text-green-500' : 'text-gray-500'}`}>
                        {index + 1}
                      </span>
                      <svg className="w-4 h-4 text-white hidden group-hover:block mx-auto" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </>
                  )}
                </div>

                {/* Nombre del track */}
                <div className="flex-1 text-left pl-3 min-w-0">
                  <p className={`text-sm font-medium truncate ${isCurrentTrack ? 'text-green-500' : 'text-white'}`}>
                    {trackName}
                  </p>
                </div>

                {/* Duración */}
                <div className="w-14 text-right text-sm text-gray-400 font-mono pr-2">
                  {formatTime(trackDurations[index] || 0)}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Player Bar - Fijo abajo */}
      <div className="border-t border-white/10 bg-[#181818] p-3">
        {/* Progress Bar */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] text-gray-400 font-mono w-8 text-right">{formatTime(currentTime)}</span>
          <div className="flex-1 relative h-1 bg-white/20 rounded-full group cursor-pointer">
            <div
              className="absolute top-0 left-0 h-full bg-white group-hover:bg-green-500 rounded-full transition-colors"
              style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
            />
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          <span className="text-[10px] text-gray-400 font-mono w-8">{formatTime(duration)}</span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          {/* Track info mini */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0 bg-gray-800">
              {coverImage ? (
                <img src={coverImage} alt={title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-lg">🎵</div>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-white truncate max-w-[120px]">
                {cleanTrackName(currentTrack.originalName || currentTrack.name)}
              </p>
              <p className="text-[10px] text-gray-500 truncate max-w-[120px]">{title}</p>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center gap-3">
            <button onClick={prevTrack} className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" /></svg>
            </button>
            <button
              onClick={togglePlay}
              className="w-9 h-9 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
            >
              {isPlaying ? (
                <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
              ) : (
                <svg className="w-4 h-4 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              )}
            </button>
            <button onClick={nextTrack} disabled={currentTrackIndex === audioFiles.length - 1} className="text-gray-400 hover:text-white disabled:opacity-30 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" /></svg>
            </button>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-2 flex-1 justify-end">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
            <div className="w-20 relative h-1 bg-white/20 rounded-full cursor-pointer hidden sm:block">
              <div className="absolute top-0 left-0 h-full bg-white rounded-full" style={{ width: `${volume * 100}%` }} />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes bar1 { 0%, 100% { height: 4px; } 50% { height: 16px; } }
        @keyframes bar2 { 0%, 100% { height: 8px; } 50% { height: 12px; } }
        @keyframes bar3 { 0%, 100% { height: 12px; } 50% { height: 6px; } }
      `}</style>
    </div>
  );
}
