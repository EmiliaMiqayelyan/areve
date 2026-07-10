'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2, Save } from 'lucide-react';

type AdminSaveButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  loading?: boolean;
  children: ReactNode;
  loadingLabel?: ReactNode;
  iconSize?: number;
  showIcon?: boolean;
  compact?: boolean;
  variant?: 'primary' | 'outline';
};

export default function AdminSaveButton({
  loading = false,
  children,
  loadingLabel,
  iconSize = 16,
  showIcon = true,
  compact = false,
  variant = 'primary',
  className = '',
  disabled,
  type = 'submit',
  ...rest
}: AdminSaveButtonProps) {
  const padding = compact ? 'px-5 py-2' : 'px-8 py-2.5';
  const variantClass =
    variant === 'outline'
      ? 'bg-white border border-[#EADFD8] text-[#2B2B2B] hover:bg-[#F8F5F2] disabled:hover:bg-white'
      : 'bg-[#E6C97A] text-[#5a4a1e] hover:bg-[#D5B86A] disabled:hover:bg-[#E6C97A]';

  return (
    <button
      type={type}
      disabled={loading || disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-bold text-[13px] transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed ${variantClass} ${padding} ${className}`.trim()}
      {...rest}
    >
      {loading ? (
        <Loader2 size={iconSize} className="animate-spin shrink-0" aria-hidden />
      ) : showIcon ? (
        <Save size={iconSize} className="shrink-0" aria-hidden />
      ) : null}
      <span>{loading && loadingLabel !== undefined ? loadingLabel : children}</span>
    </button>
  );
}
