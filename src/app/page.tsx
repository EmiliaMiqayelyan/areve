'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Star } from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';
import ReviewCard from '@/components/ui/ReviewCard';
import SectionHeader from '@/components/ui/SectionHeader';
import { apiFetch } from '@/lib/api';

/* ── tiny helpers ── */
const S = {
  page: { minHeight: '100vh' },
  section: (bg?: string): React.CSSProperties => ({ background: bg ?? '#F8F5F2', padding: '96px 24px' }),
  wrap: { maxWidth: 1280, margin: '0 auto' } as React.CSSProperties,
};

const categories = [
  { title: 'Beaded Bags', desc: 'Each bag is a wearable artwork — beaded by hand, one stitch at a time.', img: '/images/prod-bag-a.png', href: '/products?category=bags' },
  { title: 'Handmade Toys', desc: 'Soft, safe, and full of soul — toys that become treasured companions.', img: '/images/prod-toy-a.png', href: '/products?category=toys' },
  { title: 'Accessories', desc: 'From morning to evening — our accessories add a golden touch to every look.', img: '/images/prod-acc-a.png', href: '/products?category=accessories' },
];

const instagramImages = [
  '/images/gallery-light-1.png', '/images/gallery-light-2.png',
  '/images/gallery-light-3.png', '/images/gallery-light-4.png',
  '/images/prod-bag-b.png', '/images/prod-acc-b.png',
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [reviewList, setReviewList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void Promise.all([
      apiFetch<any[]>('/products?active=true'),
      apiFetch<any[]>('/reviews'),
    ])
      .then(([p, r]) => {
        setFeaturedProducts(p);
        setReviewList(r);
      })
      .finally(() => setLoading(false));
  }, []);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div style={S.page}>

      <section ref={heroRef} style={{ position: 'relative', minHeight: '90vh', display: 'flex', alignItems: 'center', overflow: 'hidden', background: '#F8F5F2' }}>

        <motion.div style={{ y: imgY, position: 'absolute', inset: 0 }}>
          <Image src="/images/hero-light.png" alt="AREVÉ" fill style={{ objectFit: 'cover', objectPosition: 'center' }} priority />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, rgba(248,245,242,0.96) 0%, rgba(248,245,242,0.85) 45%, rgba(248,245,242,0.20) 100%)' }} />
        </motion.div>

        <motion.div className="relative z-10 mx-auto w-full px-4 sm:px-6 lg:max-w-[1280px]" style={{ y: textY, opacity, paddingTop: 'calc(var(--container-px) * 2.5)' }}>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="flex items-center gap-2.5 mb-6">
            <span className="badge badge-sage">New Collection {new Date().getFullYear()}</span>
            <span className="text-[#D6C3B3] text-xs sm:text-sm">☀️</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
            className="mb-6 font-serif text-4xl font-bold leading-[1.1] text-ink sm:text-6xl lg:text-[88px] lg:max-w-[700px]"
            style={{ fontFamily: "'Playfair Display',serif" }}
          >
            Handmade with<br />
            <span className="italic text-gold">warmth</span> &amp;{' '}
            <span className="italic text-gold">sunlight</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-10 max-w-[480px] font-sans text-base leading-relaxed text-subtle sm:text-lg sm:leading-loose"
          >
            Each piece from AREVÉ carries the warmth of hands that care — beaded bags, heartfelt toys, and accessories that tell your story.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.45 }} className="flex flex-wrap gap-3 sm:gap-4">
            <Link href="/products" className="btn-primary no-underline">
              Shop Now <ArrowRight size={15} />
            </Link>
            <Link href="/gallery" className="btn-outline no-underline">
              Explore Collection
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.9 }} className="mt-12 flex flex-wrap gap-8 sm:gap-12 lg:mt-16">
            {[['500+', 'Pieces Crafted'], ['200+', 'Happy Clients'], ['100%', 'Handmade']].map(([n, l]) => (
              <div key={l}>
                <p className="font-serif text-3xl font-bold text-ink sm:text-4xl">{n}</p>
                <p className="mt-1 font-sans text-xs uppercase tracking-widest text-[#AFAFAF]">{l}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 hidden sm:flex">
          <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#AFAFAF]">Scroll</p>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.6, repeat: Infinity }}
            className="h-10 w-[1px]" style={{ background: 'linear-gradient(#E6C97A, transparent)' }} />
        </motion.div>
      </section>


      <section style={{ ...S.section('#EADFD8'), padding: 'var(--section-padding)' }}>
        <div style={{ ...S.wrap, padding: '0 var(--container-px)' }}>
          <SectionHeader eyebrow="Our Collections" title="Made for Every Moment" subtitle="Three collections, one soul — each crafted with the same dedication to beauty and authenticity." centered />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat, i) => (
              <motion.div key={cat.title} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: i * 0.12 }}>
                <Link href={cat.href} className="group relative block h-[340px] overflow-hidden rounded-[20px] no-underline">
                  <Image src={cat.img} alt={cat.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2B2B2B]/60 via-[#2B2B2B]/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                    <h3 className="mb-1.5 font-serif text-xl font-bold text-white sm:text-2xl">{cat.title}</h3>
                    <p className="mb-4 font-sans text-[13px] leading-relaxed text-white/80">{cat.desc}</p>
                    <span className="flex items-center gap-1.5 font-sans text-xs font-semibold uppercase tracking-widest text-[#F4D58D]">
                      Explore <ArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ ...S.section(), padding: 'var(--section-padding)' }}>
        <div style={{ ...S.wrap, padding: '0 var(--container-px)' }}>
          <div className="flex flex-wrap items-end justify-between gap-4 mb-4 sm:mb-8">
            <SectionHeader eyebrow="Featured" title="New Collection" />
            <Link href="/products" className="mb-1 flex items-center gap-1.5 border-b border-mocha pb-0.5 font-sans text-[13px] text-mocha no-underline transition-colors hover:text-gold hover:border-gold">
              View All <ArrowRight size={13} />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {loading && (
              <div className="col-span-full py-10 text-center font-sans text-[#AFAFAF]">
                Loading products...
              </div>
            )}
            {!loading && featuredProducts.slice(0, 6).map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            {!loading && featuredProducts.length === 0 && (
              <div className="col-span-full py-10 text-center font-sans text-[#AFAFAF]">
                No products yet.
              </div>
            )}
          </div>
        </div>
      </section>

      <section style={{ ...S.section('#EADFD8'), padding: 'var(--section-padding)' }}>
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-12 items-center px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.65 }} className="relative">
            <div className="relative h-[400px] overflow-hidden rounded-[24px] sm:h-[500px]">
              <Image src="/images/about-light.png" alt="Crafting" fill className="object-cover" loading="lazy" />
            </div>

            <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-[20px] border-2 border-gold/30" />

            <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3.5, repeat: Infinity }}
              className="absolute -left-4 bottom-8 rounded-[16px] bg-white p-4 shadow-[0_8px_32px_rgba(180,156,140,0.22)] sm:p-5">
              <p className="font-serif text-2xl font-bold text-ink sm:text-3xl">40+</p>
              <p className="font-sans text-[11px] text-[#AFAFAF] sm:text-xs">Hours per bag</p>
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.65 }}>
            <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.25em] text-mocha">Our Story</p>
            <h2 className="mb-4 font-serif text-3xl font-bold leading-tight text-ink sm:text-4xl lg:text-5xl">
              Born from <span className="italic text-gold">passion,</span><br />made with hands
            </h2>
            <div className="divider-gold mb-6" />
            <p className="mb-4 font-sans text-base leading-relaxed text-subtle sm:text-lg">
              AREVÉ was born from a deep love of handcraft and the belief that everyday objects can carry extraordinary meaning. Every bead we place is an act of love.
            </p>
            <p className="mb-8 font-sans text-base leading-relaxed text-subtle sm:text-lg">
              Our name reflects sunlight — the warmth of creation. We pour that warmth into each piece so you can carry it with you.
            </p>

            <div className="mb-10 grid grid-cols-3 gap-3">
              {[['✦', 'Handmade'], ['☀️', 'Unique'], ['♡', 'Quality']].map(([ic, lbl]) => (
                <div key={lbl} className="rounded-[14px] border border-beige bg-white p-4 text-center">
                  <div className="mb-2 text-xl sm:text-2xl">{ic}</div>
                  <p className="font-sans text-[11px] font-medium text-ink sm:text-[13px]">{lbl}</p>
                </div>
              ))}
            </div>

            <Link href="/about" className="btn-outline no-underline">
              Read Our Story <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>

      <section style={{ ...S.section('#D6C3B3'), padding: 'var(--section-padding)' }}>
        <div style={{ ...S.wrap, padding: '0 var(--container-px)' }}>
          <SectionHeader eyebrow="Testimonials" title="Words from Hearts" subtitle="The most meaningful reward is knowing our pieces bring joy." centered />
          <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {loading && (
              <div className="col-span-full py-10 text-center font-sans text-[#AFAFAF]">
                Loading reviews...
              </div>
            )}
            {!loading && reviewList.slice(0, 3).map((r, i) => <ReviewCard key={r.id} review={r} index={i} />)}
            {!loading && reviewList.length === 0 && (
              <div className="col-span-full py-10 text-center font-sans text-[#AFAFAF]">
                No reviews yet.
              </div>
            )}
          </div>
          <div className="text-center">
            <Link href="/reviews" className="btn-outline no-underline" style={{ borderColor: '#BFA6A0' }}>
              Read All Reviews <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <section style={{ ...S.section(), padding: 'var(--section-padding)' }}>
        <div style={{ ...S.wrap, padding: '0 var(--container-px)' }}>
          <SectionHeader eyebrow="@areve.handmade" title="Follow Our Journey" subtitle="Behind the scenes, new arrivals, and stories from our community." centered />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {instagramImages.map((img, i) => (
              <motion.a key={i} href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.92 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }}
                className="group relative block aspect-square overflow-hidden rounded-[14px]">
                <Image src={img} alt={`Gallery ${i + 1}`} fill className="object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                <div className="absolute inset-0 bg-gold/0 transition-colors group-hover:bg-gold/10" />
              </motion.a>
            ))}
          </div>
          <p className="mt-8 text-center font-sans text-[13px] text-mocha">
            <a href="https://www.instagram.com/areve_collections?igsh=MXRkNW9rdnZhaTd6cA%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="border-b border-sand text-mocha no-underline transition-colors hover:text-gold hover:border-gold">
              View on Instagram →
            </a>
          </p>
        </div>
      </section>

      <section className="border-t border-beige bg-ivory text-center" style={{ padding: 'var(--section-padding)' }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.55 }} className="mx-auto max-w-[600px]">
          <span className="mb-5 block text-[40px]">☀️</span>
          <h2 className="mb-4 font-serif text-3xl font-bold leading-tight text-ink sm:text-4xl lg:text-5xl">
            Want something{' '}
            <span className="italic text-gold">uniquely yours?</span>
          </h2>
          <p className="mb-10 font-sans text-base leading-relaxed text-subtle sm:text-lg">
            We accept custom orders — your colors, your vision, our hands. Let&apos;s create something together.
          </p>
          <Link href="/contact" className="btn-primary no-underline">
            Request Custom Order <ArrowRight size={15} />
          </Link>
        </motion.div>
      </section>

    </div>
  );
}
