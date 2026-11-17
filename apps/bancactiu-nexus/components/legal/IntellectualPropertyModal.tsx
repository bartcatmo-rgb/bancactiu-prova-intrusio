'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Scale,
  Lock,
  CheckCircle2,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { GlassCard, GlassButton, GlassBadge } from '@bancactiu/ui-glass';

interface IntellectualPropertyModalProps {
  isOpen: boolean;
  onAccept: () => void;
  user?: {
    name?: string;
    dni?: string;
    role?: string;
    email?: string;
  } | null;
}

export function IntellectualPropertyModal({
  isOpen,
  onAccept,
  user
}: IntellectualPropertyModalProps) {
  const [hasAgreed, setHasAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prevenir qualsevol tancament amb teclat ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown, true);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!hasAgreed) return;
    setIsSubmitting(true);
    try {
      const storageKey = `bancactiu_ip_accepted_${user?.dni || user?.name || 'current_user'}`;
      localStorage.setItem(storageKey, new Date().toISOString());
      localStorage.setItem('bancactiu_ip_global_accepted', 'true');
      document.cookie = `bancactiu_ip_accepted=true; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      onAccept();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-slate-900/40 backdrop-blur-sm animate-fade-in overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl my-auto">
        <GlassCard
          variant="glow"
          className="relative border-amber-300 shadow-2xl bg-white p-6 sm:p-8 text-slate-800"
        >
          {/* Capçalera d'Advertència Oficial */}
          <div className="flex items-start gap-4 pb-5 border-b border-amber-200">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 border border-amber-300 text-amber-600 shrink-0 shadow-sm">
              <Scale className="w-8 h-8 animate-pulse" />
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <GlassBadge variant="amber">Avís Legal Obligatori</GlassBadge>
                <GlassBadge variant="purple">ENS Nivell Alt &middot; RDL 1/1996</GlassBadge>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Drets de Propietat Intel·lectual i Confidencialitat
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Plataforma BancActiu 3.0 &middot; Institut Esteve Terrades i Illa &middot; Departament de Salut
              </p>
            </div>
          </div>

          {/* Dades de l'Usuari Autenticat */}
          <div className="my-4 p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between text-xs gap-2">
            <span className="text-slate-500">Usuari identificat:</span>
            <span className="font-semibold text-slate-900">
              {user?.name || 'Administrador'} {user?.dni ? `(${user.dni})` : ''}
            </span>
            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono text-[11px] border border-blue-200 font-bold">
              Rol: {user?.role || 'SUPERADMIN'}
            </span>
          </div>

          {/* Contingut dels Drets de Propietat Intel·lectual */}
          <div className="my-4 max-h-[42vh] overflow-y-auto pr-2 space-y-3.5 text-xs text-slate-600 leading-relaxed rounded-xl bg-slate-50 p-4 border border-slate-200 scrollbar-thin scrollbar-thumb-amber-300">
            <div className="flex gap-2.5 items-start">
              <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-semibold mb-0.5">
                  1. Titularitat i Drets d'Autor Reservats (RDL 1/1996)
                </strong>
                BancActiu 3.0, el seu codi font complet, arquitectura modular de micro-aplicacions, interfície 
                glassmorphism, models de base de dades i algoritmes d'interoperabilitat són obres originals protegides 
                pel Reial Decret Legislatiu 1/1996 de la Llei de Propietat Intel·lectual i la Directiva Europea 2009/24/CE.
              </div>
            </div>

            <div className="flex gap-2.5 items-start">
              <AlertTriangle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-semibold mb-0.5">
                  2. Prohibició de Còpia, Enginyeria Inversa i Ús Comercial
                </strong>
                Queda expressament prohibida qualsevol reproducció no autoritzada, enginyeria inversa, descompilació, 
                distribució externa, modificació o explotació comercial d'aquest programari fora de l'àmbit acadèmic, 
                formatiu i d'auditoria assignat a l'Institut Esteve Terrades i Illa i entitats participants.
              </div>
            </div>

            <div className="flex gap-2.5 items-start">
              <ShieldAlert className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-semibold mb-0.5">
                  3. Deure Ineludible de Secret i Protecció de Dades (RGPD Art. 9)
                </strong>
                Les dades sociosanitàries, CIPs, registres de pacients i expedients de préstec tractats a la plataforma 
                tenen caràcter d'alta sensibilitat. L'usuari adquireix l'obligació legal i deontològica de guardar 
                secret professional absolut (LOPDGDD 3/2018 i Reglament UE 2016/679).
              </div>
            </div>

            <div className="flex gap-2.5 items-start">
              <FileText className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-semibold mb-0.5">
                  4. Auditoria Forense Immutable (Zero-Trust)
                </strong>
                Tota consulta, inici de sessió i acció realitzada queda registrada amb empremta digital de temps, 
                adreça IP d'origen i identificador d'actor amb validesa pericial a efectes d'auditoria ENS Nivell Alt.
              </div>
            </div>
          </div>

          {/* Checkbox Obligatori d'Acceptació */}
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 mt-4">
            <input
              type="checkbox"
              id="accept-ip-rights"
              checked={hasAgreed}
              onChange={(e) => setHasAgreed(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-amber-400 text-amber-600 focus:ring-amber-500 bg-white cursor-pointer"
            />
            <label
              htmlFor="accept-ip-rights"
              className="text-xs text-amber-900 select-none cursor-pointer leading-snug font-medium"
            >
              Declaro sota la meva responsabilitat que he llegit, comprenc i accepto de forma expressa i vinculant 
              els drets de propietat intel·lectual, les restriccions d'ús i el deure de secret de la plataforma BancActiu 3.0.
            </label>
          </div>

          {/* Botó d'Acceptació Ineludible */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <span className="text-[11px] text-slate-500 text-center sm:text-left">
              * Aquest acord és ineludible per accedir a qualsevol funció del sistema.
            </span>
            <GlassButton
              variant="primary"
              size="lg"
              disabled={!hasAgreed || isSubmitting}
              onClick={handleConfirm}
              icon={<CheckCircle2 size={18} />}
              className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold border-none shadow-md shadow-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Registrant Acceptació...' : 'Acceptar i Accedir a la Plataforma'}
            </GlassButton>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
