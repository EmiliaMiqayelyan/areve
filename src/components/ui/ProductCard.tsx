'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
import { Product, useCartStore, useWishlistStore } from '@/lib/store';
import { useTranslation } from '@/i18n/I18nProvider';
import { pickLocalized } from '@/lib/localizedText';

const FALLBACK_PRODUCT_IMAGE = '/images/prod-bag-a.png';

function resolveProductImageSrc(image?: string): string {
  const src = String(image ?? '').trim();
  if (!src) return FALLBACK_PRODUCT_IMAGE;

  // Uploaded images are stored as data URLs from the admin UI.
  if (src.startsWith('data:image/')) return src;

  // We currently don't serve filesystem uploads from `/uploads/*`,
  // so treat these URLs as broken and fall back to a placeholder.
  if (src.startsWith('/uploads/')) return FALLBACK_PRODUCT_IMAGE;

  if (/^https?:\/\//i.test(src)) return src;
  if (src.startsWith('/')) return src;
  // Convert relative paths to absolute (public assets)
  return `/${src.replace(/^\/+/, '')}`;
}

const badgeColors: Record<string, { bg: string; color: string }> = {
  New:       { bg: '#C7D3C0', color: '#3d4d38' },
  Bestseller:{ bg: '#E6C97A', color: '#5a4a1e' },
  Limited:   { bg: '#E8CFCB', color: '#6b3e3a' },
  Handmade:  { bg: '#D6C3B3', color: '#5a4040' },
};

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { t, locale } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    // Reset per product so switching categories doesn't keep old failure state.
    setImgFailed(false);
  }, [product?.image]);

  const { addItem } = useCartStore();
  const { toggleWishlist, isWishlisted } = useWishlistStore();
  const wishlisted = mounted && isWishlisted(product.id);
  const badge = product.badge ? (badgeColors[product.badge] ?? badgeColors.Handmade) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="card"
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: 260, overflow: 'hidden', flexShrink: 0 }}>
        {String(product.image ?? '').startsWith('data:image/') ? (
          <img
            src={imgFailed ? FALLBACK_PRODUCT_IMAGE : resolveProductImageSrc(product.image)}
            alt={pickLocalized(product.name, locale)}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s' }}
            className="group-hover:scale-105"
            loading="lazy"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <Image
            src={imgFailed ? FALLBACK_PRODUCT_IMAGE : resolveProductImageSrc(product.image)}
            alt={pickLocalized(product.name, locale)}
            fill
            style={{ objectFit: 'cover', transition: 'transform 0.6s' }}
            className="group-hover:scale-105"
            loading="lazy"
            onError={() => setImgFailed(true)}
          />
        )}
        {/* Soft overlay on hover */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(248,245,242,0)', transition: 'background 0.3s' }} className="hover-overlay" />

        {/* Badge */}
        {badge && product.badge && (
          <span style={{ position: 'absolute', top: 12, left: 12, ...badge, fontFamily: "'DM Sans',sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', padding: '3px 10px', borderRadius: 99 }}>
            {t(`product.badge_${product.badge}` as 'product.badge_New') || product.badge}
          </span>
        )}

        {/* Wishlist */}
        <button
          onClick={() => toggleWishlist(product)}
          style={{ position: 'absolute', top: 12, right: 12, width: 34, height: 34, borderRadius: '50%', background: 'rgba(248,245,242,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s', backdropFilter: 'blur(4px)' }}
        >
          <Heart 
            size={15} 
            strokeWidth={1.8} 
            fill={wishlisted ? '#E8CFCB' : 'none'} 
            color={wishlisted ? '#c97a7a' : '#AFAFAF'} 
          />
        </button>

        {/* Quick add — slides up */}
        <motion.div
          initial={{ y: 12, opacity: 0 }}
          whileHover={{ y: 0, opacity: 1 }}
          style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 12px 12px' }}
          className="quick-add"
        >
          <button
            onClick={() => addItem({ ...product, name: pickLocalized(product.name, locale) })}
            style={{ width: '100%', padding: '10px', background: '#E6C97A', border: 'none', borderRadius: 99, fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: '1.2px', textTransform: 'uppercase', color: '#5a4a1e', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'background 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#F4D58D')}
            onMouseLeave={e => (e.currentTarget.style.background = '#E6C97A')}
          >
            <ShoppingBag size={13} strokeWidth={2} />
            {t('product.addToBag')}
          </button>
        </motion.div>
      </div>

      {/* Content */}
      <div style={{ padding: '16px 20px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: '#AFAFAF', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 6 }}>
          {product.category}
        </p>
        <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, color: '#2B2B2B', marginBottom: 10, lineHeight: 1.3 }}>
          {pickLocalized(product.name, locale)}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: '#2B2B2B' }}>${product.price}</span>
          <Link
            href={`/products/${product.id}`}
            style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: '#BFA6A0', textDecoration: 'none', borderBottom: '1px solid #BFA6A0', paddingBottom: 1, transition: 'color 0.2s, border-color 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#E6C97A'; (e.currentTarget as HTMLElement).style.borderColor = '#E6C97A'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#BFA6A0'; (e.currentTarget as HTMLElement).style.borderColor = '#BFA6A0'; }}
          >
            {t('product.viewDetails')}
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
