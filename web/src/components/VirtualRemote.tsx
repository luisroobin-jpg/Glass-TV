import React, { useState } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  Circle, 
  ArrowLeft, 
  Home, 
  Settings, 
  Play, 
  Minimize2, 
  Maximize2,
  Tv
} from 'lucide-react';

interface VirtualRemoteProps {
  onUp: () => void;
  onDown: () => void;
  onLeft: () => void;
  onRight: () => void;
  onSelect: () => void;
  onBack: () => void;
  onHome: () => void;
  onSettings: () => void;
  onToggleMusic: () => void;
}

export const VirtualRemote: React.FC<VirtualRemoteProps> = ({
  onUp,
  onDown,
  onLeft,
  onRight,
  onSelect,
  onBack,
  onHome,
  onSettings,
  onToggleMusic,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isExpanded) {
    return (
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsExpanded(true)}
          title="Abrir Controle Remoto Virtual para Teste"
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-white border border-white/20 backdrop-blur-xl shadow-2xl hover:scale-105 transition-all cursor-pointer group"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 group-hover:animate-ping" />
          <Tv className="w-4 h-4 text-cyan-300" />
          <span className="text-xs font-bold font-['Outfit']">Controle Remoto TV</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="w-64 rounded-3xl p-5 bg-slate-950/95 border border-white/20 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col items-center select-none text-white">
        {/* Remote Header */}
        <div className="w-full flex items-center justify-between pb-3 mb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-[11px] font-bold tracking-wider uppercase text-slate-300">
              Glass TV Remote
            </span>
          </div>
          <button
            onClick={() => setIsExpanded(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* D-PAD (Apple TV Clickpad Style) */}
        <div className="relative w-44 h-44 rounded-full bg-slate-900 border border-white/15 p-2 flex items-center justify-center my-3 shadow-inner">
          {/* Up */}
          <button
            onClick={onUp}
            title="Seta Cima"
            className="absolute top-1.5 left-1/2 -translate-x-1/2 w-12 h-10 flex items-center justify-center rounded-t-full text-slate-300 hover:text-white hover:bg-white/10 active:bg-white/25 transition-all cursor-pointer"
          >
            <ChevronUp className="w-6 h-6" />
          </button>

          {/* Down */}
          <button
            onClick={onDown}
            title="Seta Baixo"
            className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-12 h-10 flex items-center justify-center rounded-b-full text-slate-300 hover:text-white hover:bg-white/10 active:bg-white/25 transition-all cursor-pointer"
          >
            <ChevronDown className="w-6 h-6" />
          </button>

          {/* Left */}
          <button
            onClick={onLeft}
            title="Seta Esquerda"
            className="absolute left-1.5 top-1/2 -translate-y-1/2 w-10 h-12 flex items-center justify-center rounded-l-full text-slate-300 hover:text-white hover:bg-white/10 active:bg-white/25 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Right */}
          <button
            onClick={onRight}
            title="Seta Direita"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-10 h-12 flex items-center justify-center rounded-r-full text-slate-300 hover:text-white hover:bg-white/10 active:bg-white/25 transition-all cursor-pointer"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Center OK Button */}
          <button
            onClick={onSelect}
            title="Botão OK / Selecionar"
            className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 active:bg-cyan-400 active:text-slate-950 flex flex-col items-center justify-center border border-white/20 transition-all cursor-pointer shadow-md"
          >
            <Circle className="w-5 h-5 fill-white/80" />
            <span className="text-[9px] font-black uppercase mt-0.5 tracking-wider">OK</span>
          </button>
        </div>

        {/* Function Keys Row (Back, Home, Settings) */}
        <div className="grid grid-cols-3 gap-2 w-full mt-2">
          <button
            onClick={onBack}
            title="Voltar (Esc / Backspace)"
            className="p-3 rounded-2xl bg-white/5 hover:bg-white/15 active:bg-white/25 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer border border-white/10"
          >
            <ArrowLeft className="w-4 h-4 text-slate-200" />
            <span className="text-[9px] font-semibold text-slate-400">Voltar</span>
          </button>

          <button
            onClick={onHome}
            title="Início (Home)"
            className="p-3 rounded-2xl bg-white/5 hover:bg-white/15 active:bg-white/25 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer border border-white/10"
          >
            <Home className="w-4 h-4 text-cyan-300" />
            <span className="text-[9px] font-semibold text-slate-400">Início</span>
          </button>

          <button
            onClick={onSettings}
            title="Ajustes (S / Menu)"
            className="p-3 rounded-2xl bg-white/5 hover:bg-white/15 active:bg-white/25 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer border border-white/10"
          >
            <Settings className="w-4 h-4 text-slate-200" />
            <span className="text-[9px] font-semibold text-slate-400">Ajustes</span>
          </button>
        </div>

        {/* Bottom helper tip */}
        <div className="w-full mt-3 pt-2 border-t border-white/10 text-center text-[10px] text-slate-400">
          Você também pode usar o <span className="text-cyan-300 font-semibold">Teclado</span>: Setas, Enter, Esc.
        </div>
      </div>
    </div>
  );
};
