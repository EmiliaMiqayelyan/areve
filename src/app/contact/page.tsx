'use client';

import { type ReactNode } from 'react';
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';
import PageHero from '@/components/ui/PageHero';
import Reveal from '@/components/ui/Reveal';
import SocialLinks from '@/components/ui/SocialLinks';
import StoreImage from '@/components/ui/StoreImage';
import { TelegramIcon, WhatsAppIcon } from '@/components/ui/BrandIcons';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { useI18n } from '@/i18n/I18nProvider';
import { isFileImage, resolveProductImageSrc } from '@/lib/productImage';
import { resolveStoreTelegramUsername } from '@/lib/storeContact';
import { useGalleryQuery } from '@/lib/useProductsQuery';

type Channel = {
  key: string;
  href?: string;
  external?: boolean;
  label: string;
  value: string;
  icon: ReactNode;
};

function ChannelRow({ channel }: { channel: Channel }) {
  const body = (
    <>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-border text-primary-deep transition-colors duration-300 group-hover:border-secondary group-hover:bg-secondary group-hover:text-accent">
        {channel.icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] uppercase tracking-[0.14em] text-muted">{channel.label}</span>
        <span className="mt-0.5 block truncate font-display text-[17px] text-text sm:text-[18px]">{channel.value}</span>
      </span>
      {channel.href && (
        <ArrowUpRight
          size={16}
          strokeWidth={1.4}
          className="shrink-0 text-muted transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-text"
        />
      )}
    </>
  );

  const cls = 'group flex items-center gap-4 border-b border-border py-5 text-text no-underline';

  return channel.href ? (
    <a
      href={channel.href}
      target={channel.external ? '_blank' : undefined}
      rel={channel.external ? 'noopener noreferrer' : undefined}
      className={cls}
    >
      {body}
    </a>
  ) : (
    <div className={cls}>{body}</div>
  );
}

export default function ContactPage() {
  const { locale } = useI18n();
  const { settings } = useSiteSettings();
  const c = settings.siteContent.contact;
  const {
    businessPhone,
    supportEmail,
    address,
    instagramUrl,
    facebookUrl,
    whatsappUrl,
    telegramUrl,
    tiktokUrl,
    youtubeUrl,
  } = settings;
  const isHy = locale === 'hy';

  const { data: gallery = [], isLoading: galleryLoading } = useGalleryQuery(6);
  const photo = gallery.filter((g) => isFileImage(g.src))[2] ?? gallery.find((g) => isFileImage(g.src));
  const photoSrc = photo ? resolveProductImageSrc(photo.src) : '';

  const telegramUsername = resolveStoreTelegramUsername({ telegramUrl });
  const telegramHref = telegramUsername ? `https://t.me/${telegramUsername}` : '';

  const channels: Channel[] = [];
  if (whatsappUrl) {
    channels.push({ key: 'whatsapp', href: whatsappUrl, external: true, label: 'WhatsApp', value: businessPhone || 'WhatsApp', icon: <WhatsAppIcon size={17} /> });
  }
  if (telegramHref) {
    channels.push({ key: 'telegram', href: telegramHref, external: true, label: 'Telegram', value: telegramUsername.startsWith('+') ? telegramUsername : `@${telegramUsername}`, icon: <TelegramIcon size={17} /> });
  }
  if (businessPhone) {
    channels.push({ key: 'phone', href: `tel:${businessPhone.replace(/\s/g, '')}`, label: isHy ? 'Հեռախոս' : 'Phone', value: businessPhone, icon: <Phone size={17} strokeWidth={1.5} /> });
  }
  if (supportEmail) {
    channels.push({ key: 'email', href: `mailto:${supportEmail}`, label: isHy ? 'Էլ. փոստ' : 'Email', value: supportEmail, icon: <Mail size={17} strokeWidth={1.5} /> });
  }
  if (address) {
    channels.push({ key: 'address', label: isHy ? 'Հասցե' : 'Address', value: address, icon: <MapPin size={17} strokeWidth={1.5} /> });
  }

  return (
    <div className="min-h-screen">
      <PageHero eyebrow={c.hero.eyebrow} title={c.hero.title} subtitle={c.hero.subtitle} />

      <section id="contact-content" className="section">
        <div className="wrap grid items-start gap-12 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-6">
            <p className="eyebrow mb-3">{isHy ? 'Կապ մեզ հետ' : 'Get in touch'}</p>
            <h2 className="section-title">{isHy ? 'Ընտրեք ձեզ հարմար եղանակը' : 'Choose your way'}</h2>
            <div className="mt-6 border-t border-border">
              {channels.map((ch) => (
                <ChannelRow key={ch.key} channel={ch} />
              ))}
            </div>

            <div className="mt-10">
              <p className="mb-4 text-[11px] uppercase tracking-[0.14em] text-muted">{c.social.title}</p>
              <SocialLinks
                instagramUrl={instagramUrl}
                facebookUrl={facebookUrl}
                tiktokUrl={tiktokUrl}
                youtubeUrl={youtubeUrl}
              />
            </div>
          </Reveal>

          <Reveal className="lg:col-span-5 lg:col-start-8" delay={0.1}>
            <div className={`relative aspect-[4/5] overflow-hidden bg-surface-deep ${galleryLoading ? 'skeleton' : ''}`}>
              {photoSrc && <StoreImage src={photoSrc} alt="" fill />}
            </div>
          </Reveal>
        </div>
      </section>

      {whatsappUrl && (
        <section className="bg-surface">
          <Reveal className="wrap flex flex-col items-start gap-6 py-14 md:flex-row md:items-center md:justify-between lg:py-16">
            <div className="max-w-xl">
              <h2 className="font-display text-[clamp(22px,2.6vw,30px)] leading-tight text-text">{c.customOrder.title}</h2>
              <p className="mt-2 text-[15px] text-muted">{c.customOrder.subtitle}</p>
            </div>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-dark shrink-0">
              <WhatsAppIcon size={16} /> {c.customOrder.ctaLabel}
            </a>
          </Reveal>
        </section>
      )}
    </div>
  );
}
