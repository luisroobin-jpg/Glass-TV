import React from 'react';
import { AppItem, AppearanceMode } from '../types/tv';
import { AppIcon } from './AppIcon';

interface FreeMyTvDockProps {
  apps: AppItem[];
  selectedIndex: number;
  appearanceMode: AppearanceMode;
  onSelectApp: (app: AppItem) => void;
  onFocusApp: (index: number) => void;
  isDockFocused: boolean;
}

export const FreeMyTvDock: React.FC<FreeMyTvDockProps> = ({
  apps,
  selectedIndex,
  appearanceMode,
  onSelectApp,
  onFocusApp,
  isDockFocused,
}) => {
  const isLight = appearanceMode === 'light';

  // Ensure we display exactly 8 items (first 7 favorites + 8th Meus Aplicativos)
  const displayApps = apps.slice(0, 8);

  return (
    <div className="w-full px-10 my-auto">
      {/* Single Unified Liquid Glass Shelf (Free My TV Style) */}
      <div
        className={`w-full rounded-[28px] p-3 transition-all duration-300 ${
          isLight
            ? 'bg-black/[0.05] border border-black/10 shadow-sm backdrop-blur-xl'
            : 'bg-white/[0.05] border border-white/10 shadow-2xl backdrop-blur-xl'
        }`}
      >
        {/* Exactly 8 Items in a single horizontal row with zero horizontal scrolling */}
        <div className="grid grid-cols-8 gap-3 items-stretch justify-items-stretch">
          {displayApps.map((app, index) => {
            const isItemFocused = isDockFocused && selectedIndex === index;

            return (
              <div
                key={app.id}
                tabIndex={0}
                role="button"
                aria-label={`Aplicativo ${app.name}`}
                onClick={() => onSelectApp(app)}
                onMouseEnter={() => onFocusApp(index)}
                className={`relative group flex flex-col items-center justify-center py-3 px-2 rounded-2xl cursor-pointer select-none outline-none transition-all duration-200 ${
                  isItemFocused
                    ? 'scale-105 z-20'
                    : 'hover:scale-[1.02] opacity-90 hover:opacity-100'
                }`}
                style={{
                  background: isItemFocused
                    ? isLight
                      ? 'rgba(0, 0, 0, 0.08)'
                      : 'rgba(255, 255, 255, 0.14)'
                    : 'transparent',
                  border: isItemFocused
                    ? isLight
                      ? '1.5px solid rgba(0, 0, 0, 0.4)'
                      : '1.5px solid rgba(255, 255, 255, 0.6)'
                    : '1.5px solid transparent',
                  boxShadow: isItemFocused
                    ? isLight
                      ? '0 10px 25px -5px rgba(0, 0, 0, 0.15)'
                      : '0 12px 30px -5px rgba(0, 0, 0, 0.8), 0 0 15px rgba(255, 255, 255, 0.15)'
                    : 'none',
                }}
              >
                {/* Official Icon: Standalone, NO colored square background behind it */}
                <div className="flex items-center justify-center my-1">
                  <AppIcon type={app.iconType} name={app.name} size={54} />
                </div>

                {/* App Label */}
                <span
                  className={`text-xs font-semibold tracking-wide truncate max-w-full text-center mt-1.5 font-['Outfit'] ${
                    isItemFocused
                      ? isLight
                        ? 'text-black font-bold'
                        : 'text-white font-bold'
                      : isLight
                      ? 'text-neutral-800'
                      : 'text-neutral-200'
                  }`}
                >
                  {app.name}
                </span>

                {/* Focus indicator bar (subtle Free My TV underline glow) */}
                {isItemFocused && (
                  <div
                    className={`w-6 h-0.5 rounded-full mt-1 ${
                      isLight ? 'bg-black/60' : 'bg-white/80'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
