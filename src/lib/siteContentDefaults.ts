import { SITE_CONTENT_HY } from '@/i18n/siteContent/hy';

/** Default storefront copy (Armenian). Merged with API `site_content`. */
export const DEFAULT_SITE_CONTENT = SITE_CONTENT_HY;

export type SiteContent = typeof SITE_CONTENT_HY;

export type PublicSettings = {
  storeName: string;
  tagline: string;
  footerDescription: string;
  supportEmail: string;
  businessPhone: string;
  address: string;
  instagramUrl: string;
  facebookUrl: string;
  whatsappUrl: string;
  tiktokUrl: string;
  youtubeUrl: string;
  siteContent: SiteContent;
};
