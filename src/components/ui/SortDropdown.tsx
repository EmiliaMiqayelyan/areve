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
};

export default function SortDropdown<T extends string>({ value, onChange, options }: Props<T>) {
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

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex min-w-[168px] items-center justify-between gap-3 rounded-full border border-beige bg-white py-2.5 pl-4 pr-3 font-sans text-[13px] font-medium text-subtle shadow-[0_2px_12px_rgba(180,156,140,0.08)] transition-all hover:border-gold/40 hover:text-ink"
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
          className="absolute right-0 top-[calc(100%+8px)] z-50 min-w-full overflow-hidden rounded-2xl border border-beige bg-white py-1.5 shadow-[0_12px_40px_rgba(180,156,140,0.18)]"
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
