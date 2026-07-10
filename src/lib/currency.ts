export const CURRENCY_SYMBOL = '֏';

/** Format a numeric amount as Armenian dram (e.g. "12 500 ֏"). */
export function formatPrice(value: number | string | null | undefined): string {
  const num = Number(value ?? 0);
  if (!Number.isFinite(num)) return `0 ${CURRENCY_SYMBOL}`;

  const formatted = Math.round(num).toLocaleString('hy-AM');
  return `${formatted} ${CURRENCY_SYMBOL}`;
}
