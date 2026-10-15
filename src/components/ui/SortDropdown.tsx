'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

type SortOption<T extends string> = {
  value: T;
  label: string;
};

type Props<T extends string> = {
  value: T;
  onChange: (value: T) => void;
  options: SortOption<T>[];
  className?: string;
  menuAlign?: 'left' | 'right';
  variant?: 'pill' | 'field';
  ariaLabel?: string;
};

export default function SortDropdown<T extends string>({
  value,
  onChange,
  options,
  className = '',
  menuAlign = 'right',
  variant = 'pill',
  ariaLabel,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onOutside);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onOutside);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const isField = variant === 'field';

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={ariaLabel ? `${ariaLabel}: ${selected?.label ?? ''}` : undefined}
        className={`flex w-full cursor-pointer items-center justify-between gap-2 text-[13.5px] text-text transition-colors ${
          isField
            ? 'min-h-[46px] rounded-[2px] border border-border bg-white px-4 hover:border-text'
            : 'min-h-[40px] border-none bg-transparent px-1 hover:text-primary-deep'
        }`}
      >
        <span className="truncate">{selected?.label}</span>
        <ChevronDown
          size={15}
          strokeWidth={1.5}
          className={`shrink-0 text-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className={`absolute top-[calc(100%+8px)] z-[200] w-max min-w-full max-w-[min(100vw-2rem,320px)] border border-border bg-background py-1.5 shadow-[0_18px_40px_-20px_rgba(21,18,15,0.3)] ${
            menuAlign === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {options.map((opt) => {
            const active = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`flex w-full cursor-pointer items-center justify-between gap-6 border-none px-4 py-2.5 text-left text-[13.5px] transition-colors ${
                  active ? 'bg-surface text-text' : 'bg-transparent text-muted hover:bg-surface hover:text-text'
                }`}
              >
                {opt.label}
                {active && <Check size={14} strokeWidth={1.6} className="text-primary-deep" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
