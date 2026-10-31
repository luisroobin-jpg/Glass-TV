import React from 'react';
import { Star } from 'lucide-react';
import { AppItem, ThemeMode } from '../types/tv';
import { AppIcon } from './AppIcon';

interface AppCardProps {
  app: AppItem;
  themeMode: ThemeMode;
  isFocused: boolean;
  onSelect: (app: AppItem) => void;
  onFocus: (app: AppItem) => void;
  onToggleFavorite?: (id: string, e: React.MouseEvent) => void;
}

export const AppCard: React.FC<AppCardProps> = ({
  app,
  themeMode,
  isFocused,
  onSelect,
  onFocus,
  onToggleFavorite,
}) => {
  const isLight = themeMode === 'light';

  return (
    <div
      tabIndex={0}
      role="button"
      aria-label={`Abrir aplicativo ${app.name}`}
      onClick={() => onSelect(app)}
      onMouseEnter={() => onFocus(app)}
      className={`relative group flex-shrink-0 w-[190px] h-[185px] rounded-3xl cursor-pointer p-3.5 flex flex-col justify-between select-none outline-none transition-all duration-200 liquid-glass-card ${
        isFocused ? 'is-focused' : 'hover:scale-[1.02]'
      }`}
      style={{
        background: isLight
          ? isFocused
            ? 'rgba(255, 255, 255, 0.75)'
            : 'rgba(203, 213, 225, 0.45)'
          : isFocused
          ? 'rgba(255, 255, 255, 0.16)'
          : 'rgba(255, 255, 255, 0.06)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: isLight
          ? isFocused
            ? '2px solid rgba(15, 23, 42, 0.8)'
            : '1px solid rgba(148, 163, 184, 0.4)'
          : isFocused
          ? '2px solid rgba(255, 255, 255, 0.8)'
          : '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: isFocused
          ? isLight
            ? `0 20px 35px -10px rgba(0, 0, 0, 0.25), 0 0 25px 2px ${app.glowColor}`
            : `0 20px 40px -10px rgba(0, 0, 0, 0.8), 0 0 30px 2px ${app.glowColor}`
          : isLight
          ? '0 4px 15px -2px rgba(0, 0, 0, 0.08)'
          : '0 8px 24px -4px rgba(0, 0, 0, 0.4)',
      }}
    >
      {/* Top row: Badge & Favorite indicator */}
      <div className="flex items-center justify-between w-full">
        {app.badge ? (
          <span
            className="px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider text-white shadow-sm"
            style={{ backgroundColor: app.accentColor }}
          >
            {app.badge}
          </span>
        ) : (
          <span className={`text-[9px] font-semibold capitalize ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            {app.category}
          </span>
        )}

        {onToggleFavorite && !app.isSystemAction && (
          <button
            onClick={(e) => onToggleFavorite(app.id, e)}
            title={app.isFavorite ? 'Remover dos 8 favoritos' : 'Adicionar aos favoritos'}
            className="p-1 rounded-full text-slate-400 hover:text-amber-400 transition-colors"
          >
            <Star
              className={`w-3.5 h-3.5 ${
                app.isFavorite ? 'fill-amber-400 text-amber-400' : 'text-slate-500'
              }`}
            />
          </button>
        )}
      </div>

      {/* Center: App Icon with specular depth */}
      <div className="flex flex-col items-center justify-center my-auto transition-transform duration-200">
        <div
          className={`relative p-2.5 rounded-2xl flex items-center justify-center transition-all duration-200 ${
            isFocused ? 'scale-110 drop-shadow-md' : ''
          }`}
          style={{
            backgroundColor: isLight ? `${app.accentColor}25` : `${app.accentColor}18`,
            border: isLight ? `1px solid ${app.accentColor}50` : `1px solid ${app.accentColor}40`,
          }}
        >
          <AppIcon type={app.iconType} name={app.name} size={42} />
        </div>
      </div>

      {/* Bottom: App Title & Subtitle */}
      <div className="w-full text-center">
        <h3
          className={`text-xs font-bold tracking-wide truncate font-['Outfit'] ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}
        >
          {app.name}
        </h3>
        <p
          className={`text-[9px] truncate mt-0.5 font-['Plus_Jakarta_Sans'] ${
            isLight ? 'text-slate-600' : 'text-slate-400'
          }`}
        >
          {app.isSystemAction ? 'Abrir Biblioteca' : isFocused ? app.packageName : app.category}
        </p>
      </div>

      {/* Apple TV dynamic sheen highlight layer */}
      {isFocused && (
        <div className="absolute inset-0 rounded-3xl pointer-events-none bg-gradient-to-tr from-white/[0.08] via-transparent to-white/[0.2] overflow-hidden">
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-white/20 rounded-full blur-xl" />
        </div>
      )}
    </div>
  );
};
