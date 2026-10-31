import React, { useState, useEffect } from 'react';
import { X, Play, Code2, AlertCircle, ArrowLeft, Tv, ExternalLink } from 'lucide-react';
import { AppItem } from '../types/tv';
import { AppIcon } from './AppIcon';

interface AppLauncherModalProps {
  app: AppItem | null;
  themeMode?: 'dark' | 'light';
  onClose: () => void;
  onOpenArchitecture: () => void;
}

export const AppLauncherModal: React.FC<AppLauncherModalProps> = ({
  app,
  themeMode = 'dark',
  onClose,
  onOpenArchitecture,
}) => {
  const [isSimulatingLaunch, setIsSimulatingLaunch] = useState(false);

  useEffect(() => {
    if (!app) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Backspace') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [app, onClose]);

  if (!app) return null;

  const isLight = themeMode === 'light';

  const handleSimulate = () => {
    setIsSimulatingLaunch(true);
    setTimeout(() => {
      setIsSimulatingLaunch(false);
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200 overflow-y-auto">
      {isSimulatingLaunch ? (
        /* Fullscreen Simulated App Transition */
        <div
          className="relative w-full max-w-2xl h-80 rounded-3xl flex flex-col items-center justify-center p-8 text-center border border-white/20 shadow-2xl animate-in zoom-in-95 duration-300 my-auto"
          style={{
            backgroundColor: `${app.accentColor}25`,
            boxShadow: `0 0 80px 10px ${app.glowColor}`,
          }}
        >
          <div className="p-4 rounded-3xl bg-white/10 backdrop-blur-md mb-4 border border-white/20 animate-pulse">
            <AppIcon type={app.iconType} name={app.name} size={64} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 font-['Outfit']">
            Iniciando {app.name}...
          </h2>
          <p className="text-sm text-slate-300 font-medium mb-4">
            Acessando aplicativo na TV
          </p>
          <div className="flex items-center gap-2 text-xs text-amber-300 bg-black/50 px-4 py-2 rounded-xl border border-amber-500/30">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Retornando ao GLASS TV em instantes...</span>
          </div>
        </div>
      ) : (
        /* Standard App Launcher Info Card */
        <div
          className={`relative w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-3xl p-6 md:p-8 border backdrop-blur-2xl shadow-2xl text-left transition-all my-auto ${
            isLight
              ? 'bg-slate-100/95 border-slate-300 text-slate-900'
              : 'bg-slate-950/90 border-white/20 text-white shadow-[0_25px_60px_rgba(0,0,0,0.9)]'
          }`}
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-5 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div
                className="p-3.5 rounded-2xl border border-white/20 flex items-center justify-center"
                style={{ backgroundColor: `${app.accentColor}20` }}
              >
                <AppIcon type={app.iconType} name={app.name} size={44} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-black text-white font-['Outfit']">
                    {app.name}
                  </h3>
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase text-white"
                    style={{ backgroundColor: app.accentColor }}
                  >
                    {app.badge || app.category}
                  </span>
                </div>
                <p className="text-xs text-cyan-300 mt-1 capitalize font-medium">
                  Categoria: {app.category}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-300 mt-4 leading-relaxed font-['Plus_Jakarta_Sans']">
            {app.description}
          </p>

          {/* Friendly TV Notice */}
          <div className="mt-5 p-4 rounded-2xl bg-blue-950/40 border border-blue-500/30 flex items-start gap-3">
            <Tv className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 leading-relaxed">
              <span className="font-semibold text-white block mb-0.5">
                Navegação na Smart TV:
              </span>
              Use o botão de confirmação (OK) do controle para abrir este aplicativo ou pressione Voltar para retornar à tela inicial do Glass TV.
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
            <button
              onClick={onOpenArchitecture}
              className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              <Code2 className="w-4 h-4" />
              <span>Informações Técnicas</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                Fechar (Voltar)
              </button>

              <button
                onClick={handleSimulate}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white text-slate-950 hover:bg-slate-100 text-xs font-bold transition-all shadow-lg shadow-white/10 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Simular Abertura</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
