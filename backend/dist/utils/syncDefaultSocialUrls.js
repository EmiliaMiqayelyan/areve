"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncDefaultSocialUrls = syncDefaultSocialUrls;
const models_1 = require("../models");
const socialDefaults_1 = require("../socialDefaults");
/** Apply official social URLs when DB still has placeholder or empty values. */
async function syncDefaultSocialUrls() {
    const row = await models_1.Setting.findByPk(1);
    if (!row)
        return;
    const j = row.toJSON();
    const instagram = String(j.instagramUrl ?? j.instagram_url ?? "");
    const facebook = String(j.facebookUrl ?? j.facebook_url ?? "");
    const tiktok = String(j.tiktokUrl ?? j.tiktok_url ?? "");
    const youtube = String(j.youtubeUrl ?? j.youtube_url ?? "");
    const updates = {};
    if ((0, socialDefaults_1.isLegacyInstagramUrl)(instagram))
        updates.instagramUrl = socialDefaults_1.SOCIAL_URLS.instagram;
    if ((0, socialDefaults_1.isLegacyFacebookUrl)(facebook))
        updates.facebookUrl = socialDefaults_1.SOCIAL_URLS.facebook;
    if (!tiktok.trim())
        updates.tiktokUrl = socialDefaults_1.SOCIAL_URLS.tiktok;
    if (!youtube.trim())
        updates.youtubeUrl = socialDefaults_1.SOCIAL_URLS.youtube;
    if (Object.keys(updates).length === 0)
        return;
    await row.update(updates);
    console.log("syncDefaultSocialUrls: updated social profile links");
}
