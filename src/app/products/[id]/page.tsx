'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronLeft, ChevronRight, Heart, Minus, Package, Plus, Shield, ShoppingBag, Truck } from 'lucide-react';
import StoreImage from '@/components/ui/StoreImage';
import SunMark from '@/components/ui/SunMark';
import ProductCard, { ProductCardSkeleton } from '@/components/ui/ProductCard';
import { WhatsAppIcon } from '@/components/ui/BrandIcons';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { useCartStore, useWishlistStore } from '@/lib/store';
import { useTranslation } from '@/i18n/I18nProvider';
import { pickLocalized } from '@/lib/localizedText';
import { formatPrice } from '@/lib/currency';
import { useProductQuery, useProductsQuery } from '@/lib/useProductsQuery';
import { readExtraImages, stripExtraImages } from '@/lib/extraProductImages';
import { resolveProductImageSrc } from '@/lib/productImage';
import { publicProductPath } from '@/lib/resourceId';
import { useCategoryLabels } from '@/lib/useCatalog';
import { buildWhatsAppOrderUrl, resolveStoreWhatsAppNumber } from '@/lib/storeContact';

function DetailSkeleton() {
  return (
    <div className="wrap pb-20 pt-6">
      <div className="skeleton mb-8 h-3 w-48" />
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="skeleton aspect-[4/5] lg:col-span-7" />
        <div className="space-y-4 lg:col-span-5">
          <div className="skeleton h-3 w-24" />
          <div className="skeleton h-9 w-3/4" />
          <div className="skeleton h-6 w-32" />
          <div className="skeleton mt-8 h-12 w-full" />
        </div>
      </div>
    </div>
  );
}

const noopSubscribe = () => () => {};

export default function ProductDetailPage() {
  const { t, locale } = useTranslation();
  const { settings } = useSiteSettings();
  const { id } = useParams<{ id: string }>();
  const productId = String(id ?? '');
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  const [activeIndex, setActiveIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const origin = useSyncExternalStore(noopSubscribe, () => window.location.origin, () => '');
  const [showStickyBar, setShowStickyBar] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);
  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setActiveIndex(0);
    setFailed({});
    setQuantity(1);
  }, [productId]);

  useEffect(() => () => { if (addedTimer.current) clearTimeout(addedTimer.current); }, []);

  const { items: cartItems, addItem, updateQuantity } = useCartStore();
  const { toggleWishlist, isWishlisted } = useWishlistStore();
  const labels = useCategoryLabels();

  const { data: product, isLoading: productLoading } = useProductQuery(productId);

  const { data: relatedPool = [], isLoading: relatedLoading } = useProductsQuery(
    {
      active: true,
      category: product?.category,
      excludeId: productId,
      limit: 4,
    },
    { enabled: Boolean(product?.category) }
  );

  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [product]);

  if (productLoading) return <DetailSkeleton />;

  if (!product) {
    return (
      <div className="wrap flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
        <SunMark className="mb-6 w-16 text-primary" />
        <p className="font-display text-[26px] text-text">{t('product.notFound')}</p>
        <Link href="/products" className="btn-outline mt-8">
          <ChevronLeft size={15} strokeWidth={1.5} /> {t('product.backToProducts')}
        </Link>
      </div>
    );
  }

  const related = relatedPool.slice(0, 4);
  const wishlisted = isWishlisted(product.id);
  const gallery = [product.image, ...readExtraImages(product)]
    .map((src) => resolveProductImageSrc(src))
    .filter((src, index, all) => src && all.indexOf(src) === index)
    .slice(0, 4);
  const safeIndex = Math.min(activeIndex, Math.max(gallery.length - 1, 0));
  const activeSrc = gallery[safeIndex] ?? '';
  const displayName = pickLocalized(product.name, locale);
  const displayDescription = stripExtraImages(pickLocalized(product.description, locale));
  const categoryLabel = labels[product.category];
  const badgeRaw = product.badge ? pickLocalized(product.badge, locale) : '';
  const badgeTranslated = badgeRaw ? t(`product.badge_${badgeRaw}`) : '';
  const badgeLabel = badgeTranslated.startsWith('product.') ? badgeRaw : badgeTranslated;

  const whatsappNumber = resolveStoreWhatsAppNumber({
    businessPhone: settings.businessPhone,
    whatsappUrl: settings.whatsappUrl,
  });
  const askHref = whatsappNumber
    ? buildWhatsAppOrderUrl(
        whatsappNumber,
        `${t('product.askMessage')}\n${displayName}${origin ? `\n${origin}${publicProductPath(product.id)}` : ''}`
      )
    : '';

  const handleAdd = () => {
    const existing = cartItems.find((i) => i.id === product.id);
    addItem({ ...product, name: displayName });
    if (quantity > 1) updateQuantity(product.id, (existing?.quantity ?? 0) + quantity);
    setAdded(true);
    if (addedTimer.current) clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setAdded(false), 1800);
  };

  const step = (dir: 1 | -1) => setActiveIndex((i) => (i + dir + gallery.length) % gallery.length);

  return (
    <div className="pb-24 lg:pb-0">
      <div className="wrap pt-5 sm:pt-6">
        <nav aria-label="Breadcrumb" className="mb-6 text-[12px] text-muted sm:mb-8">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link href="/" className="no-underline hover:text-text">{t('common.home')}</Link></li>
            <li aria-hidden>/</li>
            <li><Link href="/products" className="no-underline hover:text-text">{settings.siteContent.pages.shop.title}</Link></li>
            {categoryLabel && (
              <>
                <li aria-hidden>/</li>
                <li>
                  <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="no-underline hover:text-text">
                    {categoryLabel}
                  </Link>
                </li>
              </>
            )}
            <li aria-hidden>/</li>
            <li aria-current="page" className="max-w-[50vw] truncate text-text">{displayName}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-14 xl:gap-20">
          {/* Gallery */}
          <div className="lg:col-span-7">
            <div className="flex flex-col gap-3">
              <div className="relative -mx-[var(--container-px)] aspect-[4/5] flex-1 overflow-hidden bg-surface-deep sm:mx-0">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={activeSrc}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    {activeSrc && !failed[activeSrc] ? (
                      <StoreImage
                        src={activeSrc}
                        alt={displayName}
                        fill
                        priority
                        onError={() => setFailed((f) => ({ ...f, [activeSrc]: true }))}
                      />
                    ) : (
                      <span className="absolute inset-0 flex items-center justify-center text-primary/60">
                        <SunMark className="w-24" />
                      </span>
                    )}
                  </motion.div>
                </AnimatePresence>
                {badgeLabel && <span className="badge badge-gold absolute left-4 top-4">{badgeLabel}</span>}
                {gallery.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => step(-1)}
                      aria-label={t('common.previous')}
                      className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-none bg-background/90 text-text transition-colors hover:bg-background"
                    >
                      <ChevronLeft size={18} strokeWidth={1.4} />
                    </button>
                    <button
                      type="button"
                      onClick={() => step(1)}
                      aria-label={t('common.next')}
                      className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-none bg-background/90 text-text transition-colors hover:bg-background"
                    >
                      <ChevronRight size={18} strokeWidth={1.4} />
                    </button>
                  </>
                )}
              </div>

              {gallery.length > 1 && (
                <div className="no-scrollbar flex gap-2 overflow-x-auto">
                  {gallery.map((src, galleryIndex) => {
                    const selected = galleryIndex === safeIndex;
                    return (
                      <button
                        key={`${src}-${galleryIndex}`}
                        type="button"
                        onClick={() => setActiveIndex(galleryIndex)}
                        aria-label={t('product.imageOf', { n: galleryIndex + 1, count: gallery.length })}
                        aria-pressed={selected}
                        className={`relative aspect-[4/5] w-16 shrink-0 cursor-pointer overflow-hidden border bg-surface-deep p-0 transition-opacity sm:w-20 ${
                          selected ? 'border-text' : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <StoreImage src={src} alt="" fill />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+32px)]">
              {categoryLabel && (
                <Link
                  href={`/products?category=${encodeURIComponent(product.category)}`}
                  className="eyebrow no-underline hover:text-text"
                >
                  {categoryLabel}
                </Link>
              )}
              <h1 className="mt-3 text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.12]">{displayName}</h1>
              <p className="price mt-4 text-[22px] text-text">{formatPrice(product.price)}</p>

              {displayDescription && (
                <p className="mt-6 whitespace-pre-line text-[15px] leading-relaxed text-muted">{displayDescription}</p>
              )}

              <div ref={ctaRef} className="mt-8 border-t border-border pt-8">
                <div className="flex items-stretch gap-3">
                  <div className="flex h-[52px] shrink-0 items-center border border-border" role="group" aria-label={t('product.quantity')}>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      aria-label={t('cart.decrease')}
                      className="flex h-full w-11 cursor-pointer items-center justify-center border-none bg-transparent text-text disabled:cursor-not-allowed disabled:text-muted/50"
                    >
                      <Minus size={14} strokeWidth={1.5} />
                    </button>
                    <span className="w-8 text-center text-[15px] tabular-nums" aria-live="polite">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                      aria-label={t('cart.increase')}
                      className="flex h-full w-11 cursor-pointer items-center justify-center border-none bg-transparent text-text"
                    >
                      <Plus size={14} strokeWidth={1.5} />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleAdd}
                    className="btn-primary min-h-[52px] min-w-0 flex-1 whitespace-normal rounded-none! px-3 text-center leading-tight tracking-[0.08em] sm:px-4 sm:tracking-[0.12em]"
                  >
                    {added ? <Check size={16} strokeWidth={1.8} /> : <ShoppingBag size={16} strokeWidth={1.5} />}
                    {added ? t('product.added') : t('product.addToBag')}
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product)}
                    aria-pressed={wishlisted}
                    aria-label={wishlisted ? t('product.removeFromWishlist') : t('product.addToWishlist')}
                    className={`flex h-[52px] w-[52px] shrink-0 cursor-pointer items-center justify-center border bg-transparent transition-colors ${
                      wishlisted ? 'border-primary text-primary' : 'border-border text-text hover:border-text'
                    }`}
                  >
                    <Heart size={18} strokeWidth={1.4} fill={wishlisted ? 'currentColor' : 'none'} />
                  </button>
                </div>

                <p className="mt-4 text-[13px] leading-relaxed text-muted">{t('product.orderHow')}</p>

                {askHref && (
                  <a href={askHref} target="_blank" rel="noopener noreferrer" className="link-underline mt-5">
                    <WhatsAppIcon size={15} className="text-primary-deep" /> {t('product.askQuestion')}
                  </a>
                )}
              </div>

              <ul className="mt-10 divide-y divide-border border-y border-border">
                {[
                  { icon: Shield, label: t('product.quality') },
                  { icon: Truck, label: t('product.delivery') },
                  { icon: Package, label: t('product.packaging') },
                ].map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-4 py-4 text-[14px] text-text">
                    <Icon size={18} strokeWidth={1.3} className="text-primary" aria-hidden />
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {(relatedLoading || related.length > 0) && product.category && (
        <section className="section mt-12 border-t border-border lg:mt-20">
          <div className="wrap">
            <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
              <h2 className="section-title">{t('product.relatedTitle')}</h2>
              {categoryLabel && (
                <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="link-underline shrink-0">
                  {categoryLabel}
                </Link>
              )}
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:grid-cols-4">
              {relatedLoading
                ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
                : related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </div>
        </section>
      )}

      {/* Mobile sticky purchase bar */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 py-3 backdrop-blur-md lg:hidden"
            style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
          >
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] text-text">{displayName}</p>
                <p className="price text-[14px] text-text">{formatPrice(product.price)}</p>
              </div>
              <button type="button" onClick={handleAdd} className="btn-primary min-h-[46px] shrink-0 px-5">
                {added ? <Check size={15} strokeWidth={1.8} /> : <ShoppingBag size={15} strokeWidth={1.5} />}
                {added ? t('product.added') : t('product.addToBag')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
