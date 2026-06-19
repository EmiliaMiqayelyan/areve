'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';
import ReviewCard from '@/components/ui/ReviewCard';
import SectionHeader from '@/components/ui/SectionHeader';
import type { Product } from '@/lib/store';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { useTranslation } from '@/i18n/I18nProvider';
import { useLocaleApiFetch } from '@/lib/useLocaleApi';
import { pickLocalized } from '@/lib/localizedText';

const S = {
  page: { minHeight: '100vh' },
  section: (bg?: string): React.CSSProperties => ({ background: bg ?? '#F8F5F2', padding: '96px 24px' }),
  wrap: { maxWidth: 1280, margin: '0 auto' } as React.CSSProperties,
};

export default function Home() {
  const { t, locale } = useTranslation();
  const localeFetch = useLocaleApiFetch();
  const { settings } = useSiteSettings();
  const { siteContent: sc, instagramUrl } = settings;
  const home = sc.home;

  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [reviewList, setReviewList] = useState<Array<{ id: string; name: string; location?: string; product?: string; comment: string; rating: number }>>([]);
  const [galleryPreview, setGalleryPreview] = useState<Array<{ id?: string; src: string; alt: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [heroReady, setHeroReady] = useState(false);
  useEffect(() => { setHeroReady(true); }, []);

  useEffect(() => {
    void Promise.all([
      localeFetch<Product[]>('/products?active=true'),
      localeFetch<Array<{ id: string; name: string; location?: string; product?: string; comment: string; rating: number }>>('/reviews'),
      localeFetch<Array<{ id?: string; src: string; alt: string }>>('/gallery'),
    ])
      .then(([p, r, g]) => {
        setFeaturedProducts(p);
        setReviewList(r);
        setGalleryPreview(Array.isArray(g) ? g.slice(0, 6) : []);
      })
      .finally(() => setLoading(false));
  }, [locale, localeFetch]);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const year = new Date().getFullYear();

  return (
    <div style={S.page}>

      <section ref={heroRef} style={{ position: 'relative', minHeight: '90vh', display: 'flex', alignItems: 'center', overflow: 'hidden', background: '#F8F5F2', paddingTop: 68 }}>

        <motion.div style={{ y: imgY, position: 'absolute', inset: 0 }}>
          <Image src={home.hero.image} alt={settings.storeName} fill style={{ objectFit: 'cover', objectPosition: 'center' }} priority />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, rgba(248,245,242,0.96) 0%, rgba(248,245,242,0.85) 45%, rgba(248,245,242,0.20) 100%)' }} />
        </motion.div>

        <motion.div className="relative z-10 mx-auto w-full px-4 sm:px-6 lg:max-w-[1280px]" style={{ y: textY, opacity, paddingTop: 'calc(var(--container-px) * 2.5)' }}>

          <motion.div initial={heroReady ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="flex items-center gap-2.5 mb-6">
            <span className="badge badge-sage">{home.hero.badgePrefix} {year}</span>
            <span className="text-[#D6C3B3] text-xs sm:text-sm">☀️</span>
          </motion.div>

          <motion.h1
            initial={heroReady ? false : { opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: heroReady ? 0 : 0.15, ease: 'easeOut' }}
            className="mb-6 font-serif text-4xl font-bold leading-[1.1] text-ink sm:text-6xl lg:text-[88px] lg:max-w-[700px]"
            style={{ fontFamily: "'Playfair Display',serif" }}
          >
            {home.hero.titleLine1}<br />
            <span className="italic text-gold">{home.hero.titleGold1}</span> {home.hero.conjunction}{' '}
            <span className="italic text-gold">{home.hero.titleGold2}</span>
          </motion.h1>

          <motion.p
            initial={heroReady ? false : { opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: heroReady ? 0 : 0.3 }}
            className="mb-10 max-w-[480px] font-sans text-base leading-relaxed text-subtle sm:text-lg sm:leading-loose"
          >
            {home.hero.subtitle}
          </motion.p>

          <motion.div initial={heroReady ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: heroReady ? 0 : 0.45 }} className="flex flex-wrap gap-3 sm:gap-4">
            <Link href={home.hero.primaryCta.href} className="btn-primary no-underline">
              {home.hero.primaryCta.label} <ArrowRight size={15} />
            </Link>
            <Link href={home.hero.secondaryCta.href} className="btn-outline no-underline">
              {home.hero.secondaryCta.label}
            </Link>
          </motion.div>

          <motion.div initial={heroReady ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: heroReady ? 0 : 0.9 }} className="mt-12 flex flex-wrap gap-8 sm:gap-12 lg:mt-16">
            {home.hero.stats.map(({ value, label }) => (
              <div key={label}>
                <p className="font-serif text-3xl font-bold text-ink sm:text-4xl">{value}</p>
                <p className="mt-1 font-sans text-xs uppercase tracking-widest text-[#AFAFAF]">{label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div initial={heroReady ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: heroReady ? 0 : 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 hidden sm:flex">
          <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#AFAFAF]">{t('common.scroll')}</p>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.6, repeat: Infinity }}
            className="h-10 w-[1px]" style={{ background: 'linear-gradient(#E6C97A, transparent)' }} />
        </motion.div>
      </section>


      <section style={{ ...S.section('#EADFD8'), padding: 'var(--section-padding)' }}>
        <div style={{ ...S.wrap, padding: '0 var(--container-px)' }}>
          <SectionHeader eyebrow={home.collectionsSection.eyebrow} title={home.collectionsSection.title} subtitle={home.collectionsSection.subtitle} centered />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {home.collectionCards.map((cat, i) => (
              <motion.div key={cat.title} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: i * 0.12 }}>
                <Link href={cat.href} className="group relative block h-[340px] overflow-hidden rounded-[20px] no-underline">
                  <Image src={cat.img} alt={cat.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2B2B2B]/60 via-[#2B2B2B]/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                    <h3 className="mb-1.5 font-serif text-xl font-bold text-white sm:text-2xl">{cat.title}</h3>
                    <p className="mb-4 font-sans text-[13px] leading-relaxed text-white/80">{cat.desc}</p>
                    <span className="flex items-center gap-1.5 font-sans text-xs font-semibold uppercase tracking-widest text-[#F4D58D]">
                      {t('common.explore')} <ArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ ...S.section(), padding: 'var(--section-padding)' }}>
        <div style={{ ...S.wrap, padding: '0 var(--container-px)' }}>
          <div className="flex flex-wrap items-end justify-between gap-4 mb-4 sm:mb-8">
            <SectionHeader eyebrow={home.featuredSection.eyebrow} title={home.featuredSection.title} />
            <Link href="/products" className="mb-1 flex items-center gap-1.5 border-b border-mocha pb-0.5 font-sans text-[13px] text-mocha no-underline transition-colors hover:text-gold hover:border-gold">
              {home.featuredSection.viewAllLabel} <ArrowRight size={13} />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {loading && (
              <div className="col-span-full py-10 text-center font-sans text-[#AFAFAF]">
                {t('common.loadingProducts')}
              </div>
            )}
            {!loading && featuredProducts.slice(0, 6).map((p, i) => (
              <ProductCard key={String(p.id)} product={p} index={i} />
            ))}
            {!loading && featuredProducts.length === 0 && (
              <div className="col-span-full py-10 text-center font-sans text-[#AFAFAF]">
                {t('common.noProducts')}
              </div>
            )}
          </div>
        </div>
      </section>

      <section style={{ ...S.section('#EADFD8'), padding: 'var(--section-padding)' }}>
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-12 items-center px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.65 }} className="relative">
            <div className="relative h-[400px] overflow-hidden rounded-[24px] sm:h-[500px]">
              <Image src={home.storySection.image} alt="" fill className="object-cover" loading="lazy" />
            </div>

            <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-[20px] border-2 border-gold/30" />

            <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3.5, repeat: Infinity }}
              className="absolute -left-4 bottom-8 rounded-[16px] bg-white p-4 shadow-[0_8px_32px_rgba(180,156,140,0.22)] sm:p-5">
              <p className="font-serif text-2xl font-bold text-ink sm:text-3xl">{home.storySection.floatingStatValue}</p>
              <p className="font-sans text-[11px] text-[#AFAFAF] sm:text-xs">{home.storySection.floatingStatLabel}</p>
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.65 }}>
            <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.25em] text-mocha">{home.storySection.eyebrow}</p>
            <h2 className="mb-4 font-serif text-3xl font-bold leading-tight text-ink sm:text-4xl lg:text-5xl">
              {home.storySection.titleLine1} <span className="italic text-gold">{home.storySection.titleItalic}</span><br />{home.storySection.titleLine2}
            </h2>
            <div className="divider-gold mb-6" />
            {home.storySection.paragraphs.map((para, idx) => (
              <p key={idx} className="mb-4 font-sans text-base leading-relaxed text-subtle sm:text-lg last:mb-8">
                {para}
              </p>
            ))}

            <div className="mb-10 grid grid-cols-3 gap-3">
              {home.storySection.pillars.map(({ icon, label }) => (
                <div key={label} className="rounded-[14px] border border-beige bg-white p-4 text-center">
                  <div className="mb-2 text-xl sm:text-2xl">{icon}</div>
                  <p className="font-sans text-[11px] font-medium text-ink sm:text-[13px]">{label}</p>
                </div>
              ))}
            </div>

            <Link href={home.storySection.ctaHref} className="btn-outline no-underline">
              {home.storySection.ctaLabel} <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>

      <section style={{ ...S.section('#D6C3B3'), padding: 'var(--section-padding)' }}>
        <div style={{ ...S.wrap, padding: '0 var(--container-px)' }}>
          <SectionHeader eyebrow={home.testimonialsSection.eyebrow} title={home.testimonialsSection.title} subtitle={home.testimonialsSection.subtitle} centered />
          <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {loading && (
              <div className="col-span-full py-10 text-center font-sans text-[#AFAFAF]">
                {t('common.loadingReviews')}
              </div>
            )}
            {!loading && reviewList.slice(0, 3).map((r, i) => (
              <ReviewCard key={String(r.id)} review={{ ...r, location: r.location ?? '' }} index={i} />
            ))}
            {!loading && reviewList.length === 0 && (
              <div className="col-span-full py-10 text-center font-sans text-[#AFAFAF]">
                {t('common.noReviews')}
              </div>
            )}
          </div>
          <div className="text-center">
            <Link href="/reviews" className="btn-outline no-underline" style={{ borderColor: '#BFA6A0' }}>
              {home.testimonialsSection.readAllLabel} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <section style={{ ...S.section(), padding: 'var(--section-padding)' }}>
        <div style={{ ...S.wrap, padding: '0 var(--container-px)' }}>
          <SectionHeader eyebrow={home.instagramSection.eyebrow} title={home.instagramSection.title} subtitle={home.instagramSection.subtitle} centered />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {!loading && galleryPreview.length === 0 && (
              <p className="col-span-full py-8 text-center font-sans text-[13px] text-[#AFAFAF]">
                {t('common.noGalleryAdmin')}
              </p>
            )}
            {galleryPreview.map((item, i) => (
              <motion.a
                key={item.id ?? i}
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.92 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }}
                className="group relative block aspect-square overflow-hidden rounded-[14px]"
              >
                <Image src={item.src} alt={pickLocalized(item.alt, locale)} fill className="object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                <div className="absolute inset-0 bg-gold/0 transition-colors group-hover:bg-gold/10" />
              </motion.a>
            ))}
          </div>
          <p className="mt-8 text-center font-sans text-[13px] text-mocha">
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="border-b border-sand text-mocha no-underline transition-colors hover:text-gold hover:border-gold">
              {home.instagramSection.viewLinkLabel}
            </a>
          </p>
        </div>
      </section>

      <section className="border-t border-beige bg-ivory text-center" style={{ padding: 'var(--section-padding)' }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.55 }} className="mx-auto max-w-[600px]">
          <span className="mb-5 block text-[40px]">{home.ctaSection.emoji}</span>
          <h2 className="mb-4 font-serif text-3xl font-bold leading-tight text-ink sm:text-4xl lg:text-5xl">
            {home.ctaSection.titleLine1}{' '}
            <span className="italic text-gold">{home.ctaSection.titleItalic}</span>
          </h2>
          <p className="mb-10 font-sans text-base leading-relaxed text-subtle sm:text-lg">
            {home.ctaSection.paragraph}
          </p>
          <Link href={home.ctaSection.buttonHref} className="btn-primary no-underline">
            {home.ctaSection.buttonLabel} <ArrowRight size={15} />
          </Link>
        </motion.div>
      </section>

    </div>
  );
}
