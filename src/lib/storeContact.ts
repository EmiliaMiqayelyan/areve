/** WhatsApp number in international format (digits only), e.g. 37499123456 */
export const STORE_WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_STORE_WHATSAPP_NUMBER ?? '';

/** Telegram username without @, used for optional direct links */
export const STORE_TELEGRAM_USERNAME = process.env.NEXT_PUBLIC_STORE_TELEGRAM_USERNAME ?? '';

export function normalizePhoneDigits(phone: string): string {
  return phone.replace(/\D/g, '');
}

export function resolveStoreWhatsAppNumber(options?: {
  businessPhone?: string;
  whatsappUrl?: string;
}): string {
  if (STORE_WHATSAPP_NUMBER) return normalizePhoneDigits(STORE_WHATSAPP_NUMBER);

  const fromUrl = options?.whatsappUrl?.match(/wa\.me\/(\d+)/)?.[1];
  if (fromUrl) return fromUrl;

  if (options?.businessPhone) return normalizePhoneDigits(options.businessPhone);
  return '';
}

export function resolveStoreTelegramUsername(): string {
  return STORE_TELEGRAM_USERNAME.replace(/^@/, '');
}

export function buildWhatsAppOrderUrl(phoneDigits: string, message: string): string {
  return `https://wa.me/${phoneDigits}?text=${encodeURIComponent(message)}`;
}

export function buildTelegramOrderUrl(message: string): string {
  return `https://t.me/share/url?text=${encodeURIComponent(message)}`;
}
