'use client';

import React, { useState, useCallback, useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((type: ToastType, title: string, message?: string, duration = 4000) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newToast: ToastItem = { id, type, title, message, duration };
    setToasts((prev) => [...prev, newToast]);
  }, []);

  return { toasts, addToast, removeToast };
}

export const ToastContainer: React.FC<{
  toasts: ToastItem[];
  onClose: (id: string) => void;
}> = ({ toasts, onClose }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col space-y-2.5 max-w-md w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
};

const ToastCard: React.FC<{
  toast: ToastItem;
  onClose: (id: string) => void;
}> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, toast.duration || 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  const styleConfig = {
    success: {
      bg: 'bg-emerald-50 border-emerald-300 text-emerald-900',
      icon: '✅',
      bar: 'bg-emerald-500',
    },
    error: {
      bg: 'bg-rose-50 border-rose-300 text-rose-900',
      icon: '⛔',
      bar: 'bg-rose-500',
    },
    warning: {
      bg: 'bg-amber-50 border-amber-300 text-amber-900',
      icon: '⚠️',
      bar: 'bg-amber-500',
    },
    info: {
      bg: 'bg-sky-50 border-sky-300 text-sky-900',
      icon: 'ℹ️',
      bar: 'bg-sky-500',
    },
  }[toast.type];

  return (
    <div
      role="alert"
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-sm transition-all duration-300 transform translate-y-0 opacity-100 ${styleConfig.bg}`}
    >
      <span className="text-xl select-none shrink-0 mt-0.5">{styleConfig.icon}</span>
      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-bold tracking-tight text-slate-900">{toast.title}</h4>
        {toast.message && (
          <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{toast.message}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onClose(toast.id)}
        className="text-slate-400 hover:text-slate-700 text-xs font-bold p-1 rounded transition select-none"
        aria-label="Tancar notificació"
      >
        ✕
      </button>
    </div>
  );
};
