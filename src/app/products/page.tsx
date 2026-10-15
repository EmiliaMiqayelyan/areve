'use client';

import { useState, useMemo, Suspense, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import ProductCard, { ProductCardSkeleton } from '@/components/ui/ProductCard';
import PageHero from '@/components/ui/PageHero';
import SortDropdown from '@/components/ui/SortDropdown';
import SunMark from '@/components/ui/SunMark';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { useTranslation } from '@/i18n/I18nProvider';
import { pickLocalized } from '@/lib/localizedText';
import { matchesProductQuery } from '@/lib/productSearch';
import { useCategoriesQuery, useProductsQuery } from '@/lib/useProductsQuery';
import type { Product } from '@/lib/store';

type CategoryOption = { id: string; label: string; count: number };
type SortKey = 'default' | 'price-asc' | 'price-desc';

const PAGE_SIZE = 12;

function ProductsContent() {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const { settings } = useSiteSettings();
  const pg = settings.siteContent.pages.shop;
  const L = settings.siteContent.productCategoryLabels;
  const sp = useSearchParams();
  const [cat, setCat] = useState(sp.get('category') || 'all');
  const [query, setQuery] = useState(sp.get('q') || '');
  const [sort, setSort] = useState<SortKey>('default');
  const [page, setPage] = useState(1);

  const {
    data: productList = [],
    isLoading: productsLoading,
    isError: productsError,
  } = useProductsQuery({ active: true });

  const { data: categoryRows = [], isLoading: categoriesLoading } = useCategoriesQuery();

  const loading = productsLoading || categoriesLoading;
  const loadError = productsError;

  useEffect(() => {
    setCat(sp.get('category') || 'all');
    setQuery(sp.get('q') || '');
    setPage(1);
  }, [sp]);

  const updateParams = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(sp.toString());
      mutate(params);
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, sp]
  );

  const setCategory = useCallback(
    (next: string) => {
      setCat(next);
      setPage(1);
      updateParams((params) => {
        if (next === 'all') params.delete('category');
        else params.set('category', next);
      });
    },
    [updateParams]
  );

  const clearQuery = useCallback(() => {
    setQuery('');
    setPage(1);
    updateParams((params) => params.delete('q'));
  }, [updateParams]);

  const setSortAndReset = useCallback((next: SortKey) => {
    setSort(next);
    setPage(1);
  }, []);

  const labels = useMemo(() => {
    const map: Record<string, string> = {};
    for (const row of categoryRows) {
      map[row.id] = typeof row.name === 'string' ? row.name : pickLocalized(row.name, locale);
    }
    return map;
  }, [categoryRows, locale]);

  const searched = useMemo(
    () => (query.trim() ? productList.filter((p) => matchesProductQuery(p, query, locale, labels[p.category])) : productList),
    [productList, query, locale, labels]
  );

  const catOptions = useMemo<CategoryOption[]>(() => {
    const counts: Record<string, number> = {};
    for (const p of searched) counts[p.category] = (counts[p.category] ?? 0) + 1;
    const rows = categoryRows
      .map((row) => ({ id: row.id, label: labels[row.id] ?? row.id, count: counts[row.id] ?? 0 }))
      .filter((row) => row.count > 0 || row.id === cat);
    return [{ id: 'all', label: L.all, count: searched.length }, ...rows];
  }, [categoryRows, labels, searched, cat, L.all]);

  const activeCategoryLabel = cat === 'all' ? '' : labels[cat] ?? cat;

  const filtered = useMemo(() => {
    let list: Product[] = cat === 'all' ? searched : searched.filter((p) => p.category === cat);
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [cat, sort, searched]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const goToPage = (n: number) => {
    setPage(n);
    if (typeof window !== 'undefined') {
      document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const shopCrumb = { label: pg.title, href: activeCategoryLabel ? '/products' : undefined };
  const breadcrumb = [
    { label: t('common.home'), href: '/' },
    shopCrumb,
    ...(activeCategoryLabel ? [{ label: activeCategoryLabel }] : []),
  ];

  return (
    <div className="min-h-screen">
      <PageHero
        variant="shop"
        eyebrow={pg.eyebrow}
        title={activeCategoryLabel || pg.title}
        subtitle={activeCategoryLabel ? undefined : pg.subtitle}
        breadcrumb={breadcrumb}
      />

      <div className="sticky top-[var(--header-h)] z-30 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="wrap flex items-center gap-4">
          <div className="no-scrollbar -ml-[var(--container-px)] flex min-w-0 flex-1 gap-6 overflow-x-auto pl-[var(--container-px)] sm:gap-8" role="tablist" aria-label={t('shop.filterCategory')}>
            {(loading ? [] : catOptions).map((option) => {
              const active = option.id === cat;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setCategory(option.id)}
                  className={`relative shrink-0 cursor-pointer whitespace-nowrap border-none bg-transparent py-4 text-[14px] transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:bg-primary after:transition-transform ${
                    active ? 'text-text after:scale-x-100' : 'text-muted after:scale-x-0 hover:text-text'
                  }`}
                >
                  {option.label}
                  <sup className="ml-1 text-[10px] tabular-nums text-muted">{option.count}</sup>
                </button>
              );
            })}
            {loading && <div className="skeleton my-4 h-4 w-72" aria-hidden />}
          </div>
          <div className="shrink-0 border-l border-border py-2 pl-3 sm:pl-4">
            <SortDropdown
              value={sort}
              onChange={setSortAndReset}
              ariaLabel={t('shop.filterSort')}
              options={[
                { value: 'default', label: t('shop.sortFeatured') },
                { value: 'price-asc', label: t('shop.sortPriceAsc') },
                { value: 'price-desc', label: t('shop.sortPriceDesc') },
              ]}
            />
          </div>
        </div>
      </div>

      <div id="catalog" className="wrap scroll-mt-[calc(var(--header-h)+64px)] pb-20 pt-6 sm:pt-8 lg:pb-28">
        {loadError && !loading && (
          <div className="mb-6 border border-border bg-surface px-4 py-3 text-center text-[14px] text-text">
            {t('common.apiUnavailable')}
          </div>
        )}

        <div className="mb-6 flex flex-wrap items-center gap-3 text-[13px] text-muted sm:mb-8">
          {!loading && (
            <span>
              <span className="tabular-nums text-text">{filtered.length}</span>{' '}
              {filtered.length === 1 ? t('common.product') : t('common.products')}
            </span>
          )}
          {query.trim() && (
            <button
              type="button"
              onClick={clearQuery}
              className="inline-flex cursor-pointer items-center gap-2 border border-border bg-surface px-3 py-1.5 text-[12.5px] text-text transition-colors hover:border-text"
              aria-label={t('shop.clearSearch')}
            >
              {t('shop.searchFor', { q: query.trim() })}
              <X size={13} strokeWidth={1.6} />
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 sm:gap-y-12 md:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            <motion.div
              key={`${cat}-${sort}-${currentPage}-${query}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 sm:gap-y-12 md:grid-cols-3 xl:grid-cols-4"
            >
              {paged.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} priority={i < 4} />
              ))}
            </motion.div>

            {filtered.length === 0 && (
              <div className="flex flex-col items-center py-20 text-center">
                <SunMark className="mb-6 w-16 text-primary" strokeWidth={1.4} />
                <p className="font-display text-[22px] text-text">{t('common.noProductsFound')}</p>
                {(query.trim() || cat !== 'all') && (
                  <button
                    type="button"
                    onClick={() => {
                      clearQuery();
                      setCategory('all');
                    }}
                    className="btn-outline mt-6"
                  >
                    {t('shop.showAll')}
                  </button>
                )}
              </div>
            )}

            {filtered.length > PAGE_SIZE && (
              <nav aria-label="Pagination" className="mt-16 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => goToPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage <= 1}
                  className="inline-flex h-10 cursor-pointer items-center gap-1.5 border border-border bg-transparent px-4 text-[13px] text-text transition-colors hover:border-text disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={15} strokeWidth={1.5} />
                  <span className="hidden sm:inline">{t('shop.prevPage')}</span>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => goToPage(n)}
                    aria-current={n === currentPage ? 'page' : undefined}
                    className={`h-10 min-w-10 cursor-pointer px-3 text-[13px] tabular-nums transition-colors ${
                      n === currentPage
                        ? 'border border-secondary bg-secondary text-background'
                        : 'border border-border bg-transparent text-text hover:border-text'
                    }`}
                  >
                    {n}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage >= totalPages}
                  className="inline-flex h-10 cursor-pointer items-center gap-1.5 border border-border bg-transparent px-4 text-[13px] text-text transition-colors hover:border-text disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span className="hidden sm:inline">{t('shop.nextPage')}</span>
                  <ChevronRight size={15} strokeWidth={1.5} />
                </button>
              </nav>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="wrap grid min-h-screen grid-cols-2 gap-x-3 gap-y-10 pt-32 md:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
