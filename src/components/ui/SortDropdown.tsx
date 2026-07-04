'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

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
};

export default function SortDropdown<T extends string>({
  value,
  onChange,
  options,
  className = '',
  menuAlign = 'right',
  variant = 'pill',
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  const isField = variant === 'field';

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={`flex w-full items-center justify-between gap-3 border font-sans text-[13px] font-medium transition-all ${
          isField
            ? 'min-h-[46px] rounded-xl border-beige bg-ivory py-2.5 pl-4 pr-3 text-ink shadow-none hover:border-gold/50'
            : 'min-w-[168px] rounded-full border-beige bg-white py-2.5 pl-4 pr-3 text-subtle shadow-[0_2px_12px_rgba(180,156,140,0.08)] hover:border-gold/40 hover:text-ink'
        } ${open ? 'border-gold/60 ring-2 ring-gold/15' : ''}`}
      >
        <span className="truncate">{selected?.label}</span>
        <ChevronDown
          size={15}
          className={`shrink-0 text-[#AFAFAF] transition-transform duration-200 ${open ? 'rotate-180 text-gold' : ''}`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className={`absolute top-[calc(100%+8px)] z-[200] min-w-full w-max max-w-[min(100vw-2rem,360px)] max-h-[min(60vh,320px)] overflow-y-auto rounded-2xl border border-beige bg-white py-1.5 shadow-[0_12px_40px_rgba(180,156,140,0.18)] ${
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
                className={`w-full cursor-pointer border-none px-4 py-2.5 text-left font-sans text-[13px] transition-colors ${
                  active
                    ? 'bg-gold/20 font-semibold text-[#5a4a1e]'
                    : 'bg-white text-subtle hover:bg-ivory hover:text-ink'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
