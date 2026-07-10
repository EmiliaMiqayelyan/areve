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
          fontSize: 'clamp(18px, 2.4vw, 26px)',
          color: 'var(--color-heading)',
          fontWeight: 500,
          lineHeight: 1.35,
          marginBottom: 12,
          maxWidth: centered ? 640 : undefined,
          marginLeft: centered ? 'auto' : undefined,
          marginRight: centered ? 'auto' : undefined,
        }
      : {
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(20px, 2.6vw, 30px)',
          color: 'var(--color-heading)',
          fontWeight: 500,
          lineHeight: 1.3,
          marginBottom: 12,
        };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55 }}
      style={{ marginBottom: titleSize === 'compact' ? 32 : 40, textAlign: centered ? 'center' : 'left' }}
    >
      {eyebrow && (
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 500, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#BFA6A0', marginBottom: 10 }}>
          {eyebrow}
        </p>
      )}
      <h2 style={titleStyle}>
        {title}
      </h2>
      <div className={centered ? 'divider-gold-center' : 'divider-gold'} />
      {subtitle && (
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: titleSize === 'compact' ? 14 : 15, color: 'var(--color-subtle)', lineHeight: 1.75, maxWidth: 520, marginTop: 14, marginLeft: centered ? 'auto' : 0, marginRight: centered ? 'auto' : 0 }}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
