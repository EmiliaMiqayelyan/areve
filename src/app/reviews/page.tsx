'use client';

import ReviewCard from '@/components/ui/ReviewCard';
import PageHero from '@/components/ui/PageHero';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { useTranslation } from '@/i18n/I18nProvider';
import { useReviewsQuery } from '@/lib/useProductsQuery';

export default function ReviewsPage() {
  const { t } = useTranslation();
  const { settings } = useSiteSettings();
  const pg = settings.siteContent.pages.reviews;
  const { data: reviewList = [], isLoading: loading } = useReviewsQuery();

  return (
    <div className="min-h-screen">
      <PageHero
        eyebrow={pg.eyebrow}
        title={pg.title}
        subtitle={pg.subtitle}
        meta={
          !loading && reviewList.length > 0 ? (
            <p className="text-[13px] text-muted">
              <span className="tabular-nums text-text">{reviewList.length}</span> · {pg.totalReviewsLabel}
            </p>
          ) : null
        }
      />

      <div className="wrap section">
        {loading && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton h-56" />
            ))}
          </div>
        )}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reviewList.map((r, i) => (
            <ReviewCard key={r.id} review={{ ...r, location: r.location ?? '' }} index={i} />
          ))}
        </div>

        {!loading && reviewList.length === 0 && (
          <p className="py-10 text-center text-[14px] text-muted">{t('common.noReviews')}</p>
        )}
      </div>
    </div>
  );
}
