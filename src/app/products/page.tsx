'use client';

import { useState, useMemo, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal } from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';
import SectionHeader from '@/components/ui/SectionHeader';
import SortDropdown from '@/components/ui/SortDropdown';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { useTranslation } from '@/i18n/I18nProvider';
import { useLocaleApiFetch } from '@/lib/useLocaleApi';

type Category = 'all' | 'bags' | 'toys' | 'accessories';

function ProductsContent() {
  const { t, locale } = useTranslation();
  const localeFetch = useLocaleApiFetch();
  const { settings } = useSiteSettings();
  const pg = settings.siteContent.pages.shop;
  const L = settings.siteContent.productCategoryLabels;
  const catLabels: Record<Category, string> = {
    all: L.all,
    bags: L.bags,
    toys: L.toys,
    accessories: L.accessories,
  };
  const sp = useSearchParams();
  const [cat, setCat] = useState<Category>((sp.get('category') as Category) || 'all');
  const [sort, setSort] = useState<'default' | 'price-asc' | 'price-desc'>('default');
  const [productList, setProductList] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setLoadError(false);
    void localeFetch<any[]>('/products?active=true')
      .then(setProductList)
      .catch(() => {
        setProductList([]);
        setLoadError(true);
      })
      .finally(() => setLoading(false));
  }, [locale, localeFetch]);

  const filtered = useMemo(() => {
    let list = cat === 'all' ? productList : productList.filter(p => p.category === cat);
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [cat, sort, productList]);

  return (
    <div style={{ minHeight: '100vh', paddingTop: 68 }}>
      <div style={{ background: '#EADFD8', padding: 'var(--section-padding)', borderBottom: '1px solid #D6C3B3' }}>
        <div className="mx-auto max-w-[1280px]">
          <SectionHeader eyebrow={pg.eyebrow} title={pg.title} subtitle={pg.subtitle} centered />
        </div>
      </div>

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
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {(Object.keys(catLabels) as Category[]).map(c => (
              <button key={c} onClick={() => setCat(c)}
                className={`px-5 py-2 rounded-full font-sans text-[13px] font-medium transition-all cursor-pointer border-none ${cat === c ? 'bg-gold text-[#5a4a1e] shadow-[0_2px_12px_#E6C97A55]' : 'bg-white text-subtle shadow-[0_1px_4px_rgba(180,156,140,0.12)]'
                  }`}
              >
                {catLabels[c]}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2.5">
            <SlidersHorizontal size={15} className="text-[#AFAFAF]" />
            <SortDropdown
              value={sort}
              onChange={setSort}
              options={[
                { value: 'default', label: t('shop.sortFeatured') },
                { value: 'price-asc', label: t('shop.sortPriceAsc') },
                { value: 'price-desc', label: t('shop.sortPriceDesc') },
              ]}
            />
          </div>
        </div>

        <p className="mb-8 font-sans text-[13px] text-[#AFAFAF]">
          {filtered.length} {filtered.length === 1 ? t('common.product') : t('common.products')}{cat !== 'all' ? ` ${t('common.in')} ${catLabels[cat]}` : ''}
        </p>

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
