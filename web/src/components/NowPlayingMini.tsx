import React, { useState } from 'react';
import { Play, Pause, Disc, Music } from 'lucide-react';
import { AudioTrack, ThemeMode } from '../types/tv';
import { DEMO_TRACKS } from '../data/launcherData';

interface NowPlayingMiniProps {
  themeMode: ThemeMode;
  isPlaying: boolean;
  onTogglePlay: () => void;
  isFocused?: boolean;
  onFocus?: () => void;
}

export const NowPlayingMini: React.FC<NowPlayingMiniProps> = ({
  themeMode,
  isPlaying,
  onTogglePlay,
  isFocused = false,
  onFocus,
}) => {
  const [trackIndex, setTrackIndex] = useState(0);
  const currentTrack: AudioTrack = DEMO_TRACKS[trackIndex] || DEMO_TRACKS[0];

  const handleNextTrack = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTrackIndex((prev) => (prev + 1) % DEMO_TRACKS.length);
  };

  const isLight = themeMode === 'light';

  return (
    <div
      onClick={onTogglePlay}
      onMouseEnter={onFocus}
      title="Tocando Agora (Clique para Pausar/Reproduzir) · Sessão de Mídia Android TV"
      className={`relative flex items-center gap-2.5 px-3 py-1.5 rounded-2xl select-none cursor-pointer transition-all duration-200 ${
        isFocused
          ? 'scale-105 ring-2 ring-cyan-400 shadow-[0_0_15px_rgba(56,189,248,0.35)]'
          : 'hover:scale-[1.02]'
      } ${
        isLight
          ? 'bg-slate-300/40 hover:bg-slate-300/60 text-slate-800 border border-slate-400/30 backdrop-blur-md shadow-sm'
          : 'bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/15 backdrop-blur-md shadow-sm'
      }`}
    >
      {/* Mini Album Cover with Spin Animation when playing */}
      <div
        className={`relative w-7 h-7 rounded-lg flex items-center justify-center shrink-0 overflow-hidden shadow-sm transition-transform duration-700 ${
          isPlaying ? 'rotate-12' : ''
        }`}
        style={{
          background: `linear-gradient(135deg, ${currentTrack.coverColor}, #0f172a)`,
          border: isLight ? '1px solid rgba(0,0,0,0.15)' : '1px solid rgba(255,255,255,0.25)',
        }}
      >
        <Disc className={`w-4 h-4 text-white/90 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
      </div>

      {/* Track & Artist Info - Compact */}
      <div className="flex flex-col text-left max-w-[130px] min-w-[90px]">
        <div className="flex items-center gap-1">
          <span className={`text-[11px] font-bold truncate font-['Outfit'] ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {currentTrack.title}
          </span>
        </div>
        <span className={`text-[9px] truncate font-medium ${isLight ? 'text-slate-600' : 'text-cyan-300'}`}>
          {currentTrack.artist}
        </span>
      </div>

      {/* Discrete Equalizer Bars */}
      <div className="flex items-end gap-0.5 h-3.5 px-1 shrink-0">
        <span
          className={`w-0.5 rounded-full transition-all duration-300 ${
            isPlaying ? 'h-3 animate-pulse bg-cyan-400' : 'h-1 bg-slate-400/50'
          }`}
        />
        <span
          className={`w-0.5 rounded-full transition-all duration-200 ${
            isPlaying ? 'h-3.5 animate-bounce bg-sky-400' : 'h-1.5 bg-slate-400/50'
          }`}
        />
        <span
          className={`w-0.5 rounded-full transition-all duration-300 ${
            isPlaying ? 'h-2 animate-pulse bg-cyan-300' : 'h-1 bg-slate-400/50'
          }`}
        />
      </div>

      {/* Quick Play/Pause indicator icon */}
      <div className={`p-1 rounded-full ${isLight ? 'text-slate-700 hover:bg-black/10' : 'text-slate-200 hover:bg-white/10'}`}>
        {isPlaying ? (
          <Pause className="w-2.5 h-2.5 fill-current" />
        ) : (
          <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
        )}
      </div>
    </div>
  );
};
