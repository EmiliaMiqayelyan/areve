'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import StoreImage from '@/components/ui/StoreImage';
import SunMark from '@/components/ui/SunMark';

type Copy = {
  eyebrow: string;
  title: string;
  paragraphs: ReadonlyArray<string>;
  points: ReadonlyArray<string>;
  ctaLabel: string;
  ctaHref: string;
};

export default function BrandStory({
  copy,
  image,
  detailImage,
}: {
  copy: Copy;
  image?: string;
  detailImage?: string;
}) {
  return (
    <section className="section overflow-hidden">
      <div className="wrap grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
        <Reveal className="relative lg:col-span-6">
          <div className="relative aspect-[4/5] w-[86%] overflow-hidden bg-surface-deep sm:w-[80%]">
            {image && <StoreImage src={image} alt="" fill />}
          </div>
          {detailImage && (
            <div className="absolute bottom-[-8%] right-0 aspect-square w-[42%] overflow-hidden border-[6px] border-background bg-surface-deep sm:border-8">
              <StoreImage src={detailImage} alt="" fill />
            </div>
          )}
        </Reveal>

        <Reveal className="lg:col-span-5 lg:col-start-8" delay={0.1}>
          <SunMark className="mb-6 w-16 text-primary" strokeWidth={1.6} />
          <p className="eyebrow mb-4">{copy.eyebrow}</p>
          <h2 className="section-title">{copy.title}</h2>
          <div className="mt-6 space-y-4">
            {copy.paragraphs.map((p) => (
              <p key={p} className="text-[15.5px] leading-relaxed text-muted sm:text-[16px]">
                {p}
              </p>
            ))}
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-y border-border py-5">
            {copy.points.map((point) => (
              <li key={point} className="flex items-center gap-2.5 text-[13px] font-medium tracking-[0.04em] text-text">
                <span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-primary" />
                {point}
              </li>
            ))}
          </ul>
          <Link href={copy.ctaHref} className="link-underline mt-8">
            {copy.ctaLabel} <ArrowRight size={14} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
