'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import ReviewCard from '@/components/ui/ReviewCard';
import SectionHeader from '@/components/ui/SectionHeader';
import { apiFetch } from '@/lib/api';
import { useSiteSettings } from '@/context/SiteSettingsContext';

export default function ReviewsPage() {
  const { settings } = useSiteSettings();
  const pg = settings.siteContent.pages.reviews;
  const [reviewList, setReviewList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void apiFetch<any[]>('/reviews')
      .then(setReviewList)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '100vh', paddingTop: 68 }}>
      <div className="bg-beige border-b border-sand px-[var(--container-px)] py-12 sm:py-16">
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <SectionHeader eyebrow={pg.eyebrow} title={pg.title} subtitle={pg.subtitle} centered />

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12 bg-white rounded-[24px] p-8 sm:p-10 border border-[#D6C3B3] shadow-[0_8px_30px_rgba(180,156,140,0.12)] w-full max-w-2xl mx-auto"
          >
            {[
              [pg.avgRating, pg.avgRatingLabel, <div className="flex gap-1 justify-center">{Array.from({length:5}).map((_,i)=><Star key={i} size={14} fill="#E6C97A" color="#E6C97A" />)}</div>],
              [String(reviewList.length), pg.totalReviewsLabel, null],
              [pg.fiveStarValue, pg.fiveStarLabel, null]
            ].map(([n, l, extra], i) => (
              <div key={i} className="text-center w-full sm:w-auto">
                <p className="font-serif text-3xl sm:text-4xl font-bold text-ink leading-none mb-2">{n}</p>
                {extra}
                <p className="font-sans text-[11px] uppercase tracking-widest text-muted mt-2">{l}</p>
                {i < 2 && <div className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-12 bg-beige" />}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Featured quote */}
      <div className="bg-ivory border-b border-beige px-[var(--container-px)] py-16 sm:py-20 text-center">
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <p style={{ fontSize: 36, marginBottom: 16 }}>❝</p>
          <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(18px,2.5vw,26px)', color: '#2B2B2B', fontStyle: 'italic', lineHeight: 1.65 }}>
            You can feel the love in every stitch. Worth every penny.
          </p>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: '#BFA6A0', marginTop: 16, letterSpacing: '1px' }}>— Sophie Laurent, Paris</p>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-[var(--container-px)] py-14 sm:py-16">
        {loading && (
          <div style={{ padding: '24px 0', textAlign: 'center', fontFamily: "'DM Sans',sans-serif", color: '#AFAFAF' }}>
            Loading reviews...
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20 }}>
          {reviewList.map((r, i) => <ReviewCard key={r.id} review={r} index={i} />)}
        </div>

        {!loading && reviewList.length === 0 && (
          <div style={{ padding: '24px 0', textAlign: 'center', fontFamily: "'DM Sans',sans-serif", color: '#AFAFAF' }}>
            No reviews yet.
          </div>
        )}

      </div>
    </div>
  );
}
