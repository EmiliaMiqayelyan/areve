'use client';

import { motion } from 'framer-motion';

interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export default function SectionHeader({ eyebrow, title, subtitle, centered = false }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55 }}
      style={{ marginBottom: 48, textAlign: centered ? 'center' : 'left' }}
    >
      {eyebrow && (
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', color: '#BFA6A0', marginBottom: 12 }}>
          {eyebrow}
        </p>
      )}
      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px,4vw,46px)', color: '#2B2B2B', fontWeight: 700, lineHeight: 1.2, marginBottom: 16 }}>
        {title}
      </h2>
      <div className={centered ? 'divider-gold-center' : 'divider-gold'} />
      {subtitle && (
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 16, color: '#7A7A7A', lineHeight: 1.75, maxWidth: 560, marginTop: 16, marginLeft: centered ? 'auto' : 0, marginRight: centered ? 'auto' : 0 }}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
