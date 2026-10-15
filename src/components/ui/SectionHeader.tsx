'use client';

import type { ReactNode } from 'react';
import Reveal from '@/components/ui/Reveal';

interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  titleSize?: 'default' | 'compact';
  action?: ReactNode;
  className?: string;
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  centered = false,
  titleSize = 'default',
  action,
  className = '',
}: Props) {
  return (
    <Reveal
      className={`mb-8 flex flex-col gap-5 sm:mb-10 lg:mb-12 ${
        centered ? 'items-center text-center' : 'sm:flex-row sm:items-end sm:justify-between'
      } ${className}`}
    >
      <div className={centered ? 'mx-auto max-w-2xl' : 'max-w-2xl'}>
        {eyebrow && <p className={`eyebrow mb-3 ${centered ? '' : 'eyebrow-line'}`}>{eyebrow}</p>}
        <h2 className={titleSize === 'compact' ? 'text-[clamp(1.35rem,2.2vw,1.75rem)]' : 'section-title'}>{title}</h2>
        {subtitle && (
          <p className={`mt-3 max-w-xl text-[15px] leading-relaxed text-muted ${centered ? 'mx-auto' : ''}`}>{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </Reveal>
  );
}
