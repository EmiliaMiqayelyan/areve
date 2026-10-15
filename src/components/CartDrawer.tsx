'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Minus, Plus, ChevronLeft, ArrowRight } from 'lucide-react';
import StoreImage from '@/components/ui/StoreImage';
import { TelegramIcon, WhatsAppIcon } from '@/components/ui/BrandIcons';
import Link from 'next/link';
import { useCartStore } from '@/lib/store';
import { useTranslation } from '@/i18n/I18nProvider';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { buildOrderMessage } from '@/lib/buildOrderMessage';
import { formatPrice } from '@/lib/currency';
import { resolveProductImageSrc } from '@/lib/productImage';
import { publicProductPath } from '@/lib/resourceId';
import {
  buildTelegramOrderUrl,
  buildWhatsAppOrderUrl,
  resolveStoreTelegramUsername,
  resolveStoreWhatsAppNumber,
} from '@/lib/storeContact';

type CartStep = 'review' | 'messenger';
type MessengerChannel = 'whatsapp' | 'telegram';

export default function CartDrawer() {
  const { items, isOpen, toggleCart, removeItem, updateQuantity, total, count, clearCart } =
    useCartStore();
  const { t } = useTranslation();
  const { settings } = useSiteSettings();
  const [step, setStep] = useState<CartStep>('review');
  const [channel, setChannel] = useState<MessengerChannel>('whatsapp');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setStep('review');
      setSendError(null);
      setSending(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') toggleCart();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen, toggleCart]);

  const cartTotal = total();
  const itemCount = count();

  const handleSendOrder = useCallback(() => {
    if (items.length === 0 || sending) return;

    setSendError(null);
    setSending(true);

    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const message = buildOrderMessage(
        items,
        cartTotal,
        itemCount,
        origin,
        {
          introSingular: t('cart.orderIntroSingular'),
          introPlural: t('cart.orderIntroPlural'),
          link: t('cart.orderLink'),
          price: t('cart.orderPrice'),
          orderTotal: t('cart.orderTotal'),
          thanks: t('cart.orderThanks'),
        }
      );

      let url: string;

      if (channel === 'whatsapp') {
        const phone = resolveStoreWhatsAppNumber({
          businessPhone: settings.businessPhone,
          whatsappUrl: settings.whatsappUrl,
        });
        if (!phone) {
          setSendError(t('cart.messengerNotConfigured'));
          return;
        }
        url = buildWhatsAppOrderUrl(phone, message);
      } else {
        const username = resolveStoreTelegramUsername({
          telegramUrl: settings.telegramUrl,
        });
        if (!username) {
          setSendError(t('cart.messengerNotConfigured'));
          return;
        }
        url = buildTelegramOrderUrl(username, message);
      }

      window.open(url, '_blank', 'noopener,noreferrer');
    } catch {
      setSendError(t('cart.messengerNotConfigured'));
    } finally {
      setSending(false);
    }
  }, [items, sending, cartTotal, itemCount, channel, settings, t]);

  const headerTitle = step === 'review' ? t('cart.yourBag') : t('cart.chooseMessenger');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 z-[60] bg-secondary/40"
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={headerTitle}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-[440px] flex-col bg-background"
          >
            <div className="flex h-[var(--header-h)] shrink-0 items-center justify-between gap-3 border-b border-border px-5 sm:px-6">
              <div className="flex min-w-0 flex-1 items-center gap-2">
                {step === 'messenger' && (
                  <button
                    type="button"
                    onClick={() => setStep('review')}
                    aria-label={t('cart.back')}
                    className="icon-btn -ml-2.5 shrink-0"
                  >
                    <ChevronLeft size={20} strokeWidth={1.4} />
                  </button>
                )}
                <span className={`min-w-0 ${step === 'messenger' ? 'text-[14px] font-medium leading-snug' : 'truncate font-display text-[20px]'}`}>
                  {headerTitle}
                </span>
                {step === 'review' && itemCount > 0 && (
                  <span className="shrink-0 text-[13px] tabular-nums text-muted">({itemCount})</span>
                )}
              </div>
              <button type="button" onClick={toggleCart} aria-label={t('header.close')} className="icon-btn -mr-2.5 shrink-0">
                <X size={20} strokeWidth={1.4} />
              </button>
            </div>

            {step === 'review' ? (
              <>
                <div className="flex-1 overflow-y-auto px-5 sm:px-6">
                  {items.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center py-16 text-center">
                      <ShoppingBag size={40} strokeWidth={1} className="text-primary" />
                      <p className="mt-5 font-display text-[22px] text-text">{t('cart.empty')}</p>
                      <p className="mt-2 max-w-[260px] text-[14px] text-muted">{t('cart.emptyHint')}</p>
                      <Link href="/products" onClick={toggleCart} className="btn-primary mt-8">
                        {t('cart.shopNow')} <ArrowRight size={14} />
                      </Link>
                    </div>
                  ) : (
                    <ul className="divide-y divide-border">
                      <AnimatePresence initial={false}>
                        {items.map((item) => {
                          const src = resolveProductImageSrc(item.image);
                          return (
                            <motion.li
                              key={item.id}
                              layout
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0, x: 30 }}
                              className="flex gap-4 py-5"
                            >
                              <Link
                                href={publicProductPath(item.id)}
                                onClick={toggleCart}
                                className="relative block aspect-[3/4] w-20 shrink-0 overflow-hidden bg-surface-deep"
                              >
                                {src && <StoreImage src={src} alt={item.name} fill />}
                              </Link>
                              <div className="flex min-w-0 flex-1 flex-col">
                                <div className="flex items-start justify-between gap-3">
                                  <Link
                                    href={publicProductPath(item.id)}
                                    onClick={toggleCart}
                                    className="line-clamp-2 font-display text-[15px] leading-snug text-text no-underline hover:text-primary-deep"
                                  >
                                    {item.name}
                                  </Link>
                                  <p className="price shrink-0 text-[14px] text-text">{formatPrice(item.price * item.quantity)}</p>
                                </div>
                                <p className="mt-1 text-[12px] tabular-nums text-muted">
                                  {formatPrice(item.price)} × {item.quantity}
                                </p>
                                <div className="mt-auto flex items-center justify-between pt-3">
                                  <div className="flex h-9 items-center border border-border">
                                    <button
                                      type="button"
                                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                      aria-label={t('cart.decrease')}
                                      className="flex h-full w-9 cursor-pointer items-center justify-center border-none bg-transparent text-text"
                                    >
                                      <Minus size={12} strokeWidth={1.6} />
                                    </button>
                                    <span className="w-7 text-center text-[13px] tabular-nums">{item.quantity}</span>
                                    <button
                                      type="button"
                                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                      aria-label={t('cart.increase')}
                                      className="flex h-full w-9 cursor-pointer items-center justify-center border-none bg-transparent text-text"
                                    >
                                      <Plus size={12} strokeWidth={1.6} />
                                    </button>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeItem(item.id)}
                                    className="cursor-pointer border-none bg-transparent p-1 text-[12px] text-muted underline-offset-4 transition-colors hover:text-text hover:underline"
                                  >
                                    {t('cart.remove')}
                                  </button>
                                </div>
                              </div>
                            </motion.li>
                          );
                        })}
                      </AnimatePresence>
                    </ul>
                  )}
                </div>

                {items.length > 0 && (
                  <div className="shrink-0 border-t border-border bg-surface px-5 pb-5 pt-5 sm:px-6" style={{ paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}>
                    <div className="flex items-baseline justify-between">
                      <span className="text-[13px] uppercase tracking-[0.12em] text-muted">{t('common.total')}</span>
                      <span className="price text-[22px] text-text">{formatPrice(cartTotal)}</span>
                    </div>
                    <p className="mt-2 text-[12.5px] leading-relaxed text-muted">{t('cart.orderNote')}</p>
                    <button type="button" onClick={() => setStep('messenger')} className="btn-primary mt-5 w-full">
                      {t('cart.sendYourOrder')} <ArrowRight size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={clearCart}
                      className="mt-3 w-full cursor-pointer border-none bg-transparent py-2 text-[12.5px] text-muted underline-offset-4 transition-colors hover:text-text hover:underline"
                    >
                      {t('cart.clearBag')}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-5 py-6 sm:px-6">
                  <MessengerOption
                    label={t('cart.sendViaWhatsApp')}
                    selected={channel === 'whatsapp'}
                    onSelect={() => setChannel('whatsapp')}
                    icon={<WhatsAppIcon size={20} />}
                    accent="#25D366"
                  />
                  <MessengerOption
                    label={t('cart.sendViaTelegram')}
                    selected={channel === 'telegram'}
                    onSelect={() => setChannel('telegram')}
                    icon={<TelegramIcon size={20} />}
                    accent="#229ED9"
                  />

                  <div className="mt-3 border border-border bg-surface p-5">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-muted">{t('common.total')}</p>
                    <p className="price mt-1 text-[24px] text-text">{formatPrice(cartTotal)}</p>
                    <p className="mt-1 text-[13px] text-muted">
                      {t('cart.orderItemCount').replace('{count}', String(itemCount))}
                    </p>
                  </div>

                  {sendError && (
                    <p role="alert" className="text-[13px] text-[#a33a2b]">
                      {sendError}
                    </p>
                  )}
                </div>

                <div className="shrink-0 border-t border-border px-5 pt-5 sm:px-6" style={{ paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}>
                  <button
                    type="button"
                    onClick={handleSendOrder}
                    disabled={items.length === 0 || sending}
                    className="btn-primary w-full"
                  >
                    {sending ? t('cart.openingMessenger') : t('cart.sendOrder')}
                  </button>
                  <button type="button" onClick={() => setStep('review')} className="btn-outline mt-3 w-full">
                    {t('cart.back')}
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function MessengerOption({
  label,
  selected,
  onSelect,
  icon,
  accent,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
  icon: React.ReactNode;
  accent: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`flex w-full cursor-pointer items-center gap-4 border bg-white px-4 py-4 text-left transition-colors ${
        selected ? 'border-text' : 'border-border hover:border-muted'
      }`}
    >
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-text/60">
        {selected && <span className="h-2.5 w-2.5 rounded-full bg-text" />}
      </span>
      <span style={{ color: accent }} className="shrink-0">
        {icon}
      </span>
      <span className="text-[15px] text-text">{label}</span>
    </button>
  );
}
