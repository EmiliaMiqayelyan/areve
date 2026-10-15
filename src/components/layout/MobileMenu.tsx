'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';
import areve from '../../../public/areve.png';
import { InstagramIcon, WhatsAppIcon } from '@/components/ui/BrandIcons';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { useTranslation } from '@/i18n/I18nProvider';
import type { Locale } from '@/i18n/types';

const LOCALE_NAMES: Partial<Record<Locale, string>> = { hy: 'Հայերեն', en: 'English' };

type Props = {
  navLinks: ReadonlyArray<{ href: string; label: string }>;
  isActive: (href: string) => boolean;
  onClose: () => void;
};

export default function MobileMenu({ navLinks, isActive, onClose }: Props) {
  const { t, locale, setLocale, locales, localeLabels } = useTranslation();
  const { settings } = useSiteSettings();

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[90] lg:hidden" role="dialog" aria-modal="true" aria-label={t('header.menu')}>
      <motion.div
        className="absolute inset-0 bg-secondary/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.aside
        className="absolute inset-y-0 left-0 flex w-[min(88vw,400px)] flex-col bg-background"
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex h-[var(--header-h)] items-center justify-between border-b border-border px-5">
          <Link href="/" onClick={onClose} aria-label="AREVÉ Collections">
            <Image src={areve} alt="AREVÉ Collections" className="h-8 w-auto" unoptimized />
          </Link>
          <button type="button" className="icon-btn -mr-2" onClick={onClose} aria-label={t('header.close')}>
            <X size={19} strokeWidth={1.4} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-8">
          <nav aria-label="Mobile" className="border-b border-border py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                aria-current={isActive(link.href) ? 'page' : undefined}
                className={`flex items-center justify-between py-2 text-[15px] no-underline ${
                  isActive(link.href) ? 'text-primary-deep' : 'text-text'
                }`}
              >
                {link.label}
                <ArrowRight size={14} strokeWidth={1.3} className="text-muted" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center justify-between border-b border-border py-4">
            <span className="text-[11px] uppercase tracking-[0.16em] text-muted">{t('header.language')}</span>
            <div className="flex items-center gap-3" role="group" aria-label={t('header.language')}>
              {locales.map((code, i) => {
                const active = locale === code;
                return (
                  <span key={code} className="flex items-center gap-3">
                    {i > 0 && <span aria-hidden className="h-3 w-px bg-border" />}
                    <button
                      type="button"
                      onClick={() => setLocale(code as Locale)}
                      aria-pressed={active}
                      className={`cursor-pointer border-none bg-transparent px-0 py-1 text-[13px] transition-colors ${
                        active
                          ? 'text-text underline decoration-primary decoration-1 underline-offset-[6px]'
                          : 'text-muted hover:text-text'
                      }`}
                    >
                      {LOCALE_NAMES[code as Locale] ?? localeLabels[code as Locale]}
                    </button>
                  </span>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2.5 py-4">
            {settings.whatsappUrl && (
              <a href={settings.whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-[13px] text-text no-underline">
                <WhatsAppIcon size={15} className="text-primary-deep" /> WhatsApp
              </a>
            )}
            {settings.instagramUrl && (
              <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-[13px] text-text no-underline">
                <InstagramIcon size={15} className="text-primary-deep" /> Instagram
              </a>
            )}
          </div>
        </div>
      </motion.aside>
    </div>
  );
}
