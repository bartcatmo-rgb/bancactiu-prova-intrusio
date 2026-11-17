"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function HoneypotTrapPage() {
  const [seconds, setSeconds] = useState(0);
  const [isTransitioned, setIsTransitioned] = useState(false);
  const [clientIp, setClientIp] = useState<string>('Detectant IP...');
  const [isSoundActive, setIsSoundActive] = useState(false);
  const loggedRef = useRef(false);

  // 1. Registre automàtic de la IP de l'intrús al servidor en carregar la trampa
  useEffect(() => {
    if (loggedRef.current) return;
    loggedRef.current = true;

    fetch('/api/security/intrusion-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        route: window.location.pathname + window.location.search,
        method: 'INTERCEPT',
        attemptType: 'Sondeig Maliciós (Honeypot)',
        details: 'Intrús capturat per la pantalla trampa Honeypot Shield (Gatets & Coches Chocones)',
        severity: 'HIGH',
        status: 'HONEYPOT_TRIGGERED'
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.log?.ip) {
          setClientIp(data.log.ip);
        }
      })
      .catch(() => {
        setClientIp('127.0.0.1');
      });
  }, []);

  // 2. Temporitzador de 0 a 3 segons per a la transició suau
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => {
        if (prev >= 3) {
          setIsTransitioned(true);
          clearInterval(timer);
          return 3;
        }
        const nextVal = prev + 1;
        if (nextVal >= 3) {
          setIsTransitioned(true);
        }
        return nextVal;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Forçar activació de so en cas de bloqueig d'autoplay del navegador
  const handleActivateFullExperience = () => {
    setIsSoundActive(true);
    setIsTransitioned(true);
    setSeconds(3);
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black text-white font-sans select-none">
      {/* 
        ========================================================================
        FONS: Videoclip YouTube "Los Desgraciaus - Los coches chocones"
        0-3 segons: difuminat (blur-2xl), fosc (brightness-20), escala 105%
        Segon 3+: transició nítida (blur-0, brightness-100, pantalla completa)
        ========================================================================
      */}
      <div 
        className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out ${
          isTransitioned 
            ? 'filter-none scale-100 opacity-100 z-10' 
            : 'filter blur-[24px] brightness-[0.22] scale-105 opacity-80 z-0'
        }`}
      >
        <iframe
          className="w-full h-full pointer-events-auto border-0"
          src="https://www.youtube.com/embed/hVQpuS97xvc?autoplay=1&mute=0&controls=1&loop=1&playlist=hVQpuS97xvc&enablejsapi=1"
          title="Los Desgraciaus - Los coches chocones"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>

      {/* 
        ========================================================================
        PRIMER PLA (0-3 segons):
        Els dos gatets animats des de la carpeta local 'public/assets/cats/'
        (cat-no-no.gif i cat-dancing.gif) amb missatge flotant retro
        ========================================================================
      */}
      <div
        className={`absolute inset-0 z-30 flex flex-col items-center justify-center p-4 transition-all duration-1000 ease-in-out ${
          isTransitioned
            ? 'opacity-0 pointer-events-none scale-95 translate-y-4'
            : 'opacity-100 pointer-events-auto scale-100 translate-y-0'
        }`}
      >
        {/* Banner d'alerta d'intrusió detectada */}
        <div className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/90 text-white text-xs font-mono tracking-widest uppercase shadow-[0_0_25px_rgba(220,38,38,0.8)] border border-red-400">
          <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
          HONEYPOT SHIELD ACTIVAT • IP CAPTURADA: {clientIp}
        </div>

        {/* Contenidor central dels dos gatets animats */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-12 my-2">
          {/* Gatet 1: Nega amb el cap (No, no) */}
          <div className="flex flex-col items-center">
            <div className="relative w-44 h-44 md:w-56 md:h-56 p-2 rounded-2xl bg-black/60 border-2 border-yellow-400/80 shadow-[0_0_30px_rgba(250,204,21,0.5)] flex items-center justify-center overflow-hidden backdrop-blur-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/cats/cat-no-no.gif"
                alt="Gatet negant amb el cap - No No No"
                className="w-full h-full object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
              />
            </div>
            <span className="mt-2 text-xs font-mono font-bold text-yellow-300 uppercase tracking-wider bg-black/80 px-2.5 py-0.5 rounded border border-yellow-500/50">
              Gat &quot;No, no, no!&quot;
            </span>
          </div>

          {/* Gatet 2: Ballarí */}
          <div className="flex flex-col items-center">
            <div className="relative w-44 h-44 md:w-56 md:h-56 p-2 rounded-2xl bg-black/60 border-2 border-pink-400/80 shadow-[0_0_30px_rgba(244,114,182,0.5)] flex items-center justify-center overflow-hidden backdrop-blur-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/cats/cat-dancing.gif"
                alt="Gatet ballarí ballant a la pista"
                className="w-full h-full object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
              />
            </div>
            <span className="mt-2 text-xs font-mono font-bold text-pink-300 uppercase tracking-wider bg-black/80 px-2.5 py-0.5 rounded border border-pink-500/50">
              Gat Festa &amp; Ball
            </span>
          </div>
        </div>

        {/* 
          Missatge flotant de videojoc retro (EXACTE segons el requeriment):
          "⚠️ Wa, wa, wa... La pròxima vegada, sigueu jugant! ⚠️"
        */}
        <div className="mt-6 max-w-2xl px-6 py-4 rounded-2xl bg-black/90 border-4 border-yellow-400 shadow-[0_0_50px_rgba(250,204,21,0.8)] text-center animate-bounce">
          <h1 className="font-mono text-xl sm:text-2xl md:text-3xl font-black text-yellow-300 tracking-wide drop-shadow-[0_3px_10px_rgba(255,255,0,0.8)]">
            ⚠️ Wa, wa, wa... La pròxima vegada, sigueu jugant! ⚠️
          </h1>
          <p className="mt-2 font-mono text-xs sm:text-sm text-yellow-100/90 tracking-wider">
            Intrusió detectada i neutralitzada pel motor Honeypot de BancActiu 3.0.
          </p>
        </div>

        {/* Comptador progressiu de la transició (0s -> 3s) */}
        <div className="mt-4 flex items-center gap-3 bg-black/70 px-4 py-1.5 rounded-full border border-white/20">
          <span className="text-xs font-mono text-neutral-300">
            Transició a pantalla completa en: <strong className="text-yellow-400 text-sm font-bold">{Math.max(0, 3 - seconds)}s</strong>
          </span>
          <div className="w-24 h-2 bg-neutral-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-yellow-400 to-red-500 transition-all duration-1000"
              style={{ width: `${(seconds / 3) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* 
        ========================================================================
        BARRA SUPERIOR DE CONTROL I ACCÉS AL MONITOR D'INTRUSIONS (SUPERADMIN)
        ========================================================================
      */}
      <header className="absolute top-0 left-0 right-0 z-40 p-4 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-b from-black/90 via-black/40 to-transparent pointer-events-auto">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-xs sm:text-sm font-bold tracking-wider text-emerald-400">
            BANCACTIU 3.0 • PROVA INTRUSIÓ (HONEYPOT CLONE)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {!isSoundActive && (
            <button
              onClick={handleActivateFullExperience}
              className="px-3 py-1.5 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-bold font-mono tracking-wide shadow-[0_0_15px_rgba(234,179,8,0.7)] transition-all flex items-center gap-1.5"
            >
              <span>🔊</span>
              <span>Activar Vídeo &amp; So al Màxim</span>
            </button>
          )}

          <Link
            href="/security/intrusions"
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold font-mono tracking-wide shadow-lg border border-blue-400 transition-all flex items-center gap-1.5"
          >
            <span>📊</span>
            <span>Monitor d&apos;IPs en Temps Real</span>
          </Link>

          <Link
            href="/login"
            className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-mono border border-neutral-600 transition-all"
          >
            Tornar al Login
          </Link>
        </div>
      </header>

      {/* 
        Badge informatiu flotant quan la transició s'ha completat
      */}
      {isTransitioned && (
        <aside className="absolute bottom-4 left-4 z-40 px-4 py-2.5 rounded-xl bg-black/80 border border-yellow-400/60 backdrop-blur-md shadow-2xl text-xs font-mono text-yellow-300 flex items-center gap-3">
          <span className="text-xl">🚗💨</span>
          <div>
            <div className="font-bold text-white">Los Desgraciaus - Los coches chocones</div>
            <div className="text-[11px] text-yellow-200/80">Pantalla trampa activa • IP enregistrada al panell de control</div>
          </div>
        </aside>
      )}
    </main>
  );
}
