'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import StoreImage from '@/components/ui/StoreImage';
import { useTranslation } from '@/i18n/I18nProvider';
import { formatPrice } from '@/lib/currency';
import { pickLocalized } from '@/lib/localizedText';
import { resolveProductImageSrc } from '@/lib/productImage';
import { publicProductPath } from '@/lib/resourceId';
import type { Product } from '@/lib/store';

type HeroCopy = {
  eyebrow: string;
  title: string;
  titleAccent: string;
  subtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
};

type Props = {
  copy: HeroCopy;
  leadImage?: string;
  products: Product[];
  loading: boolean;
};

const ease = [0.22, 1, 0.36, 1] as const;

function HeroProduct({ product }: { product?: Product }) {
  const { locale } = useTranslation();
  if (!product) return <div className="skeleton aspect-square" aria-hidden />;
  const name = pickLocalized(product.name, locale);
  const src = resolveProductImageSrc(product.image);
  return (
    <Link href={publicProductPath(product.id)} className="group relative block aspect-square overflow-hidden bg-surface-deep no-underline">
      {src && (
        <StoreImage
          src={src}
          alt={name}
          fill
          priority
          className="transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
        />
      )}
      <span className="absolute inset-x-2 bottom-2 hidden items-center justify-between gap-3 bg-background/95 px-3 py-2 sm:flex">
        <span className="truncate text-[12px] text-text">{name}</span>
        <span className="price shrink-0 text-[12px] text-text">{formatPrice(product.price)}</span>
      </span>
    </Link>
  );
}

export default function HomeHero({ copy, leadImage, products, loading }: Props) {
  const [first, second] = products;

  return (
    <section className="relative">
      <div className="wrap grid items-center gap-10 pb-12 pt-8 sm:pb-16 sm:pt-12 lg:grid-cols-12 lg:gap-12 lg:pb-20 lg:pt-14">
        <div className="lg:col-span-5">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="eyebrow eyebrow-line mb-5 lg:mb-7"
          >
            {copy.eyebrow}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.05, ease }}
            className="display-title"
          >
            <span className="block">{copy.title}</span>
            <span className="hero-accent block text-primary-deep">{copy.titleAccent}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease }}
            className="mt-5 max-w-md text-[15.5px] leading-relaxed text-muted sm:mt-6 sm:text-[17px]"
          >
            {copy.subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease }}
            className="mt-8 flex flex-col gap-3 sm:flex-row lg:mt-10"
          >
            <Link href={copy.primaryCta.href} className="btn-primary">
              {copy.primaryCta.label} <ArrowRight size={15} strokeWidth={1.6} />
            </Link>
            <Link href={copy.secondaryCta.href} className="btn-outline">
              {copy.secondaryCta.label}
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.1 }}
          className="lg:col-span-7"
        >
          <div className="ml-auto grid max-w-[700px] grid-cols-[1.35fr_1fr] gap-3 sm:gap-4">
            {leadImage ? (
              <Link href={copy.primaryCta.href} className="group relative row-span-2 overflow-hidden bg-surface-deep" aria-label={copy.primaryCta.label}>
                <StoreImage
                  src={leadImage}
                  alt=""
                  fill
                  priority
                  className="transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                />
              </Link>
            ) : (
              <div className={`row-span-2 ${loading ? 'skeleton' : 'bg-surface-deep'}`} aria-hidden />
            )}
            <HeroProduct product={first} />
            <HeroProduct product={second} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
