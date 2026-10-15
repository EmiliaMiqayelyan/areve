'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard, { ProductCardSkeleton } from '@/components/ui/ProductCard';
import SectionHeader from '@/components/ui/SectionHeader';
import { useTranslation } from '@/i18n/I18nProvider';
import type { Product } from '@/lib/store';

type Props = {
  eyebrow: string;
  title: string;
  viewAllLabel: string;
  products: Product[];
  loading: boolean;
};

const ITEM_CLASS = 'w-[62%] shrink-0 snap-start sm:w-[40%] md:w-[30%] lg:w-[calc((100%-60px)/4)]';

export default function ProductRail({ eyebrow, title, viewAllLabel, products, loading }: Props) {
  const { t } = useTranslation();
  const scroller = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const updateEdges = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    setEdges({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    updateEdges();
    const el = scroller.current;
    if (!el) return;
    el.addEventListener('scroll', updateEdges, { passive: true });
    window.addEventListener('resize', updateEdges);
    return () => {
      el.removeEventListener('scroll', updateEdges);
      window.removeEventListener('resize', updateEdges);
    };
  }, [updateEdges, products.length]);

  const scrollBy = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: 'smooth' });
  };

  if (!loading && products.length === 0) return null;

  return (
    <section className="section bg-surface">
      <div className="wrap">
        <SectionHeader
          eyebrow={eyebrow}
          title={title}
          action={
            <div className="flex items-center gap-5">
              <Link href="/products" className="link-underline">
                {viewAllLabel} <ArrowRight size={14} />
              </Link>
              <div className="hidden items-center gap-2 md:flex">
                <button
                  type="button"
                  onClick={() => scrollBy(-1)}
                  disabled={edges.start}
                  aria-label={t('common.previous')}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center border border-text/80 bg-transparent text-text transition-colors hover:bg-text hover:text-background disabled:cursor-default disabled:border-border disabled:text-muted disabled:hover:bg-transparent"
                >
                  <ChevronLeft size={17} strokeWidth={1.4} />
                </button>
                <button
                  type="button"
                  onClick={() => scrollBy(1)}
                  disabled={edges.end}
                  aria-label={t('common.next')}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center border border-text/80 bg-transparent text-text transition-colors hover:bg-text hover:text-background disabled:cursor-default disabled:border-border disabled:text-muted disabled:hover:bg-transparent"
                >
                  <ChevronRight size={17} strokeWidth={1.4} />
                </button>
              </div>
            </div>
          }
        />

        <div
          ref={scroller}
          className="no-scrollbar -mx-[var(--container-px)] flex snap-x snap-mandatory scroll-px-[var(--container-px)] gap-3 overflow-x-auto px-[var(--container-px)] pb-2 sm:gap-5"
        >
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className={ITEM_CLASS}>
                  <ProductCardSkeleton />
                </div>
              ))
            : products.map((p) => (
                <div key={p.id} className={ITEM_CLASS}>
                  <ProductCard product={p} />
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
