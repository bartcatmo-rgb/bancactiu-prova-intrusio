"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';

const INACTIVITY_TIMEOUT_MS = 5 * 60 * 1000; // 5 minuts exactes (normativa Generalitat / ENS)

export function SessionLockManager({ children, onReauthenticate }: { children: React.ReactNode; onReauthenticate: (pass: string) => Promise<boolean> }) {
  const [isLocked, setIsLocked] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const saveCurrentStateSnapshot = useCallback(() => {
    try {
      const activeElement = document.activeElement as HTMLInputElement;
      if (activeElement && activeElement.value && activeElement.name) {
        sessionStorage.setItem('bancactiu_last_field_snapshot', JSON.stringify({
          name: activeElement.name,
          value: activeElement.value,
          timestamp: Date.now()
        }));
      }
    } catch (e) {
      console.error("Error desant snapshot d'estat:", e);
    }
  }, []);

  const triggerLock = useCallback(() => {
    saveCurrentStateSnapshot();
    setIsLocked(true);
  }, [saveCurrentStateSnapshot]);

  const resetTimer = useCallback(() => {
    if (isLocked) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(triggerLock, INACTIVITY_TIMEOUT_MS);
  }, [isLocked, triggerLock]);

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    const handleActivity = () => resetTimer();

    events.forEach(event => window.addEventListener(event, handleActivity));
    resetTimer();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach(event => window.removeEventListener(event, handleActivity));
    };
  }, [resetTimer]);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await onReauthenticate(password);
      if (success) {
        setIsLocked(false);
        setPassword('');
        const snapshot = sessionStorage.getItem('bancactiu_last_field_snapshot');
        if (snapshot) {
          const data = JSON.parse(snapshot);
          const field = document.querySelector(`[name="${data.name}"]`) as HTMLInputElement;
          if (field) {
            field.value = data.value;
            field.focus();
          }
        }
      } else {
        setError('Contrasenya incorrecta. Torneu a provar.');
      }
    } catch (err) {
      setError('Error de validació de seguretat.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {children}
      {isLocked && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 p-6 space-y-6 text-slate-900">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto text-2xl shadow-inner">
                🔒
              </div>
              <h2 className="text-xl font-bold text-slate-900">Sessió Bloquejada per Inactivitat</h2>
              <p className="text-sm text-slate-500">
                Segons la normativa de seguretat, la sessió s'ha suspès automàticament passats 5 minuts sense activitat per protegir les dades del ciutadà.
              </p>
            </div>

            <form onSubmit={handleUnlock} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Contrasenya / PIN de desbloqueig</label>
                <input
                  type="password"
                  autoComplete="current-password"
                  data-lpignore="true"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Introduïu la vostra contrasenya"
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                  autoFocus
                />
              </div>

              {error && <p className="text-sm text-rose-600 font-medium text-center">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? 'Verificant credencials...' : 'Desbloquejar i Reprendre la Feina'}
              </button>
            </form>

            <div className="text-xs text-center text-slate-400 border-t pt-4">
              BancActiu 3.0 Enterprise · Protecció de Dades i Traçabilitat ENS Nivell Alt
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SessionLockManager;
