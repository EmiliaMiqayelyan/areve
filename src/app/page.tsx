'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import HomeHero from '@/components/home/HomeHero';
import TrustStrip from '@/components/home/TrustStrip';
import CategoryGrid from '@/components/home/CategoryGrid';
import ProductRail from '@/components/home/ProductRail';
import BrandStory from '@/components/home/BrandStory';
import CustomOrderBand from '@/components/home/CustomOrderBand';
import InstagramStrip from '@/components/home/InstagramStrip';
import ProductCard, { ProductCardSkeleton } from '@/components/ui/ProductCard';
import Reveal from '@/components/ui/Reveal';
import SectionHeader from '@/components/ui/SectionHeader';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { useTranslation } from '@/i18n/I18nProvider';
import { pickLocalized } from '@/lib/localizedText';
import { isFileImage, resolveProductImageSrc } from '@/lib/productImage';
import { useCatalogCategories } from '@/lib/useCatalog';
import { useGalleryQuery } from '@/lib/useProductsQuery';
import type { Product } from '@/lib/store';

const FEATURED_COUNT = 8;
const NEW_COUNT = 10;

function byNewest(a: Product, b: Product) {
  return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime();
}

export default function Home() {
  const { t, locale } = useTranslation();
  const { settings } = useSiteSettings();
  const home = settings.siteContent.home;

  const { categories, products, isLoading: catalogLoading } = useCatalogCategories();
  // Larger limits pull inline base64 entries from the API — keep this small.
  const { data: galleryRaw = [], isLoading: galleryLoading } = useGalleryQuery(6);

  const gallery = useMemo(
    () =>
      galleryRaw
        .filter((item) => isFileImage(item.src))
        .map((item) => ({ id: item.id, src: resolveProductImageSrc(item.src), alt: pickLocalized(item.alt, locale) })),
    [galleryRaw, locale]
  );

  const withImage = useMemo(() => products.filter((p) => resolveProductImageSrc(p.image)), [products]);

  const featured = useMemo(() => {
    const favorites = withImage.filter((p) => p.isFavorite);
    const fill = withImage.filter((p) => !p.isFavorite);
    return [...favorites, ...fill].slice(0, FEATURED_COUNT);
  }, [withImage]);

  const newest = useMemo(() => [...withImage].sort(byNewest).slice(0, NEW_COUNT), [withImage]);

  const heroLead = gallery[0]?.src ?? resolveProductImageSrc(featured[0]?.image);
  const heroProducts = gallery[0] ? featured.slice(0, 2) : featured.slice(1, 3);
  const storyImage = gallery[1]?.src ?? resolveProductImageSrc(featured[3]?.image);
  const storyDetail = resolveProductImageSrc(newest.find((p) => !featured.slice(0, 2).includes(p))?.image);
  const instagramImages = gallery.length >= 4 ? gallery.slice(2) : gallery;

  return (
    <>
      <HomeHero
        copy={home.hero}
        leadImage={heroLead || undefined}
        products={heroProducts}
        loading={catalogLoading || galleryLoading}
      />

      <TrustStrip items={home.trust} />

      <CategoryGrid categories={categories} loading={catalogLoading} copy={home.categoriesSection} />

      <section className="section pt-0">
        <div className="wrap">
          <SectionHeader
            eyebrow={home.featuredSection.eyebrow}
            title={home.featuredSection.title}
            action={
              <Link href="/products" className="link-underline">
                {home.featuredSection.viewAllLabel} <ArrowRight size={14} />
              </Link>
            }
          />
          <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 sm:gap-y-12 md:grid-cols-3 lg:grid-cols-4">
            {catalogLoading &&
              Array.from({ length: FEATURED_COUNT }).map((_, i) => <ProductCardSkeleton key={i} />)}
            {!catalogLoading &&
              featured.map((p, i) => (
                <Reveal key={p.id} delay={Math.min((i % 4) * 0.06, 0.2)}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
          </div>
          {!catalogLoading && featured.length === 0 && (
            <p className="py-10 text-center text-[14px] text-muted">{t('common.noProducts')}</p>
          )}
        </div>
      </section>

      <BrandStory copy={home.storySection} image={storyImage || undefined} detailImage={storyDetail || undefined} />

      <ProductRail
        eyebrow={home.newSection.eyebrow}
        title={home.newSection.title}
        viewAllLabel={home.newSection.viewAllLabel}
        products={newest}
        loading={catalogLoading}
      />

      <CustomOrderBand copy={home.customSection} whatsappUrl={settings.whatsappUrl} />

      <InstagramStrip copy={home.instagramSection} images={instagramImages} instagramUrl={settings.instagramUrl} />
    </>
  );
}
