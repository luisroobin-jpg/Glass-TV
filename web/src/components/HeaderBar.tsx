import React, { useEffect, useState } from 'react';
import { Settings, Sparkles, CloudSun, RefreshCw } from 'lucide-react';
import { ThemeMode, WeatherData } from '../types/tv';
import { NowPlayingMini } from './NowPlayingMini';

interface HeaderBarProps {
  themeMode: ThemeMode;
  weather: WeatherData | null;
  onRefreshWeather: () => void;
  onOpenSettings: () => void;
  isSettingsFocused: boolean;
  clock24h: boolean;
  showWeather: boolean;
  showClock: boolean;
  showMusicMini: boolean;
  isPlayingMusic: boolean;
  onTogglePlayMusic: () => void;
  isMusicMiniFocused: boolean;
  onFocusMusicMini: () => void;
  onFocusSettings: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  themeMode,
  weather,
  onRefreshWeather,
  onOpenSettings,
  isSettingsFocused,
  clock24h,
  showWeather,
  showClock,
  showMusicMini,
  isPlayingMusic,
  onTogglePlayMusic,
  isMusicMiniFocused,
  onFocusMusicMini,
  onFocusSettings,
}) => {
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: !clock24h,
  });

  const formattedSeconds = time.getSeconds().toString().padStart(2, '0');

  const formattedDate = time.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  const isLight = themeMode === 'light';

  return (
    <header className="relative z-40 w-full flex items-center justify-between px-10 pt-5 pb-2 transition-all duration-300">
      {/* Brand & Identity Zone */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`relative flex items-center justify-center w-9 h-9 rounded-2xl border transition-all shadow-md ${
              isLight
                ? 'bg-slate-300/40 border-slate-400/40 text-cyan-700'
                : 'bg-white/10 border-white/20 text-cyan-300 shadow-cyan-500/10'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-transparent pointer-events-none" />
          </div>

          <div className="flex flex-col text-left">
            <h1
              className={`text-2xl font-black tracking-wider font-['Outfit'] drop-shadow-sm ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
            >
              GLASS{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">
                TV
              </span>
            </h1>
            <span
              className={`text-[10px] font-semibold tracking-widest uppercase font-['Plus_Jakarta_Sans'] ${
                isLight ? 'text-slate-600' : 'text-slate-400'
              }`}
            >
              Android TV Launcher
            </span>
          </div>
        </div>
      </div>

      {/* Center Zone: Novo Hamburgo Weather + Mini Tocando Agora + Digital Clock */}
      <div className="flex items-center gap-5">
        {/* Weather Widget for Novo Hamburgo, RS */}
        {showWeather && (
          <div
            onClick={onRefreshWeather}
            title="Atualizar clima de Novo Hamburgo, RS (Open-Meteo)"
            className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl border cursor-pointer transition-all duration-200 shadow-sm group ${
              isLight
                ? 'bg-slate-300/40 hover:bg-slate-300/60 border-slate-400/30 text-slate-900'
                : 'bg-white/[0.07] hover:bg-white/[0.12] border-white/15 text-white'
            }`}
          >
            <CloudSun className={`w-4 h-4 ${isLight ? 'text-amber-600' : 'text-amber-300'} group-hover:scale-110 transition-transform`} />
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold tracking-tight">
                  {weather ? `${weather.temperature}°C` : '--°C'}
                </span>
                <span className={`text-[11px] font-semibold ${isLight ? 'text-cyan-800' : 'text-cyan-300'}`}>
                  {weather?.city ?? 'Novo Hamburgo'}, {weather?.state ?? 'RS'}
                </span>
                {weather?.isLive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" title="Dados ao vivo" />
                )}
              </div>
              <span className={`text-[10px] ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                {weather?.conditionText ?? 'Carregando...'} · Min {weather?.tempMin ?? 16}° Max {weather?.tempMax ?? 26}°
              </span>
            </div>
            <RefreshCw className="w-3 h-3 text-slate-400 opacity-40 group-hover:opacity-100 group-hover:rotate-180 transition-all ml-0.5" />
          </div>
        )}

        {/* Mini Tocando Agora (Harmoniously adjacent to Clock) */}
        {showMusicMini && (
          <NowPlayingMini
            themeMode={themeMode}
            isPlaying={isPlayingMusic}
            onTogglePlay={onTogglePlayMusic}
            isFocused={isMusicMiniFocused}
            onFocus={onFocusMusicMini}
          />
        )}

        {/* Digital Clock and Date */}
        {showClock && (
          <div className="flex flex-col items-end">
            <div className={`flex items-baseline gap-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              <span className="text-2xl font-extrabold tracking-tight font-['Outfit'] tabular-nums drop-shadow-sm">
                {formattedTime}
              </span>
              <span className={`text-xs font-semibold tabular-nums ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                :{formattedSeconds}
              </span>
            </div>
            <span className={`text-[11px] font-medium tracking-wide ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              {capitalizedDate}
            </span>
          </div>
        )}
      </div>

      {/* Right Action: Clean Settings Button (Wi-Fi, Bluetooth & 1080p removed as requested) */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenSettings}
          onMouseEnter={onFocusSettings}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-2xl transition-all duration-200 cursor-pointer ${
            isSettingsFocused
              ? isLight
                ? 'bg-slate-900 text-white scale-105 shadow-md font-bold'
                : 'bg-white text-slate-950 scale-105 shadow-[0_0_20px_rgba(255,255,255,0.4)] ring-2 ring-white font-bold'
              : isLight
              ? 'bg-slate-300/40 hover:bg-slate-300/60 text-slate-800 border border-slate-400/30'
              : 'bg-white/[0.08] hover:bg-white/[0.15] text-white border border-white/15'
          }`}
          aria-label="Configurações do GLASS TV"
        >
          <Settings className={`w-3.5 h-3.5 ${isSettingsFocused ? 'rotate-45 transition-transform' : ''}`} />
          <span className="text-xs font-semibold tracking-wide">Ajustes</span>
        </button>
      </div>
    </header>
  );
};
