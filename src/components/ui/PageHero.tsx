'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import SunMark from '@/components/ui/SunMark';
import { useTranslation } from '@/i18n/I18nProvider';

type PageHeroProps = {
  variant?: 'shop' | 'gallery' | 'about' | 'faq' | 'contact';
  eyebrow: string;
  title: string;
  titleItalic?: string;
  subtitle?: string;
  emoji?: string;
  ctaLabel?: string;
  ctaHref?: string;
  /** Rendered under the title — e.g. a result count. */
  meta?: React.ReactNode;
  breadcrumb?: Array<{ label: string; href?: string }>;
};

const ease = [0.22, 1, 0.36, 1] as const;

/** One consistent page header used across secondary pages. */
export default function PageHero({
  eyebrow,
  title,
  titleItalic,
  subtitle,
  ctaLabel,
  ctaHref,
  meta,
  breadcrumb,
}: PageHeroProps) {
  const { t } = useTranslation();
  const crumbs = breadcrumb ?? [{ label: t('common.home'), href: '/' }, { label: title.replace(/\n/g, ' ') }];
  const lines = title.split('\n');

  return (
    <section className="relative overflow-hidden border-b border-border bg-surface">
      <SunMark
        className="pointer-events-none absolute -bottom-2 right-[-40px] hidden w-[360px] text-primary/[0.14] md:block"
        strokeWidth={0.9}
      />
      <div className="wrap relative py-10 sm:py-14 lg:py-16">
        <nav aria-label="Breadcrumb" className="mb-6 text-[12px] text-muted">
          <ol className="flex flex-wrap items-center gap-2">
            {crumbs.map((c, i) => (
              <li key={`${c.label}-${i}`} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden>/</span>}
                {c.href ? (
                  <Link href={c.href} className="no-underline transition-colors hover:text-text">
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-text">
                    {c.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="max-w-2xl"
        >
          <p className="eyebrow eyebrow-line mb-4">{eyebrow.replace(/^·\s*/, '')}</p>
          <h1 className="text-[clamp(2rem,4vw,3.2rem)] leading-[1.08]">
            {lines.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
            {titleItalic && <span className="block text-primary-deep">{titleItalic}</span>}
          </h1>
          {subtitle && <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted sm:text-[16px]">{subtitle}</p>}
          {meta && <div className="mt-5">{meta}</div>}
          {ctaLabel && ctaHref && (
            <a href={ctaHref} className="link-underline mt-6">
              {ctaLabel} <ArrowDown size={14} />
            </a>
          )}
        </motion.div>
      </div>
    </section>
  );
}
