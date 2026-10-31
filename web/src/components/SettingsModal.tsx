import React, { useState, useEffect } from 'react';
import { 
  X, 
  ArrowLeft,
  Palette, 
  LayoutGrid, 
  Sliders, 
  Cpu, 
  Check, 
  Star, 
  MoveUp, 
  MoveDown, 
  Zap, 
  Sun, 
  Moon, 
  Image as ImageIcon,
  Tv, 
  Info
} from 'lucide-react';
import { AppItem, LauncherSettings } from '../types/tv';
import { WALLPAPERS } from '../data/launcherData';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: LauncherSettings;
  onUpdateSettings: (newSettings: Partial<LauncherSettings>) => void;
  apps: AppItem[];
  onToggleFavoriteApp: (id: string) => void;
  onMoveAppOrder: (id: string, direction: 'up' | 'down') => void;
  onOpenMyApps: () => void;
  onOpenArchitecture: () => void;
}

type SettingsSection = 'appearance' | 'apps' | 'widgets' | 'system';

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  apps,
  onToggleFavoriteApp,
  onMoveAppOrder,
  onOpenMyApps,
  onOpenArchitecture,
}) => {
  const [activeSection, setActiveSection] = useState<SettingsSection>('appearance');

  // Esc and Backspace listener inside modal
  useEffect(() => {
    if (!isOpen) return;

    const handleModalKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'SELECT') {
        if (e.key === 'Escape') {
          (e.target as HTMLElement).blur();
        }
        return;
      }

      if (e.key === 'Escape' || e.key === 'Backspace') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleModalKeyDown);
    return () => window.removeEventListener('keydown', handleModalKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isLight = settings.appearanceMode === 'light';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/85 backdrop-blur-2xl animate-in fade-in duration-200 overflow-y-auto">
      <div
        className={`relative w-full max-w-4xl h-[88vh] max-h-[620px] rounded-3xl border flex flex-col overflow-hidden text-left shadow-2xl transition-all duration-300 my-auto ${
          isLight
            ? 'bg-[#E5E5E7] border-neutral-300 text-neutral-900 shadow-xl'
            : 'bg-[#121214] border-white/15 text-white shadow-[0_30px_90px_rgba(0,0,0,0.95)]'
        }`}
      >
        {/* Header Bar - Always 100% visible and never scroll-clipped */}
        <div
          className={`flex items-center justify-between px-6 py-3.5 border-b shrink-0 sticky top-0 z-20 ${
            isLight ? 'border-neutral-300 bg-[#E5E5E7]/95 backdrop-blur-md' : 'border-white/10 bg-[#121214]/95 backdrop-blur-md'
          }`}
        >
          {/* Upper-Left: Prominent Voltar Button + Title */}
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

            <div className="flex items-center gap-2.5 ml-1">
              <div
                className={`p-2 rounded-xl border ${
                  isLight ? 'bg-white border-neutral-300 text-neutral-900' : 'bg-white/10 border-white/20 text-cyan-300'
                }`}
              >
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-black font-['Outfit'] leading-tight">
                  Configurações
                </h2>
                <p className={`text-[11px] ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                  Aparência, aplicativos favoritos, widgets e preferências
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            title="Fechar (Esc)"
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isLight
                ? 'bg-neutral-200 hover:bg-neutral-300 border-neutral-300 text-neutral-800'
                : 'bg-white/10 hover:bg-white/20 border-white/15 text-neutral-300 hover:text-white'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body: Left Categories + Right Content */}
        <div className="flex flex-1 min-h-0">
          {/* Left Navigation Tabs */}
          <div
            className={`w-60 border-r p-5 flex flex-col gap-2 shrink-0 ${
              isLight ? 'border-neutral-300 bg-neutral-200/40' : 'border-white/10 bg-white/[0.02]'
            }`}
          >
            <button
              onClick={() => setActiveSection('appearance')}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold tracking-wide transition-all cursor-pointer text-left ${
                activeSection === 'appearance'
                  ? isLight
                    ? 'bg-neutral-900 text-white font-bold shadow-md'
                    : 'bg-white text-neutral-950 font-bold shadow-md'
                  : isLight
                  ? 'text-neutral-700 hover:bg-neutral-300'
                  : 'text-neutral-300 hover:bg-white/10'
              }`}
            >
              <Palette className="w-4 h-4 shrink-0" />
              <span>Aparência</span>
            </button>

            <button
              onClick={() => setActiveSection('apps')}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold tracking-wide transition-all cursor-pointer text-left ${
                activeSection === 'apps'
                  ? isLight
                    ? 'bg-neutral-900 text-white font-bold shadow-md'
                    : 'bg-white text-neutral-950 font-bold shadow-md'
                  : isLight
                  ? 'text-neutral-700 hover:bg-neutral-300'
                  : 'text-neutral-300 hover:bg-white/10'
              }`}
            >
              <LayoutGrid className="w-4 h-4 shrink-0" />
              <span>Aplicativos</span>
            </button>

            <button
              onClick={() => setActiveSection('widgets')}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold tracking-wide transition-all cursor-pointer text-left ${
                activeSection === 'widgets'
                  ? isLight
                    ? 'bg-neutral-900 text-white font-bold shadow-md'
                    : 'bg-white text-neutral-950 font-bold shadow-md'
                  : isLight
                  ? 'text-neutral-700 hover:bg-neutral-300'
                  : 'text-neutral-300 hover:bg-white/10'
              }`}
            >
              <Sliders className="w-4 h-4 shrink-0" />
              <span>Widgets</span>
            </button>

            <button
              onClick={() => setActiveSection('system')}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold tracking-wide transition-all cursor-pointer text-left ${
                activeSection === 'system'
                  ? isLight
                    ? 'bg-neutral-900 text-white font-bold shadow-md'
                    : 'bg-white text-neutral-950 font-bold shadow-md'
                  : isLight
                  ? 'text-neutral-700 hover:bg-neutral-300'
                  : 'text-neutral-300 hover:bg-white/10'
              }`}
            >
              <Cpu className="w-4 h-4 shrink-0" />
              <span>Sistema</span>
            </button>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 p-7 overflow-y-auto no-scrollbar">
            {/* CATEGORY 1: APARÊNCIA */}
            {activeSection === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold mb-1">Aparência</h3>
                  <p className={`text-xs ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                    Escolha o tema visual da interface.
                  </p>
                </div>

                {/* 3 Clean Appearance Mode Options */}
                <div className="grid grid-cols-3 gap-3">
                  {/* Option 1: Dark */}
                  <button
                    onClick={() => onUpdateSettings({ appearanceMode: 'dark' })}
                    className={`p-3.5 rounded-2xl border flex flex-col text-left transition-all cursor-pointer ${
                      settings.appearanceMode === 'dark'
                        ? 'bg-black text-white border-white ring-2 ring-white shadow-xl font-bold'
                        : isLight
                        ? 'bg-white border-neutral-300 text-neutral-800'
                        : 'bg-white/5 border-white/10 text-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Moon className="w-5 h-5 text-white" />
                      {settings.appearanceMode === 'dark' && <Check className="w-4 h-4 text-cyan-400 stroke-[3]" />}
                    </div>
                    <span className="text-xs font-bold">DARK</span>
                    <span className="text-[11px] opacity-75 mt-0.5">Fundo preto.</span>
                  </button>

                  {/* Option 2: Light */}
                  <button
                    onClick={() => onUpdateSettings({ appearanceMode: 'light' })}
                    className={`p-3.5 rounded-2xl border flex flex-col text-left transition-all cursor-pointer ${
                      settings.appearanceMode === 'light'
                        ? 'bg-[#E5E5E7] text-neutral-900 border-neutral-900 ring-2 ring-neutral-900 shadow-xl font-bold'
                        : isLight
                        ? 'bg-white border-neutral-300 text-neutral-800'
                        : 'bg-white/5 border-white/10 text-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Sun className="w-5 h-5 text-amber-500" />
                      {settings.appearanceMode === 'light' && <Check className="w-4 h-4 text-neutral-900 stroke-[3]" />}
                    </div>
                    <span className="text-xs font-bold">LIGHT</span>
                    <span className="text-[11px] opacity-75 mt-0.5">Fundo cinza-claro.</span>
                  </button>

                  {/* Option 3: Personalizado */}
                  <button
                    onClick={() => onUpdateSettings({ appearanceMode: 'custom' })}
                    className={`p-3.5 rounded-2xl border flex flex-col text-left transition-all cursor-pointer ${
                      settings.appearanceMode === 'custom'
                        ? 'bg-cyan-950/60 text-white border-cyan-400 ring-2 ring-cyan-400 shadow-xl font-bold'
                        : isLight
                        ? 'bg-white border-neutral-300 text-neutral-800'
                        : 'bg-white/5 border-white/10 text-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <ImageIcon className="w-5 h-5 text-cyan-400" />
                      {settings.appearanceMode === 'custom' && <Check className="w-4 h-4 text-cyan-400 stroke-[3]" />}
                    </div>
                    <span className="text-xs font-bold">PERSONALIZADO</span>
                    <span className="text-[11px] opacity-75 mt-0.5">Escolha seu papel de parede.</span>
                  </button>
                </div>

                {/* Sub-item: Papel de Parede (Somente disponível no modo Personalizado) */}
                {settings.appearanceMode === 'custom' ? (
                  <div className="space-y-3 pt-3 border-t border-white/10">
                    <label className="text-xs font-bold block">
                      Papéis de Parede
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {WALLPAPERS.map((wp) => (
                        <div
                          key={wp.id}
                          onClick={() => onUpdateSettings({ wallpaperId: wp.id })}
                          className={`relative group rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${
                            settings.wallpaperId === wp.id
                              ? 'border-cyan-400 scale-[1.02] shadow-lg'
                              : 'border-transparent opacity-80 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={wp.url}
                            alt={wp.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-20 object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-2 flex flex-col justify-end">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-white">{wp.name}</span>
                              {settings.wallpaperId === wp.id && (
                                <span className="p-0.5 rounded-full bg-cyan-400 text-neutral-950">
                                  <Check className="w-3 h-3 stroke-[3]" />
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Dark Scrim calibration */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between text-xs font-semibold mb-1">
                        <span>Escurecimento do papel de parede</span>
                        <span className="font-mono text-cyan-400">{Math.round(settings.darkScrimOpacity * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.05"
                        max="0.40"
                        step="0.05"
                        value={settings.darkScrimOpacity}
                        onChange={(e) => onUpdateSettings({ darkScrimOpacity: parseFloat(e.target.value) })}
                        className="w-full accent-cyan-400 h-2 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>
                ) : null}

                {/* Transparência e Desfoque */}
                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/10">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold block">Desfoque dos Painéis</label>
                    <select
                      value={settings.blurLevel}
                      onChange={(e) => onUpdateSettings({ blurLevel: e.target.value as any })}
                      className={`w-full p-2 rounded-xl border text-xs font-semibold cursor-pointer outline-none ${
                        isLight ? 'bg-white border-neutral-300 text-neutral-900' : 'bg-black/60 border-white/20 text-white'
                      }`}
                    >
                      <option value="none">Desativado</option>
                      <option value="light">Leve</option>
                      <option value="medium">Padrão</option>
                      <option value="deep">Intenso</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold block">Perfil de Animação</label>
                    <select
                      value={settings.animationProfile}
                      onChange={(e) => onUpdateSettings({ animationProfile: e.target.value as any })}
                      className={`w-full p-2 rounded-xl border text-xs font-semibold cursor-pointer outline-none ${
                        isLight ? 'bg-white border-neutral-300 text-neutral-900' : 'bg-black/60 border-white/20 text-white'
                      }`}
                    >
                      <option value="apple">Suave</option>
                      <option value="tcl_eco">Econômico</option>
                      <option value="off">Instantâneo</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* CATEGORY 2: APLICATIVOS */}
            {activeSection === 'apps' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold mb-1">Gerenciar Favoritos</h3>
                    <p className={`text-xs ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                      Selecione até 7 favoritos para a barra da tela inicial.
                    </p>
                  </div>

                  <button
                    onClick={onOpenMyApps}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isLight
                        ? 'bg-neutral-900 text-white hover:bg-neutral-800'
                        : 'bg-cyan-400 text-neutral-950 hover:bg-cyan-300'
                    }`}
                  >
                    Abrir Meus Aplicativos
                  </button>
                </div>

                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {apps.map((app, index) => (
                    <div
                      key={app.id}
                      className={`flex items-center justify-between p-3 rounded-2xl border transition-colors ${
                        isLight
                          ? 'bg-white/80 border-neutral-300'
                          : 'bg-white/[0.04] border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {!app.isSystemAction && (
                          <button
                            onClick={() => onToggleFavoriteApp(app.id)}
                            className="p-1 text-neutral-400 hover:text-amber-400 transition-colors cursor-pointer"
                          >
                            <Star className={`w-4 h-4 ${app.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                          </button>
                        )}
                        <div>
                          <span className="text-xs font-bold block">{app.name}</span>
                          <span className={`text-[10px] uppercase font-semibold tracking-wider ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
                            {app.badge || app.category}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {app.isFavorite && (
                          <span className="text-[10px] font-semibold text-amber-500 mr-2">
                            Na Tela Inicial
                          </span>
                        )}
                        {!app.isSystemAction && (
                          <>
                            <button
                              disabled={index === 0}
                              onClick={() => onMoveAppOrder(app.id, 'up')}
                              className={`p-1.5 rounded-xl border disabled:opacity-20 transition-colors cursor-pointer ${
                                isLight ? 'bg-neutral-200 border-neutral-300' : 'bg-white/10 border-white/15'
                              }`}
                            >
                              <MoveUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              disabled={index === apps.length - 1}
                              onClick={() => onMoveAppOrder(app.id, 'down')}
                              className={`p-1.5 rounded-xl border disabled:opacity-20 transition-colors cursor-pointer ${
                                isLight ? 'bg-neutral-200 border-neutral-300' : 'bg-white/10 border-white/15'
                              }`}
                            >
                              <MoveDown className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CATEGORY 3: WIDGETS */}
            {activeSection === 'widgets' && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-base font-bold mb-1">Widgets</h3>
                  <p className={`text-xs ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                    Ative ou oculte widgets da barra superior.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: 'clock', title: 'Relógio e Data', desc: 'Horário digital e data no topo da tela' },
                    { key: 'weather', title: 'Clima em Novo Hamburgo', desc: 'Previsão ao vivo com temperatura e sensação' },
                    { key: 'musicMini', title: 'Tocando Agora', desc: 'Mini reprodutor de áudio na barra superior' },
                  ].map((widget) => {
                    const isEnabled = settings.activeWidgets[widget.key as keyof typeof settings.activeWidgets];
                    return (
                      <div
                        key={widget.key}
                        onClick={() =>
                          onUpdateSettings({
                            activeWidgets: {
                              ...settings.activeWidgets,
                              [widget.key]: !isEnabled,
                            },
                          })
                        }
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                          isEnabled
                            ? isLight
                              ? 'bg-white border-neutral-800 shadow-sm'
                              : 'bg-white/[0.08] border-cyan-400/40 shadow-sm'
                            : isLight
                            ? 'bg-neutral-200/50 border-neutral-300 opacity-60'
                            : 'bg-white/[0.02] border-white/10 opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold">{widget.title}</span>
                          <span
                            className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] font-bold ${
                              isEnabled ? 'bg-cyan-400 text-neutral-950' : 'bg-neutral-500/20 text-transparent'
                            }`}
                          >
                            ✓
                          </span>
                        </div>
                        <p className={`text-[11px] ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                          {widget.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* 24h Toggle */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold block">Formato 24 Horas</span>
                    <span className={`text-[11px] ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                      Exibir 18:00 em vez de 06:00 PM
                    </span>
                  </div>
                  <button
                    onClick={() => onUpdateSettings({ clockFormat24: !settings.clockFormat24 })}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                      settings.clockFormat24
                        ? 'bg-cyan-400 text-neutral-950'
                        : isLight
                        ? 'bg-neutral-200 text-neutral-800'
                        : 'bg-white/10 text-white'
                    }`}
                  >
                    {settings.clockFormat24 ? 'Ativo (24h)' : '12h (AM/PM)'}
                  </button>
                </div>
              </div>
            )}

            {/* CATEGORY 4: SISTEMA */}
            {activeSection === 'system' && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-base font-bold mb-1">Sistema</h3>
                  <p className={`text-xs ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                    Preferências gerais e desempenho da TV.
                  </p>
                </div>

                <div
                  onClick={() =>
                    onUpdateSettings({
                      blurLevel: 'none',
                      animationProfile: 'tcl_eco',
                      glassOpacity: 0.28,
                    })
                  }
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isLight
                      ? 'bg-white border-neutral-300 hover:border-neutral-800'
                      : 'bg-white/[0.04] border-white/15 hover:bg-white/[0.08]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                      <Zap className="w-4 h-4 fill-current" />
                      Modo Econômico
                    </span>
                    <span className="text-[10px] bg-cyan-400/20 text-cyan-400 px-2 py-0.5 rounded font-bold">
                      Ativar
                    </span>
                  </div>
                  <p className={`text-[11px] leading-relaxed ${isLight ? 'text-neutral-600' : 'text-neutral-300'}`}>
                    Reduz efeitos visuais e transparências para economizar energia e aumentar a fluidez na TV.
                  </p>
                </div>

                <div
                  className={`p-4 rounded-2xl border text-xs space-y-1.5 ${
                    isLight ? 'bg-white/80 border-neutral-300' : 'bg-black/50 border-white/10'
                  }`}
                >
                  <span className="font-bold block">Informações do Dispositivo:</span>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>Resolução: <strong>1920 × 1080 (Full HD)</strong></div>
                    <div>Plataforma: <strong>Android TV</strong></div>
                    <div>Interface: <strong>GLASS TV 3.4</strong></div>
                    <div>Status: <strong>Pronto</strong></div>
                  </div>
                </div>

                <button
                  onClick={onOpenArchitecture}
                  className={`w-full py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    isLight
                      ? 'bg-neutral-900 text-white hover:bg-neutral-800'
                      : 'bg-cyan-500 hover:bg-cyan-400 text-neutral-950 shadow-md'
                  }`}
                >
                  Ver Informações de Desenvolvedor & GitHub
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
