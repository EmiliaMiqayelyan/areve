/** Local display number (Armenia). */
export const STORE_PHONE_DISPLAY = '041802122';

/** International digits for WhatsApp / Telegram (no +). 041802122 → 37441802122 */
export const STORE_PHONE_E164 = '37441802122';

export const STORE_WHATSAPP_URL = `https://wa.me/${STORE_PHONE_E164}`;
export const STORE_TELEGRAM_URL = `https://t.me/+${STORE_PHONE_E164}`;

/** WhatsApp number in international format (digits only). */
export const STORE_WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_STORE_WHATSAPP_NUMBER?.replace(/\D/g, '') || STORE_PHONE_E164;

/** Telegram phone handle with +, e.g. +37441802122 */
export const STORE_TELEGRAM_USERNAME =
  process.env.NEXT_PUBLIC_STORE_TELEGRAM_USERNAME?.trim() || `+${STORE_PHONE_E164}`;

export function normalizePhoneDigits(phone: string): string {
  return phone.replace(/\D/g, '');
}

/** Convert 041802122 / +374 41 80 21 22 / 37441802122 into wa.me digits. */
export function toInternationalDigits(phone: string): string {
  let digits = normalizePhoneDigits(phone);
  if (!digits) return STORE_PHONE_E164;
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.startsWith('0')) digits = `374${digits.slice(1)}`;
  if (!digits.startsWith('374') && digits.length <= 9) digits = `374${digits}`;
  return digits;
}

function telegramPhoneHandle(value: string): string {
  return `+${toInternationalDigits(value)}`;
}

export function resolveStoreWhatsAppNumber(options?: {
  businessPhone?: string;
  whatsappUrl?: string;
}): string {
  if (STORE_WHATSAPP_NUMBER) return toInternationalDigits(STORE_WHATSAPP_NUMBER);

  const fromUrl = options?.whatsappUrl?.match(/wa\.me\/(\+?\d+)/)?.[1];
  if (fromUrl) return toInternationalDigits(fromUrl);

  if (options?.businessPhone) return toInternationalDigits(options.businessPhone);
  return STORE_PHONE_E164;
}

export function resolveStoreTelegramUsername(options?: { telegramUrl?: string }): string {
  const fromEnv = STORE_TELEGRAM_USERNAME.replace(/^@/, '').trim();
  if (fromEnv) {
    if (/^\+?\d+$/.test(fromEnv)) return telegramPhoneHandle(fromEnv);
    return fromEnv;
  }

  const raw = (options?.telegramUrl ?? '').trim();
  if (!raw) return telegramPhoneHandle(STORE_PHONE_E164);

  const withoutAt = raw.replace(/^@/, '');
  const fromTme = withoutAt.match(/(?:t\.me|telegram\.me)\/(\+?[A-Za-z0-9_]+)/i)?.[1];
  if (fromTme) {
    if (/^\+?\d+$/.test(fromTme)) return telegramPhoneHandle(fromTme);
    return fromTme;
  }

  if (/^[A-Za-z0-9_]{5,32}$/.test(withoutAt)) return withoutAt;
  if (/^\+?\d{8,15}$/.test(withoutAt)) return telegramPhoneHandle(withoutAt);
  return telegramPhoneHandle(STORE_PHONE_E164);
}

export function buildWhatsAppOrderUrl(phoneDigits: string, message: string): string {
  return `https://wa.me/${toInternationalDigits(phoneDigits)}?text=${encodeURIComponent(message)}`;
}

export function buildTelegramOrderUrl(username: string, message: string): string {
  const handle = username.replace(/^@/, '');
  return `https://t.me/${handle}?text=${encodeURIComponent(message)}`;
}
