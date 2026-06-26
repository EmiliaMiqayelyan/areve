'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowLeft, Heart, ShoppingBag, Star, Shield, Truck, RefreshCw } from 'lucide-react';
import { useCartStore, useWishlistStore } from '@/lib/store';
import ProductCard from '@/components/ui/ProductCard';
import { useTranslation } from '@/i18n/I18nProvider';
import { useLocaleApiFetch } from '@/lib/useLocaleApi';
import { pickLocalized } from '@/lib/localizedText';

const FALLBACK_PRODUCT_IMAGE = '/images/prod-bag-a.png';

function resolveProductImageSrc(image?: string): string {
  const src = String(image ?? '').trim();
  if (!src) return FALLBACK_PRODUCT_IMAGE;
  if (src.startsWith('blob:')) return FALLBACK_PRODUCT_IMAGE;
  if (src.startsWith('data:image/')) {
    return src;
  }
  if (src.startsWith('/uploads/')) return FALLBACK_PRODUCT_IMAGE;
  if (/^https?:\/\//i.test(src)) return src;
  if (src.startsWith('/')) return src;
  return `/${src.replace(/^\/+/, '')}`;
}

export default function ProductDetailPage() {
  const { t, locale } = useTranslation();
  const localeFetch = useLocaleApiFetch();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any | null>(null);
  const [relatedPool, setRelatedPool] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [imgFailed, setImgFailed] = useState(false);
  const { addItem } = useCartStore();
  const { toggleWishlist, isWishlisted } = useWishlistStore();

  useEffect(() => {
    setLoading(true);
    setImgFailed(false);
    void localeFetch<any[]>('/products?active=true')
      .then((items) => {
        setRelatedPool(items);
        setProduct(items.find((p) => p.id === id) || null);
      })
      .catch(() => {
        setRelatedPool([]);
        setProduct(null);
      })
      .finally(() => setLoading(false));
  }, [id, locale, localeFetch]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', paddingTop: 120, textAlign: 'center', fontFamily: "'DM Sans',sans-serif", color: '#AFAFAF' }}>
        {t('product.loading')}
      </div>
    );
  }

  if (!product) return (
    <div style={{ minHeight: '100vh', paddingTop: 120, textAlign: 'center' }}>
      <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: '#2B2B2B' }}>{t('product.notFound')}</p>
      <Link href="/products" style={{ color: '#E6C97A', textDecoration: 'none', marginTop: 12, display: 'inline-block' }}>← {t('product.backToProducts')}</Link>
    </div>
  );

  const related = relatedPool.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);
  const wishlisted = isWishlisted(product.id);
  const displayName = pickLocalized(product.name, locale);
  const displayDescription = pickLocalized(product.description, locale);
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
          {/* Image */}
          <motion.div initial={{ opacity: 0, x: -32 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55 }}
            className="relative h-[380px] overflow-hidden rounded-[24px] bg-beige sm:h-[500px] lg:h-[600px]">
            {String(product.image ?? '').startsWith('data:image/') ? (
              <img
                src={imgFailed ? FALLBACK_PRODUCT_IMAGE : resolveProductImageSrc(product.image)}
                alt={displayName}
                className="absolute inset-x-0 h-full w-full object-cover"
                onError={() => setImgFailed(true)}
              />
            ) : (
              <Image
                src={imgFailed ? FALLBACK_PRODUCT_IMAGE : resolveProductImageSrc(product.image)}
                alt={displayName}
                fill
                className="object-cover"
                priority
                onError={() => setImgFailed(true)}
              />
            )}
            {badgeLabel && (
              <span className="badge badge-gold absolute left-4 top-4 sm:left-6 sm:top-6">{badgeLabel}</span>
            )}
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55 }} className="flex flex-col justify-center">
            <p className="mb-2 font-sans text-[11px] uppercase tracking-[2.5px] text-[#AFAFAF]">{product.category}</p>
            <h1 className="mb-4 font-serif text-3xl font-bold text-ink sm:text-4xl lg:text-5xl lg:leading-tight">{displayName}</h1>

            <div className="mb-5 flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} fill="#E6C97A" color="#E6C97A" />)}
              <span className="ml-2 font-sans text-[13px] text-[#AFAFAF]">({t('product.reviewsCount', { count: 12 })})</span>
            </div>

            <div className="divider-gold mb-6" />

            <p className="mb-8 font-sans text-base leading-relaxed text-subtle sm:text-lg">{displayDescription}</p>

            <p className="mb-8 font-serif text-4xl font-bold text-ink sm:text-5xl">${product.price}</p>

            <div className="mb-8 flex flex-col gap-4 sm:flex-row">
              <button onClick={() => addItem({ ...product, name: displayName })} className="btn-primary flex-1 justify-center py-4">
                <ShoppingBag size={15} /> {t('product.addToBag')}
              </button>
              <button onClick={() => toggleWishlist(product)}
                className={`flex h-[52px] w-full items-center justify-center rounded-full border-[1.5px] transition-all sm:w-[52px] ${
                    wishlisted ? 'border-gold bg-gold/10' : 'border-beige bg-white'
                }`}
              >
                <Heart size={18} strokeWidth={1.6} fill={wishlisted ? '#E8CFCB' : 'none'} color={wishlisted ? '#c97a7a' : '#BFA6A0'} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
              {[
                [<Shield size={16} />, t('product.qualityGuaranteed')],
                [<Truck size={16} />, t('product.worldwideShipping')],
                [<RefreshCw size={16} />, t('product.returns14')],
              ].map(([ic, lbl], i) => (
                <div key={i} className="flex items-center gap-3 rounded-[12px] bg-beige/40 p-4 sm:flex-col sm:justify-center sm:text-center sm:bg-beige/60">
                  <div className="text-gold">{ic as React.ReactNode}</div>
                  <p className="font-sans text-[11px] font-medium text-subtle uppercase tracking-wider">{lbl as string}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {related.length > 0 && (
          <div className="border-t border-beige pt-16 sm:pt-24">
            <h2 className="mb-8 font-serif text-2xl font-bold text-ink sm:text-3xl sm:mb-12">{t('product.relatedTitle')}</h2>
            <div className="grid grid-cols-1 gap-5 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
