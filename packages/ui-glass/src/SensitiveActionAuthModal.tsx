'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, Lock, KeyRound, AlertTriangle, Eye, EyeOff, CheckCircle2, X } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { GlassButton } from './GlassButton';
import { GlassBadge } from './GlassBadge';

export interface SensitiveActionAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (authData?: { authorizedAt: string; auditId?: string }) => void;
  actionTitle: string;
  actionDescription?: string;
  actionSeverity?: 'critical' | 'high' | 'warning';
  currentUserDni?: string;
  currentUserName?: string;
  currentUserRole?: string;
  moduleName?: string;
  verifyApiUrl?: string;
}

export const SensitiveActionAuthModal: React.FC<SensitiveActionAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  actionTitle,
  actionDescription,
  actionSeverity = 'critical',
  currentUserDni = '52622304Y',
  currentUserName = 'Mireia Valls (SuperAdmin)',
  currentUserRole = 'SUPERADMIN',
  moduleName = 'bancactiu-nexus',
  verifyApiUrl = '/api/auth/reauthenticate',
}) => {
  const [dni, setDni] = useState(currentUserDni);
  const [password, setPassword] = useState('');
  const [justification, setJustification] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setDni(currentUserDni);
      setPassword('');
      setJustification('');
      setErrorMessage(null);
      setIsSuccess(false);
      setIsLoading(false);
    }
  }, [isOpen, currentUserDni]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose, isLoading]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setErrorMessage('La contrasenya de confirmació és estrictament obligatòria.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch(verifyApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dni: dni.trim().toUpperCase(),
          password,
          actionName: actionTitle,
          actionDetails: actionDescription || 'Acció crítica protegida',
          justification: justification.trim(),
          module: moduleName,
          role: currentUserRole,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Credencials no vàlides o sessió no autoritzada.');
      }

      setIsSuccess(true);
      setTimeout(() => {
        onSuccess({
          authorizedAt: data.authorizedAt || new Date().toISOString(),
          auditId: data.auditId,
        });
        onClose();
      }, 700);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error durant la verificació d\'identitat.');
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityBadge = () => {
    switch (actionSeverity) {
      case 'critical':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase">
            Nivell Crític · ENS Alt
          </span>
        );
      case 'high':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
            Privilegi Elevat
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 uppercase">
            Re-Autenticació Requerida
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <GlassCard className="w-full max-w-lg p-6 border-rose-200 shadow-2xl relative overflow-hidden bg-white">
        {/* Llum d'advertència superior */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600" />

        {/* Capçalera del Modal */}
        <div className="flex items-start justify-between pb-3 mb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 tracking-tight">Doble Verificació de Seguretat</h2>
                {getSeverityBadge()}
              </div>
              <p className="text-xs text-slate-500">Re-autenticació per a operacions d'alt risc institucional</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition disabled:opacity-40"
          >
            <X size={18} />
          </button>
        </div>

        {/* Resum de l'acció sensible */}
        <div className="mb-4 p-3 rounded-xl bg-rose-50/70 border border-rose-200 text-xs">
          <div className="flex items-center gap-2 text-rose-800 font-semibold mb-1">
            <AlertTriangle size={14} className="shrink-0 text-amber-500" />
            <span>Acció Requerida: {actionTitle}</span>
          </div>
          {actionDescription && (
            <p className="text-slate-600 text-[11px] leading-relaxed pl-5">{actionDescription}</p>
          )}
          <div className="mt-2 pt-2 border-t border-rose-200/60 flex flex-wrap items-center justify-between text-[10px] text-slate-500">
            <span>Operador: <strong className="text-slate-900">{currentUserName}</strong></span>
            <span>Rol: <strong className="text-purple-700 font-semibold">{currentUserRole}</strong></span>
          </div>
        </div>

        {/* Alerta d'error */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-700 text-xs flex items-center gap-2 animate-shake">
            <ShieldAlert size={16} className="shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Estat d'èxit */}
        {isSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-700 text-xs flex items-center gap-2">
            <CheckCircle2 size={16} className="shrink-0 text-emerald-600 animate-bounce" />
            <span>Identitat confirmada. Autoritzant execució de l'acció...</span>
          </div>
        )}

        {/* Formulari de re-autenticació */}
        <form onSubmit={handleSubmit} autoComplete="off" autoCapitalize="off" spellCheck={false} data-lpignore="true" className="space-y-3.5">
          {/* Camp DNI actiu */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              DNI del Responsable d'Autorització
            </label>
            <div className="relative">
              <input
                type="text"
                value={dni}
                onChange={(e) => setDni(e.target.value.toUpperCase())}
                placeholder="ex. 52622304Y"
                disabled={isLoading || isSuccess}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                data-lpignore="true"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-sm focus:outline-none focus:border-rose-400 focus:bg-white disabled:opacity-60"
              />
              <span className="absolute right-3 top-2.5 text-[10px] font-mono text-slate-400 uppercase">
                Usuari Actiu
              </span>
            </div>
          </div>

          {/* Camp Contrasenya de confirmació */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Contrasenya Actual de Confirmació <span className="text-rose-500">*</span>
              </label>
              <span className="text-[10px] text-slate-500">Requerida per ENS Nivell Alt</span>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Introdueix la teva clau per validar"
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                data-lpignore="true"
                autoFocus
                disabled={isLoading || isSuccess}
                className="w-full px-3.5 py-2 pr-10 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-rose-400 focus:bg-white disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Justificació institucional (ENS / RGPD Audit) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Motiu / Justificació d'Acció <span className="text-slate-400 font-normal">(Opcional per a traçabilitat)</span>
            </label>
            <input
              type="text"
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="ex. Revisió periòdica d'autoritzacions o expedient sanitari"
              disabled={isLoading || isSuccess}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              data-lpignore="true"
              className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-purple-400 focus:bg-white disabled:opacity-60"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <GlassButton
              type="button"
              variant="secondary"
              size="sm"
              disabled={isLoading || isSuccess}
              onClick={onClose}
            >
              Cancel·lar
            </GlassButton>
            <GlassButton
              type="submit"
              variant="danger"
              size="sm"
              disabled={isLoading || isSuccess || !password}
              icon={<KeyRound size={14} />}
            >
              {isLoading ? 'Verificant amb ENS...' : 'Autoritzar i Executar'}
            </GlassButton>
          </div>
        </form>

        <p className="mt-3 text-[10px] text-center text-slate-400 leading-tight">
          Aquest procés genera un registre forense inmutable amb segell temporal, adreça IP i DNI de conformitat amb l'Esquema Nacional de Seguretat i RGPD.
        </p>
      </GlassCard>
    </div>
  );
};
