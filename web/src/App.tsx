/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  AppItem, 
  FeaturedItem, 
  FocusArea, 
  LauncherSettings, 
  WeatherData 
} from './types/tv';
import { DEFAULT_APPS, WALLPAPERS } from './data/launcherData';
import { getInstalledApps, openNativeApp, isNativeAndroid } from './services/nativeAndroid';
import { fetchNovoHamburgoWeather } from './services/weatherService';
import { HeaderBar } from './components/HeaderBar';
import { TopShelfShowcase } from './components/TopShelfShowcase';
import { FreeMyTvDock } from './components/FreeMyTvDock';
import { MyAppsModal } from './components/MyAppsModal';
import { SettingsModal } from './components/SettingsModal';
import { AppLauncherModal } from './components/AppLauncherModal';
import { AndroidArchitectureDrawer } from './components/AndroidArchitectureDrawer';

export default function App() {
  // Apps catalog state with persistent favorites
  const [apps, setApps] = useState<AppItem[]>(() => {
    const saved = localStorage.getItem('glasstv_apps_v3_4');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return DEFAULT_APPS;
  });

  // On a real Android TV, replace the demo catalogue with launchable installed apps.
  useEffect(() => {
    if (!isNativeAndroid()) return;
    const sync = () => {
      const installed = getInstalledApps();
      if (!installed) return;
      setApps(previous => {
        const existing = new Map(previous.map(a => [a.packageName, a]));
        const mapped: AppItem[] = installed.map((nativeApp, index) => {
          const old = existing.get(nativeApp.packageName);
          return {
            id: old?.id || nativeApp.packageName,
            name: nativeApp.name,
            packageName: nativeApp.packageName,
            category: old?.category || 'tools',
            accentColor: old?.accentColor || '#38BDF8',
            glowColor: old?.glowColor || 'rgba(56, 189, 248, 0.3)',
            iconType: old?.iconType || 'grid',
            description: old?.description || 'Aplicativo instalado na TV',
            isFavorite: old?.isFavorite ?? false,
            order: old?.order ?? (100 + index),
          };
        });
        // Keep the fixed library shortcut, but never show nonexistent apps.
        const library = previous.find(a => a.id === 'my_apps') || DEFAULT_APPS.find(a => a.id === 'my_apps');
        return library ? [...mapped, library] : mapped;
      });
    };
    sync();
    window.addEventListener('focus', sync);
    return () => window.removeEventListener('focus', sync);
  }, []);

  // Settings state (AppearanceMode: 'dark' | 'light' | 'custom')
  const [settings, setSettings] = useState<LauncherSettings>(() => {
    const saved = localStorage.getItem('glasstv_settings_v3_4');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      appearanceMode: 'dark', // 'dark' (#000000), 'light' (#E5E5E7), or 'custom' (Papel de Parede)
      wallpaperId: 'aerial_fjord',
      customWallpaperUrl: '',
      blurLevel: 'medium', // 24px
      glassOpacity: 0.18,
      darkScrimOpacity: 0.15, // 15% dark layer as specifically requested
      animationProfile: 'apple',
      clockFormat24: true,
      isNowPlayingPlaying: true,
      activeWidgets: {
        clock: true,
        weather: true,
        musicMini: true,
        topShelf: true,
        remoteGuide: false,
      },
      displayScale: 'fit',
      tvBrandPreset: 'apple_smooth',
    };
  });

  // Weather state (Novo Hamburgo, RS)
  const [weather, setWeather] = useState<WeatherData | null>(null);

  // Focus Navigation state: 'apps' (Dock) | 'shelf' (Top Shelf) | 'settings_btn'
  const [focusArea, setFocusArea] = useState<FocusArea>('apps');
  const [selectedDockIndex, setSelectedDockIndex] = useState<number>(0);

  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMyAppsOpen, setIsMyAppsOpen] = useState(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [launchingApp, setLaunchingApp] = useState<AppItem | null>(null);

  // Extract the 8 dock items:
  // Exactly 7 user favorites + the 8th slot is permanently fixed as "Meus Aplicativos"
  const dockApps = React.useMemo(() => {
    const myAppsItem = apps.find((a) => a.id === 'my_apps') || {
      id: 'my_apps',
      name: 'Meus Aplicativos',
      category: 'tools' as const,
      packageName: 'com.glasstv.allapps',
      accentColor: '#38BDF8',
      glowColor: 'rgba(56, 189, 248, 0.45)',
      iconType: 'grid',
      description: 'Acesse todos os aplicativos instalados na sua TV e personalize seus favoritos.',
      badge: 'BIBLIOTECA',
      isFavorite: true,
      isSystemAction: true,
      order: 7,
    };

    const userFavorites = apps.filter((a) => a.isFavorite && a.id !== 'my_apps');
    const top7 = userFavorites.slice(0, 7);

    return [...top7, myAppsItem];
  }, [apps]);

  // Active Wallpaper lookup (strictly for 'custom' mode!)
  const activeWallpaper = WALLPAPERS.find((w) => w.id === settings.wallpaperId) || WALLPAPERS[0];
  const wallpaperSrc = settings.customWallpaperUrl || activeWallpaper.url;

  // Sync settings and apps to localStorage
  useEffect(() => {
    localStorage.setItem('glasstv_settings_v3_4', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('glasstv_apps_v3_4', JSON.stringify(apps));
  }, [apps]);

  // Load weather for Novo Hamburgo, RS
  const loadWeather = useCallback(async () => {
    const data = await fetchNovoHamburgoWeather();
    setWeather(data);
  }, []);

  useEffect(() => {
    loadWeather();
    const interval = setInterval(loadWeather, 1000 * 60 * 15);
    return () => clearInterval(interval);
  }, [loadWeather]);

  // Apply glass blur CSS variables dynamically
  useEffect(() => {
    let blurPx = '24px';
    if (settings.blurLevel === 'none') blurPx = '0px';
    else if (settings.blurLevel === 'light') blurPx = '12px';
    else if (settings.blurLevel === 'medium') blurPx = '24px';
    else if (settings.blurLevel === 'deep') blurPx = '40px';

    document.documentElement.style.setProperty('--glass-blur', blurPx);
    document.documentElement.style.setProperty('--glass-opacity', settings.glassOpacity.toString());
  }, [settings.blurLevel, settings.glassOpacity]);

  // Launch handler for items
  const handleLaunchApp = useCallback((app: AppItem) => {
    if (app.id === 'my_apps') {
      setIsMyAppsOpen(true);
    } else {
      if (!openNativeApp(app.packageName)) setLaunchingApp(app);
    }
  }, []);

  const handleLaunchFeatured = useCallback((featured: FeaturedItem) => {
    const existing = apps.find((a) => a.id === featured.serviceAppId);
    if (existing) {
      if (!openNativeApp(existing.packageName)) setLaunchingApp(existing);
    } else {
      if (openNativeApp(featured.packageName)) return;
      setLaunchingApp({
        id: featured.id,
        name: featured.serviceName,
        category: 'streaming',
        packageName: featured.packageName,
        accentColor: featured.serviceAccentColor,
        glowColor: featured.serviceGlowColor,
        iconType: featured.serviceIconType,
        description: featured.tagline,
        badge: 'STREAMING',
        isFavorite: false,
        order: 99,
      });
    }
  }, [apps]);

  // D-Pad and Keyboard navigation handlers
  const handleNavigateUp = useCallback(() => {
    if (isSettingsOpen || isMyAppsOpen || isArchitectureOpen || launchingApp) return;

    if (focusArea === 'apps') {
      if (settings.activeWidgets.topShelf) {
        setFocusArea('shelf');
      } else {
        setFocusArea('settings_btn');
      }
    } else if (focusArea === 'shelf') {
      setFocusArea('settings_btn');
    }
  }, [focusArea, isSettingsOpen, isMyAppsOpen, isArchitectureOpen, launchingApp, settings.activeWidgets.topShelf]);

  const handleNavigateDown = useCallback(() => {
    if (isSettingsOpen || isMyAppsOpen || isArchitectureOpen || launchingApp) return;

    if (focusArea === 'settings_btn') {
      if (settings.activeWidgets.topShelf) {
        setFocusArea('shelf');
      } else {
        setFocusArea('apps');
      }
    } else if (focusArea === 'shelf') {
      setFocusArea('apps');
    }
  }, [focusArea, isSettingsOpen, isMyAppsOpen, isArchitectureOpen, launchingApp, settings.activeWidgets.topShelf]);

  const handleNavigateLeft = useCallback(() => {
    if (isSettingsOpen || isMyAppsOpen || isArchitectureOpen || launchingApp) return;

    if (focusArea === 'apps') {
      setSelectedDockIndex((prev) => Math.max(0, prev - 1));
    }
  }, [focusArea, isSettingsOpen, isMyAppsOpen, isArchitectureOpen, launchingApp]);

  const handleNavigateRight = useCallback(() => {
    if (isSettingsOpen || isMyAppsOpen || isArchitectureOpen || launchingApp) return;

    if (focusArea === 'apps') {
      setSelectedDockIndex((prev) => Math.min(dockApps.length - 1, prev + 1));
    }
  }, [focusArea, dockApps.length, isSettingsOpen, isMyAppsOpen, isArchitectureOpen, launchingApp]);

  const handleSelect = useCallback(() => {
    if (isSettingsOpen || isMyAppsOpen || isArchitectureOpen) return;

    if (focusArea === 'apps') {
      const selectedApp = dockApps[selectedDockIndex];
      if (selectedApp) {
        handleLaunchApp(selectedApp);
      }
    } else if (focusArea === 'settings_btn') {
      setIsSettingsOpen(true);
    }
  }, [focusArea, dockApps, selectedDockIndex, handleLaunchApp, isSettingsOpen, isMyAppsOpen, isArchitectureOpen]);

  const handleBack = useCallback(() => {
    if (launchingApp) {
      setLaunchingApp(null);
    } else if (isMyAppsOpen) {
      setIsMyAppsOpen(false);
    } else if (isSettingsOpen) {
      setIsSettingsOpen(false);
    } else if (isArchitectureOpen) {
      setIsArchitectureOpen(false);
    } else {
      setFocusArea('apps');
      setSelectedDockIndex(0);
    }
  }, [launchingApp, isMyAppsOpen, isSettingsOpen, isArchitectureOpen]);

  // Global Keyboard Listener (TV Remote Simulation)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT') return;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          handleNavigateUp();
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleNavigateDown();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handleNavigateLeft();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleNavigateRight();
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          handleSelect();
          break;
        case 'Escape':
        case 'Backspace':
          e.preventDefault();
          handleBack();
          break;
        case 's':
        case 'S':
        case 'c':
        case 'C':
          setIsSettingsOpen((prev) => !prev);
          break;
        case 'm':
        case 'M':
          setIsMyAppsOpen((prev) => !prev);
          break;
        case 'h':
        case 'H':
          setFocusArea('apps');
          setSelectedDockIndex(0);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNavigateUp, handleNavigateDown, handleNavigateLeft, handleNavigateRight, handleSelect, handleBack]);

  // Reorder app up or down
  const handleMoveAppOrder = (id: string, direction: 'up' | 'down') => {
    setApps((prevApps) => {
      const index = prevApps.findIndex((a) => a.id === id);
      if (index === -1) return prevApps;
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= prevApps.length) return prevApps;

      const newApps = [...prevApps];
      const temp = newApps[index];
      newApps[index] = newApps[newIndex];
      newApps[newIndex] = temp;
      return newApps;
    });
  };

  // Toggle favorite status (cap 7 + 8th Meus Aplicativos)
  const handleToggleFavorite = (id: string) => {
    if (id === 'my_apps') return;
    setApps((prevApps) => {
      const currentFavs = prevApps.filter((a) => a.isFavorite && a.id !== 'my_apps');
      const targetApp = prevApps.find((a) => a.id === id);
      if (!targetApp) return prevApps;

      if (!targetApp.isFavorite && currentFavs.length >= 7) {
        alert('A barra comporta no máximo 7 favoritos personalizados + o atalho Meus Aplicativos. Desmarque um favorito antes de adicionar outro.');
        return prevApps;
      }

      return prevApps.map((a) => (a.id === id ? { ...a, isFavorite: !a.isFavorite } : a));
    });
  };

  const isLight = settings.appearanceMode === 'light';
  const isDark = settings.appearanceMode === 'dark';
  const isCustom = settings.appearanceMode === 'custom';

  return (
    <div
      className={`relative w-screen h-screen overflow-hidden select-none font-['Plus_Jakarta_Sans'] flex items-center justify-center transition-colors duration-300 ${
        isDark
          ? 'bg-[#000000] text-white'
          : isLight
          ? 'bg-[#E5E5E7] text-[#1D1D1F]'
          : 'bg-[#05070d] text-white'
      }`}
    >
      {/* 1080p Android TV Frame (1920x1080) — Perfectly Framed without Bottom Cut-offs */}
      <div className="relative w-full h-full max-w-[1920px] max-h-[1080px] flex flex-col justify-between overflow-hidden">
        
        {/* Layer 1: Wallpaper Image (ONLY displayed when appearanceMode === 'custom'!) */}
        {isCustom && (
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none animate-in fade-in duration-500">
            <img
              src={wallpaperSrc}
              alt="Glass TV Wallpaper"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover scale-100 transition-all duration-700 ease-out"
            />
            {/* 15% Dark Scrim Layer for custom wallpaper */}
            <div 
              className="absolute inset-0 pointer-events-none transition-opacity duration-300"
              style={{
                backgroundColor: `rgba(0, 0, 0, ${settings.darkScrimOpacity})`,
              }}
            />
            {/* Safe margin vignette for TV edge */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/35 via-transparent to-black/60" />
          </div>
        )}

        {/* TOP: Header Bar (Brand, Weather, Mini Tocando Agora, Clock, Settings) */}
        <HeaderBar
          themeMode={settings.appearanceMode}
          weather={weather}
          onRefreshWeather={loadWeather}
          onOpenSettings={() => setIsSettingsOpen(true)}
          isSettingsFocused={focusArea === 'settings_btn'}
          clock24h={settings.clockFormat24}
          showWeather={settings.activeWidgets.weather}
          showClock={settings.activeWidgets.clock}
          showMusicMini={settings.activeWidgets.musicMini}
          isPlayingMusic={settings.isNowPlayingPlaying}
          onTogglePlayMusic={() =>
            setSettings((prev) => ({ ...prev, isNowPlayingPlaying: !prev.isNowPlayingPlaying }))
          }
          isMusicMiniFocused={focusArea === 'mini_music'}
          onFocusMusicMini={() => setFocusArea('mini_music')}
          onFocusSettings={() => setFocusArea('settings_btn')}
        />

        {/* CENTER MAIN: Top Shelf Auto Carousel + Free My TV 8-App Dock with Balanced Gap */}
        <main className="relative z-10 flex-1 flex flex-col justify-center gap-6 min-h-0 py-2">
          {/* 1. Automated 6-Second Rotating Carousel of Featured Movies & Series */}
          {settings.activeWidgets.topShelf && (
            <TopShelfShowcase
              themeMode={settings.appearanceMode}
              onLaunchFeatured={handleLaunchFeatured}
              isFocused={focusArea === 'shelf'}
            />
          )}

          {/* 2. Free My TV Single Horizontal Liquid Glass Dock with Exactly 8 Visible Apps */}
          <FreeMyTvDock
            apps={dockApps}
            selectedIndex={selectedDockIndex}
            appearanceMode={settings.appearanceMode}
            onSelectApp={handleLaunchApp}
            onFocusApp={(idx) => {
              setFocusArea('apps');
              setSelectedDockIndex(idx);
            }}
            isDockFocused={focusArea === 'apps'}
          />
        </main>

        {/* Bottom Safe Margin buffer (4px) */}
        <div className="relative z-10 w-full h-4 shrink-0" />

        {/* Modal 1: Meus Aplicativos (Free My TV Library with 8-favorites manager and Back Button) */}
        <MyAppsModal
          isOpen={isMyAppsOpen}
          onClose={() => setIsMyAppsOpen(false)}
          apps={apps}
          themeMode={settings.appearanceMode}
          onLaunchApp={handleLaunchApp}
          onToggleFavorite={handleToggleFavorite}
          onMoveOrder={handleMoveAppOrder}
        />

        {/* Modal 2: Settings & Customization */}
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          settings={settings}
          onUpdateSettings={(newVals) => setSettings((prev) => ({ ...prev, ...newVals }))}
          apps={apps}
          onToggleFavoriteApp={handleToggleFavorite}
          onMoveAppOrder={handleMoveAppOrder}
          onOpenMyApps={() => {
            setIsSettingsOpen(false);
            setIsMyAppsOpen(true);
          }}
          onOpenArchitecture={() => {
            setIsSettingsOpen(false);
            setIsArchitectureOpen(true);
          }}
        />

        {/* Modal 3: App Launch Simulator & Native Android Intent Preview */}
        <AppLauncherModal
          app={launchingApp}
          themeMode={settings.appearanceMode === 'light' ? 'light' : 'dark'}
          onClose={() => setLaunchingApp(null)}
          onOpenArchitecture={() => {
            setLaunchingApp(null);
            setIsArchitectureOpen(true);
          }}
        />

        {/* Modal 4: Android Architecture & GitHub Actions Pipeline */}
        <AndroidArchitectureDrawer
          isOpen={isArchitectureOpen}
          onClose={() => setIsArchitectureOpen(false)}
        />
      </div>
    </div>
  );
}
