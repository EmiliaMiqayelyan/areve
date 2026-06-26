'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useTranslation } from '@/i18n/I18nProvider';
import { pickLocalized } from '@/lib/localizedText';

interface Review {
  id: string; name: string; location: string;
  comment: string; rating: number; product?: string;
}

export default function ReviewCard({ review, index = 0 }: { review: Review; index?: number }) {
  const { locale } = useTranslation();
  const comment = pickLocalized(review.comment, locale);
  const productLabel = review.product ? pickLocalized(review.product, locale) : '';
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.09 }}
      style={{ background: '#fff', borderRadius: 20, padding: '28px 28px 24px', border: '1px solid #E8DDD6', display: 'flex', flexDirection: 'column', gap: 14, boxShadow: '0 2px 16px rgba(180,156,140,0.06)' }}
    >
      {/* Stars */}
      <div style={{ display: 'flex', gap: 3 }}>
        {Array.from({ length: review.rating }).map((_, i) => (
          <Star key={i} size={14} fill="#E6C97A" color="#E6C97A" />
        ))}
      </div>

      {/* Comment */}
      <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, color: '#2B2B2B', lineHeight: 1.75, fontStyle: 'italic', flex: 1 }}>
        &ldquo;{comment}&rdquo;
      </p>

      {/* Product tag */}
      {productLabel && (
        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: '#BFA6A0', letterSpacing: '1px', textTransform: 'uppercase' }}>
          {productLabel}
        </span>
      )}

      {/* Author */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 12, borderTop: '1px solid #E8DDD6' }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #E6C97A, #E8CFCB)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, fontWeight: 700, color: '#5a4a1e' }}>{review.name[0]}</span>
        </div>
        <div>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, color: '#2B2B2B' }}>{review.name}</p>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: '#AFAFAF' }}>{review.location}</p>
        </div>
      </div>
    </motion.div>
  );
}
