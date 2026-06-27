'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { useTranslation } from '@/i18n/I18nProvider';
import { useLocaleApiFetch } from '@/lib/useLocaleApi';
import { pickLocalized } from '@/lib/localizedText';

export default function GalleryPage() {
  const { t, locale } = useTranslation();
  const localeFetch = useLocaleApiFetch();
  const { settings } = useSiteSettings();
  const pg = settings.siteContent.pages.gallery;
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void localeFetch<any[]>('/gallery')
      .then(setGalleryItems)
      .catch(() => setGalleryItems([]))
      .finally(() => setLoading(false));
  }, [locale, localeFetch]);

  return (
    <div style={{ minHeight: '100vh', paddingTop: 68 }}>
      <div style={{ background: '#EADFD8', padding: '64px 24px 56px', borderBottom: '1px solid #D6C3B3' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <SectionHeader eyebrow={pg.eyebrow} title={pg.title} subtitle={pg.subtitle} centered />
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 24px' }}>
        {loading && (
          <div style={{ padding: '24px 0', textAlign: 'center', fontFamily: 'var(--font-sans)', color: '#AFAFAF' }}>
            {t('common.loadingGallery')}
          </div>
        )}
        {/* Masonry-like grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, gridAutoRows: '220px' }}>
          {galleryItems.map((img, i) => {
            const altText = pickLocalized(img.alt, locale);
            return (
            <motion.div key={i}
              initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: (i % 6) * 0.06 }}
              onClick={() => setLightbox(img.src)}
              style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', cursor: 'zoom-in', gridColumn: `span ${img.cols}` }}
            >
              <Image
                src={String(img.src).startsWith('blob:') ? '/images/gallery-light-1.png' : img.src}
                alt={altText}
                fill
                style={{ objectFit: 'cover', transition: 'transform 0.5s' }}
                loading="lazy"
              />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(248,245,242,0)', transition: 'background 0.3s', display: 'flex', alignItems: 'flex-end', padding: 14 }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(230,201,122,0.15)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(248,245,242,0)'; }}>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: '#2B2B2B', background: 'rgba(248,245,242,0.88)', padding: '4px 10px', borderRadius: 99, opacity: 0, transition: 'opacity 0.3s' }}
                  className="img-caption">
                  {altText}
                </p>
              </div>
            </motion.div>
          );})}
        </div>

        {!loading && galleryItems.length === 0 && (
          <div style={{ padding: '24px 0', textAlign: 'center', fontFamily: 'var(--font-sans)', color: '#AFAFAF' }}>
            Gallery is empty.
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={() => setLightbox(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(248,245,242,0.92)', backdropFilter: 'blur(8px)', zIndex: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <button onClick={() => setLightbox(null)}
            style={{ position: 'absolute', top: 24, right: 24, width: 40, height: 40, borderRadius: '50%', background: '#EADFD8', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7A7A7A' }}>
            <X size={18} />
          </button>
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} onClick={e => e.stopPropagation()}
            style={{ position: 'relative', width: '100%', maxWidth: 720, aspectRatio: '4/3', borderRadius: 20, overflow: 'hidden', boxShadow: '0 24px 80px rgba(180,156,140,0.3)' }}>
            <Image src={lightbox} alt="" fill style={{ objectFit: 'contain', background: '#fff' }} />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
