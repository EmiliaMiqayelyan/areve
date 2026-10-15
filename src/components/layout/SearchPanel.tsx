'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, Search, X } from 'lucide-react';
import StoreImage from '@/components/ui/StoreImage';
import { useTranslation } from '@/i18n/I18nProvider';
import { formatPrice } from '@/lib/currency';
import { pickLocalized } from '@/lib/localizedText';
import { resolveProductImageSrc } from '@/lib/productImage';
import { publicProductPath } from '@/lib/resourceId';
import { useCategoryLabels } from '@/lib/useCatalog';
import { useProductsQuery } from '@/lib/useProductsQuery';
import { matchesProductQuery } from '@/lib/productSearch';

export default function SearchPanel({ onClose }: { onClose: () => void }) {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const labels = useCategoryLabels();
  const { data: products = [] } = useProductsQuery({ active: true });

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const trimmed = query.trim();
  const results = useMemo(() => {
    if (trimmed.length < 2) return [];
    return products
      .filter((p) => matchesProductQuery(p, trimmed, locale, labels[p.category]))
      .slice(0, 6);
  }, [products, trimmed, locale, labels]);

  const submit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!trimmed) return;
    router.push(`/products?q=${encodeURIComponent(trimmed)}`);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-x-0 top-full border-b border-border bg-background shadow-[0_24px_40px_-28px_rgba(21,18,15,0.35)]"
    >
      <div className="wrap py-5 sm:py-6">
        <form onSubmit={submit} role="search" className="flex items-center gap-3 border-b border-text pb-3">
          <Search size={20} strokeWidth={1.4} className="shrink-0 text-muted" aria-hidden />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('header.searchPlaceholder')}
            aria-label={t('header.search')}
            className="min-w-0 flex-1 border-none bg-transparent font-display text-[18px] text-text outline-none placeholder:text-muted/70 sm:text-[22px]"
          />
          <button type="button" onClick={onClose} className="icon-btn -mr-2 shrink-0" aria-label={t('header.close')}>
            <X size={20} strokeWidth={1.4} />
          </button>
        </form>

        {trimmed.length >= 2 && (
          <div className="pt-4">
            {results.length === 0 ? (
              <p className="py-3 text-[14px] text-muted">{t('header.searchEmpty')}</p>
            ) : (
              <>
                <ul className="grid grid-cols-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
                  {results.map((p) => {
                    const name = pickLocalized(p.name, locale);
                    const src = resolveProductImageSrc(p.image);
                    return (
                      <li key={p.id}>
                        <Link
                          href={publicProductPath(p.id)}
                          onClick={onClose}
                          className="flex items-center gap-4 py-2.5 no-underline transition-colors hover:text-primary-deep"
                        >
                          <span className="relative block h-16 w-12 shrink-0 overflow-hidden bg-surface-deep">
                            {src && <StoreImage src={src} alt="" fill />}
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-[14px] text-text">{name}</span>
                            <span className="block text-[12px] text-muted">{labels[p.category]}</span>
                            <span className="price block text-[13px] text-text">{formatPrice(p.price)}</span>
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <button type="button" onClick={submit} className="link-underline mt-4 cursor-pointer border-none bg-transparent">
                  {t('header.searchSubmit')} <ArrowRight size={14} />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
