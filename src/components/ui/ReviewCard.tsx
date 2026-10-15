'use client';

import { Star } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import { useTranslation } from '@/i18n/I18nProvider';
import { pickLocalized } from '@/lib/localizedText';

interface Review {
  id: string;
  name: string;
  location: string;
  comment: string;
  rating: number;
  product?: string;
}

export default function ReviewCard({ review, index = 0 }: { review: Review; index?: number }) {
  const { locale } = useTranslation();
  const comment = pickLocalized(review.comment, locale);
  const productLabel = review.product ? pickLocalized(review.product, locale) : '';
  const rating = Math.max(0, Math.min(5, Math.round(Number(review.rating) || 0)));

  return (
    <Reveal delay={Math.min(index * 0.06, 0.3)} className="flex h-full flex-col border border-border bg-white p-6 sm:p-7">
      <div className="flex gap-1 text-primary" aria-label={`${rating} / 5`}>
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
        ))}
      </div>
      <p className="mt-5 flex-1 font-display text-[16px] leading-relaxed text-text">&ldquo;{comment}&rdquo;</p>
      {productLabel && (
        <p className="mt-4 text-[11px] uppercase tracking-[0.14em] text-primary-deep">{productLabel}</p>
      )}
      <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary font-display text-[15px] text-accent">
          {review.name?.[0] ?? '·'}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[14px] font-medium text-text">{review.name}</p>
          {review.location && <p className="truncate text-[12px] text-muted">{review.location}</p>}
        </div>
      </div>
    </Reveal>
  );
}
