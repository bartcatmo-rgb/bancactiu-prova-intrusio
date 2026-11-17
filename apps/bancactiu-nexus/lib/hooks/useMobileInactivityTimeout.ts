'use client';

import { useEffect, useRef } from 'react';

const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minuts segons RGPD / Seguretat Mòbil

export function useMobileInactivityTimeout(onTimeout: () => void, enabled: boolean = true) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (enabled) {
      timerRef.current = setTimeout(() => {
        console.warn('Sessió mòbil tancada per inactivitat (15 minuts).');
        onTimeout();
      }, INACTIVITY_TIMEOUT_MS);
    }
  };

  useEffect(() => {
    if (!enabled) return;

    const events = ['touchstart', 'touchend', 'click', 'mousemove', 'keydown', 'scroll'];
    events.forEach((ev) => window.addEventListener(ev, resetTimer, { passive: true }));

    resetTimer();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      events.forEach((ev) => window.removeEventListener(ev, resetTimer));
    };
  }, [enabled, onTimeout]);
}
