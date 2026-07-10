'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Minus, Plus, Trash2, ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/lib/store';
import { useTranslation } from '@/i18n/I18nProvider';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { buildOrderMessage } from '@/lib/buildOrderMessage';
import { formatPrice } from '@/lib/currency';
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
          intro: t('cart.orderIntro'),
          link: t('cart.orderLink'),
          quantity: t('cart.orderQuantity'),
          unitPrice: t('cart.orderUnitPrice'),
          lineTotal: t('cart.orderLineTotal'),
          orderTotal: t('cart.orderTotal'),
          itemCount: t('cart.orderItemCount'),
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

  const headerTitle =
    step === 'review' ? t('cart.yourBag') : t('cart.chooseMessenger');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(43,43,43,0.25)',
              backdropFilter: 'blur(4px)',
              zIndex: 60,
            }}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            style={{
              position: 'fixed',
              right: 0,
              top: 0,
              bottom: 0,
              width: '100%',
              maxWidth: 400,
              background: '#F8F5F2',
              zIndex: 70,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-8px 0 40px rgba(180,156,140,0.18)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                padding: '16px 20px',
                borderBottom: '1px solid #EADFD8',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: 1 }}>
                {step === 'messenger' && (
                  <button
                    type="button"
                    onClick={() => setStep('review')}
                    aria-label={t('cart.back')}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#7A7A7A',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <ChevronLeft size={18} />
                  </button>
                )}
                <ShoppingBag size={16} color="#E6C97A" strokeWidth={1.8} style={{ flexShrink: 0 }} />
                <span
                  style={{
                    fontFamily: step === 'messenger' ? 'var(--font-sans)' : 'var(--font-serif)',
                    fontSize: step === 'messenger' ? 13 : 17,
                    fontWeight: step === 'messenger' ? 500 : 400,
                    lineHeight: 1.35,
                    color: '#2B2B2B',
                    minWidth: 0,
                  }}
                >
                  {headerTitle}
                </span>
                {step === 'review' && items.length > 0 && (
                  <span
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 12,
                      color: '#AFAFAF',
                      flexShrink: 0,
                    }}
                  >
                    ({items.length})
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={toggleCart}
                aria-label={t('cart.back')}
                style={{
                  background: '#EDE6DF',
                  border: 'none',
                  borderRadius: '9999px',
                  width: 36,
                  height: 36,
                  minWidth: 36,
                  minHeight: 36,
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#7A7A7A',
                }}
              >
                <X size={14} />
              </button>
            </div>

            {step === 'review' ? (
              <>
                <div
                  style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '20px 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                  }}
                >
                  {items.length === 0 ? (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        gap: 12,
                        textAlign: 'center',
                      }}
                    >
                      <ShoppingBag size={48} color="#D6C3B3" strokeWidth={1.2} />
                      <p
                        style={{
                          fontFamily: 'var(--font-serif)',
                          fontSize: 20,
                          color: '#2B2B2B',
                        }}
                      >
                        {t('cart.empty')}
                      </p>
                      <p
                        style={{
                          fontFamily: 'var(--font-sans)',
                          fontSize: 14,
                          color: '#AFAFAF',
                        }}
                      >
                        {t('cart.emptyHint')}
                      </p>
                      <Link
                        href="/products"
                        onClick={toggleCart}
                        className="btn-primary"
                        style={{ marginTop: 8, textDecoration: 'none' }}
                      >
                        {t('cart.shopNow')}
                      </Link>
                    </div>
                  ) : (
                    items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        style={{
                          display: 'flex',
                          gap: 12,
                          background: '#fff',
                          borderRadius: 14,
                          padding: 12,
                          border: '1px solid #EADFD8',
                        }}
                      >
                        <div
                          style={{
                            position: 'relative',
                            width: 72,
                            height: 72,
                            borderRadius: 10,
                            overflow: 'hidden',
                            flexShrink: 0,
                          }}
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              justifyContent: 'space-between',
                              gap: 8,
                            }}
                          >
                            <p
                              style={{
                                fontFamily: 'var(--font-sans)',
                                fontSize: 14,
                                fontWeight: 500,
                                color: '#2B2B2B',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                flex: 1,
                              }}
                            >
                              {item.name}
                            </p>
                            <p
                              style={{
                                fontFamily: 'var(--font-serif)',
                                fontSize: 15,
                                fontWeight: 600,
                                color: '#2B2B2B',
                                flexShrink: 0,
                              }}
                            >
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                          <p
                            style={{
                              fontFamily: 'var(--font-sans)',
                              fontSize: 12,
                              color: '#AFAFAF',
                              marginTop: 2,
                            }}
                          >
                            {formatPrice(item.price)} × {item.quantity}
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              style={{
                                width: 26,
                                height: 26,
                                borderRadius: '50%',
                                background: '#F5F0EC',
                                border: '1px solid #EADFD8',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#7A7A7A',
                              }}
                            >
                              <Minus size={11} />
                            </button>
                            <span
                              style={{
                                fontFamily: 'var(--font-sans)',
                                fontSize: 13,
                                fontWeight: 500,
                                color: '#2B2B2B',
                                minWidth: 16,
                                textAlign: 'center',
                              }}
                            >
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              style={{
                                width: 26,
                                height: 26,
                                borderRadius: '50%',
                                background: '#F5F0EC',
                                border: '1px solid #EADFD8',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#7A7A7A',
                              }}
                            >
                              <Plus size={11} />
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#AFAFAF',
                            padding: 4,
                            alignSelf: 'flex-start',
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </motion.div>
                    ))
                  )}
                </div>

                {items.length > 0 && (
                  <div
                    style={{
                      padding: '20px 24px',
                      borderTop: '1px solid #EADFD8',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 12,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-sans)',
                          fontSize: 14,
                          color: '#7A7A7A',
                        }}
                      >
                        {t('common.total')}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-serif)',
                          fontSize: 24,
                          color: '#2B2B2B',
                        }}
                      >
                        {formatPrice(cartTotal)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep('messenger')}
                      className="btn-primary"
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      {t('cart.sendYourOrder')}
                    </button>
                    <button
                      onClick={clearCart}
                      className="btn-outline"
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      {t('cart.clearBag')}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <div
                  style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '20px 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 14,
                      color: '#7A7A7A',
                      marginBottom: 4,
                    }}
                  >
                    {t('cart.chooseMessenger')}
                  </p>

                  <MessengerOption
                    label={t('cart.sendViaWhatsApp')}
                    selected={channel === 'whatsapp'}
                    onSelect={() => setChannel('whatsapp')}
                    accent="#25D366"
                  />
                  <MessengerOption
                    label={t('cart.sendViaTelegram')}
                    selected={channel === 'telegram'}
                    onSelect={() => setChannel('telegram')}
                    accent="#229ED9"
                  />

                  <div
                    style={{
                      marginTop: 8,
                      padding: 14,
                      background: '#fff',
                      borderRadius: 12,
                      border: '1px solid #EADFD8',
                    }}
                  >
                    <p
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: 12,
                        color: '#AFAFAF',
                        marginBottom: 8,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                      }}
                    >
                      {t('common.total')}
                    </p>
                    <p
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: 22,
                        color: '#2B2B2B',
                      }}
                    >
                      {formatPrice(cartTotal)}
                    </p>
                    <p
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: 13,
                        color: '#7A7A7A',
                        marginTop: 4,
                      }}
                    >
                      {t('cart.orderItemCount').replace('{count}', String(itemCount))}
                    </p>
                  </div>

                  {sendError && (
                    <p
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: 13,
                        color: '#c0392b',
                      }}
                    >
                      {sendError}
                    </p>
                  )}
                </div>

                <div
                  style={{
                    padding: '20px 24px',
                    borderTop: '1px solid #EADFD8',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                  }}
                >
                  <button
                    type="button"
                    onClick={handleSendOrder}
                    disabled={items.length === 0 || sending}
                    className="btn-primary"
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      opacity: items.length === 0 || sending ? 0.65 : 1,
                      cursor: items.length === 0 || sending ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {sending ? t('cart.openingMessenger') : t('cart.sendOrder')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep('review')}
                    className="btn-outline"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    {t('cart.back')}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function MessengerOption({
  label,
  selected,
  onSelect,
  accent,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
  accent: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        width: '100%',
        padding: '14px 16px',
        background: selected ? '#fff' : 'transparent',
        border: `2px solid ${selected ? accent : '#EADFD8'}`,
        borderRadius: 14,
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'border-color 0.2s, background 0.2s',
      }}
    >
      <span
        style={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          border: `2px solid ${selected ? accent : '#D6C3B3'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {selected && (
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: accent,
            }}
          />
        )}
      </span>
      <span
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 15,
          fontWeight: 500,
          color: '#2B2B2B',
        }}
      >
        {label}
      </span>
    </button>
  );
}
