'use client';

import { motion } from 'framer-motion';
import StoreImage from '@/components/ui/StoreImage';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import PageHero from '@/components/ui/PageHero';
import { useSiteSettings } from '@/context/SiteSettingsContext';

export default function AboutPage() {
  const { settings } = useSiteSettings();
  const about = settings.siteContent.about;

  return (
    <div style={{ minHeight: '100vh', paddingTop: 68 }}>

      <PageHero
        variant="about"
        emoji={about.hero.emoji}
        eyebrow={about.hero.eyebrow}
        title={about.hero.titleLine1}
        titleItalic={about.hero.titleItalic}
        subtitle={about.hero.intro}
      />

      {/* Story */}
      <section className="bg-ivory" style={{ padding: 'var(--section-padding)' }}>
        <div
          className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14"
          style={{ paddingLeft: 'var(--container-px)', paddingRight: 'var(--container-px)' }}
        >
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative aspect-[4/5] max-h-[520px] overflow-hidden rounded-[28px] bg-beige sm:aspect-auto sm:h-[480px]">
              <StoreImage src={about.beginning.image} alt="" fill />
            </div>
            <div className="absolute -bottom-3 -right-3 hidden h-20 w-20 rounded-[18px] border-2 border-gold/35 sm:block" />
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3.5, repeat: Infinity }}
              className="absolute -left-3 bottom-10 rounded-2xl border border-beige bg-white px-4 py-3 shadow-[0_8px_32px_rgba(180,156,140,0.18)] sm:-left-5 sm:px-5 sm:py-4"
            >
              <p className="font-serif text-xl font-medium text-heading">40+</p>
              <p className="font-sans text-[10px] uppercase tracking-wider text-muted">ժամ մեկ կտորի</p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2"
          >
            <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-mocha">
              {about.beginning.eyebrow}
            </p>
            <h2 className="mb-4 font-serif text-[clamp(1.35rem,2.6vw,1.85rem)] font-medium leading-snug text-heading">
              {about.beginning.title}
            </h2>
            <div className="divider-gold mb-6" />
            <div className="space-y-4">
              {about.beginning.paragraphs.map((p, idx) => (
                <p key={idx} className="font-sans text-[15px] leading-relaxed text-subtle sm:text-base">
                  {p}
                </p>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-beige" style={{ padding: 'var(--section-padding)' }}>
        <div className="mx-auto max-w-[1280px]" style={{ paddingLeft: 'var(--container-px)', paddingRight: 'var(--container-px)' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-[640px] rounded-[28px] border border-white/80 bg-white px-6 py-10 text-center shadow-[0_8px_40px_rgba(180,156,140,0.1)] sm:px-10 sm:py-12"
          >
            <h2 className="mb-3 font-serif text-[clamp(1.3rem,2.4vw,1.75rem)] font-medium text-heading mb-3">{about.closing.title}</h2>
            <Link href={about.closing.ctaHref} className="btn-primary no-underline">
              {about.closing.ctaLabel} <ArrowRight size={15} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
