'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Plus } from 'lucide-react';
import Link from 'next/link';
import PageHero from '@/components/ui/PageHero';
import Reveal from '@/components/ui/Reveal';
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
    <div className="min-h-screen">
      <PageHero eyebrow={pg.eyebrow} title={pg.title} subtitle={pg.subtitle} />

      <div className="wrap section">
        <div className="mx-auto max-w-[820px]">
          {loading && (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton h-16" />
              ))}
            </div>
          )}

          <div className="border-t border-border">
            {faqList.map((faq, i) => {
              const isOpen = open === i;
              const panelId = `faq-panel-${i}`;
              return (
                <div key={faq.id ?? i} className="border-b border-border">
                  <h3 className="m-0">
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      className="group flex w-full cursor-pointer items-start gap-5 border-none bg-transparent py-6 text-left"
                    >
                      <span className="w-7 shrink-0 pt-1 text-[12px] tabular-nums tracking-[0.1em] text-primary-deep">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="flex-1 font-display text-[18px] leading-snug text-text transition-colors group-hover:text-primary-deep sm:text-[20px]">
                        {pickLocalized(faq.question, locale)}
                      </span>
                      <Plus
                        size={18}
                        strokeWidth={1.4}
                        className={`mt-1 shrink-0 text-muted transition-transform duration-300 ${isOpen ? 'rotate-45 text-text' : ''}`}
                      />
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={panelId}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="pb-7 pl-12 pr-8 text-[15px] leading-relaxed text-muted">
                          {pickLocalized(faq.answer, locale)}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {!loading && faqList.length === 0 && (
            <p className="py-10 text-center text-[14px] text-muted">{t('common.noFaqs')}</p>
          )}

          <Reveal className="mt-16 flex flex-col items-start gap-6 bg-surface p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
            <div>
              <h2 className="font-display text-[22px] text-text sm:text-[24px]">{t('faq.stillQuestions')}</h2>
              <p className="mt-2 text-[15px] text-muted">{t('faq.stillQuestionsDesc')}</p>
            </div>
            <Link href="/contact" className="btn-dark shrink-0">
              {t('faq.contactUs')} <ArrowRight size={15} strokeWidth={1.5} />
            </Link>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
