import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Disc, Music } from 'lucide-react';
import { AudioTrack } from '../types/tv';
import { DEMO_TRACKS } from '../data/launcherData';

interface MusicWidgetProps {
  isFocused?: boolean;
  onFocus?: () => void;
}

export const MusicWidget: React.FC<MusicWidgetProps> = ({
  isFocused = false,
  onFocus,
}) => {
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(48);
  const currentTrack: AudioTrack = DEMO_TRACKS[trackIndex] || DEMO_TRACKS[0];

  // Simulated progress timer when playing
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= currentTrack.duration) {
          // auto loop or next track
          setTrackIndex((i) => (i + 1) % DEMO_TRACKS.length);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack.duration]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentTime(0);
    setTrackIndex((prev) => (prev > 0 ? prev - 1 : DEMO_TRACKS.length - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentTime(0);
    setTrackIndex((prev) => (prev + 1) % DEMO_TRACKS.length);
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.min(100, (currentTime / currentTrack.duration) * 100);

  return (
    <div
      onClick={onFocus}
      className={`relative w-80 h-56 rounded-3xl p-5 flex flex-col justify-between cursor-pointer select-none transition-all duration-200 liquid-glass-card ${
        isFocused ? 'is-focused' : 'hover:scale-[1.02]'
      }`}
      style={{
        background: isFocused
          ? 'rgba(255, 255, 255, 0.16)'
          : 'rgba(255, 255, 255, 0.06)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: isFocused
          ? '0 24px 48px -12px rgba(0, 0, 0, 0.8), 0 0 30px 2px rgba(56, 189, 248, 0.35), inset 0 1px 2px rgba(255, 255, 255, 0.5)'
          : '0 8px 24px -4px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
      }}
    >
      {/* Header: Title & Equalizer bars */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <Music className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
            Tocando Agora · TV Áudio
          </span>
        </div>

        {/* Dynamic Animated Soundwave equalizer */}
        <div className="flex items-end gap-1 h-4">
          <span
            className={`w-1 bg-cyan-400 rounded-full transition-all duration-300 ${
              isPlaying ? 'h-3.5 animate-pulse' : 'h-1.5 opacity-40'
            }`}
          />
          <span
            className={`w-1 bg-sky-300 rounded-full transition-all duration-200 ${
              isPlaying ? 'h-4 animate-bounce' : 'h-2 opacity-40'
            }`}
          />
          <span
            className={`w-1 bg-blue-400 rounded-full transition-all duration-300 ${
              isPlaying ? 'h-2.5 animate-pulse' : 'h-1 opacity-40'
            }`}
          />
          <span
            className={`w-1 bg-indigo-300 rounded-full transition-all duration-150 ${
              isPlaying ? 'h-3 animate-bounce' : 'h-1.5 opacity-40'
            }`}
          />
        </div>
      </div>

      {/* Middle: Album Vinyl / Art + Track Metadata */}
      <div className="flex items-center gap-3.5 my-auto">
        <div
          className={`relative w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-500 overflow-hidden ${
            isPlaying ? 'rotate-12 scale-105' : ''
          }`}
          style={{
            background: `linear-gradient(135deg, ${currentTrack.coverColor}, #0f172a)`,
            border: '1px solid rgba(255,255,255,0.25)',
          }}
        >
          <Disc className={`w-8 h-8 text-white/90 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/20 pointer-events-none" />
        </div>

        <div className="flex flex-col flex-1 min-w-0 text-left">
          <h4 className="text-sm font-bold text-white truncate font-['Outfit']">
            {currentTrack.title}
          </h4>
          <p className="text-xs text-cyan-300 truncate font-medium">
            {currentTrack.artist}
          </p>
          <span className="text-[10px] text-slate-400 truncate mt-0.5">
            {currentTrack.album}
          </span>
        </div>
      </div>

      {/* Bottom: Progress Bar & Player Controls */}
      <div className="w-full flex flex-col gap-2">
        {/* Progress Bar */}
        <div className="w-full">
          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-sky-300 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 tabular-nums font-mono">
            <span>{formatSeconds(currentTime)}</span>
            <span>{formatSeconds(currentTrack.duration)}</span>
          </div>
        </div>

        {/* Transport Controls */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors">
            <Volume2 className="w-3.5 h-3.5" />
            <span className="text-[10px]">TCL Áudio</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              title="Faixa Anterior"
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-200 transition-colors cursor-pointer"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              title={isPlaying ? 'Pausar' : 'Reproduzir'}
              className="p-2 rounded-xl bg-white text-slate-950 hover:scale-110 shadow-md transition-all cursor-pointer"
            >
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5 fill-current" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
              )}
            </button>

            <button
              onClick={handleNext}
              title="Próxima Faixa"
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-200 transition-colors cursor-pointer"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
