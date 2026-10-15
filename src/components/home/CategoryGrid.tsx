'use client';

import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import SectionHeader from '@/components/ui/SectionHeader';
import StoreImage from '@/components/ui/StoreImage';
import SunMark from '@/components/ui/SunMark';
import { resolveProductImageSrc } from '@/lib/productImage';
import type { CatalogCategory } from '@/lib/useCatalog';

type Copy = { eyebrow: string; title: string; allTitle: string; allText: string; countLabel: string };

const LG_SPAN: Record<number, string> = {
  1: 'lg:col-span-1',
  2: 'lg:col-span-2',
  3: 'lg:col-span-3',
  4: 'lg:col-span-4',
};

function CategoryTile({
  category,
  countLabel,
  featured = false,
}: {
  category: CatalogCategory;
  countLabel: string;
  featured?: boolean;
}) {
  const src = resolveProductImageSrc(category.cover?.image);
  return (
    <Link
      href={`/products?category=${encodeURIComponent(category.id)}`}
      className={`group relative block overflow-hidden bg-surface-deep no-underline ${
        featured ? 'aspect-[4/3] lg:aspect-auto lg:h-full' : 'aspect-[4/5]'
      }`}
    >
      {src && (
        <StoreImage
          src={src}
          alt=""
          fill
          className="transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
        />
      )}
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-secondary/70 via-secondary/20 to-transparent" />
      <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-5 lg:p-6">
        <span className="min-w-0">
          <span className={`block font-display leading-tight text-background ${featured ? 'text-[22px] sm:text-[28px]' : 'text-[16px] sm:text-[19px]'}`}>
            {category.label}
          </span>
          <span className="mt-1 block text-[11px] uppercase tracking-[0.14em] text-accent">
            {category.count} {countLabel}
          </span>
        </span>
        <span className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-background/40 text-background transition-colors duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-secondary sm:flex">
          <ArrowUpRight size={16} strokeWidth={1.5} />
        </span>
      </span>
    </Link>
  );
}

export default function CategoryGrid({
  categories,
  loading,
  copy,
}: {
  categories: CatalogCategory[];
  loading: boolean;
  copy: Copy;
}) {
  if (!loading && categories.length === 0) return null;

  const [lead, ...rest] = categories;
  const useLead = categories.length >= 3;
  const tiles = useLead ? rest : categories;
  const usedCells = (useLead ? 4 : 0) + tiles.length;
  const lgSpan = 4 - (usedCells % 4) || 4;
  const mobileSpan = tiles.length % 2 === 1 ? 'col-span-1' : 'col-span-2';

  return (
    <section className="section">
      <div className="wrap">
        <SectionHeader eyebrow={copy.eyebrow} title={copy.title} />

        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <div className="skeleton col-span-2 aspect-[4/3] lg:row-span-2 lg:aspect-auto" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton aspect-[4/5]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {useLead && lead && (
              <Reveal className="col-span-2 lg:row-span-2">
                <CategoryTile category={lead} countLabel={copy.countLabel} featured />
              </Reveal>
            )}
            {tiles.map((cat, i) => (
              <Reveal key={cat.id} delay={Math.min(i * 0.05, 0.25)}>
                <CategoryTile category={cat} countLabel={copy.countLabel} />
              </Reveal>
            ))}
            <Reveal className={`${mobileSpan} ${LG_SPAN[lgSpan]}`}>
              <Link
                href="/products"
                className={`group relative flex h-full flex-col justify-between overflow-hidden bg-secondary p-5 text-background no-underline sm:p-6 lg:p-8 ${
                  mobileSpan === 'col-span-1' ? 'aspect-[4/5]' : 'min-h-[180px]'
                } ${lgSpan === 1 ? 'lg:aspect-[4/5]' : 'lg:aspect-auto lg:min-h-0'}`}
              >
                <SunMark className="w-14 text-primary sm:w-16" strokeWidth={1.6} />
                <span>
                  <span className="block font-display text-[20px] leading-tight sm:text-[26px]">{copy.allTitle}</span>
                  <span className="mt-2 block max-w-[260px] text-[13px] leading-snug text-background/65">{copy.allText}</span>
                  <span className="mt-4 inline-flex items-center gap-2 text-[11.5px] font-medium uppercase tracking-[0.14em] text-accent transition-colors group-hover:text-background">
                    {copy.allTitle} <ArrowRight size={14} strokeWidth={1.5} />
                  </span>
                </span>
              </Link>
            </Reveal>
          </div>
        )}
      </div>
    </section>
  );
}
