'use client';

import { motion } from 'framer-motion';

type PageHeroProps = {
  variant: 'shop' | 'gallery' | 'about' | 'faq' | 'contact';
  eyebrow: string;
  title: string;
  titleItalic?: string;
  subtitle?: string;
  emoji?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

const ease = [0.22, 1, 0.36, 1] as const;

const fade = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease },
};

export default function PageHero({
  variant,
  eyebrow,
  title,
  titleItalic,
  subtitle,
  emoji,
  ctaLabel,
  ctaHref,
}: PageHeroProps) {
  if (variant === 'shop') return <ShopHero eyebrow={eyebrow} title={title} subtitle={subtitle} />;
  if (variant === 'gallery') return <GalleryHero eyebrow={eyebrow} title={title} subtitle={subtitle} />;
  if (variant === 'faq') return <FaqHero eyebrow={eyebrow} title={title} subtitle={subtitle} />;
  if (variant === 'contact') {
    return (
      <ContactHero
        eyebrow={eyebrow}
        title={title}
        subtitle={subtitle}
        ctaLabel={ctaLabel}
        ctaHref={ctaHref}
      />
    );
  }
  return (
    <AboutHero
      eyebrow={eyebrow}
      title={title}
      titleItalic={titleItalic}
      subtitle={subtitle}
      emoji={emoji}
    />
  );
}

function splitLastWords(title: string, count = 1) {
  const words = title.trim().split(/\s+/);
  if (words.length <= count) return { rest: '', accent: title.trim() };
  const accent = words.splice(-count).join(' ');
  return { rest: words.join(' '), accent };
}

function ShopHero({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <section className="border-b border-[#EBE5DF]">
      <div
        className="mx-auto max-w-[1280px] px-4 py-9 sm:px-6 sm:py-10"
        style={{ paddingLeft: 'var(--container-px)', paddingRight: 'var(--container-px)' }}
      >
        <motion.div {...fade} className="flex items-start gap-4">
          <span className="mt-1.5 h-8 w-px shrink-0 bg-[#C4A574]" aria-hidden />
          <div className="min-w-0 max-w-md">
            <p className="mb-1.5 font-sans text-[9px] font-medium uppercase tracking-[0.22em] text-[#AEA49C]">
              {eyebrow}
            </p>
            <h1 className="font-serif text-[clamp(18px,2.2vw,24px)] font-normal leading-snug tracking-[-0.01em] text-heading">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2.5 font-sans text-[12px] leading-relaxed text-[#9A9189]">{subtitle}</p>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function formatGalleryTitle(title: string) {
  const newline = title.indexOf('\n');
  if (newline > -1) {
    return (
      <>
        <span className="block">{title.slice(0, newline)}</span>
        <span className="mt-0.5 block italic text-gold">{title.slice(newline + 1).trim()}</span>
      </>
    );
  }

  const comma = title.indexOf(',');
  if (comma > -1) {
    return (
      <>
        <span className="block">{title.slice(0, comma + 1)}</span>
        <span className="mt-0.5 block italic text-gold">{title.slice(comma + 1).trim()}</span>
      </>
    );
  }

  return title;
}

function GalleryHero({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <section className="border-b border-[#EBE5DF]">
      <div
        className="mx-auto max-w-[1280px] px-4 py-9 sm:px-6 sm:py-10"
        style={{ paddingLeft: 'var(--container-px)', paddingRight: 'var(--container-px)' }}
      >
        <motion.div {...fade} className="ml-auto max-w-md text-right">
          <p className="mb-1.5 font-sans text-[9px] font-medium uppercase tracking-[0.22em] text-[#AEA49C]">
            {eyebrow}
          </p>
          <h1 className="font-serif text-[clamp(18px,2.2vw,24px)] font-normal leading-[1.3] tracking-[-0.01em] text-heading">
            {formatGalleryTitle(title)}
          </h1>
          {subtitle && (
            <p className="mt-3 font-sans text-[12px] leading-relaxed text-[#9A9189]">{subtitle}</p>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function FaqHero({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  const { rest, accent } = splitLastWords(title, 1);

  return (
    <section className="border-b border-[#EBE5DF]">
      <div
        className="mx-auto max-w-[1280px] px-4 py-9 sm:px-6 sm:py-10"
        style={{ paddingLeft: 'var(--container-px)', paddingRight: 'var(--container-px)' }}
      >
        <motion.div
          {...fade}
          className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div className="min-w-0 max-w-lg">
            <p className="mb-1.5 font-sans text-[9px] font-medium uppercase tracking-[0.22em] text-[#AEA49C]">
              {eyebrow}
            </p>
            <h1 className="font-serif text-[clamp(18px,2.2vw,24px)] font-normal leading-snug tracking-[-0.01em] text-heading">
              {rest && <span>{rest} </span>}
              <span className="italic text-gold">{accent}</span>
            </h1>
          </div>
          {subtitle && (
            <p className="max-w-[240px] font-sans text-[12px] leading-relaxed text-[#9A9189] sm:pb-0.5 sm:text-right">
              {subtitle}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function ContactHero({
  eyebrow,
  title,
  subtitle,
  ctaLabel,
  ctaHref,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  const { rest, accent } = splitLastWords(title, 2);

  return (
    <section className="border-b border-[#EBE5DF]">
      <div
        className="mx-auto max-w-[1280px] px-4 py-9 sm:px-6 sm:py-10"
        style={{ paddingLeft: 'var(--container-px)', paddingRight: 'var(--container-px)' }}
      >
        <motion.div {...fade} className="max-w-md">
          <p className="mb-1.5 flex items-center gap-2.5 font-sans text-[9px] font-medium uppercase tracking-[0.22em] text-[#AEA49C]">
            <span className="inline-block h-px w-5 bg-[#C4A574]" aria-hidden />
            {eyebrow}
          </p>
          <h1 className="font-serif text-[clamp(18px,2.2vw,24px)] font-normal leading-[1.3] tracking-[-0.01em] text-heading">
            {rest && <span>{rest} </span>}
            <span className="italic text-gold">{accent}</span>
          </h1>
          {subtitle && (
            <p className="mt-2.5 font-sans text-[12px] leading-relaxed text-[#9A9189]">{subtitle}</p>
          )}
          {ctaLabel && ctaHref && (
            <a
              href={ctaHref}
              className="mt-4 inline-flex items-center gap-2 font-sans text-[10px] font-medium uppercase tracking-[0.14em] text-ink no-underline transition-colors hover:text-[#B28A5A]"
            >
              {ctaLabel}
              <span aria-hidden className="text-[#B28A5A]">
                ↓
              </span>
            </a>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function AboutHero({
  eyebrow,
  title,
  titleItalic,
  subtitle,
  emoji,
}: {
  eyebrow: string;
  title: string;
  titleItalic?: string;
  subtitle?: string;
  emoji?: string;
}) {
  return (
    <section className="border-b border-[#EBE5DF]">
      <div
        className="mx-auto max-w-[1280px] px-4 py-9 sm:px-6 sm:py-10"
        style={{ paddingLeft: 'var(--container-px)', paddingRight: 'var(--container-px)' }}
      >
        <motion.div {...fade} className="flex items-start gap-4">
          <span className="mt-1.5 h-8 w-px shrink-0 bg-[#C4A574]" aria-hidden />
          <div className="min-w-0 max-w-md">
            <p className="mb-1.5 font-sans text-[9px] font-medium uppercase tracking-[0.2em] text-[#AEA49C]">
              {emoji && <span className="mr-1 not-italic">{emoji}</span>}
              {eyebrow}
            </p>
            <h1 className="font-serif text-[clamp(18px,2.2vw,24px)] font-normal leading-[1.3] tracking-[-0.01em] text-heading">
              {title}
              {titleItalic && (
                <>
                  {' '}
                  <span className="italic text-gold">{titleItalic}</span>
                </>
              )}
            </h1>
            {subtitle && (
              <p className="mt-2.5 font-sans text-[12px] leading-relaxed text-[#9A9189]">{subtitle}</p>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
