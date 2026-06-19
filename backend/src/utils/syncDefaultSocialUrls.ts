import { Setting } from "../models";
import {
  SOCIAL_URLS,
  isLegacyFacebookUrl,
  isLegacyInstagramUrl,
} from "../socialDefaults";

/** Apply official social URLs when DB still has placeholder or empty values. */
export async function syncDefaultSocialUrls() {
  const row = await Setting.findByPk(1);
  if (!row) return;

  const j = row.toJSON() as Record<string, unknown>;
  const instagram = String(j.instagramUrl ?? j.instagram_url ?? "");
  const facebook = String(j.facebookUrl ?? j.facebook_url ?? "");
  const tiktok = String(j.tiktokUrl ?? j.tiktok_url ?? "");
  const youtube = String(j.youtubeUrl ?? j.youtube_url ?? "");

  const updates: Record<string, string> = {};

  if (isLegacyInstagramUrl(instagram)) updates.instagramUrl = SOCIAL_URLS.instagram;
  if (isLegacyFacebookUrl(facebook)) updates.facebookUrl = SOCIAL_URLS.facebook;
  if (!tiktok.trim()) updates.tiktokUrl = SOCIAL_URLS.tiktok;
  if (!youtube.trim()) updates.youtubeUrl = SOCIAL_URLS.youtube;

  if (Object.keys(updates).length === 0) return;

  await row.update(updates);
  console.log("syncDefaultSocialUrls: updated social profile links");
}
