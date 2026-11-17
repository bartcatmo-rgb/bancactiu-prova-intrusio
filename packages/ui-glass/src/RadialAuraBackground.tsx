'use client';

import React from 'react';

export interface RadialAuraBackgroundProps {
  children?: React.ReactNode;
  variant?: 'nexus' | 'salut' | 'municipal' | 'social' | 'operatiu' | 'default';
  className?: string;
}

export const RadialAuraBackground: React.FC<RadialAuraBackgroundProps> = ({
  children,
  variant = 'default',
  className = ''
}) => {
  const getGradientThemes = () => {
    switch (variant) {
      case 'nexus':
        return {
          aura1: 'from-purple-400/20 via-indigo-300/15 to-transparent',
          aura2: 'from-blue-400/20 via-violet-300/15 to-transparent',
          aura3: 'from-cyan-400/15 via-sky-300/10 to-transparent',
          accent: 'border-purple-200'
        };
      case 'salut':
        return {
          aura1: 'from-emerald-400/20 via-teal-300/15 to-transparent',
          aura2: 'from-cyan-400/20 via-blue-300/15 to-transparent',
          aura3: 'from-teal-300/15 via-emerald-300/10 to-transparent',
          accent: 'border-emerald-200'
        };
      case 'municipal':
        return {
          aura1: 'from-indigo-400/20 via-blue-300/15 to-transparent',
          aura2: 'from-violet-400/20 via-purple-300/15 to-transparent',
          aura3: 'from-sky-300/15 via-indigo-300/10 to-transparent',
          accent: 'border-indigo-200'
        };
      case 'social':
        return {
          aura1: 'from-rose-400/20 via-amber-300/15 to-transparent',
          aura2: 'from-orange-400/20 via-rose-300/15 to-transparent',
          aura3: 'from-amber-300/15 via-red-300/10 to-transparent',
          accent: 'border-rose-200'
        };
      case 'operatiu':
        return {
          aura1: 'from-cyan-400/20 via-blue-300/15 to-transparent',
          aura2: 'from-indigo-400/20 via-teal-300/15 to-transparent',
          aura3: 'from-blue-300/15 via-sky-300/10 to-transparent',
          accent: 'border-cyan-200'
        };
      default:
        return {
          aura1: 'from-indigo-400/20 via-purple-300/15 to-transparent',
          aura2: 'from-cyan-400/15 via-blue-300/15 to-transparent',
          aura3: 'from-emerald-300/15 via-indigo-300/10 to-transparent',
          accent: 'border-slate-200'
        };
    }
  };

  const theme = getGradientThemes();

  return (
    <div className={`relative min-h-screen w-full overflow-x-hidden overflow-y-auto custom-scrollbar bg-slate-50 text-slate-900 ${className}`}>
      {/* Dynamic Ambient Radial Auras (Fixed Clean Healthcare Light Theme Backlight) */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className={`absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-gradient-to-br ${theme.aura1} blur-3xl opacity-70 animate-pulse`} />
        <div className={`absolute top-1/3 -right-40 h-[650px] w-[650px] rounded-full bg-gradient-to-bl ${theme.aura2} blur-3xl opacity-60`} />
        <div className={`absolute -bottom-40 left-1/4 h-[550px] w-[550px] rounded-full bg-gradient-to-tr ${theme.aura3} blur-3xl opacity-50`} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/90 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 w-full min-h-screen flex flex-col">
        {children}
      </div>
    </div>
  );
};
