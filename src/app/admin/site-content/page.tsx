'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, RotateCcw, Save } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { useAdminStore } from '@/lib/adminStore';
import { DEFAULT_SITE_CONTENT } from '@/lib/siteContentDefaults';
import { modal, toast } from '@/lib/uiStore';

type GeneralPayload = {
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
};

function mapApiToGeneral(r: Record<string, unknown>): GeneralPayload {
  return {
    storeName: String(r.storeName ?? r.store_name ?? ''),
    tagline: String(r.tagline ?? ''),
    footerDescription: String(r.footerDescription ?? r.footer_description ?? ''),
    supportEmail: String(r.supportEmail ?? r.support_email ?? ''),
    businessPhone: String(r.businessPhone ?? r.business_phone ?? ''),
    address: String(r.address ?? ''),
    instagramUrl: String(r.instagramUrl ?? r.instagram_url ?? ''),
    facebookUrl: String(r.facebookUrl ?? r.facebook_url ?? ''),
    whatsappUrl: String(r.whatsappUrl ?? r.whatsapp_url ?? ''),
    tiktokUrl: String(r.tiktokUrl ?? r.tiktok_url ?? ''),
    youtubeUrl: String(r.youtubeUrl ?? r.youtube_url ?? ''),
  };
}

export default function AdminSiteContentPage() {
  const { token } = useAdminStore();
  const [general, setGeneral] = useState<GeneralPayload | null>(null);
  const [jsonText, setJsonText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!token) return;
    void apiFetch<Record<string, unknown>>('/admin/settings', {}, token)
      .then((r) => {
        setGeneral(mapApiToGeneral(r));
        const sc = r.siteContent ?? r.site_content ?? DEFAULT_SITE_CONTENT;
        setJsonText(JSON.stringify(sc, null, 2));
      })
      .catch(() => toast.error('Could not load settings'))
      .finally(() => setLoading(false));
  }, [token]);

  const handleSave = async () => {
    if (!token || !general) return;
    let siteContent: unknown;
    try {
      siteContent = JSON.parse(jsonText) as unknown;
    } catch {
      toast.error('Invalid JSON — fix syntax before saving.');
      return;
    }
    setSaving(true);
    try {
      await apiFetch(
        '/admin/settings',
        {
          method: 'PUT',
          body: JSON.stringify({ ...general, siteContent }),
        },
        token
      );
      modal.alert('Site content and structure were saved. Refresh the storefront to verify.', 'Saved');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = () => {
    setJsonText(JSON.stringify(DEFAULT_SITE_CONTENT, null, 2));
    toast.info('Editor filled with default structure — save to persist.');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#2B2B2B] flex items-center gap-2">
            <FileText size={22} className="text-[#E6C97A]" />
            Site content
          </h1>
          <p className="text-[14px] text-[#7A7A7A] mt-1 max-w-xl">
            Edit navigation, page copy, home sections, and SEO metadata as JSON. Invalid JSON cannot be saved. Brand contact fields and social URLs are still under{' '}
            <Link href="/admin/settings" className="text-mocha underline underline-offset-2 hover:text-gold">
              Settings
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-2 bg-white text-[#2B2B2B] px-4 py-2.5 rounded-xl border border-[#EADFD8] font-medium text-[13px] hover:bg-[#F8F5F2] cursor-pointer"
          >
            <RotateCcw size={16} /> Reset editor to defaults
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || loading || !general}
            className="flex items-center gap-2 bg-[#E6C97A] text-[#5a4a1e] px-6 py-2.5 rounded-xl font-medium text-[13px] hover:bg-[#D5B86A] shadow-sm cursor-pointer disabled:opacity-50"
          >
            <Save size={16} /> {saving ? 'Saving…' : 'Save to database'}
          </button>
        </div>
      </div>

      {loading && <p className="text-[13px] text-[#AFAFAF]">Loading…</p>}

      {!loading && (
        <div className="bg-white p-5 rounded-2xl border border-[#EADFD8] shadow-sm space-y-3">
          <label className="text-[12px] font-bold text-[#7A7A7A] uppercase tracking-wider">siteContent JSON</label>
          <textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            spellCheck={false}
            className="w-full min-h-[480px] font-mono text-[12px] leading-relaxed bg-[#F8F5F2] border border-[#EADFD8] rounded-xl p-4 text-[#2B2B2B] focus:outline-none focus:ring-2 focus:ring-[#E6C97A]/40"
          />
        </div>
      )}
    </div>
  );
}
