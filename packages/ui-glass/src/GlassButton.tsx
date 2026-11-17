'use client';

import React from 'react';

export interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  icon?: React.ReactNode;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon,
  ...props
}) => {
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5 rounded-xl',
    md: 'px-4 py-2 text-xs sm:text-sm gap-2 rounded-xl',
    lg: 'px-6 py-3 text-sm sm:text-base gap-2.5 rounded-2xl font-bold'
  };

  const variantStyles = {
    primary: 'bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-sm hover:shadow-md border border-cyan-500/30',
    secondary: 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200/90 shadow-sm hover:shadow',
    danger: 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-sm hover:shadow-md border border-rose-500/30',
    success: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-sm hover:shadow-md border border-emerald-500/30',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-transparent'
  };

  return (
    <button
      className={`inline-flex items-center justify-center font-semibold transition-all duration-200 cursor-pointer active:scale-95 disabled:opacity-50 disabled:pointer-events-none ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
};
