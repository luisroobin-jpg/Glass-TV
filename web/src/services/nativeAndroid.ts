type NativeApp = { name: string; packageName: string };
declare global { interface Window { GlassTVAndroid?: { getInstalledApps(): string; launchApp(packageName: string): boolean } } }
export function isNativeAndroid(): boolean { return !!window.GlassTVAndroid; }
export function getInstalledApps(): NativeApp[] | null {
  try { return window.GlassTVAndroid ? JSON.parse(window.GlassTVAndroid.getInstalledApps()) as NativeApp[] : null; }
  catch { return null; }
}
export function openNativeApp(packageName: string): boolean {
  if (!window.GlassTVAndroid) return false;
  try { return window.GlassTVAndroid.launchApp(packageName); } catch { return false; }
}
