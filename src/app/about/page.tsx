'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';

const values = [
  { icon: '✦', bg: '#C7D3C0', title: 'Handmade',    desc: 'Every item crafted entirely by hand. No machines, no shortcuts — only patient hands and careful attention.' },
  { icon: '☀️', bg: '#E6C97A', title: 'Unique',       desc: 'Because every piece is made by hand, no two are exactly the same. You carry something truly one-of-a-kind.' },
  { icon: '♡', bg: '#E8CFCB', title: 'High Quality', desc: 'We source only the finest beads, natural fabrics, and threads. We will not put our name on anything less.' },
  { icon: '🌿', bg: '#D6C3B3', title: 'Sustainable',  desc: 'Natural materials, small batches, zero-waste packaging. Beautiful should not cost the earth.' },
];

const steps = [
  { n: '01', title: 'Design & Dream',      desc: 'Every collection begins with a sketch and a feeling — a color seen in morning light, a pattern from an old textile.' },
  { n: '02', title: 'Select Materials',    desc: 'We handpick every bead, fabric, and thread. Quality is felt before it is seen.' },
  { n: '03', title: 'Bead by Bead',        desc: 'Each bead placed with intention. A single bag can take 40+ hours of careful, meditative work.' },
  { n: '04', title: 'Final Love',          desc: 'Before shipping, every piece is inspected, wrapped with care, and sent with a little note.' },
];

export default function AboutPage() {
  return (
    <div style={{ minHeight: '100vh', paddingTop: 68 }}>

      {/* Hero */}
      <section className="bg-beige text-center border-b border-sand" style={{ padding: 'var(--section-padding)' }}>
        <div className="mx-auto max-w-[720px]">
          <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="mb-5 block text-4xl sm:text-5xl">☀️</span>
            <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.25em] text-mocha sm:text-xs">Our Story</p>
            <h1 className="mb-5 font-serif text-4xl font-bold leading-[1.1] text-ink sm:text-6xl lg:text-7xl">
              Made from the <span className="italic text-gold">heart</span>
            </h1>
            <div className="divider-gold-center mb-6" />
            <p className="font-sans text-base leading-relaxed text-subtle sm:text-lg sm:leading-loose">
              AREVÉ is more than a brand. It is a love letter to the art of making things by hand — slowly, intentionally, beautifully.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="bg-ivory" style={{ padding: 'var(--section-padding)' }}>
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16" style={{ paddingLeft: 'var(--container-px)', paddingRight: 'var(--container-px)' }}>
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.65 }}>
            <SectionHeader eyebrow="The Beginning" title="A story told in beads" />
            <p className="mb-4 font-sans text-base leading-relaxed text-subtle sm:text-lg">
              AREVÉ started on a small table by a window, with a bowl of beads and an afternoon of sunlight. What began as a personal obsession with handcraft grew into something shared.
            </p>
            <p className="mb-4 font-sans text-base leading-relaxed text-subtle sm:text-lg">
              The name AREVÉ comes from the Armenian word for sun — <em className="not-italic font-bold text-ink">arév</em> — because sunlight transforms ordinary things into something luminous.
            </p>
            <p className="font-sans text-base leading-relaxed text-subtle sm:text-lg">
              Today we create pieces designed to be cherished, not consumed. Every piece has a story, and when you carry it, that story becomes yours.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.65 }} className="relative">
            <div className="relative h-[400px] overflow-hidden rounded-[24px] sm:h-[460px]">
              <Image src="/images/about-light.png" alt="Crafting" fill className="object-cover" loading="lazy" />
            </div>
            <div className="absolute -bottom-3 -left-3 h-24 w-24 rounded-[16px] border-2 border-gold/40" />
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-beige" style={{ padding: 'var(--section-padding)' }}>
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6" style={{ paddingLeft: 'var(--container-px)', paddingRight: 'var(--container-px)' }}>
          <SectionHeader eyebrow="What We Believe" title="Our Values" subtitle="The principles behind every piece we create." centered />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {values.map((v, i) => (
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

      {/* Process */}
      <section className="bg-ivory" style={{ padding: 'var(--section-padding)' }}>
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6" style={{ paddingLeft: 'var(--container-px)', paddingRight: 'var(--container-px)' }}>
          <SectionHeader eyebrow="How We Work" title="Behind the Scenes" subtitle="From first sketch to your hands — the journey of every AREVÉ piece." centered />
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
            {steps.map((s, i) => (
              <motion.div key={s.n} initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: i * 0.12 }}>
                <p className="mb-3 font-serif text-5xl font-bold leading-none text-gold/30 sm:text-6xl">{s.n}</p>
                <h3 className="mb-2.5 font-serif text-xl font-bold text-ink">{s.title}</h3>
                <p className="font-sans text-sm leading-relaxed text-subtle">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery strip */}
      <section className="bg-beige p-0">
        <div className="grid h-[200px] grid-cols-1 sm:h-[260px] sm:grid-cols-3">
          {['/images/gallery-light-3.png', '/images/gallery-light-4.png', '/images/gallery-light-1.png'].map((img, i) => (
            <div key={i} className={`relative overflow-hidden ${i > 0 ? 'hidden sm:block' : 'block'}`}>
              <Image src={img} alt="" fill className="object-cover transition-transform duration-700 hover:scale-105" loading="lazy" />
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ivory text-center" style={{ padding: 'var(--section-padding)' }}>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto max-w-[480px]">
          <h2 className="mb-3 font-serif text-3xl font-bold text-ink sm:text-4xl">Ready to find your piece?</h2>
          <p className="mb-8 font-sans text-base text-subtle sm:text-lg">Explore our handmade collection — each one waiting for the right person.</p>
          <Link href="/products" className="btn-primary no-underline">Shop the Collection <ArrowRight size={15} /></Link>
        </motion.div>
      </section>
    </div>
  );
}
