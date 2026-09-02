'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X } from 'lucide-react';
import StoreImage from '@/components/ui/StoreImage';
import Link from 'next/link';
import { useWishlistStore } from '@/lib/store';
import { useTranslation } from '@/i18n/I18nProvider';
import { formatPrice } from '@/lib/currency';

type WishlistPopoverProps = {
  anchorRef: React.RefObject<HTMLButtonElement | null>;
};

const PANEL_WIDTH = 300;

export default function WishlistPopover({ anchorRef }: WishlistPopoverProps) {
  const { items, isOpen, closeWishlistPanel, removeItem } = useWishlistStore();
  const { t } = useTranslation();
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
      const left = Math.min(
        Math.max(16, rect.right - PANEL_WIDTH),
        window.innerWidth - PANEL_WIDTH - 16
      );
      setPosition({
        top: rect.bottom + 10,
        left,
      });
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
      if (
        panelRef.current?.contains(target) ||
        anchorRef.current?.contains(target)
      ) {
        return;
      }
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
          initial={{ opacity: 0, y: -6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.98 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            top: position.top,
            left: position.left,
            width: PANEL_WIDTH,
            maxWidth: 'calc(100vw - 32px)',
            background: '#fff',
            borderRadius: 16,
            border: '1px solid #EADFD8',
            boxShadow: '0 12px 40px rgba(43,43,43,0.12)',
            zIndex: 100,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 16px',
              borderBottom: '1px solid #F0E8E2',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Heart size={15} color="#E6C97A" strokeWidth={1.8} fill="#E6C97A30" />
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 16,
                  color: '#2B2B2B',
                }}
              >
                {t('wishlist.title')}
              </span>
              {items.length > 0 && (
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 12,
                    color: '#AFAFAF',
                  }}
                >
                  ({items.length})
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={closeWishlistPanel}
              aria-label={t('cart.back')}
              style={{
                background: '#F5F0EC',
                border: 'none',
                borderRadius: '50%',
                width: 26,
                height: 26,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#7A7A7A',
              }}
            >
              <X size={13} />
            </button>
          </div>

          <div
            style={{
              maxHeight: 320,
              overflowY: 'auto',
              padding: items.length === 0 ? '28px 20px' : '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            {items.length === 0 ? (
              <div style={{ textAlign: 'center' }}>
                <Heart size={36} color="#D6C3B3" strokeWidth={1.2} style={{ margin: '0 auto 10px' }} />
                <p
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 16,
                    color: '#2B2B2B',
                    marginBottom: 14,
                  }}
                >
                  {t('wishlist.empty')}
                </p>
                <Link
                  href="/products"
                  onClick={closeWishlistPanel}
                  className="btn-primary"
                  style={{
                    display: 'inline-flex',
                    textDecoration: 'none',
                    fontSize: 13,
                    padding: '10px 18px',
                  }}
                >
                  {t('wishlist.shopNow')}
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    gap: 10,
                    padding: 8,
                    borderRadius: 12,
                    background: '#FAF7F4',
                    border: '1px solid #F0E8E2',
                  }}
                >
                  <Link
                    href={`/products/${item.id}`}
                    onClick={closeWishlistPanel}
                    style={{
                      position: 'relative',
                      width: 56,
                      height: 56,
                      borderRadius: 8,
                      overflow: 'hidden',
                      flexShrink: 0,
                    }}
                  >
                    <StoreImage src={item.image} alt={item.name} fill />
                  </Link>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link
                      href={`/products/${item.id}`}
                      onClick={closeWishlistPanel}
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: 13,
                        fontWeight: 500,
                        color: '#2B2B2B',
                        textDecoration: 'none',
                        display: 'block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.name}
                    </Link>
                    <p
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: 14,
                        color: '#2B2B2B',
                        marginTop: 2,
                      }}
                    >
                      {formatPrice(item.price)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    aria-label={t('wishlist.remove')}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#C9A0A0',
                      padding: 4,
                      alignSelf: 'flex-start',
                    }}
                  >
                    <Heart size={15} fill="#E6C97A50" strokeWidth={1.6} />
                  </button>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div
              style={{
                padding: '10px 12px 12px',
                borderTop: '1px solid #F0E8E2',
              }}
            >
              <Link
                href="/products"
                onClick={closeWishlistPanel}
                style={{
                  display: 'block',
                  textAlign: 'center',
                  fontFamily: 'var(--font-sans)',
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  color: '#7A7A7A',
                  textDecoration: 'none',
                  padding: '8px 0',
                }}
              >
                {t('wishlist.shopNow')}
              </Link>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
