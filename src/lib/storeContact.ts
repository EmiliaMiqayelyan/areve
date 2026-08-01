/** WhatsApp number in international format (digits only), e.g. 37499123456 */
export const STORE_WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_STORE_WHATSAPP_NUMBER ?? '37441802122';

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

export function resolveStoreTelegramUsername(options?: { telegramUrl?: string }): string {
  const fromEnv = STORE_TELEGRAM_USERNAME.replace(/^@/, '').trim();
  if (fromEnv) return fromEnv;

  const raw = (options?.telegramUrl ?? '').trim();
  if (!raw) return '';

  const withoutAt = raw.replace(/^@/, '');
  const fromTme = withoutAt.match(/(?:t\.me|telegram\.me)\/(\+?[A-Za-z0-9_]+)/i)?.[1];
  if (fromTme) return fromTme;

  if (/^[A-Za-z0-9_]{5,32}$/.test(withoutAt)) return withoutAt;
  if (/^\+\d{8,15}$/.test(withoutAt)) return withoutAt;
  return '';
}

export function buildWhatsAppOrderUrl(phoneDigits: string, message: string): string {
  return `https://wa.me/${phoneDigits}?text=${encodeURIComponent(message)}`;
}

export function buildTelegramOrderUrl(username: string, message: string): string {
  const handle = username.replace(/^@/, '');
  return `https://t.me/${handle}?text=${encodeURIComponent(message)}`;
}
