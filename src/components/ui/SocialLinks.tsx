'use client';

import { FacebookIcon, InstagramIcon, TikTokIcon, YouTubeIcon } from '@/components/ui/BrandIcons';

type Props = {
  instagramUrl?: string;
  facebookUrl?: string;
  tiktokUrl?: string;
  youtubeUrl?: string;
  size?: 'sm' | 'md';
  tone?: 'light' | 'dark';
  className?: string;
};

export default function SocialLinks({
  instagramUrl = '',
  facebookUrl = '',
  tiktokUrl = '',
  youtubeUrl = '',
  size = 'md',
  tone = 'light',
  className = '',
}: Props) {
  const dim = size === 'sm' ? 'h-9 w-9' : 'h-10 w-10';
  const toneClass =
    tone === 'dark'
      ? 'border-background/20 text-background/80 hover:border-primary hover:bg-primary hover:text-secondary'
      : 'border-border text-text hover:border-secondary hover:bg-secondary hover:text-background';

  const links = [
    { label: 'Instagram', href: instagramUrl, icon: <InstagramIcon size={16} /> },
    { label: 'Facebook', href: facebookUrl, icon: <FacebookIcon size={16} /> },
    { label: 'TikTok', href: tiktokUrl, icon: <TikTokIcon size={16} /> },
    { label: 'YouTube', href: youtubeUrl, icon: <YouTubeIcon size={16} /> },
  ].filter((item) => item.href.trim().length > 0);

  if (links.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-2.5 ${className}`}>
      {links.map((item) => (
        <a
          key={item.label}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={item.label}
          className={`flex items-center justify-center rounded-full border transition-colors duration-300 ${dim} ${toneClass}`}
        >
          {item.icon}
        </a>
      ))}
    </div>
  );
}
