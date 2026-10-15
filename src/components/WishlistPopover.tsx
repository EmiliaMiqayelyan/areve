'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, X } from 'lucide-react';
import StoreImage from '@/components/ui/StoreImage';
import Link from 'next/link';
import { useCartStore, useWishlistStore } from '@/lib/store';
import { useTranslation } from '@/i18n/I18nProvider';
import { formatPrice } from '@/lib/currency';
import { pickLocalized } from '@/lib/localizedText';
import { resolveProductImageSrc } from '@/lib/productImage';
import { publicProductPath } from '@/lib/resourceId';

type WishlistPopoverProps = {
  anchorRef: React.RefObject<HTMLButtonElement | null>;
};

const PANEL_WIDTH = 340;

export default function WishlistPopover({ anchorRef }: WishlistPopoverProps) {
  const { items, isOpen, closeWishlistPanel, removeItem } = useWishlistStore();
  const { addItem } = useCartStore();
  const { t, locale } = useTranslation();
  const panelRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!isOpen || !anchorRef.current) {
      setPosition(null);
      return;
    }

    const updatePosition = () => {
      const rect = anchorRef.current!.getBoundingClientRect();
      const width = Math.min(PANEL_WIDTH, window.innerWidth - 24);
      const left = Math.min(Math.max(12, rect.right - width), window.innerWidth - width - 12);
      setPosition({ top: rect.bottom + 8, left });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen, anchorRef]);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (panelRef.current?.contains(target) || anchorRef.current?.contains(target)) return;
      closeWishlistPanel();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeWishlistPanel();
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeWishlistPanel, anchorRef]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && position && (
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-label={t('wishlist.title')}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          style={{ top: position.top, left: position.left, width: Math.min(PANEL_WIDTH, typeof window !== 'undefined' ? window.innerWidth - 24 : PANEL_WIDTH) }}
          className="fixed z-[100] overflow-hidden border border-border bg-background shadow-[0_24px_48px_-24px_rgba(21,18,15,0.35)]"
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="font-display text-[17px] text-text">
              {t('wishlist.title')}
              {items.length > 0 && <span className="ml-1.5 text-[13px] tabular-nums text-muted">({items.length})</span>}
            </p>
            <button type="button" onClick={closeWishlistPanel} aria-label={t('header.close')} className="icon-btn -mr-2 h-8 w-8">
              <X size={16} strokeWidth={1.5} />
            </button>
          </div>

          <div className="max-h-[360px] overflow-y-auto">
            {items.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <Heart size={30} strokeWidth={1} className="mx-auto text-primary" />
                <p className="mt-4 font-display text-[18px] text-text">{t('wishlist.empty')}</p>
                <Link href="/products" onClick={closeWishlistPanel} className="btn-primary mt-6 min-h-[42px] px-5">
                  {t('wishlist.shopNow')}
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {items.map((item) => {
                  const name = pickLocalized(item.name, locale);
                  const src = resolveProductImageSrc(item.image);
                  return (
                    <li key={item.id} className="flex gap-3 px-4 py-3">
                      <Link
                        href={publicProductPath(item.id)}
                        onClick={closeWishlistPanel}
                        className="relative block aspect-[3/4] w-14 shrink-0 overflow-hidden bg-surface-deep"
                      >
                        {src && <StoreImage src={src} alt={name} fill />}
                      </Link>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <Link
                          href={publicProductPath(item.id)}
                          onClick={closeWishlistPanel}
                          className="truncate text-[14px] text-text no-underline hover:text-primary-deep"
                        >
                          {name}
                        </Link>
                        <p className="price mt-0.5 text-[13px] text-text">{formatPrice(item.price)}</p>
                        <div className="mt-auto flex items-center gap-4 pt-1.5">
                          <button
                            type="button"
                            onClick={() => addItem({ ...item, name })}
                            className="inline-flex cursor-pointer items-center gap-1.5 border-none bg-transparent p-0 text-[12px] font-medium text-primary-deep hover:text-text"
                          >
                            <ShoppingBag size={13} strokeWidth={1.6} /> {t('product.addToBag')}
                          </button>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="cursor-pointer border-none bg-transparent p-0 text-[12px] text-muted hover:text-text"
                          >
                            {t('wishlist.remove')}
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {items.length > 0 && (
            <Link
              href="/products"
              onClick={closeWishlistPanel}
              className="block border-t border-border py-3 text-center text-[12px] font-medium uppercase tracking-[0.12em] text-text no-underline hover:bg-surface"
            >
              {t('wishlist.shopNow')}
            </Link>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
