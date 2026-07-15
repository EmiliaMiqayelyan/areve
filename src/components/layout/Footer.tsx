'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from "next/image";
import areve from "../../../public/areve.png";
import SocialLinks from '@/components/ui/SocialLinks';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { useTranslation } from '@/i18n/I18nProvider';

const col: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 12 };
const linkStyle: React.CSSProperties = { fontFamily: 'var(--font-sans)', fontSize: 14, color: '#7A7A7A', textDecoration: 'none', transition: 'color 0.2s' };
const headStyle: React.CSSProperties = { fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 600, color: '#A8A09A', marginBottom: 16 };

export default function Footer() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const { settings } = useSiteSettings();
  const { storeName, tagline, footerDescription, instagramUrl, facebookUrl, tiktokUrl, youtubeUrl, siteContent } = settings;

  if (pathname.startsWith('/admin')) return null;

  return (
    <footer style={{ background: '#F5F0EC', borderTop: '1px solid #E8DDD6', padding: 'var(--section-padding)' }}>
      <div className="mx-auto" style={{ maxWidth: 1280, padding: '0 var(--container-px)' }}>
        <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-24 mb-12">

          {/* Column 1: Brand */}
          <div style={{ ...col }} className="max-w-xs">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <Image src={areve} alt={storeName} width="90" height="90" />
            </div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: '#7A7A7A', lineHeight: 1.7 }}>
              {footerDescription}
            </p>
            <SocialLinks
              className="mt-2"
              size="sm"
              instagramUrl={instagramUrl}
              facebookUrl={facebookUrl}
              tiktokUrl={tiktokUrl}
              youtubeUrl={youtubeUrl}
            />
          </div>

          {/* Column 2: Links */}
          <div className="grid grid-cols-2 gap-8 sm:gap-16 lg:gap-24">
            {/* Explore */}
            <div style={col}>
              <h4 style={headStyle}>{t('footer.explore')}</h4>
              {siteContent.footer.explore.map(([href, label]) => (
                <Link key={`${href}-${label}`} href={href} style={linkStyle} className="hover:text-gold">
                  {label}
                </Link>
              ))}
            </div>

            {/* Support */}
            <div style={col}>
              <h4 style={headStyle}>{t('footer.support')}</h4>
              {siteContent.footer.support.map(([href, label], i) => (
                <Link key={`${href}-${label}-${i}`} href={href} style={linkStyle} className="hover:text-gold">
                  {label}
                </Link>
              ))}
            </div>
          </div>

        </div>

        <div className="border-t border-[#E5D9D2] pt-6 flex flex-wrap gap-4 items-center justify-between">
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: '#AFAFAF' }}>
            © {new Date().getFullYear()} {storeName}. {siteContent.footer.copyrightSuffix}
          </p>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: '#AFAFAF' }} className="hidden sm:block">
            {tagline}
          </p>
        </div>
      </div>
    </footer>
  );
}
