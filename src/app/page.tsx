'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
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

function HeroDecoSun({ className }: { className: string }) {
  const cx = 24;
  const cy = 24;

  return (
    <span className={className} aria-hidden>
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="hero-aesthetic__deco-sun-svg">
        <g className="hero-aesthetic__deco-sun-rays">
          {Array.from({ length: 16 }, (_, i) => (
            <ellipse
              key={i}
              cx={cx}
              cy="5.5"
              rx="2.1"
              ry="4.2"
              fill="#FFC72C"
              transform={`rotate(${i * 22.5} ${cx} ${cy})`}
            />
          ))}
        </g>
        <circle cx={cx} cy={cy} r="11" fill="#FFD93D" />
        <circle cx="17.5" cy="21.5" r="2.6" fill="#1A1A1A" />
        <circle cx="30.5" cy="21.5" r="2.6" fill="#1A1A1A" />
        <circle cx="16.6" cy="20.5" r="0.95" fill="#fff" />
        <circle cx="17.9" cy="22.1" r="0.5" fill="#fff" />
        <circle cx="29.6" cy="20.5" r="0.95" fill="#fff" />
        <circle cx="30.9" cy="22.1" r="0.5" fill="#fff" />
        <circle cx="15.2" cy="27.8" r="2.3" fill="#FF9EB5" opacity="0.85" />
        <circle cx="32.8" cy="27.8" r="2.3" fill="#FF9EB5" opacity="0.85" />
        <path
          d="M19.8 28.2Q24 31.6 28.2 28.2"
          stroke="#1A1A1A"
          strokeWidth="1.15"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </span>
  );
}

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
      localeFetch<Product[]>('/products?active=true&favorite=true'),
      localeFetch<Array<{ id: string; name: string; location?: string; product?: string; comment: string; rating: number }>>('/reviews'),
      localeFetch<Array<{ id?: string; src: string; alt: string }>>('/gallery'),
    ])
      .then(([p, r, g]) => {
        setFeaturedProducts(p);
        setReviewList(r);
        setGalleryPreview(Array.isArray(g) ? g.slice(0, 6) : []);
      })
      .catch(() => {
        setFeaturedProducts([]);
        setReviewList([]);
        setGalleryPreview([]);
      })
      .finally(() => setLoading(false));
  }, [locale, localeFetch]);

  const hero = home.hero;
  const heroEyebrow =
    'eyebrow' in hero && hero.eyebrow
      ? hero.eyebrow
      : `${hero.badgePrefix} ${new Date().getFullYear()}`;
  const heroTitle = 'title' in hero && hero.title ? hero.title : hero.titleLine1;
  const heroAccent =
    'titleAccent' in hero && hero.titleAccent
      ? hero.titleAccent
      : [hero.titleGold1, hero.conjunction, hero.titleGold2].filter(Boolean).join(' ');
  const heroTrust =
    'trustLine' in hero && hero.trustLine ? hero.trustLine : null;

  return (
    <div style={S.page}>

      <section className="relative min-h-[min(88vh,820px)] overflow-hidden pt-[68px]">
        <div className="hero-aesthetic" aria-hidden>
          <div className="hero-aesthetic__mesh" />
          <div className="hero-aesthetic__sun hero-aesthetic__sun--right" />
          <div className="hero-aesthetic__sun hero-aesthetic__sun--center" />
          <div className="hero-aesthetic__core" />
          <div className="hero-aesthetic__orb-group hero-aesthetic__orb-group--1">
            <div className="hero-aesthetic__orb" />
          </div>
          <div className="hero-aesthetic__orb-group hero-aesthetic__orb-group--2">
            <div className="hero-aesthetic__orb" />
          </div>
          <div className="hero-aesthetic__orb-group hero-aesthetic__orb-group--3">
            <div className="hero-aesthetic__orb" />
          </div>
          <div className="hero-aesthetic__orb-group hero-aesthetic__orb-group--center">
            <div className="hero-aesthetic__orb" />
          </div>
          <HeroDecoSun className="hero-aesthetic__deco-sun hero-aesthetic__deco-sun--left" />
          <HeroDecoSun className="hero-aesthetic__deco-sun hero-aesthetic__deco-sun--title" />
          <HeroDecoSun className="hero-aesthetic__deco-sun hero-aesthetic__deco-sun--bottom" />
          <HeroDecoSun className="hero-aesthetic__deco-sun hero-aesthetic__deco-sun--top-right" />
          <HeroDecoSun className="hero-aesthetic__deco-sun hero-aesthetic__deco-sun--mid-right" />
          <HeroDecoSun className="hero-aesthetic__deco-sun hero-aesthetic__deco-sun--center-right" />
          <div className="hero-aesthetic__micro-dot hero-aesthetic__micro-dot--1" />
          <div className="hero-aesthetic__micro-dot hero-aesthetic__micro-dot--2" />
          <div className="hero-aesthetic__micro-dot hero-aesthetic__micro-dot--3" />
          <div className="hero-aesthetic__micro-dot hero-aesthetic__micro-dot--4" />
          <div className="hero-aesthetic__micro-dot hero-aesthetic__micro-dot--5" />
          <div className="hero-aesthetic__micro-dot hero-aesthetic__micro-dot--6" />
          <div className="hero-aesthetic__micro-dot hero-aesthetic__micro-dot--7" />
          <div className="hero-aesthetic__micro-dot hero-aesthetic__micro-dot--8" />
          <div className="hero-aesthetic__micro-dot hero-aesthetic__micro-dot--9" />
          <div className="hero-aesthetic__micro-dot hero-aesthetic__micro-dot--10" />
          <div className="hero-aesthetic__bead hero-aesthetic__bead--1" />
          <div className="hero-aesthetic__bead hero-aesthetic__bead--2" />
          <div className="hero-aesthetic__bead hero-aesthetic__bead--3" />
          <div className="hero-aesthetic__bead hero-aesthetic__bead--4" />
          <div className="hero-aesthetic__bead hero-aesthetic__bead--5" />
          <div className="hero-aesthetic__bead hero-aesthetic__bead--6" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-4 pt-10 pb-16 sm:px-6 sm:pt-14 lg:pt-16 lg:pb-20 text-center lg:text-left">
          <motion.p
            initial={heroReady ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="mb-5 font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-muted"
          >
            {heroEyebrow}
          </motion.p>

          <motion.h1
            initial={heroReady ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: heroReady ? 0 : 0.08, ease: 'easeOut' }}
            className="mb-5 max-w-[640px] mx-auto lg:mx-0 font-serif text-[1.85rem] font-normal leading-[1.15] text-heading sm:text-[2.15rem] lg:text-[2.5rem]"
          >
            {heroTitle}
            {heroAccent ? (
              <>
                <br />
                <span className="font-normal mt-3 italic text-gold">{heroAccent}</span>
              </>
            ) : null}
          </motion.h1>

          <motion.div
            initial={heroReady ? false : { opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.5, delay: heroReady ? 0 : 0.2 }}
            className="mx-auto lg:mx-0 mb-8 h-px w-12 origin-center lg:origin-left bg-gold/70"
          />

          <motion.p
            initial={heroReady ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: heroReady ? 0 : 0.25, ease: 'easeOut' }}
            className="mx-auto lg:mx-0 mb-9 max-w-[480px] font-sans text-[15px] leading-relaxed text-subtle sm:text-base sm:leading-8 lg:text-[17px]"
          >
            {hero.subtitle}
          </motion.p>

          <motion.div
            initial={heroReady ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: heroReady ? 0 : 0.35, ease: 'easeOut' }}
            className="flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start"
          >
            <Link href={hero.primaryCta.href} className="btn-primary no-underline justify-center">
              {hero.primaryCta.label} <ArrowRight size={15} />
            </Link>
            <Link href={hero.secondaryCta.href} className="btn-outline no-underline justify-center">
              {hero.secondaryCta.label}
            </Link>
          </motion.div>

          {heroTrust ? (
            <motion.p
              initial={heroReady ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: heroReady ? 0 : 0.5 }}
              className="mt-10 font-sans text-[11px] uppercase tracking-[0.14em] text-muted"
            >
              {heroTrust}
            </motion.p>
          ) : (
            <motion.div
              initial={heroReady ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: heroReady ? 0 : 0.5 }}
              className="mt-10 flex flex-wrap justify-center gap-8 lg:justify-start"
            >
              {hero.stats.map(({ value, label }) => (
                <div key={label}>
                  <p className="font-serif text-xl font-medium text-heading">{value}</p>
                  <p className="mt-0.5 font-sans text-[10px] uppercase tracking-widest text-muted">
                    {label}
                  </p>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </section>


      <section className="bg-beige py-12 sm:py-14">
        <div className="mx-auto max-w-[760px] px-4 sm:px-6">
          <div className="mb-7 text-center sm:mb-8">
            <p className="mb-2 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-muted">
              {home.collectionsSection.eyebrow}
            </p>
            <h2 className="font-serif text-xl font-medium text-heading sm:text-[1.65rem]">
              {home.collectionsSection.title}
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {home.collectionCards.map((cat, i) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <Link href={cat.href} className="group block no-underline" scroll>
                  <div className="relative mb-2 aspect-[3/4] overflow-hidden rounded-lg bg-ivory sm:mb-2.5">
                    <Image
                      src={cat.img}
                      alt={cat.title}
                      fill
                      className="object-cover transition-opacity duration-300 group-hover:opacity-90"
                      loading="lazy"
                      sizes="(max-width: 760px) 30vw, 220px"
                    />
                  </div>
                  <p className="text-center font-sans text-[11px] leading-snug text-subtle transition-colors group-hover:text-ink sm:text-xs">
                    {cat.title}
                  </p>
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

      <section style={{ ...S.section('#F5F0EC'), padding: 'var(--section-padding)' }}>
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-12 items-center px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.65 }} className="relative">
            <div className="relative h-[400px] overflow-hidden rounded-[24px] sm:h-[500px]">
              <Image src={home.storySection.image} alt="" fill className="object-cover" loading="lazy" />
            </div>

            <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-[20px] border-2 border-gold/30" />

            <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3.5, repeat: Infinity }}
              className="absolute -left-4 bottom-8 rounded-[16px] border-1 border-[#E6C97A] p-4 shadow-[0_8px_32px_rgba(180,156,140,0.22)] sm:p-5">
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.65 }}>
            <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.25em] text-mocha">{home.storySection.eyebrow}</p>
            <h2 className="mb-4 font-serif text-[clamp(1.35rem,2.6vw,1.85rem)] font-medium leading-snug text-heading">
              {home.storySection.titleLine1}{' '}
              <span className="italic text-gold">{home.storySection.titleItalic}</span>
              {home.storySection.titleLine2 ? (
                <>
                  <br />
                  {home.storySection.titleLine2}
                </>
              ) : null}
            </h2>
            <div className="divider-gold mb-6" />
            {home.storySection.paragraphs.map((para, idx) => (
              <p key={idx} className="mb-3 font-sans text-[13px] leading-relaxed text-subtle sm:text-sm last:mb-7">
                {para}
              </p>
            ))}

            <div className="mb-10 grid grid-cols-3 gap-3">
              {home.storySection.pillars.map(({ icon, label }) => (
                <div key={label} className="rounded-[14px] border border-beige bg-white p-4 text-center">
                  <div
                    className={`mb-2 flex h-6 items-center justify-center leading-none ${
                      icon === '☀️' ? 'text-[13px]' : 'text-[18px]'
                    }`}
                    aria-hidden
                  >
                    {icon}
                  </div>
                  <p className="font-sans text-[11px] font-medium text-ink sm:text-[12px]">{label}</p>
                </div>
              ))}
            </div>

            <Link href={home.storySection.ctaHref} className="btn-outline no-underline">
              {home.storySection.ctaLabel} <ArrowRight size={14} />
            </Link>
          </motion.div>
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

      <section className="border-t border-beige text-center" style={{ padding: 'var(--section-padding)', background: 'rgb(245, 240, 236)' }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.55 }} className="mx-auto max-w-[600px]">
          <span className="mb-5 block text-[40px]">{home.ctaSection.emoji}</span>
          <h2 className="mb-4 font-serif text-[clamp(1.35rem,2.6vw,1.85rem)] font-medium leading-snug text-heading">
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
