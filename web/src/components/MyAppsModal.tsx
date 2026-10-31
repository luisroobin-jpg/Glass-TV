import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  X, 
  Grid, 
  Star, 
  Play, 
  Search, 
  MoveUp, 
  MoveDown, 
  Tv 
} from 'lucide-react';
import { AppItem, AppearanceMode } from '../types/tv';
import { AppIcon } from './AppIcon';

interface MyAppsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apps: AppItem[];
  themeMode: AppearanceMode;
  onLaunchApp: (app: AppItem) => void;
  onToggleFavorite: (id: string) => void;
  onMoveOrder: (id: string, direction: 'up' | 'down') => void;
}

export const MyAppsModal: React.FC<MyAppsModalProps> = ({
  isOpen,
  onClose,
  apps,
  themeMode,
  onLaunchApp,
  onToggleFavorite,
  onMoveOrder,
}) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'streaming' | 'music' | 'tools'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedAppId, setFocusedAppId] = useState<string | null>(null);

  const gridContainerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const filteredApps = apps.filter((app) => {
    if (app.id === 'my_apps') return false; // don't show the library shortcut inside the library
    if (filterCategory !== 'all' && app.category !== filterCategory) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return app.name.toLowerCase().includes(q) || app.packageName.toLowerCase().includes(q);
    }
    return true;
  });

  // Set initial focus to first item and scroll container to top when modal opens
  useEffect(() => {
    if (isOpen && filteredApps.length > 0) {
      if (!focusedAppId || !filteredApps.some((a) => a.id === focusedAppId)) {
        setFocusedAppId(filteredApps[0].id);
      }
      if (gridContainerRef.current) {
        gridContainerRef.current.scrollTop = 0;
      }
    }
  }, [isOpen]);

  // Smooth scroll into view whenever focusedAppId changes:
  // Ensures the selected line climbs up and is fully visible without cuts at the bottom
  useEffect(() => {
    if (!isOpen || !focusedAppId) return;

    const cardElement = cardRefs.current.get(focusedAppId);
    const container = gridContainerRef.current;

    if (cardElement && container) {
      const containerRect = container.getBoundingClientRect();
      const elementRect = cardElement.getBoundingClientRect();

      const safeBottomMargin = 40; // generous margin so card bottom is 100% visible
      const safeTopMargin = 20;

      if (elementRect.bottom > containerRect.bottom - safeBottomMargin) {
        const scrollAmount = elementRect.bottom - containerRect.bottom + safeBottomMargin;
        container.scrollBy({ top: scrollAmount, behavior: 'smooth' });
      } else if (elementRect.top < containerRect.top + safeTopMargin) {
        const scrollAmount = elementRect.top - containerRect.top - safeTopMargin;
        container.scrollBy({ top: scrollAmount, behavior: 'smooth' });
      }
    }
  }, [focusedAppId, isOpen]);

  // Navigation listener for TV Remote / Keyboard (Arrows, Enter, Space, Escape, Backspace)
  useEffect(() => {
    if (!isOpen) return;

    const handleModalKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT') {
        if (e.key === 'Escape') {
          (e.target as HTMLElement).blur();
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          (e.target as HTMLElement).blur();
          if (filteredApps.length > 0) {
            setFocusedAppId(filteredApps[0].id);
          }
        }
        return;
      }

      if (e.key === 'Escape' || e.key === 'Backspace') {
        e.preventDefault();
        onClose();
        return;
      }

      if (filteredApps.length === 0) return;

      const currentIndex = filteredApps.findIndex((a) => a.id === focusedAppId);
      const validIndex = currentIndex >= 0 ? currentIndex : 0;

      // Dynamically calculate grid columns
      let cols = 4;
      const firstEl = cardRefs.current.get(filteredApps[0]?.id);
      if (firstEl && filteredApps.length > 1) {
        for (let i = 1; i < filteredApps.length; i++) {
          const nextEl = cardRefs.current.get(filteredApps[i]?.id);
          if (nextEl && nextEl.offsetTop > firstEl.offsetTop) {
            cols = i;
            break;
          }
        }
      }

      switch (e.key) {
        case 'ArrowRight': {
          e.preventDefault();
          const nextIdx = Math.min(filteredApps.length - 1, validIndex + 1);
          setFocusedAppId(filteredApps[nextIdx].id);
          break;
        }
        case 'ArrowLeft': {
          e.preventDefault();
          const prevIdx = Math.max(0, validIndex - 1);
          setFocusedAppId(filteredApps[prevIdx].id);
          break;
        }
        case 'ArrowDown': {
          e.preventDefault();
          const nextRowIdx = Math.min(filteredApps.length - 1, validIndex + cols);
          setFocusedAppId(filteredApps[nextRowIdx].id);
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          const prevRowIdx = Math.max(0, validIndex - cols);
          setFocusedAppId(filteredApps[prevRowIdx].id);
          break;
        }
        case 'Enter':
        case ' ': {
          e.preventDefault();
          const selectedApp = filteredApps[validIndex];
          if (selectedApp) {
            onClose();
            onLaunchApp(selectedApp);
          }
          break;
        }
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleModalKeyDown);
    return () => window.removeEventListener('keydown', handleModalKeyDown);
  }, [isOpen, onClose, filteredApps, focusedAppId, onLaunchApp]);

  if (!isOpen) return null;

  const isLight = themeMode === 'light';

  // Count how many are currently marked favorite (excluding the 'my_apps' shortcut itself)
  const favoriteCount = apps.filter((a) => a.isFavorite && a.id !== 'my_apps').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/85 backdrop-blur-2xl animate-in fade-in duration-200 overflow-y-auto">
      <div
        className={`relative w-full max-w-5xl h-[88vh] max-h-[620px] rounded-[32px] border flex flex-col overflow-hidden text-left shadow-2xl transition-all duration-300 my-auto ${
          isLight
            ? 'bg-[#E5E5E7] border-neutral-300 text-neutral-900 shadow-xl'
            : 'bg-[#101014] border-white/15 text-white shadow-[0_30px_90px_rgba(0,0,0,0.95)]'
        }`}
      >
        {/* Top Header: Always 100% visible and sticky, with prominent ← Voltar button */}
        <div
          className={`flex items-center justify-between px-6 py-3.5 border-b shrink-0 sticky top-0 z-20 ${
            isLight ? 'border-neutral-300 bg-[#E5E5E7]/95 backdrop-blur-md' : 'border-white/10 bg-[#101014]/95 backdrop-blur-md'
          }`}
        >
          {/* Upper-Left: Back Button + Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              title="Voltar para a tela inicial (Esc / Backspace)"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border font-bold text-xs transition-all cursor-pointer shadow-sm ${
                isLight
                  ? 'bg-white hover:bg-neutral-100 border-neutral-300 text-neutral-900'
                  : 'bg-white/10 hover:bg-white/20 border-white/20 text-white hover:scale-105'
              }`}
            >
              <ArrowLeft className="w-4 h-4 text-cyan-400" />
              <span>Voltar</span>
            </button>

            <div className="flex items-center gap-2 ml-1">
              <div
                className={`p-2 rounded-xl border ${
                  isLight ? 'bg-white border-neutral-300 text-neutral-900' : 'bg-cyan-950/60 border-cyan-400/30 text-cyan-300'
                }`}
              >
                <Grid className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-black font-['Outfit']">
                  Meus Aplicativos
                </h2>
                <p className={`text-[11px] ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                  {favoriteCount} de 7 favoritos selecionados para a tela inicial
                </p>
              </div>
            </div>
          </div>

          {/* Upper-Right: Search + Close X */}
          <div className="flex items-center gap-2.5">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs ${
                isLight ? 'bg-white border-neutral-300 text-neutral-900' : 'bg-white/10 border-white/15 text-white'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-neutral-400" />
              <input
                type="text"
                placeholder="Buscar app..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none text-xs w-32 placeholder:text-neutral-400"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-neutral-400 hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <button
              onClick={onClose}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isLight
                  ? 'bg-neutral-200 hover:bg-neutral-300 border-neutral-300 text-neutral-800'
                  : 'bg-white/10 hover:bg-white/20 border-white/15 text-neutral-300 hover:text-white'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Categories Bar */}
        <div
          className={`flex items-center justify-between px-8 py-2 border-b shrink-0 text-xs ${
            isLight ? 'border-neutral-200 bg-neutral-100' : 'border-white/5 bg-black/30'
          }`}
        >
          <div className="flex items-center gap-2">
            {[
              { id: 'all', label: 'Todos os Apps' },
              { id: 'streaming', label: 'Streaming' },
              { id: 'music', label: 'Música & Áudio' },
              { id: 'tools', label: 'Sistema & Ferramentas' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id as any)}
                className={`px-3 py-1 rounded-xl font-medium transition-all cursor-pointer ${
                  filterCategory === cat.id
                    ? isLight
                      ? 'bg-neutral-900 text-white font-bold shadow-sm'
                      : 'bg-white text-neutral-950 font-bold shadow-md'
                    : isLight
                    ? 'text-neutral-700 hover:bg-neutral-200'
                    : 'text-neutral-300 hover:bg-white/10'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <span className={`text-[11px] font-mono ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
            {filteredApps.length} aplicativos disponíveis
          </span>
        </div>

        {/* Main Grid View with vertical scroll and clean framing */}
        <div ref={gridContainerRef} className="flex-1 p-6 overflow-y-auto no-scrollbar scroll-smooth">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 pb-6">
            {filteredApps.map((app) => {
              const isFocused = focusedAppId === app.id;
              return (
                <div
                  key={app.id}
                  ref={(el) => {
                    if (el) cardRefs.current.set(app.id, el);
                    else cardRefs.current.delete(app.id);
                  }}
                  onMouseEnter={() => setFocusedAppId(app.id)}
                  onClick={() => {
                    onClose();
                    onLaunchApp(app);
                  }}
                  className={`relative p-3.5 rounded-2xl border flex flex-col justify-between transition-all duration-200 select-none scroll-mb-10 scroll-mt-6 cursor-pointer ${
                    isFocused
                      ? isLight
                        ? 'bg-white border-neutral-900 shadow-xl scale-[1.02] ring-2 ring-neutral-900'
                        : 'bg-white/[0.12] border-white shadow-2xl scale-[1.02] ring-2 ring-cyan-400'
                      : isLight
                      ? 'bg-white/80 border-neutral-300 hover:bg-white shadow-sm'
                      : 'bg-white/[0.04] border-white/10 hover:bg-white/[0.08]'
                  }`}
                >
                  {/* Top Bar inside card */}
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase text-white shadow-sm"
                      style={{ backgroundColor: app.accentColor }}
                    >
                      {app.badge || app.category}
                    </span>

                    {/* Star Favorite Toggle */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(app.id);
                      }}
                      title={app.isFavorite ? 'Remover dos favoritos da tela inicial' : 'Adicionar aos favoritos da tela inicial'}
                      className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all cursor-pointer ${
                        app.isFavorite
                          ? 'bg-amber-400/20 text-amber-500 border border-amber-400/30'
                          : isLight
                          ? 'bg-neutral-200 text-neutral-600 hover:text-amber-500'
                          : 'bg-white/10 text-neutral-400 hover:text-amber-400'
                      }`}
                    >
                      <Star className={`w-3 h-3 ${app.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                      <span>{app.isFavorite ? 'Favorito' : 'Fixar'}</span>
                    </button>
                  </div>

                  {/* App Icon + Title (Clean standalone icon without colored box) */}
                  <div className="flex items-center gap-3 my-1.5">
                    <div className="flex items-center justify-center shrink-0">
                      <AppIcon type={app.iconType} name={app.name} size={44} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className={`text-sm font-bold truncate font-['Outfit'] ${isLight ? 'text-neutral-950' : 'text-white'}`}>
                        {app.name}
                      </h4>
                      <span className={`text-[10px] uppercase font-semibold tracking-wider truncate block ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
                        {app.badge || app.category}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className={`text-[10px] line-clamp-2 my-1 leading-relaxed ${isLight ? 'text-neutral-600' : 'text-neutral-300'}`}>
                    {app.description}
                  </p>

                  {/* Bottom Action Buttons */}
                  <div className="flex items-center justify-between pt-2.5 mt-1 border-t border-white/10">
                    {/* Reorder Buttons if favorite */}
                    {app.isFavorite ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onMoveOrder(app.id, 'up');
                          }}
                          title="Mover para esquerda na tela inicial"
                          className={`p-1 rounded-lg border transition-colors cursor-pointer ${
                            isLight ? 'bg-neutral-200 hover:bg-neutral-300 border-neutral-300' : 'bg-white/10 hover:bg-white/20 border-white/15'
                          }`}
                        >
                          <MoveUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onMoveOrder(app.id, 'down');
                          }}
                          title="Mover para direita na tela inicial"
                          className={`p-1 rounded-lg border transition-colors cursor-pointer ${
                            isLight ? 'bg-neutral-200 hover:bg-neutral-300 border-neutral-300' : 'bg-white/10 hover:bg-white/20 border-white/15'
                          }`}
                        >
                          <MoveDown className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <span className={`text-[10px] ${isLight ? 'text-neutral-500' : 'text-neutral-500'}`}>
                        Disponível
                      </span>
                    )}

                    <button
                      onClick={() => {
                        onClose();
                        onLaunchApp(app);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isLight
                          ? 'bg-neutral-900 text-white hover:bg-neutral-800'
                          : 'bg-white text-neutral-950 hover:bg-white/90'
                      }`}
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Abrir</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer with Return to Home Button */}
        <div
          className={`flex items-center justify-between px-8 py-3 border-t text-xs shrink-0 ${
            isLight ? 'border-neutral-300 bg-neutral-200/60 text-neutral-700' : 'border-white/10 bg-black/40 text-neutral-400'
          }`}
        >
          <span className="text-[11px] font-medium opacity-80">
            Navegue pelos aplicativos com o controle remoto ou teclado
          </span>

          <button
            onClick={onClose}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
              isLight ? 'bg-neutral-300 hover:bg-neutral-400 text-neutral-900' : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            ← Voltar
          </button>
        </div>
      </div>
    </div>
  );
};
