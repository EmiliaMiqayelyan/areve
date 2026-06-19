import type { Locale } from '../types';
import { messagesEn } from './en';
import { messagesHy } from './hy';

export type Messages = typeof messagesHy | typeof messagesEn;

export function getMessages(locale: Locale): Messages {
  return locale === 'en' ? messagesEn : messagesHy;
}

type Path = string;

export function translate(messages: Messages, path: Path, params?: Record<string, string | number>): string {
  const parts = path.split('.');
  let val: unknown = messages;
  for (const part of parts) {
    if (val && typeof val === 'object' && part in (val as object)) {
      val = (val as Record<string, unknown>)[part];
    } else {
      return path;
    }
  }
  if (typeof val !== 'string') return path;
  if (!params) return val;
  return Object.entries(params).reduce(
    (acc, [key, value]) => acc.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value)),
    val
  );
}
