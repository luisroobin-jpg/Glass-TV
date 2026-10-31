import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, Copy, Check, Terminal, FileCode, Github, Tv, Layers } from 'lucide-react';

interface AndroidArchitectureDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidArchitectureDrawer: React.FC<AndroidArchitectureDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Backspace') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const MANIFEST_CODE = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.glasstv.launcher">

    <!-- Requisitos para Android TV (Touchscreen opcional) -->
    <uses-feature
        android:name="android.software.leanback"
        android:required="true" />
    <uses-feature
        android:name="android.hardware.touchscreen"
        android:required="false" />

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.QUERY_ALL_PACKAGES" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="Glass TV"
        android:banner="@drawable/banner"
        android:hardwareAccelerated="true"
        android:largeHeap="true"
        android:theme="@style/Theme.Leanback">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTask"
            android:stateNotNeeded="true"
            android:screenOrientation="landscape">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.HOME" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.LEANBACK_LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;

  const KOTLIN_LAUNCH_CODE = `package com.glasstv.launcher

import android.content.Intent
import android.content.pm.PackageManager
import android.content.pm.ResolveInfo
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.tv.material3.*

class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        val installedApps = loadInstalledTvApps()
        
        setContent {
            GlassTvLauncherScreen(
                apps = installedApps,
                onLaunchApp = { pkgName -> launchApp(pkgName) }
            )
        }
    }

    private fun loadInstalledTvApps(): List<AppModel> {
        val pm = packageManager
        val tvIntent = Intent(Intent.ACTION_MAIN, null).apply {
            addCategory(Intent.CATEGORY_LEANBACK_LAUNCHER)
        }
        val resolveInfos: List<ResolveInfo> = pm.queryIntentActivities(tvIntent, 0)
        
        return resolveInfos.map { info ->
            AppModel(
                packageName = info.activityInfo.packageName,
                appName = info.loadLabel(pm).toString(),
                icon = info.loadIcon(pm)
            )
        }
    }

    private fun launchApp(packageName: String) {
        val launchIntent = packageManager.getLaunchIntentForPackage(packageName)
        if (launchIntent != null) {
            startActivity(launchIntent)
        }
    }
}`;

  const GITHUB_ACTIONS_WORKFLOW = `name: Build Glass TV Launcher APK

on:
  push:
    branches: [ "main" ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4

    - name: Set up JDK 17
      uses: actions/setup-java@v4
      with:
        java-version: '17'
        distribution: 'temurin'
        cache: gradle

    - name: Grant execute permission for gradlew
      run: chmod +x gradlew

    - name: Build Android TV Release APK
      run: ./gradlew assembleRelease

    - name: Upload APK Artifact
      uses: actions/upload-artifact@v4
      with:
        name: Glass-TV-Launcher-Release
        path: app/build/outputs/apk/release/*.apk`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/85 backdrop-blur-2xl animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-4xl h-[88vh] max-h-[640px] rounded-3xl bg-slate-950/95 border border-cyan-500/30 backdrop-blur-3xl shadow-[0_30px_90px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden text-left my-auto">
        {/* Header - Always 100% visible and sticky */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0 sticky top-0 z-20 bg-slate-950/95 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              title="Voltar para a tela inicial (Esc / Backspace)"
              className="flex items-center gap-2 px-3.5 py-2 rounded-2xl border border-white/20 bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all cursor-pointer hover:scale-105 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 text-cyan-400" />
              <span>Voltar</span>
            </button>

            <div className="flex items-center gap-2.5 ml-1">
              <div className="p-2.5 rounded-2xl bg-cyan-950/60 border border-cyan-400/30 text-cyan-300">
                <Github className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white font-['Outfit'] leading-tight">
                  Arquitetura do Launcher Nativo Android TV
                </h2>
                <p className="text-xs text-slate-400">
                  Guia de integração com repositório GitHub e pipeline de compilação por GitHub Actions
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            title="Fechar (Esc)"
            className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-8 overflow-y-auto space-y-6 no-scrollbar text-slate-200">
          {/* Overview Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-purple-950/30 border border-cyan-500/20 flex items-start gap-3">
            <Layers className="w-5 h-5 text-cyan-300 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-bold text-white text-sm block">
                Estratégia de Engenharia: Protótipo Web ➔ Launcher Android TV Nativo
              </span>
              <p className="text-slate-300 leading-relaxed">
                Este projeto web atua como o laboratório visual e ergonômico de 1080p. Para o aplicativo Android definitivo (compilado via GitHub Actions), use a arquitetura Kotlin com Jetpack Compose for TV (ou Leanback AndroidX) mantendo exatamente a proporção, safe-margins e comportamento de foco de controle remoto que validamos aqui.
              </p>
            </div>
          </div>

          {/* Section 1: Android Manifest */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">
                  1. AndroidManifest.xml (Categorias HOME e LEANBACK_LAUNCHER)
                </h3>
              </div>
              <button
                onClick={() => copyToClipboard(MANIFEST_CODE, 'manifest')}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold transition-colors cursor-pointer"
              >
                {copiedKey === 'manifest' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'manifest' ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-2xl bg-black/80 border border-white/10 font-mono text-[11px] text-emerald-300 overflow-x-auto leading-relaxed">
              {MANIFEST_CODE}
            </pre>
          </div>

          {/* Section 2: Kotlin D-Pad & Package Launching */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">
                  2. MainActivity.kt (Carregamento de Apps Instalados e Disparo de Intents)
                </h3>
              </div>
              <button
                onClick={() => copyToClipboard(KOTLIN_LAUNCH_CODE, 'kotlin')}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold transition-colors cursor-pointer"
              >
                {copiedKey === 'kotlin' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'kotlin' ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-2xl bg-black/80 border border-white/10 font-mono text-[11px] text-cyan-200 overflow-x-auto leading-relaxed">
              {KOTLIN_LAUNCH_CODE}
            </pre>
          </div>

          {/* Section 3: GitHub Actions CI/CD */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Github className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">
                  3. .github/workflows/build-android-launcher.yml (Compilação Automática no GitHub)
                </h3>
              </div>
              <button
                onClick={() => copyToClipboard(GITHUB_ACTIONS_WORKFLOW, 'actions')}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold transition-colors cursor-pointer"
              >
                {copiedKey === 'actions' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'actions' ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-2xl bg-black/80 border border-white/10 font-mono text-[11px] text-amber-200 overflow-x-auto leading-relaxed">
              {GITHUB_ACTIONS_WORKFLOW}
            </pre>
          </div>

          {/* Section 4: TCL / SEMP Performance Tips */}
          <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-slate-300 space-y-2">
            <span className="font-bold text-white block">
              Dica Crítica para TV TCL / SEMP Toshiba (Android 9 Pie - API 28):
            </span>
            <p>
              Ao compilar para Android TV 9 com GPUs Mali-470/450, utilize <code className="text-cyan-300 font-mono">android:hardwareAccelerated="true"</code> e adicione <code className="text-cyan-300 font-mono">android:largeHeap="true"</code> no manifesto. Para evitar queda de frames na rolagem horizontal, configure o RecyclerView / LazyRow com <code className="text-cyan-300 font-mono">setItemViewCacheSize(8)</code> e mantenha as imagens de pôster em resolução 300x450 com compressão WebP ou JPEG 80%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
