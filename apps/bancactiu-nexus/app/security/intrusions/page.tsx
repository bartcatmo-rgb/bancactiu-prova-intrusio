"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';

interface IntrusionLog {
  id: string;
  timestamp: string;
  displayTime: string;
  ip: string;
  route: string;
  method: string;
  attemptType: string;
  userAgent: string;
  details: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'BLOCKED' | 'HONEYPOT_TRIGGERED' | 'RECORDED';
  locationInfo?: string;
}

interface SummaryStats {
  totalIntrusions: number;
  uniqueIpsCount: number;
  criticalCount: number;
  honeypotTriggeredCount: number;
  lastDetectedIp: string;
  lastTimestamp: string;
}

export default function IntrusionMonitorDashboardPage() {
  const [logs, setLogs] = useState<IntrusionLog[]>([]);
  const [summary, setSummary] = useState<SummaryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [authError, setAuthError] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  // Comprova si ja hi ha clau desada a la sessió local
  useEffect(() => {
    const saved = sessionStorage.getItem('bancactiu_intrusion_unlocked');
    if (saved === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    // Clau d'administració per a l'entorn de pentest
    if (adminKey === 'SuperAdmin@2026!' || adminKey === '1234' || adminKey === 'bancactiu' || adminKey === 'admin') {
      setIsAuthenticated(true);
      sessionStorage.setItem('bancactiu_intrusion_unlocked', 'true');
      setAuthError('');
    } else {
      setAuthError('Clau d\'administració incorrecta. Utilitza SuperAdmin@2026! o 1234.');
    }
  };

  const fetchLogs = useCallback(async () => {
    try {
      const res = await fetch('/api/security/intrusion-logs', { cache: 'no-store' });
      const data = await res.json();
      if (data.success && data.data) {
        setLogs(data.data.logs || []);
        setSummary(data.data.summary || null);
      }
    } catch (e) {
      console.error('Error recuperant registres d\'intrusió:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Polling automàtic cada 2 segons per a temps real en videotrucades
  useEffect(() => {
    fetchLogs();
    if (!autoRefresh) return;
    const interval = setInterval(fetchLogs, 2000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchLogs]);

  // Simular intent d'intrusió per mostrar en directe
  const handleSimulateAttack = async () => {
    try {
      setActionMessage('Disparant simulació d\'intrusió...');
      const res = await fetch('/api/security/intrusion-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ simulate: true })
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage('Simulació injectada amb èxit! Visible al monitor.');
        fetchLogs();
      }
    } catch {
      setActionMessage('Error llançant simulació.');
    } finally {
      setTimeout(() => setActionMessage(''), 4000);
    }
  };

  // Netejar registres
  const handleClearLogs = async () => {
    if (!confirm('Vols buidar tots els registres d\'intrusió acumulats?')) return;
    try {
      await fetch('/api/security/intrusion-logs', { method: 'DELETE' });
      fetchLogs();
      setActionMessage('Registres buidats correctament.');
    } catch {
      setActionMessage('Error buidant registres.');
    } finally {
      setTimeout(() => setActionMessage(''), 3000);
    }
  };

  // Exportar registres en format JSON
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `bancactiu-intrusions-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Filtres
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch =
        searchQuery === '' ||
        log.ip.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.attemptType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.details.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = filterType === 'ALL' || log.attemptType === filterType;
      return matchesSearch && matchesType;
    });
  }, [logs, searchQuery, filterType]);

  // Si no està autenticat, mostra la pantalla de desbloqueig de SuperAdmin
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
            <span className="text-3xl">🛡️</span>
          </div>

          <h1 className="text-2xl font-bold text-center text-white font-mono">
            Accés SuperAdmin
          </h1>
          <p className="mt-1 text-center text-xs text-neutral-400 font-mono">
            Monitor de Fluxos d&apos;Intrusió i IPs en Temps Real (Honeypot Clone)
          </p>

          <form onSubmit={handleUnlock} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-mono font-medium text-neutral-300 mb-1">
                Clau d&apos;Administració de Seguretat
              </label>
              <input
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder="Ex: SuperAdmin@2026! o 1234"
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
                autoFocus
              />
            </div>

            {authError && (
              <p className="text-xs text-red-400 font-mono bg-red-950/40 p-2.5 rounded-lg border border-red-800/50">
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold font-mono text-sm shadow-lg shadow-blue-600/30 transition-all"
            >
              Desbloquejar Panell en Directe
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-neutral-800 text-center">
            <Link href="/honeypot" className="text-xs text-yellow-400 hover:underline font-mono">
              🐱 Veure Pantalla Trampa Honeypot Shield →
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans">
      {/* CAPÇALERA SUPERIOR EXECUTIVA */}
      <header className="sticky top-0 z-40 bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800 px-4 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 text-xl font-bold">
              🛡️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-xl font-black text-white font-mono tracking-tight">
                  MONITOR D&apos;INTRUSIONS I IPs EN TEMPS REAL
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-mono font-bold border border-red-500/30">
                  HONEYPOT
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-mono">
                BancActiu 3.0 Prova Intrusió • Captura i traça immediata d&apos;adreces IP atacants
              </p>
            </div>
          </div>

          {/* Controls ràpids per a Videotrucada */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-2 border ${
                autoRefresh
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                  : 'bg-neutral-800 border-neutral-700 text-neutral-400'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-emerald-400 animate-ping' : 'bg-neutral-500'}`} />
              {autoRefresh ? 'LIVE EN DIRECTE (2s)' : 'PAUSAT'}
            </button>

            <button
              onClick={handleSimulateAttack}
              className="px-3.5 py-1.5 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-mono font-bold shadow-[0_0_15px_rgba(234,179,8,0.4)] transition-all flex items-center gap-1.5"
            >
              <span>⚡</span>
              <span>Simular Atac (Demo)</span>
            </button>

            <Link
              href="/honeypot"
              target="_blank"
              className="px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-xs font-mono font-bold shadow-md transition-all flex items-center gap-1.5"
            >
              <span>🐱</span>
              <span>Trampa Gatets</span>
            </Link>

            <button
              onClick={handleClearLogs}
              className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-mono border border-neutral-700 transition-all"
            >
              Buidar
            </button>

            <button
              onClick={handleExportJson}
              className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-mono border border-neutral-700 transition-all"
            >
              JSON
            </button>

            <Link
              href="/login"
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold shadow-md transition-all"
            >
              Login
            </Link>
          </div>
        </div>

        {actionMessage && (
          <div className="mt-2 text-center text-xs font-mono text-yellow-300 bg-yellow-950/40 py-1 border border-yellow-700/50 rounded-lg">
            {actionMessage}
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
        {/* BLOC DE METRIQUES SUPERADMIN */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Mètrica 1: Total Intrusions */}
          <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
            <span className="text-xs font-mono text-neutral-400">Total Intents Registrats</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-black font-mono text-white">
                {summary?.totalIntrusions ?? logs.length}
              </span>
              <span className="text-xs font-mono text-red-400">capturats</span>
            </div>
          </div>

          {/* Mètrica 2: IPs Úniques (DESTACAT PER VIDEOTRUCADA) */}
          <div className="p-4 rounded-2xl bg-neutral-900 border-2 border-yellow-500/40 shadow-[0_0_20px_rgba(234,179,8,0.15)]">
            <span className="text-xs font-mono text-yellow-400 font-bold uppercase tracking-wider">
              IPs Úniques Detectades
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-black font-mono text-yellow-300">
                {summary?.uniqueIpsCount ?? new Set(logs.map(l => l.ip)).size}
              </span>
              <span className="text-xs font-mono text-yellow-200/70">fonts d&apos;origen</span>
            </div>
          </div>

          {/* Mètrica 3: Darrera IP Detectada (PROMINENT PER A DEMO) */}
          <div className="p-4 rounded-2xl bg-neutral-900 border-2 border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.15)]">
            <span className="text-xs font-mono text-red-400 font-bold uppercase tracking-wider">
              Última IP Identificada
            </span>
            <div className="mt-1">
              <span className="text-xl md:text-2xl font-black font-mono text-red-400 break-all select-all">
                {summary?.lastDetectedIp || (logs[0]?.ip ?? 'Cap')}
              </span>
              <div className="text-[11px] font-mono text-neutral-400 mt-0.5">
                {summary?.lastTimestamp || (logs[0]?.displayTime ?? 'Sense intents')}
              </div>
            </div>
          </div>

          {/* Mètrica 4: Trampes Honeypot Disparades */}
          <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
            <span className="text-xs font-mono text-pink-400 font-bold">Honeypots Triggered</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-black font-mono text-pink-400">
                {summary?.honeypotTriggeredCount ?? logs.filter(l => l.status === 'HONEYPOT_TRIGGERED').length}
              </span>
              <span className="text-xs font-mono text-neutral-400">amb gatets &amp; música</span>
            </div>
          </div>
        </section>

        {/* FILTRES I CERCA */}
        <section className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cerca per IP, ruta, tipus..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-sm font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-yellow-500"
            />
            <span className="absolute left-3 top-2.5 text-neutral-500 text-sm">🔍</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {['ALL', 'Força Bruta', 'Sondeig Maliciós (Honeypot)', 'Login Fallit', 'Injecció Sospitosa'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                  filterType === type
                    ? 'bg-yellow-400 text-black font-bold shadow'
                    : 'bg-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                {type === 'ALL' ? 'Tots' : type}
              </button>
            ))}
          </div>
        </section>

        {/* TAULA EN DIRECTE D'INTRUSIONS I IPs */}
        <section className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
            <h2 className="text-sm font-bold font-mono text-neutral-200 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              FLUX D&apos;INTRUSIONS EN TEMPS REAL ({filteredLogs.length} registres)
            </h2>
            <span className="text-xs font-mono text-neutral-400">
              Refresc automàtic actiu • Format d&apos;alta visibilitat
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-950/80 text-neutral-400 font-mono text-xs uppercase tracking-wider border-b border-neutral-800">
                  <th className="py-3 px-4">Hora (Timestamp)</th>
                  <th className="py-3 px-4">Adreça IP (Atacant)</th>
                  <th className="py-3 px-4">Tipus d&apos;Intent</th>
                  <th className="py-3 px-4">Ruta Objectiu</th>
                  <th className="py-3 px-4">Gravetat</th>
                  <th className="py-3 px-4">Estat &amp; Reacció</th>
                  <th className="py-3 px-4">Detalls de l&apos;Atac</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/80 font-mono text-xs">
                {loading && logs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-neutral-400">
                      Carregant flux en directe de seguretat...
                    </td>
                  </tr>
                ) : filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-neutral-400">
                      No s&apos;han trobat intents d&apos;intrusió amb els filtres actuals.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => {
                    const isCritical = log.severity === 'CRITICAL';
                    const isHoneypot = log.status === 'HONEYPOT_TRIGGERED';

                    return (
                      <tr
                        key={log.id}
                        className={`transition-colors hover:bg-neutral-800/50 ${
                          isCritical ? 'bg-red-950/20' : isHoneypot ? 'bg-yellow-950/10' : ''
                        }`}
                      >
                        {/* Timestamp */}
                        <td className="py-3 px-4 text-neutral-300 whitespace-nowrap">
                          {log.displayTime}
                        </td>

                        {/* Adreça IP (GRAN I VISIBLE EN VIDEOTRUCADA) */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="inline-flex items-center gap-2">
                            <span className="px-2.5 py-1 rounded-lg bg-black border border-yellow-500/50 font-bold text-yellow-300 text-sm tracking-wide shadow-sm">
                              {log.ip}
                            </span>
                            <button
                              onClick={() => navigator.clipboard.writeText(log.ip)}
                              title="Copiar IP"
                              className="text-neutral-500 hover:text-white transition-colors"
                            >
                              📋
                            </button>
                          </div>
                          {log.locationInfo && (
                            <div className="text-[10px] text-neutral-500 mt-0.5">
                              {log.locationInfo}
                            </div>
                          )}
                        </td>

                        {/* Tipus d'Intent */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              log.attemptType === 'Força Bruta'
                                ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                                : log.attemptType === 'Sondeig Maliciós (Honeypot)'
                                ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40'
                                : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                            }`}
                          >
                            {log.attemptType}
                          </span>
                        </td>

                        {/* Ruta */}
                        <td className="py-3 px-4 text-neutral-200 font-bold whitespace-nowrap">
                          <code>{log.route}</code>
                        </td>

                        {/* Gravetat */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              isCritical
                                ? 'bg-red-600 text-white'
                                : log.severity === 'HIGH'
                                ? 'bg-orange-500/20 text-orange-400'
                                : 'bg-neutral-800 text-neutral-300'
                            }`}
                          >
                            {log.severity}
                          </span>
                        </td>

                        {/* Estat */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          {isHoneypot ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/40 font-bold">
                              <span>🐱</span>
                              <span>HONEYPOT DISPARAT</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                              <span>⛔</span>
                              <span>BLOQUEJAT</span>
                            </span>
                          )}
                        </td>

                        {/* Detalls */}
                        <td className="py-3 px-4 max-w-xs truncate text-neutral-400" title={log.details}>
                          {log.details}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
