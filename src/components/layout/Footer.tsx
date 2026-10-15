'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Mail, MapPin, Phone } from 'lucide-react';
import areve from '../../../public/areve.png';
import SocialLinks from '@/components/ui/SocialLinks';
import SunMark from '@/components/ui/SunMark';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { useTranslation } from '@/i18n/I18nProvider';
import { useCatalogCategories } from '@/lib/useCatalog';

const headingClass = 'mb-5 text-[11px] font-medium uppercase tracking-[0.18em] text-accent';
const linkClass = 'text-[14px] text-background/70 no-underline transition-colors hover:text-background';

export default function Footer() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const { settings } = useSiteSettings();
  const { categories } = useCatalogCategories();
  const {
    storeName,
    tagline,
    footerDescription,
    instagramUrl,
    facebookUrl,
    tiktokUrl,
    youtubeUrl,
    businessPhone,
    supportEmail,
    address,
    siteContent,
  } = settings;

  if (pathname.startsWith('/admin')) return null;

  const infoLinks = [...siteContent.footer.explore, ...siteContent.footer.support].filter(
    ([href, label], i, all) => all.findIndex(([h, l]) => h === href && l === label) === i
  );

  return (
    <footer className="relative overflow-hidden bg-secondary text-background">
      <SunMark
        className="pointer-events-none absolute -right-24 -top-6 hidden w-[520px] text-primary/[0.09] lg:block"
        strokeWidth={0.8}
      />
      <div className="wrap relative pb-10 pt-16 lg:pt-24">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-12 lg:gap-x-10">
          <div className="col-span-2 lg:col-span-4">
            <Link href="/" aria-label={storeName.trim() || 'AREVÉ'} className="inline-block">
              <Image src={areve} alt="AREVÉ Collections" className="h-16 w-auto lg:h-20" unoptimized />
            </Link>
            <p className="mt-6 max-w-xs font-display text-[18px] leading-snug text-background/90">{tagline}</p>
            {footerDescription && footerDescription !== tagline && (
              <p className="mt-2 max-w-xs text-[14px] text-background/60">{footerDescription}</p>
            )}
            <SocialLinks
              className="mt-7"
              tone="dark"
              instagramUrl={instagramUrl}
              facebookUrl={facebookUrl}
              tiktokUrl={tiktokUrl}
              youtubeUrl={youtubeUrl}
            />
          </div>

          {categories.length > 0 && (
            <div className="lg:col-span-3">
              <h2 className={headingClass}>{t('footer.shop')}</h2>
              <ul className="flex flex-col gap-3">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link href={`/products?category=${encodeURIComponent(cat.id)}`} className={linkClass}>
                      {cat.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="lg:col-span-2">
            <h2 className={headingClass}>{t('footer.explore')}</h2>
            <ul className="flex flex-col gap-3">
              {infoLinks.map(([href, label], i) => (
                <li key={`${href}-${label}-${i}`}>
                  <Link href={href} className={linkClass}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 lg:col-span-3">
            <h2 className={headingClass}>{t('footer.contact')}</h2>
            <ul className="flex flex-col gap-3.5">
              {businessPhone && (
                <li>
                  <a href={`tel:${businessPhone.replace(/\s/g, '')}`} className={`${linkClass} inline-flex items-center gap-3`}>
                    <Phone size={15} strokeWidth={1.4} className="text-primary" /> {businessPhone}
                  </a>
                </li>
              )}
              {supportEmail && (
                <li>
                  <a href={`mailto:${supportEmail}`} className={`${linkClass} inline-flex items-center gap-3 break-all`}>
                    <Mail size={15} strokeWidth={1.4} className="shrink-0 text-primary" /> {supportEmail}
                  </a>
                </li>
              )}
              {address && (
                <li className="inline-flex items-center gap-3 text-[14px] text-background/70">
                  <MapPin size={15} strokeWidth={1.4} className="text-primary" /> {address}
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-background/10 pt-6 text-[12px] text-background/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {storeName.trim() || 'AREVÉ'}. {siteContent.footer.copyrightSuffix}
          </p>
          <p className="tracking-[0.14em]">AREVÉ COLLECTIONS</p>
        </div>
      </div>
    </footer>
  );
}
