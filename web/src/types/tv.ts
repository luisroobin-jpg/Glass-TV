export type FocusArea = 'shelf' | 'apps' | 'settings_btn' | 'all_apps' | 'mini_music';

export interface FeaturedItem {
  id: string;
  title: string;
  subtitle: string;
  serviceName: string;
  serviceAppId: string;
  serviceAccentColor: string;
  serviceGlowColor: string;
  serviceIconType: string;
  tagline: string;
  rating?: string;
  duration?: string;
  backdropUrl: string;
  packageName: string;
}

export interface AppItem {
  id: string;
  name: string;
  category: 'streaming' | 'music' | 'video' | 'games' | 'tools';
  packageName: string;
  accentColor: string;
  glowColor: string;
  iconType: string;
  description: string;
  badge?: string;
  isFavorite: boolean;
  order: number;
  isSystemAction?: boolean;
  heroContent?: {
    title: string;
    subtitle: string;
    tagline: string;
    rating?: string;
    duration?: string;
    backdropUrl: string;
  };
}

export interface WallpaperOption {
  id: string;
  name: string;
  subtitle: string;
  url: string;
  type: 'cinematic' | 'aurora' | 'glass' | 'abstract' | 'gradient';
}

export type BlurLevel = 'none' | 'light' | 'medium' | 'deep';
export type AnimationSpeed = 'apple' | 'tcl_eco' | 'off';
export type AppearanceMode = 'dark' | 'light' | 'custom';
export type ThemeMode = AppearanceMode;

export interface LauncherSettings {
  appearanceMode: AppearanceMode; // 'dark' (Preto Absoluto #000000), 'light' (Cinza Apple #E5E5E7), 'custom' (Papel de Parede)
  wallpaperId: string;
  customWallpaperUrl: string;
  blurLevel: BlurLevel;
  glassOpacity: number; // 0.10 to 0.40
  darkScrimOpacity: number; // default 0.15 (15%)
  animationProfile: AnimationSpeed;
  clockFormat24: boolean;
  isNowPlayingPlaying: boolean;
  activeWidgets: {
    clock: boolean;
    weather: boolean;
    musicMini: boolean;
    topShelf: boolean;
    remoteGuide: boolean;
  };
  displayScale: 'fit' | '1080p';
  tvBrandPreset: 'apple_smooth' | 'tcl_android9' | 'custom';
}

export interface WeatherData {
  city: string;
  state: string;
  temperature: number;
  weatherCode: number;
  conditionText: string;
  humidity: number;
  windSpeed: number;
  tempMax: number;
  tempMin: number;
  isLive: boolean;
  lastUpdated: string;
}

export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  coverColor: string;
}
