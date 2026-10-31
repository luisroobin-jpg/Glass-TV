import React, { useState, useEffect, useRef } from 'react';
import { Play, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { FeaturedItem, AppearanceMode } from '../types/tv';
import { FEATURED_SHOWS } from '../data/launcherData';
import { AppIcon } from './AppIcon';

interface TopShelfShowcaseProps {
  themeMode: AppearanceMode;
  onLaunchFeatured: (featured: FeaturedItem) => void;
  isFocused?: boolean;
}

export const TopShelfShowcase: React.FC<TopShelfShowcaseProps> = ({
  themeMode,
  onLaunchFeatured,
  isFocused = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentItem: FeaturedItem = FEATURED_SHOWS[currentIndex] || FEATURED_SHOWS[0];
  const isLight = themeMode === 'light';
  const hasImage = Boolean(currentItem.backdropUrl) && !imageErrors[currentItem.id];

  // 6-second automatic rotation
  useEffect(() => {
    if (isInteracting) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % FEATURED_SHOWS.length);
    }, 6000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isInteracting, currentIndex]);

  const handleManualPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : FEATURED_SHOWS.length - 1));
  };

  const handleManualNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % FEATURED_SHOWS.length);
  };

  return (
    <div
      onMouseEnter={() => setIsInteracting(true)}
      onMouseLeave={() => setIsInteracting(false)}
      className="relative w-full h-[220px] px-10 transition-all duration-300 ease-out select-none"
    >
      {/* Banner Container with Liquid Glass Frame and Rounded Corners */}
      <div
        className={`relative w-full h-full rounded-[28px] overflow-hidden border transition-all duration-300 ${
          isFocused
            ? 'ring-2 ring-white shadow-2xl scale-[1.01]'
            : 'shadow-xl'
        } ${
          isLight
            ? 'border-neutral-300 bg-neutral-200'
            : 'border-white/15 bg-neutral-950'
        }`}
      >
        {/* Layer 1: Full-Bleed Production Backdrop Image */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          {hasImage ? (
            <img
              key={currentItem.id}
              src={currentItem.backdropUrl}
              alt={currentItem.title}
              onError={() => setImageErrors((prev) => ({ ...prev, [currentItem.id]: true }))}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center scale-100 animate-in fade-in duration-700 ease-out"
            />
          ) : (
            /* Neutral cinematic backdrop with subtle ambient glow when no photo is available */
            <div className="w-full h-full bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 flex items-center justify-end pr-20">
              <div 
                className="w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none" 
                style={{ backgroundColor: currentItem.serviceAccentColor }} 
              />
            </div>
          )}

          {/* Layer 2: Apple TV Left-to-Right Heavy Dark Gradient Scrim */}
          <div
            className={`absolute inset-0 ${
              isLight
                ? 'bg-gradient-to-r from-[#E5E5E7] via-[#E5E5E7]/90 via-55% to-transparent'
                : 'bg-gradient-to-r from-black via-black/85 via-55% to-transparent'
            }`}
          />
          {/* Subtle bottom vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Layer 3: Foreground Content over the Left Scrim */}
        <div className="relative z-10 w-full h-full flex items-center justify-between px-10 py-5">
          <div className="flex flex-col justify-center max-w-2xl text-left">
            {/* Top metadata row: Streaming Service + Duration + Rating */}
            <div className="flex items-center gap-2.5 mb-2">
              <div
                className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider text-white shadow-sm"
                style={{ backgroundColor: currentItem.serviceAccentColor }}
              >
                <AppIcon type={currentItem.serviceIconType} name={currentItem.serviceName} size={14} />
                <span>{currentItem.serviceName}</span>
              </div>

              <span className={`text-[11px] font-semibold ${isLight ? 'text-neutral-700' : 'text-neutral-300'}`}>
                {currentItem.subtitle}
              </span>

              {currentItem.rating && (
                <span
                  className={`px-1.5 py-0.2 text-[9px] font-bold border rounded ${
                    isLight ? 'border-neutral-500 text-neutral-800' : 'border-white/30 text-neutral-200'
                  }`}
                >
                  {currentItem.rating}
                </span>
              )}

              {currentItem.duration && (
                <span className={`text-[11px] ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                  · {currentItem.duration}
                </span>
              )}
            </div>

            {/* Title */}
            <h2
              key={`title-${currentItem.id}`}
              className={`text-3xl font-black tracking-tight drop-shadow-md font-['Outfit'] animate-in fade-in duration-300 leading-tight ${
                isLight ? 'text-neutral-950' : 'text-white'
              }`}
            >
              {currentItem.title}
            </h2>

            {/* Tagline / Description */}
            <p
              key={`tagline-${currentItem.id}`}
              className={`text-xs mt-1.5 line-clamp-2 max-w-lg font-['Plus_Jakarta_Sans'] leading-relaxed animate-in fade-in duration-300 ${
                isLight ? 'text-neutral-800' : 'text-neutral-200'
              }`}
            >
              {currentItem.tagline}
            </p>

            {/* CTA Button + Carousel Progress Indicators */}
            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={() => onLaunchFeatured(currentItem)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs tracking-wide transition-all duration-200 cursor-pointer shadow-md ${
                  isLight
                    ? 'bg-neutral-900 text-white hover:bg-neutral-800'
                    : 'bg-white text-neutral-950 hover:bg-neutral-100 hover:scale-[1.02]'
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Abrir no {currentItem.serviceName}</span>
              </button>

              {/* Progress Dots */}
              <div className="flex items-center gap-1.5">
                {FEATURED_SHOWS.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentIndex(idx)}
                    title={`Destaque ${idx + 1}: ${item.title}`}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      currentIndex === idx
                        ? 'w-6 bg-cyan-400'
                        : isLight
                        ? 'w-1.5 bg-neutral-400 hover:bg-neutral-600'
                        : 'w-1.5 bg-white/30 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Controls: Manual Prev / Next Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleManualPrev}
              title="Destaque Anterior"
              className={`p-2.5 rounded-2xl border transition-all cursor-pointer backdrop-blur-md ${
                isLight
                  ? 'bg-white/70 hover:bg-white border-neutral-300 text-neutral-800 shadow-sm'
                  : 'bg-black/40 hover:bg-black/70 border-white/20 text-white hover:scale-105'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={handleManualNext}
              title="Próximo Destaque"
              className={`p-2.5 rounded-2xl border transition-all cursor-pointer backdrop-blur-md ${
                isLight
                  ? 'bg-white/70 hover:bg-white border-neutral-300 text-neutral-800 shadow-sm'
                  : 'bg-black/40 hover:bg-black/70 border-white/20 text-white hover:scale-105'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
