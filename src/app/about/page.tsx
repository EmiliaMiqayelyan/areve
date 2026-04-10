'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { useSiteSettings } from '@/context/SiteSettingsContext';

export default function AboutPage() {
  const { settings } = useSiteSettings();
  const about = settings.siteContent.about;

  return (
    <div style={{ minHeight: '100vh', paddingTop: 68 }}>

      <section className="bg-beige text-center border-b border-sand" style={{ padding: 'var(--section-padding)' }}>
        <div className="mx-auto max-w-[720px]">
          <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="mb-5 block text-4xl sm:text-5xl">{about.hero.emoji}</span>
            <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.25em] text-mocha sm:text-xs">{about.hero.eyebrow}</p>
            <h1 className="mb-5 font-serif text-4xl font-bold leading-[1.1] text-ink sm:text-6xl lg:text-7xl">
              {about.hero.titleLine1} <span className="italic text-gold">{about.hero.titleItalic}</span>
            </h1>
            <div className="divider-gold-center mb-6" />
            <p className="font-sans text-base leading-relaxed text-subtle sm:text-lg sm:leading-loose">
              {about.hero.intro}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="bg-ivory" style={{ padding: 'var(--section-padding)' }}>
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16" style={{ paddingLeft: 'var(--container-px)', paddingRight: 'var(--container-px)' }}>
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.65 }}>
            <SectionHeader eyebrow={about.beginning.eyebrow} title={about.beginning.title} />
            {about.beginning.paragraphs.map((p, idx) => (
              <p key={idx} className="mb-4 font-sans text-base leading-relaxed text-subtle sm:text-lg">
                {p}
              </p>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.65 }} className="relative">
            <div className="relative h-[400px] overflow-hidden rounded-[24px] sm:h-[460px]">
              <Image src={about.beginning.image} alt="" fill className="object-cover" loading="lazy" />
            </div>
            <div className="absolute -bottom-3 -left-3 h-24 w-24 rounded-[16px] border-2 border-gold/40" />
          </motion.div>
        </div>
      </section>

      <section className="bg-beige" style={{ padding: 'var(--section-padding)' }}>
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6" style={{ paddingLeft: 'var(--container-px)', paddingRight: 'var(--container-px)' }}>
          <SectionHeader eyebrow={about.values.eyebrow} title={about.values.title} subtitle={about.values.subtitle} centered />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {about.values.items.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group rounded-[20px] border border-sand bg-white p-7 text-center transition-all hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(180,156,140,0.18)]">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full text-2xl" style={{ background: v.bg + '60' }}>{v.icon}</div>
                <h3 className="mb-2.5 font-serif text-lg font-bold text-ink">{v.title}</h3>
                <p className="font-sans text-sm leading-relaxed text-subtle">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ivory" style={{ padding: 'var(--section-padding)' }}>
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6" style={{ paddingLeft: 'var(--container-px)', paddingRight: 'var(--container-px)' }}>
          <SectionHeader eyebrow={about.process.eyebrow} title={about.process.title} subtitle={about.process.subtitle} centered />
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
            {about.process.steps.map((s, i) => (
              <motion.div key={s.n} initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: i * 0.12 }}>
                <p className="mb-3 font-serif text-5xl font-bold leading-none text-gold/30 sm:text-6xl">{s.n}</p>
                <h3 className="mb-2.5 font-serif text-xl font-bold text-ink">{s.title}</h3>
                <p className="font-sans text-sm leading-relaxed text-subtle">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-beige p-0">
        <div className="grid h-[200px] grid-cols-1 sm:h-[260px] sm:grid-cols-3">
          {about.bannerImages.map((img, i) => (
            <div key={img} className={`relative overflow-hidden ${i > 0 ? 'hidden sm:block' : 'block'}`}>
              <Image src={img} alt="" fill className="object-cover transition-transform duration-700 hover:scale-105" loading="lazy" />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-ivory text-center" style={{ padding: 'var(--section-padding)' }}>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto max-w-[480px]">
          <h2 className="mb-3 font-serif text-3xl font-bold text-ink sm:text-4xl">{about.closing.title}</h2>
          <p className="mb-8 font-sans text-base text-subtle sm:text-lg">{about.closing.subtitle}</p>
          <Link href={about.closing.ctaHref} className="btn-primary no-underline">{about.closing.ctaLabel} <ArrowRight size={15} /></Link>
        </motion.div>
      </section>
    </div>
  );
}
