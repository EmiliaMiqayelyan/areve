import { Setting } from "../models";

const MOJIBAKE_RE = /[ÕÔÃ][±°´€³]|Ã©|â€|AREVÃ/;

const ARMENIAN_TAGLINE = "Արև՝ քո առօրյայում";
const ARMENIAN_FOOTER =
  "Ստեղծված ձեռքերով՝ ջերմությամբ, համբերությամբ և սիրով";

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

/** Reset settings text that was saved with broken UTF-8 or legacy English defaults. */
export async function repairCorruptedSettings() {
  const row = await Setting.findByPk(1);
  if (!row) return;

  const j = row.toJSON() as Record<string, unknown>;
  const tagline = String(j.tagline ?? "");
  const footer = String(j.footerDescription ?? j.footer_description ?? "");
  const siteContent = j.siteContent ?? j.site_content;

  const corrupted =
    hasMojibake(tagline) ||
    hasMojibake(footer) ||
    hasMojibake(siteContent) ||
    isLegacyEnglishCopy(tagline, footer);

  if (!corrupted) return;

  await row.update({
    tagline: ARMENIAN_TAGLINE,
    footerDescription: ARMENIAN_FOOTER,
    siteContent: null,
  });

  console.log("repairCorruptedSettings: restored Armenian settings copy");
}
