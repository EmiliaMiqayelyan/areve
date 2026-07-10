'use client';

import { useState } from 'react';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import PageHero from '@/components/ui/PageHero';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { useTranslation } from '@/i18n/I18nProvider';
import { useLocaleApiFetch } from '@/lib/useLocaleApi';
import { pickLocalized } from '@/lib/localizedText';

export default function FAQPage() {
  const { t, locale } = useTranslation();
  const localeFetch = useLocaleApiFetch();
  const { settings } = useSiteSettings();
  const pg = settings.siteContent.pages.faq;
  const [open, setOpen] = useState<number | null>(0);
  const [faqList, setFaqList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void localeFetch<any[]>('/faqs')
      .then(setFaqList)
      .catch(() => setFaqList([]))
      .finally(() => setLoading(false));
  }, [locale, localeFetch]);

  return (
    <div style={{ minHeight: '100vh', paddingTop: 68 }}>
      <PageHero
        variant="faq"
        eyebrow={pg.eyebrow}
        title={pg.title}
        subtitle={pg.subtitle}
      />

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '64px 24px' }}>
        {loading && (
          <div style={{ padding: '24px 0', textAlign: 'center', fontFamily: 'var(--font-sans)', color: '#AFAFAF' }}>
            {t('common.loadingFaqs')}
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {faqList.map((faq, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }}
              style={{ background: '#fff', borderRadius: 16, border: `1.5px solid ${open === i ? '#E6C97A' : '#EADFD8'}`, overflow: 'hidden', transition: 'border-color 0.25s' }}>
              <button onClick={() => setOpen(open === i ? null : i)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ width: 28, height: 28, borderRadius: '50%', background: open === i ? '#E6C97A' : '#EADFD8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-serif)', fontSize: 13, fontWeight: 700, color: open === i ? '#5a4a1e' : '#AFAFAF', flexShrink: 0 }}>
                    {i + 1}
                  </span>
                  <span style={{ fontFamily: 'var(--font-serif)', fontSize: 15, color: 'var(--color-heading)', fontWeight: 500 }}>
                    {pickLocalized(faq.question, locale)}
                  </span>
                </div>
                <ChevronDown size={18} color="#AFAFAF" style={{ flexShrink: 0, transform: open === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
              </button>

              <AnimatePresence>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28 }}>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: 15, color: '#7A7A7A', lineHeight: 1.75, padding: '0 24px 22px 66px' }}>
                      {pickLocalized(faq.answer, locale)}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {!loading && faqList.length === 0 && (
          <div style={{ padding: '24px 0', textAlign: 'center', fontFamily: 'var(--font-sans)', color: '#AFAFAF' }}>
            {t('common.noFaqs')}
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ marginTop: 48, background: '#EADFD8', borderRadius: 20, padding: '36px 32px', textAlign: 'center', border: '1px solid #D6C3B3' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 20, fontWeight: 500, color: 'var(--color-heading)', marginBottom: 10 }}>{t('faq.stillQuestions')}</h3>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 15, color: 'var(--color-subtle)', marginBottom: 24 }}>{t('faq.stillQuestionsDesc')}</p>
          <Link href="/contact" className="btn-primary" style={{ textDecoration: 'none' }}>{t('faq.contactUs')} <ArrowRight size={14} /></Link>
        </motion.div>
      </div>
    </div>
  );
}
