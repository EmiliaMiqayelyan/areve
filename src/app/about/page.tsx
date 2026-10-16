'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import PageHero from '@/components/ui/PageHero';
import Reveal from '@/components/ui/Reveal';
import StoreImage from '@/components/ui/StoreImage';
import SunMark from '@/components/ui/SunMark';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { useTranslation } from '@/i18n/I18nProvider';
import { pickLocalized } from '@/lib/localizedText';
import { isFileImage, resolveProductImageSrc } from '@/lib/productImage';
import { useGalleryQuery } from '@/lib/useProductsQuery';

export default function AboutPage() {
  const { locale } = useTranslation();
  const { settings } = useSiteSettings();
  const about = settings.siteContent.about;
  const { data: galleryRaw = [], isLoading } = useGalleryQuery(6);

  const gallery = useMemo(
    () =>
      galleryRaw
        .filter((g) => isFileImage(g.src))
        .map((g) => ({ id: g.id, src: resolveProductImageSrc(g.src), alt: pickLocalized(g.alt, locale) })),
    [galleryRaw, locale]
  );

  const storyImage = gallery[0]?.src;
  const strip = gallery.slice(1, 4);

  return (
    <div className="min-h-screen">
      <PageHero
        variant="about"
        eyebrow={about.hero.eyebrow}
        title={about.hero.titleLine1}
        titleItalic={about.hero.titleItalic}
        subtitle={about.hero.intro}
      />

      <section className="section">
        <div className="wrap grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-6">
            <div className={`relative aspect-[4/5] overflow-hidden bg-surface-deep ${isLoading ? 'skeleton' : ''}`}>
              {storyImage && <StoreImage src={storyImage} alt="" fill />}
            </div>
          </Reveal>
          <Reveal className="lg:col-span-5 lg:col-start-8" delay={0.1}>
            <SunMark className="mb-6 w-16 text-primary" strokeWidth={1.6} />
            <p className="eyebrow mb-4">{about.beginning.eyebrow}</p>
            <h2 className="section-title">{about.beginning.title}</h2>
            <div className="mt-6 space-y-4">
              {about.beginning.paragraphs.map((p) => (
                <p key={p} className="text-[15.5px] leading-relaxed text-muted sm:text-[16px]">
                  {p}
                </p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {strip.length > 0 && (
        <section className="pb-[var(--section-y)]">
          <div className="wrap grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
            {strip.map((img, i) => (
              <Reveal key={img.id ?? i} delay={i * 0.08} className={i === 2 ? 'hidden md:block' : undefined}>
                <div className="relative aspect-[3/4] overflow-hidden bg-surface-deep">
                  <StoreImage src={img.src} alt={img.alt} fill />
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <section className="bg-background text-text">
        <Reveal className="wrap flex flex-col items-center py-20 text-center lg:py-28">
          <h2 className="section-title max-w-none whitespace-nowrap text-[clamp(1.15rem,3.4vw,2.25rem)]!">
            {about.closing.title}
          </h2>
          <Link href={about.closing.ctaHref} className="btn-primary mt-8">
            {about.closing.ctaLabel} <ArrowRight size={15} strokeWidth={1.5} />
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
