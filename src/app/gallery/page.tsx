'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import PageHero from '@/components/ui/PageHero';
import StoreImage from '@/components/ui/StoreImage';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { useTranslation } from '@/i18n/I18nProvider';
import { pickLocalized } from '@/lib/localizedText';
import { useGalleryQuery } from '@/lib/useProductsQuery';

export default function GalleryPage() {
  const { t, locale } = useTranslation();
  const { settings } = useSiteSettings();
  const pg = settings.siteContent.pages.gallery;
  const [active, setActive] = useState<number | null>(null);
  const { data: galleryItems = [], isLoading: loading } = useGalleryQuery();

  const images = useMemo(
    () =>
      galleryItems
        .filter((img) => img.src && !String(img.src).startsWith('blob:'))
        .map((img, i) => ({
          key: img.id ?? `${i}`,
          src: img.src,
          alt: pickLocalized(img.alt, locale),
          wide: (img.cols ?? 1) > 1,
        })),
    [galleryItems, locale]
  );

  const close = useCallback(() => setActive(null), []);
  const step = useCallback(
    (dir: 1 | -1) => setActive((i) => (i === null ? i : (i + dir + images.length) % images.length)),
    [images.length]
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [active, close, step]);

  const current = active !== null ? images[active] : null;

  return (
    <div className="min-h-screen">
      <PageHero eyebrow={pg.eyebrow} title={pg.title} subtitle={pg.subtitle} />

      <div className="wrap section">
        <div className="grid auto-rows-[220px] grid-flow-dense grid-cols-2 gap-2 sm:auto-rows-[280px] sm:gap-3 md:grid-cols-3 lg:auto-rows-[320px] lg:grid-cols-4">
          {loading &&
            Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton" />)}
          {images.map((img, i) => (
            <motion.button
              key={img.key}
              type="button"
              onClick={() => setActive(i)}
              aria-label={img.alt || `${i + 1}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className={`group relative cursor-zoom-in overflow-hidden border-none bg-surface-deep p-0 ${
                img.wide ? 'md:col-span-2' : ''
              }`}
            >
              <StoreImage
                src={img.src}
                alt={img.alt}
                fill
                className="transition-transform duration-700 ease-[var(--ease-brand)] group-hover:scale-[1.04]"
              />
              {img.alt && (
                <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-secondary/60 to-transparent px-4 pb-3 pt-10 text-left text-[12px] text-background opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {img.alt}
                </span>
              )}
            </motion.button>
          ))}
        </div>

        {!loading && images.length === 0 && (
          <p className="py-10 text-center text-[14px] text-muted">{t('common.noGalleryAdmin')}</p>
        )}
      </div>

      <AnimatePresence>
        {current && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={current.alt || pg.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-secondary/95 p-4 sm:p-10"
          >
            <button
              type="button"
              onClick={close}
              aria-label={t('header.close')}
              className="icon-btn absolute right-3 top-3 z-10 text-background hover:text-accent sm:right-6 sm:top-6"
            >
              <X size={22} strokeWidth={1.4} />
            </button>
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(-1);
                  }}
                  aria-label={t('common.previous')}
                  className="icon-btn absolute left-2 top-1/2 z-10 -translate-y-1/2 bg-secondary/40 text-background hover:text-accent sm:left-6 sm:bg-transparent"
                >
                  <ChevronLeft size={26} strokeWidth={1.2} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(1);
                  }}
                  aria-label={t('common.next')}
                  className="icon-btn absolute right-2 top-1/2 z-10 -translate-y-1/2 bg-secondary/40 text-background hover:text-accent sm:right-6 sm:bg-transparent"
                >
                  <ChevronRight size={26} strokeWidth={1.2} />
                </button>
              </>
            )}
            <motion.div
              key={current.key}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative h-[78vh] w-full max-w-5xl"
            >
              <StoreImage src={current.src} alt={current.alt} fill objectFit="contain" />
            </motion.div>
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[12px] tabular-nums tracking-[0.12em] text-background/70">
              {(active ?? 0) + 1} / {images.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
