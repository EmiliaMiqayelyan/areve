'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import ReviewCard from '@/components/ui/ReviewCard';
import SectionHeader from '@/components/ui/SectionHeader';
import { apiFetch } from '@/lib/api';

export default function ReviewsPage() {
  const [reviewList, setReviewList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void apiFetch<any[]>('/reviews')
      .then(setReviewList)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '100vh', paddingTop: 68 }}>
      <div style={{ background: '#EADFD8', padding: '64px 24px 56px', borderBottom: '1px solid #D6C3B3' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <SectionHeader eyebrow="Customer Reviews" title="What Our Community Says" subtitle="Real words from real people who love handmade things." centered />

          <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
            style={{ display: 'inline-flex', gap: 40, background: '#fff', borderRadius: 20, padding: '20px 36px', border: '1px solid #D6C3B3', marginTop: 8 }}>
            {[['5.0','Average Rating',<div style={{ display: 'flex', gap: 2 }}>{Array.from({length:5}).map((_,i)=><Star key={i} size={13} fill="#E6C97A" color="#E6C97A" />)}</div>],
              [String(reviewList.length),'Total Reviews',null],
              ['100%','5-Star Reviews',null]].map(([n,l,extra],i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 36, color: '#2B2B2B', fontWeight: 700 }}>{n}</p>
                {extra}
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: '#AFAFAF', marginTop: 4 }}>{l}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Featured quote */}
      <div style={{ background: '#F8F5F2', padding: '64px 24px', textAlign: 'center', borderBottom: '1px solid #EADFD8' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <p style={{ fontSize: 36, marginBottom: 16 }}>❝</p>
          <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(18px,2.5vw,26px)', color: '#2B2B2B', fontStyle: 'italic', lineHeight: 1.65 }}>
            You can feel the love in every stitch. Worth every penny.
          </p>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: '#BFA6A0', marginTop: 16, letterSpacing: '1px' }}>— Sophie Laurent, Paris</p>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '56px 24px' }}>
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

        <div style={{ textAlign: 'center', marginTop: 56 }}>
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, color: '#2B2B2B', marginBottom: 12 }}>Share Your Experience</h3>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: '#7A7A7A', marginBottom: 24 }}>Have a piece from AREVÉ? We'd love to hear your story.</p>
          <a href="mailto:hello@areve.handmade?subject=My Review for AREVÉ" className="btn-primary" style={{ textDecoration: 'none' }}>Write a Review</a>
        </div>
      </div>
    </div>
  );
}
