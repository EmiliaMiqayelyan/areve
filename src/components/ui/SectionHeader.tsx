'use client';

import { motion } from 'framer-motion';

interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  titleSize?: 'default' | 'compact';
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  centered = false,
  titleSize = 'default',
}: Props) {
  const titleStyle =
    titleSize === 'compact'
      ? {
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(22px, 2.8vw, 32px)',
          color: '#2B2B2B',
          fontWeight: 700,
          lineHeight: 1.35,
          marginBottom: 16,
          maxWidth: centered ? 720 : undefined,
          marginLeft: centered ? 'auto' : undefined,
          marginRight: centered ? 'auto' : undefined,
        }
      : {
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(28px,4vw,46px)',
          color: '#2B2B2B',
          fontWeight: 700,
          lineHeight: 1.2,
          marginBottom: 16,
        };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55 }}
      style={{ marginBottom: titleSize === 'compact' ? 36 : 48, textAlign: centered ? 'center' : 'left' }}
    >
      {eyebrow && (
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', color: '#BFA6A0', marginBottom: 12 }}>
          {eyebrow}
        </p>
      )}
      <h2 style={titleStyle}>
        {title}
      </h2>
      <div className={centered ? 'divider-gold-center' : 'divider-gold'} />
      {subtitle && (
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: titleSize === 'compact' ? 15 : 16, color: '#7A7A7A', lineHeight: 1.75, maxWidth: 560, marginTop: 16, marginLeft: centered ? 'auto' : 0, marginRight: centered ? 'auto' : 0 }}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
