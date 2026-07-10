'use client';

import { useState, useMemo, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, Tags } from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';
import PageHero from '@/components/ui/PageHero';
import SortDropdown from '@/components/ui/SortDropdown';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { useTranslation } from '@/i18n/I18nProvider';
import { useLocaleApiFetch } from '@/lib/useLocaleApi';
import { pickLocalized } from '@/lib/localizedText';
import type { Product } from '@/lib/store';

type CategoryOption = { id: string; label: string };

function ProductsContent() {
  const { t, locale } = useTranslation();
  const localeFetch = useLocaleApiFetch();
  const { settings } = useSiteSettings();
  const pg = settings.siteContent.pages.shop;
  const L = settings.siteContent.productCategoryLabels;
  const sp = useSearchParams();
  const initialCategory = sp.get('category') || 'all';
  const [cat, setCat] = useState(initialCategory);
  const [sort, setSort] = useState<'default' | 'price-asc' | 'price-desc'>('default');
  const [productList, setProductList] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setLoadError(false);
    void Promise.all([
      localeFetch<Product[]>('/products?active=true'),
      localeFetch<Array<{ id: string; name: string }>>('/categories'),
    ])
      .then(([products, categoryRows]) => {
        setProductList(products);
        setCategories(
          categoryRows.map((row) => ({
            id: row.id,
            label: typeof row.name === 'string' ? row.name : pickLocalized(row.name, locale),
          }))
        );
      })
      .catch(() => {
        setProductList([]);
        setCategories([]);
        setLoadError(true);
      })
      .finally(() => setLoading(false));
  }, [locale, localeFetch]);

  const catOptions = useMemo<CategoryOption[]>(
    () => [{ id: 'all', label: L.all }, ...categories],
    [categories, L.all]
  );

  const activeCategoryLabel = catOptions.find((item) => item.id === cat)?.label ?? cat;

  const filtered = useMemo(() => {
    let list = cat === 'all' ? productList : productList.filter((p) => p.category === cat);
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [cat, sort, productList]);

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
        {loading && (
          <div className="py-10 text-center font-sans text-[#AFAFAF]">
            {t('common.loadingProducts')}
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
                onChange={setCat}
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
                onChange={setSort}
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

        <AnimatePresence mode="wait">
          <motion.div key={cat} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}
            className="grid grid-cols-1 gap-5 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </motion.div>
        </AnimatePresence>

        {!loading && filtered.length === 0 && (
          <div className="py-10 text-center font-sans text-[#AFAFAF]">
            {t('common.noProductsFound')}
          </div>
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
