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
import type { CatalogCategory } from '@/lib/useCatalog';

type Props = {
  navLinks: ReadonlyArray<{ href: string; label: string }>;
  categories: CatalogCategory[];
  isActive: (href: string) => boolean;
  onClose: () => void;
};

export default function MobileMenu({ navLinks, categories, isActive, onClose }: Props) {
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
            <Image src={areve} alt="AREVÉ Collections" className="h-9 w-auto" unoptimized />
          </Link>
          <button type="button" className="icon-btn -mr-2" onClick={onClose} aria-label={t('header.close')}>
            <X size={22} strokeWidth={1.4} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-8">
          <nav aria-label="Mobile" className="border-b border-border py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                aria-current={isActive(link.href) ? 'page' : undefined}
                className={`flex items-center justify-between py-3 font-display text-[22px] no-underline ${
                  isActive(link.href) ? 'text-primary-deep' : 'text-text'
                }`}
              >
                {link.label}
                <ArrowRight size={16} strokeWidth={1.3} className="text-muted" />
              </Link>
            ))}
          </nav>

          {categories.length > 0 && (
            <div className="border-b border-border py-5">
              <p className="eyebrow mb-3">{t('footer.shop')}</p>
              <ul className="grid grid-cols-1 gap-0.5">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/products?category=${encodeURIComponent(cat.id)}`}
                      onClick={onClose}
                      className="flex items-center justify-between py-2 text-[15px] text-text no-underline"
                    >
                      <span>{cat.label}</span>
                      <span className="text-[12px] tabular-nums text-muted">{cat.count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="border-b border-border py-5">
            <p className="eyebrow mb-3">{t('header.language')}</p>
            <div className="inline-flex border border-border">
              {locales.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLocale(code as Locale)}
                  aria-pressed={locale === code}
                  className={`min-w-[64px] cursor-pointer border-none px-4 py-2.5 text-[13px] transition-colors ${
                    locale === code ? 'bg-secondary text-background' : 'bg-transparent text-text'
                  }`}
                >
                  {localeLabels[code as Locale]}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 py-5">
            {settings.whatsappUrl && (
              <a href={settings.whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[14px] text-text no-underline">
                <WhatsAppIcon size={17} className="text-primary-deep" /> WhatsApp
              </a>
            )}
            {settings.instagramUrl && (
              <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[14px] text-text no-underline">
                <InstagramIcon size={17} className="text-primary-deep" /> Instagram
              </a>
            )}
          </div>
        </div>
      </motion.aside>
    </div>
  );
}
