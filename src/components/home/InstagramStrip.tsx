'use client';

import { ArrowUpRight } from 'lucide-react';
import { InstagramIcon } from '@/components/ui/BrandIcons';
import Reveal from '@/components/ui/Reveal';
import SectionHeader from '@/components/ui/SectionHeader';
import StoreImage from '@/components/ui/StoreImage';

type Copy = { eyebrow: string; title: string; handle: string; viewLinkLabel: string };

export default function InstagramStrip({
  copy,
  images,
  instagramUrl,
}: {
  copy: Copy;
  images: Array<{ id?: string; src: string; alt: string }>;
  instagramUrl?: string;
}) {
  if (images.length < 2 || !instagramUrl) return null;

  return (
    <section className="section">
      <div className="wrap">
        <SectionHeader
          eyebrow={copy.eyebrow}
          title={copy.handle}
          action={
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="link-underline">
              <InstagramIcon size={15} /> {copy.viewLinkLabel}
            </a>
          }
        />
        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4">
          {images.slice(0, 4).map((img, i) => (
            <Reveal key={img.id ?? i} delay={i * 0.06}>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${copy.title} — Instagram`}
                className="group relative block aspect-square overflow-hidden bg-surface-deep"
              >
                <StoreImage
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-secondary/0 text-background opacity-0 transition-all duration-300 group-hover:bg-secondary/35 group-hover:opacity-100">
                  <ArrowUpRight size={22} strokeWidth={1.4} />
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
