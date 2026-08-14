'use client';

import { useState, useMemo, Suspense, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, SlidersHorizontal, Tags } from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';
import PageHero from '@/components/ui/PageHero';
import SortDropdown from '@/components/ui/SortDropdown';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { useTranslation } from '@/i18n/I18nProvider';
import { pickLocalized } from '@/lib/localizedText';
import { useCategoriesQuery, useProductsQuery } from '@/lib/useProductsQuery';
import type { Product } from '@/lib/store';

type CategoryOption = { id: string; label: string };

const PAGE_SIZE = 12;

function ProductsContent() {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const { settings } = useSiteSettings();
  const pg = settings.siteContent.pages.shop;
  const L = settings.siteContent.productCategoryLabels;
  const sp = useSearchParams();
  const initialCategory = sp.get('category') || 'all';
  const [cat, setCat] = useState(initialCategory);
  const [sort, setSort] = useState<'default' | 'price-asc' | 'price-desc'>('default');
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
    const category = sp.get('category') || 'all';
    setCat(category);
    setPage(1);
  }, [sp]);

  const setCategory = useCallback(
    (next: string) => {
      setCat(next);
      setPage(1);
      const params = new URLSearchParams(sp.toString());
      if (next === 'all') params.delete('category');
      else params.set('category', next);
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, sp]
  );

  const setSortAndReset = useCallback((next: 'default' | 'price-asc' | 'price-desc') => {
    setSort(next);
    setPage(1);
  }, []);

  const categories = useMemo<CategoryOption[]>(
    () =>
      categoryRows.map((row) => ({
        id: row.id,
        label: typeof row.name === 'string' ? row.name : pickLocalized(row.name, locale),
      })),
    [categoryRows, locale]
  );

  const catOptions = useMemo<CategoryOption[]>(
    () => [{ id: 'all', label: L.all }, ...categories],
    [categories, L.all]
  );

  const activeCategoryLabel = catOptions.find((item) => item.id === cat)?.label ?? cat;

  const filtered = useMemo(() => {
    let list: Product[] = cat === 'all' ? productList : productList.filter((p) => p.category === cat);
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list = [...list].sort((a, b) => a.price - b.price);
    return list;
  }, [cat, sort, productList]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return (
    <div style={{ minHeight: '100vh', paddingTop: 68 }}>
      <PageHero
        variant="shop"
        eyebrow={pg.eyebrow}
        title={pg.title}
        subtitle={pg.subtitle}
      />

      <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 sm:py-12" style={{ paddingLeft: 'var(--container-px)', paddingRight: 'var(--container-px)' }}>
        {loadError && !loading && (
          <div className="mb-6 rounded-xl border border-rose/60 bg-rose/30 px-4 py-3 text-center font-sans text-sm text-ink">
            {t('common.apiUnavailable')}
          </div>
        )}
        <div className="relative z-20 mb-8 rounded-[22px] border border-beige bg-white shadow-[0_4px_28px_rgba(180,156,140,0.08)]">
          <div className="grid grid-cols-1 gap-5 overflow-visible p-4 sm:p-5 md:grid-cols-2">
            <div className="relative z-30 space-y-2">
              <span className="flex items-center gap-2 font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
                <Tags size={13} className="text-gold" />
                {t('shop.filterCategory')}
              </span>
              <SortDropdown
                value={cat}
                onChange={setCategory}
                variant="field"
                options={catOptions.map((option) => ({ value: option.id, label: option.label }))}
                className="w-full"
                menuAlign="left"
              />
            </div>
            <div className="relative z-20 space-y-2">
              <span className="flex items-center gap-2 font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
                <SlidersHorizontal size={13} className="text-gold" />
                {t('shop.filterSort')}
              </span>
              <SortDropdown
                value={sort}
                onChange={setSortAndReset}
                variant="field"
                options={[
                  { value: 'default', label: t('shop.sortFeatured') },
                  { value: 'price-asc', label: t('shop.sortPriceAsc') },
                  { value: 'price-desc', label: t('shop.sortPriceDesc') },
                ]}
                className="w-full"
                menuAlign="left"
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-beige bg-ivory/60 px-4 py-3 sm:px-5">
            <p className="font-sans text-[13px] text-subtle">
              <span className="font-serif text-base font-medium text-heading">{filtered.length}</span>
              {' '}
              {filtered.length === 1 ? t('common.product') : t('common.products')}
            </p>
            {cat !== 'all' && (
              <p className="font-sans text-[12px] text-muted">
                {activeCategoryLabel}
              </p>
            )}
          </div>
        </div>

        {loading ? (
          <div className="py-10 text-center font-sans text-[#AFAFAF]">
            {t('common.loadingProducts')}
          </div>
        ) : (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${cat}-${sort}-${currentPage}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="grid grid-cols-1 gap-5 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              >
                {paged.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </motion.div>
            </AnimatePresence>

            {filtered.length === 0 && (
              <div className="py-10 text-center font-sans text-[#AFAFAF]">
                {t('common.noProductsFound')}
              </div>
            )}

            {filtered.length > PAGE_SIZE && (
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#EADFD8] bg-white px-4 py-2 font-sans text-[12px] font-medium text-[#2B2B2B] transition-colors hover:border-[#E6C97A] disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label={t('shop.prevPage')}
                >
                  <ChevronLeft size={15} strokeWidth={1.8} />
                  {t('shop.prevPage')}
                </button>

                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setPage(n)}
                      aria-current={n === currentPage ? 'page' : undefined}
                      className={`flex h-9 min-w-9 items-center justify-center rounded-full px-2.5 font-sans text-[13px] transition-colors ${
                        n === currentPage
                          ? 'bg-[#E6C97A] font-semibold text-[#5a4a1e]'
                          : 'border border-[#EADFD8] bg-white text-[#7A7A7A] hover:border-[#E6C97A] hover:text-[#2B2B2B]'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#EADFD8] bg-white px-4 py-2 font-sans text-[12px] font-medium text-[#2B2B2B] transition-colors hover:border-[#E6C97A] disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label={t('shop.nextPage')}
                >
                  {t('shop.nextPage')}
                  <ChevronRight size={15} strokeWidth={1.8} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', paddingTop: 100, textAlign: 'center', fontFamily: 'var(--font-sans)', color: '#AFAFAF' }}>Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
