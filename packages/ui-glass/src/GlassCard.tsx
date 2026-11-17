'use client';

import React from 'react';

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'glow' | 'interactive' | 'solid';
  className?: string;
  glowColor?: 'purple' | 'cyan' | 'emerald' | 'rose' | 'amber';
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  variant = 'default',
  className = '',
  glowColor = 'cyan',
  ...props
}) => {
  const getGlowClasses = () => {
    switch (glowColor) {
      case 'purple': return 'hover:border-purple-300 hover:shadow-[0_8px_30px_rgba(168,85,247,0.18)]';
      case 'emerald': return 'hover:border-emerald-300 hover:shadow-[0_8px_30px_rgba(16,185,129,0.18)]';
      case 'rose': return 'hover:border-rose-300 hover:shadow-[0_8px_30px_rgba(244,63,94,0.18)]';
      case 'amber': return 'hover:border-amber-300 hover:shadow-[0_8px_30px_rgba(245,158,11,0.18)]';
      default: return 'hover:border-cyan-300 hover:shadow-[0_8px_30px_rgba(6,182,212,0.18)]';
    }
  };

  const baseStyles = 'relative rounded-2xl backdrop-blur-xl transition-all duration-300 border box-border';
  const variantStyles = {
    default: 'bg-white/85 border-slate-200/90 shadow-sm text-slate-800',
    glow: `bg-white/90 border-slate-200/90 shadow-sm ${getGlowClasses()} text-slate-800`,
    interactive: `bg-white/90 border-slate-200/90 hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-sm hover:shadow-md ${getGlowClasses()} text-slate-800`,
    solid: 'bg-white border-slate-200 shadow-md text-slate-800'
  };

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {/* Top subtle highlight reflection */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
      {children}
    </div>
  );
};
