'use client';

import type { LocalizedText } from '@/lib/localizedText';
import { parseLocalized } from '@/lib/localizedText';

type Props = {
  label: string;
  value: LocalizedText | string | undefined;
  onChange: (value: LocalizedText) => void;
  multiline?: boolean;
  required?: boolean;
  hyPlaceholder?: string;
  enPlaceholder?: string;
  rows?: number;
};

export default function BilingualField({
  label,
  value,
  onChange,
  multiline = false,
  required = false,
  hyPlaceholder,
  enPlaceholder,
  rows = 4,
}: Props) {
  const v =
    value && typeof value === 'object' && 'hy' in value && 'en' in value
      ? { hy: String(value.hy ?? ''), en: String(value.en ?? '') }
      : parseLocalized(value);

  const update = (locale: 'hy' | 'en', text: string) => {
    onChange({ ...v, [locale]: text });
  };

  const InputTag = multiline ? 'textarea' : 'input';

  return (
    <div className="space-y-3">
      <label className="text-[12px] font-bold text-[#7A7A7A] uppercase tracking-wider">{label}</label>
      <div className="space-y-1.5">
        <span className="text-[10px] font-bold text-[#AFAFAF] uppercase tracking-wider">Հայերեն</span>
        <InputTag
          required={required}
          value={v.hy}
          onChange={(e) => update('hy', e.target.value)}
          placeholder={hyPlaceholder}
          rows={multiline ? rows : undefined}
          className="w-full bg-[#F8F5F2] border border-[#EADFD8] rounded-xl py-2.5 px-4 text-[14px] text-[#2B2B2B] placeholder-[#AFAFAF] focus:outline-none focus:ring-2 focus:ring-[#E6C97A]/50 transition-shadow resize-none"
        />
      </div>
      <div className="space-y-1.5">
        <span className="text-[10px] font-bold text-[#AFAFAF] uppercase tracking-wider">English</span>
        <InputTag
          value={v.en}
          onChange={(e) => update('en', e.target.value)}
          placeholder={enPlaceholder}
          rows={multiline ? rows : undefined}
          className="w-full bg-[#F8F5F2] border border-[#EADFD8] rounded-xl py-2.5 px-4 text-[14px] text-[#2B2B2B] placeholder-[#AFAFAF] focus:outline-none focus:ring-2 focus:ring-[#E6C97A]/50 transition-shadow resize-none"
        />
      </div>
    </div>
  );
}
