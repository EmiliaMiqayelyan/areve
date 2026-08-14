'use client';

import { type ReactNode } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import { ArrowUpRight, Phone, Send } from 'lucide-react';
import PageHero from '@/components/ui/PageHero';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { useI18n } from '@/i18n/I18nProvider';
import { resolveStoreTelegramUsername } from '@/lib/storeContact';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
});

const BG = '#F8F5F1';
const INK = '#1A1A1A';
const CONTACT_IMAGE = '/images/about-crafting.png';

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

const WA = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const IG = () => (
  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.98 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const FB = () => (
  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const TikTok = () => (
  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

const YT = () => (
  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

function ContactBlock({
  href,
  external,
  icon,
  label,
  bodyFont,
  delay = 0,
}: {
  href: string;
  external?: boolean;
  icon: ReactNode;
  label: string;
  bodyFont: string;
  delay?: number;
}) {
  return (
    <motion.a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      aria-label={label}
      {...fadeUp}
      transition={{ ...fadeUp.transition, delay }}
      className="group relative flex items-center gap-3 rounded-[16px] border border-[#EADFD6] bg-white/75 px-3.5 py-3.5 no-underline transition-all duration-300 hover:border-[#B28A5A]/40 hover:bg-white"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F8F5F1] text-[#B28A5A] transition-colors duration-300 group-hover:bg-[#B28A5A] group-hover:text-white">
        {icon}
      </span>
      <span className={`${bodyFont} flex-1 text-[12px] font-medium tracking-[0.04em] text-[#1A1A1A]`}>
        {label}
      </span>
      <ArrowUpRight
        size={13}
        strokeWidth={1.5}
        className="text-[#D2C6BA] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#B28A5A]"
      />
    </motion.a>
  );
}

export default function ContactPage() {
  const { locale } = useI18n();
  const { settings } = useSiteSettings();
  const c = settings.siteContent.contact;
  const {
    businessPhone,
    instagramUrl,
    facebookUrl,
    whatsappUrl,
    telegramUrl,
    tiktokUrl,
    youtubeUrl,
  } = settings;

  const displayFont = locale === 'en' ? cormorant.className : 'font-serif';
  const bodyFont = locale === 'en' ? inter.className : 'font-sans';

  const telegramUsername = resolveStoreTelegramUsername({ telegramUrl });
  const telegramHref = telegramUsername ? `https://t.me/${telegramUsername}` : '';

  const contactChannels = [
    {
      key: 'phone',
      href: `tel:${businessPhone.replace(/\s/g, '')}`,
      label: businessPhone || (locale === 'hy' ? 'Հեռախոս' : 'Phone'),
      icon: <Phone size={16} strokeWidth={1.5} />,
    },
    telegramHref && {
      key: 'telegram',
      href: telegramHref,
      external: true,
      label: 'Telegram',
      icon: <Send size={15} strokeWidth={1.6} />,
    },
    {
      key: 'whatsapp',
      href: whatsappUrl,
      external: true,
      label: 'WhatsApp',
      icon: <WA />,
    },
  ].filter(Boolean) as Array<{
    key: string;
    href: string;
    external?: boolean;
    label: string;
    icon: ReactNode;
  }>;

  const socialItems = [
    { href: instagramUrl, label: 'Instagram', icon: <IG /> },
    { href: facebookUrl, label: 'Facebook', icon: <FB /> },
    { href: tiktokUrl, label: 'TikTok', icon: <TikTok /> },
    { href: youtubeUrl, label: 'YouTube', icon: <YT /> },
  ].filter((item) => item.href.trim());

  return (
    <div className="min-h-screen pt-[68px]" style={{ backgroundColor: BG, color: INK }}>
      <PageHero
        variant="contact"
        eyebrow={c.hero.eyebrow}
        title={c.hero.title}
        subtitle={c.hero.subtitle}
        ctaLabel={c.hero.ctaLabel}
        ctaHref="#contact-content"
      />

      <section id="contact-content" className="px-[var(--container-px)] py-12 sm:py-16">
        <div className="mx-auto grid max-w-[1040px] items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-[#EFE8E0] lg:min-h-[480px]">
              <Image
                src={CONTACT_IMAGE}
                alt=""
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'linear-gradient(180deg, transparent 60%, rgba(26,26,26,0.32) 100%)',
                }}
              />
            </div>
          </motion.div>

          <div>
            <motion.p
              {...fadeUp}
              className={`${bodyFont} mb-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-[#B28A5A]`}
            >
              {locale === 'hy' ? 'Կապ մեզ հետ' : 'Get in touch'}
            </motion.p>
            <motion.h2
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.04 }}
              className={`${displayFont} mb-5 text-[clamp(18px,2.2vw,22px)] font-medium leading-snug text-[#1A1A1A]`}
            >
              {locale === 'hy' ? 'Ընտրիր քո եղանակը' : 'Choose your way'}
            </motion.h2>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-1">
              {contactChannels.map((channel, i) => (
                <ContactBlock
                  key={channel.key}
                  href={channel.href}
                  external={channel.external}
                  icon={channel.icon}
                  label={channel.label}
                  bodyFont={bodyFont}
                  delay={0.05 + i * 0.04}
                />
              ))}
            </div>

            {socialItems.length > 0 && (
              <motion.div
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: 0.22 }}
                className="mt-8 border-t border-[#E8E2DC] pt-6"
              >
                <p className={`${bodyFont} mb-3 text-[10px] uppercase tracking-[0.16em] text-[#9A9A9A]`}>
                  {c.social.title}
                </p>
                <div className="flex items-center gap-2.5">
                  {socialItems.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.label}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E8E2DC] bg-white text-[#B28A5A] no-underline transition-all duration-300 hover:border-[#B28A5A] hover:bg-[#B28A5A] hover:text-white"
                    >
                      {item.icon}
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
