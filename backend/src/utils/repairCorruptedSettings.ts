import { Setting } from "../models";
import { DEFAULT_SITE_CONTENT } from "../defaultSiteContent";

const MOJIBAKE_RE = /[ÕÔÃ][±°´€³]|Ã©|â€|AREVÃ/;

const ARMENIAN_TAGLINE = "Արև՝ քո առօրյայում";
const ARMENIAN_FOOTER = "Յուրաքանչյուրը փոքրիկ արև է";

function hasMojibake(value: unknown): boolean {
  if (value == null) return false;
  const text = typeof value === "string" ? value : JSON.stringify(value);
  return MOJIBAKE_RE.test(text);
}

function isLegacyEnglishCopy(tagline: string, footer: string): boolean {
  return (
    /Handcrafted/i.test(tagline) ||
    /Every piece is a tiny sun/i.test(footer) ||
    tagline.trim() === "" ||
    footer.trim() === ""
  );
}

function isLegacyArmenianFooter(footer: string): boolean {
  const trimmed = footer.trim();
  if (trimmed === ARMENIAN_FOOTER) return false;
  return (
    trimmed.startsWith("Ստեղծված ձեռքերով") ||
    trimmed.startsWith("Յուրաքանչյուր կտոր փոքրիկ արև է")
  );
}

function siteContentLooksStale(siteContent: unknown): boolean {
  if (siteContent == null) return false;
  const text = JSON.stringify(siteContent);
  return (
    text.includes("Պատրաստ եք գտնել ձեր կտորը") ||
    text.includes("Պատմություն, պատմված բիզերով") ||
    text.includes("Ոճ, որը ստեղծվում է") ||
    text.includes("/reviews") ||
    text.includes("Կարծիքներ") ||
    text.includes("ՏԵՍԱԿԱՆԻ")
  );
}

/** Reset settings text that was saved with broken UTF-8 or legacy defaults. */
export async function repairCorruptedSettings() {
  const row = await Setting.findByPk(1);
  if (!row) return;

  const j = row.toJSON() as Record<string, unknown>;
  const tagline = String(j.tagline ?? "");
  const footer = String(j.footerDescription ?? j.footer_description ?? "");
  const siteContent = j.siteContent ?? j.site_content;

  const patch: Record<string, unknown> = {};

  const corrupted =
    hasMojibake(tagline) ||
    hasMojibake(footer) ||
    hasMojibake(siteContent) ||
    isLegacyEnglishCopy(tagline, footer);

  if (corrupted) {
    patch.tagline = ARMENIAN_TAGLINE;
    patch.footerDescription = ARMENIAN_FOOTER;
    patch.siteContent = structuredClone(DEFAULT_SITE_CONTENT);
  } else if (isLegacyArmenianFooter(footer)) {
    patch.footerDescription = ARMENIAN_FOOTER;
  }

  // Replace stale storefront JSON so DB matches code (API also ignores DB copy).
  if (siteContentLooksStale(siteContent)) {
    patch.siteContent = structuredClone(DEFAULT_SITE_CONTENT);
  }

  if (Object.keys(patch).length === 0) return;

  await row.update(patch);

  console.log("repairCorruptedSettings: updated settings copy");
}
