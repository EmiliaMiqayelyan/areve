'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export type AdminSelectOption = {
  value: string;
  label: string;
};

type Props = {
  value: string;
  onChange: (value: string) => void;
  options: AdminSelectOption[];
  placeholder?: string;
  label?: string;
  className?: string;
  compact?: boolean;
  menuAlign?: 'left' | 'right';
};

export default function AdminSelect({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  label,
  className = '',
  compact = false,
  menuAlign = 'right',
}: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      {label ? (
        <p className="text-[10px] font-bold text-[#AFAFAF] uppercase tracking-[0.2em] mb-2">{label}</p>
      ) : null}

      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => setOpen((current) => !current)}
        className={`flex w-full items-center justify-between gap-2 border bg-[#F8F5F2] text-left transition-all ${
          compact ? 'min-w-[132px] rounded-full px-3 py-1.5' : 'min-w-[220px] rounded-xl px-4 py-2.5 gap-3'
        } ${
          open
            ? 'border-[#E6C97A] ring-2 ring-[#E6C97A]/30'
            : 'border-[#EADFD8] hover:border-[#D6C3B3]'
        }`}
      >
        <span className={`${compact ? 'text-[12px] font-bold uppercase tracking-wide' : 'text-[13px]'} ${selected ? 'text-[#2B2B2B] font-medium' : 'text-[#AFAFAF]'}`}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          size={compact ? 14 : 16}
          className={`shrink-0 text-[#AFAFAF] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open ? (
        <ul
          id={listboxId}
          role="listbox"
          className={`absolute z-30 mt-2 max-h-64 min-w-full overflow-auto rounded-2xl border border-[#EADFD8] bg-white p-1.5 shadow-[0_16px_40px_rgba(180,156,140,0.18)] ${
            menuAlign === 'left' ? 'left-0' : 'right-0'
          }`}
        >
          {options.map((option) => {
            const active = option.value === value;
            return (
              <li key={option.value} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left text-[13px] transition-colors ${
                    active
                      ? 'bg-[#E6C97A]/20 text-[#5a4a1e] font-semibold'
                      : 'text-[#2B2B2B] hover:bg-[#F8F5F2]'
                  }`}
                >
                  <span>{option.label}</span>
                  {active ? <Check size={15} className="shrink-0 text-[#C9A84C]" /> : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
