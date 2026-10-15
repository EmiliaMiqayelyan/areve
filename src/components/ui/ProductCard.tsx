'use client';

import { useState, useEffect, useRef, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { Check, Heart, ShoppingBag } from 'lucide-react';
import StoreImage from '@/components/ui/StoreImage';
import SunMark from '@/components/ui/SunMark';
import { Product, useCartStore, useWishlistStore } from '@/lib/store';
import { useTranslation } from '@/i18n/I18nProvider';
import { pickLocalized } from '@/lib/localizedText';
import { formatPrice } from '@/lib/currency';
import { publicProductPath } from '@/lib/resourceId';
import { resolveProductImageSrc } from '@/lib/productImage';
import { useCategoryLabels } from '@/lib/useCatalog';

export function ProductCardSkeleton() {
  return (
    <div aria-hidden className="flex flex-col">
      <div className="skeleton aspect-[3/4]" />
      <div className="skeleton mt-4 h-2.5 w-1/3" />
      <div className="skeleton mt-2.5 h-3.5 w-3/4" />
      <div className="skeleton mt-2.5 h-3 w-1/4" />
    </div>
  );
}

type Props = {
  product: Product;
  index?: number;
  priority?: boolean;
  sizes?: 'default' | 'large';
};

const noopSubscribe = () => () => {};

export default function ProductCard({ product, priority = false, sizes = 'default' }: Props) {
  const { t, locale } = useTranslation();
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (addedTimer.current) clearTimeout(addedTimer.current); }, []);

  const labels = useCategoryLabels();
  const { addItem } = useCartStore();
  const { toggleWishlist, isWishlisted } = useWishlistStore();
  const wishlisted = mounted && isWishlisted(product.id);

  const productHref = publicProductPath(product.id);
  const productName = pickLocalized(product.name, locale);
  const categoryLabel = labels[product.category];
  const imageSrc = resolveProductImageSrc(product.image);
  const badgeRaw = product.badge ? pickLocalized(product.badge, locale) : '';
  const badgeLabel = badgeRaw ? t(`product.badge_${badgeRaw}`) : '';

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ ...product, name: productName });
    setAdded(true);
    if (addedTimer.current) clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setAdded(false), 1600);
  };

  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-[3/4] overflow-hidden bg-surface-deep">
        <Link href={productHref} className="absolute inset-0 block no-underline" aria-hidden tabIndex={-1}>
          {imageSrc && failedSrc !== imageSrc ? (
            <StoreImage
              src={imageSrc}
              alt={productName}
              fill
              priority={priority}
              className="transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
              onError={() => setFailedSrc(imageSrc)}
            />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-primary/60">
              <SunMark className="w-16" />
            </span>
          )}
        </Link>

        {badgeLabel && (
          <span className="badge badge-gold pointer-events-none absolute left-2.5 top-2.5 sm:left-3 sm:top-3">
            {badgeLabel.startsWith('product.') ? badgeRaw : badgeLabel}
          </span>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          aria-pressed={wishlisted}
          aria-label={wishlisted ? t('product.removeFromWishlist') : t('product.addToWishlist')}
          className={`absolute right-1.5 top-1.5 z-[2] flex h-10 w-10 cursor-pointer items-center justify-center border-none bg-transparent transition-colors sm:right-2 sm:top-2 ${
            wishlisted ? 'text-primary' : 'text-text/70 hover:text-text'
          }`}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-background/90 backdrop-blur-sm">
            <Heart size={15} strokeWidth={1.5} fill={wishlisted ? 'currentColor' : 'none'} />
          </span>
        </button>

        {/* Desktop: reveal on hover */}
        <button
          type="button"
          onClick={handleAdd}
          className="pc-quick absolute inset-x-3 bottom-3 z-[2] h-11 cursor-pointer items-center justify-center gap-2 border-none bg-secondary text-[11.5px] font-medium uppercase tracking-[0.12em] text-background transition-colors hover:bg-primary hover:text-secondary"
        >
          {added ? <Check size={14} strokeWidth={1.8} /> : <ShoppingBag size={14} strokeWidth={1.6} />}
          {added ? t('product.added') : t('product.addToBag')}
        </button>

        {/* Touch: always-visible compact button */}
        <button
          type="button"
          onClick={handleAdd}
          aria-label={t('product.addToBag')}
          className={`pc-quick-touch absolute bottom-2 right-2 z-[2] flex h-10 w-10 cursor-pointer items-center justify-center border-none transition-colors ${
            added ? 'bg-primary text-secondary' : 'bg-background/95 text-text'
          }`}
        >
          {added ? <Check size={16} strokeWidth={1.8} /> : <ShoppingBag size={16} strokeWidth={1.5} />}
        </button>
      </div>

      <div className="flex flex-1 flex-col pt-3 sm:pt-4">
        {categoryLabel && (
          <p className="mb-1 truncate text-[10.5px] uppercase tracking-[0.14em] text-muted sm:text-[11px]">{categoryLabel}</p>
        )}
        <h3 className={`font-display font-normal leading-snug text-text ${sizes === 'large' ? 'text-[17px] sm:text-[19px]' : 'text-[15px] sm:text-[16px]'}`}>
          <Link href={productHref} className="no-underline transition-colors hover:text-primary-deep">
            {productName}
          </Link>
        </h3>
        <p className="price mt-1.5 text-[14px] text-text sm:text-[15px]">{formatPrice(product.price)}</p>
      </div>
    </article>
  );
}
