'use client';

import React from 'react';

export interface GlassBadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'emerald' | 'purple' | 'amber' | 'rose' | 'slate';
  pulse?: boolean;
  className?: string;
}

export const GlassBadge: React.FC<GlassBadgeProps> = ({
  children,
  variant = 'blue',
  pulse = false,
  className = ''
}) => {
  const styles = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
    amber: 'bg-amber-50 border-amber-200 text-amber-800',
    rose: 'bg-rose-50 border-rose-200 text-rose-700',
    slate: 'bg-slate-100 border-slate-200 text-slate-700'
  };

  const dotColors = {
    blue: 'bg-blue-600',
    emerald: 'bg-emerald-600',
    purple: 'bg-purple-600',
    amber: 'bg-amber-600',
    rose: 'bg-rose-600',
    slate: 'bg-slate-500'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border backdrop-blur-md ${styles[variant]} ${className}`}>
      {pulse && <span className={`w-1.5 h-1.5 rounded-full animate-ping ${dotColors[variant]}`} />}
      <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />
      {children}
    </span>
  );
};
