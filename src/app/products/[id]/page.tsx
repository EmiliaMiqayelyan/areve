'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import StoreImage from '@/components/ui/StoreImage';
import { useEffect, useState } from 'react';
import { ArrowLeft, Heart, ShoppingBag, Shield, Truck, Package } from 'lucide-react';
import { useCartStore, useWishlistStore } from '@/lib/store';
import ProductCard from '@/components/ui/ProductCard';
import { useTranslation } from '@/i18n/I18nProvider';
import { pickLocalized } from '@/lib/localizedText';
import { formatPrice } from '@/lib/currency';
import { useProductQuery, useProductsQuery } from '@/lib/useProductsQuery';
import { readExtraImages, stripExtraImages } from '@/lib/extraProductImages';

const FALLBACK_PRODUCT_IMAGE = '/images/prod-bag-a.png';

function resolveProductImageSrc(image?: string): string {
  const src = String(image ?? '').trim();
  if (!src) return FALLBACK_PRODUCT_IMAGE;
  if (src.startsWith('blob:') || src.startsWith('data:image/')) return FALLBACK_PRODUCT_IMAGE;
  if (src.startsWith('/uploads/')) return src;
  if (/^https?:\/\//i.test(src)) return src;
  if (src.startsWith('/')) return src;
  return `/${src.replace(/^\/+/, '')}`;
}

export default function ProductDetailPage() {
  const { t, locale } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const productId = String(id ?? '');
  const [imgFailed, setImgFailed] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
    setImgFailed(false);
  }, [productId]);

  const { addItem } = useCartStore();
  const { toggleWishlist, isWishlisted } = useWishlistStore();

  const { data: product, isLoading: productLoading } = useProductQuery(productId);

  const { data: relatedPool = [] } = useProductsQuery(
    {
      active: true,
      category: product?.category,
      excludeId: productId,
      limit: 4,
    },
    { enabled: Boolean(product?.category) }
  );

  const loading = productLoading;

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', paddingTop: 120, textAlign: 'center', fontFamily: 'var(--font-sans)', color: '#AFAFAF' }}>
        {t('product.loading')}
      </div>
    );
  }

  if (!product) return (
    <div style={{ minHeight: '100vh', paddingTop: 120, textAlign: 'center' }}>
      <p style={{ fontFamily: 'var(--font-serif)', fontSize: 22, color: '#2B2B2B' }}>{t('product.notFound')}</p>
      <Link href="/products" style={{ color: '#E6C97A', textDecoration: 'none', marginTop: 12, display: 'inline-block' }}>← {t('product.backToProducts')}</Link>
    </div>
  );

  const related = relatedPool.slice(0, 3);
  const wishlisted = isWishlisted(product.id);
  const mainSrc = resolveProductImageSrc(product.image);
  const gallery = [mainSrc, ...readExtraImages(product)]
    .map((src) => resolveProductImageSrc(src))
    .filter((src, index, all) => src && all.indexOf(src) === index)
    .slice(0, 4);
  const safeIndex = Math.min(activeIndex, Math.max(gallery.length - 1, 0));
  const activeSrc = gallery[safeIndex] ?? mainSrc;
  const displayName = pickLocalized(product.name, locale);
  const displayDescription = stripExtraImages(pickLocalized(product.description, locale));
  const badgeRaw = product.badge ? pickLocalized(product.badge, locale) : null;
  const badgeLabel = badgeRaw
    ? (t(`product.badge_${badgeRaw}` as 'product.badge_New') || badgeRaw)
    : null;

  return (
    <div style={{ minHeight: '100vh', paddingTop: 92, paddingBottom: 80 }}>
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6" style={{ paddingLeft: 'var(--container-px)', paddingRight: 'var(--container-px)' }}>
        <Link href="/products" className="mb-8 inline-flex items-center gap-1.5 font-sans text-[13px] text-mocha no-underline transition-colors hover:text-gold sm:mb-12">
          <ArrowLeft size={14} /> {t('product.backToProducts')}
        </Link>

        <div className="mb-16 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16 lg:mb-24">
          <motion.div initial={{ opacity: 0, x: -32 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55 }} className="flex flex-col">
            <div className="relative h-[380px] overflow-hidden rounded-[24px] bg-beige sm:h-[500px] lg:h-[600px]">
              <StoreImage
                src={imgFailed ? FALLBACK_PRODUCT_IMAGE : activeSrc}
                alt={displayName}
                fill
                priority
                onError={() => setImgFailed(true)}
              />
              {badgeLabel && (
                <span className="badge badge-gold absolute left-4 top-4 sm:left-6 sm:top-6">{badgeLabel}</span>
              )}
            </div>
            {gallery.length > 1 && (
              <div className="mt-3 flex gap-2">
                {gallery.map((src, galleryIndex) => {
                  const selected = galleryIndex === safeIndex;
                  return (
                    <button
                      key={`${src}-${galleryIndex}`}
                      type="button"
                      onClick={() => {
                        setActiveIndex(galleryIndex);
                        setImgFailed(false);
                      }}
                      aria-label={`${displayName} ${galleryIndex + 1}`}
                      aria-pressed={selected}
                      className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-[10px] bg-beige sm:h-16 sm:w-16 ${
                        selected ? 'ring-2 ring-[#E6C97A]' : 'ring-1 ring-[#EADFD8]'
                      }`}
                    >
                      <StoreImage src={src} alt="" fill />
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55 }} className="flex flex-col justify-center">
            <p className="mb-3 font-sans text-[11px] font-medium uppercase tracking-[0.28em] text-gold">AREVÉ</p>
            <h1 className="font-serif text-[clamp(1.7rem,3vw,2.45rem)] font-medium leading-[1.12] text-heading">{displayName}</h1>
            <div className="divider-gold my-5" />

            {displayDescription ? (
              <p className="mb-6 font-sans text-sm leading-relaxed text-subtle sm:text-[15px]">{displayDescription}</p>
            ) : null}

            <p className="mb-6 font-serif text-xl font-medium text-ink sm:text-2xl">{formatPrice(product.price)}</p>

            <div className="mb-6 flex flex-col gap-3 sm:flex-row">
              <button onClick={() => addItem({ ...product, name: displayName })} className="btn-primary flex-1 justify-center !py-3 !text-[12px] !tracking-[1px]">
                <ShoppingBag size={14} /> {t('product.addToBag')}
              </button>
              <button onClick={() => toggleWishlist(product)}
                className={`flex h-[44px] w-full items-center justify-center rounded-full border-[1.5px] transition-all sm:w-[44px] ${
                    wishlisted ? 'border-gold bg-gold/10' : 'border-beige bg-white'
                }`}
              >
                <Heart size={16} strokeWidth={1.6} fill={wishlisted ? '#E8CFCB' : 'none'} color={wishlisted ? '#c97a7a' : '#BFA6A0'} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
              {[
                [<Shield size={16} />, t('product.quality')],
                [<Truck size={16} />, t('product.delivery')],
                [<Package size={16} />, t('product.packaging')],
              ].map(([ic, lbl], i) => (
                <div key={i} className="flex items-center gap-3 rounded-[12px] bg-beige/40 p-4 sm:flex-col sm:justify-center sm:text-center sm:bg-beige/60">
                  <div className="text-gold">{ic as React.ReactNode}</div>
                  <p className="font-sans text-[11px] font-medium text-subtle tracking-wide">{lbl as string}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {related.length > 0 && (
          <div className="border-t border-beige pt-16 sm:pt-24">
            <h2 className="mb-6 font-serif text-base font-medium text-heading sm:text-lg sm:mb-10">{t('product.relatedTitle')}</h2>
            <div className="grid grid-cols-1 gap-5 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
