'use client';

import { Save, Info, Link as LinkIcon, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { SOCIAL_URLS } from '@/lib/socialDefaults';
import { useAdminStore } from '@/lib/adminStore';
import { toast, modal } from '@/lib/uiStore';

type StoreSettingsForm = {
  storeName: string;
  tagline: string;
  footerDescription: string;
  supportEmail: string;
  businessPhone: string;
  address: string;
  instagramUrl: string;
  facebookUrl: string;
  whatsappUrl: string;
  telegramUrl: string;
  tiktokUrl: string;
  youtubeUrl: string;
};

const defaultSettings: StoreSettingsForm = {
  storeName: 'AREVÉ',
  tagline: 'Արև՝ քո առօրյայում',
  footerDescription: 'Յուրաքանչյուրը փոքրիկ արև է',
  supportEmail: 'care@areve.com',
  businessPhone: '+374 41 83 21 22',
  address: '123 Artisan Maker Way, Creative District, NY 10012',
  instagramUrl: SOCIAL_URLS.instagram,
  facebookUrl: SOCIAL_URLS.facebook,
  whatsappUrl: 'https://wa.me/37441832122',
  telegramUrl: '',
  tiktokUrl: SOCIAL_URLS.tiktok,
  youtubeUrl: SOCIAL_URLS.youtube,
};

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false);
  const { token } = useAdminStore();
  const [settings, setSettings] = useState<StoreSettingsForm>(defaultSettings);

  useEffect(() => {
    if (!token) return;
    void apiFetch<any>('/admin/settings', {}, token)
      .then((result) => {
        if (!result) return;
        setSettings({
          storeName: result.store_name ?? result.storeName,
          tagline: result.tagline,
          footerDescription: result.footer_description ?? result.footerDescription,
          supportEmail: result.support_email ?? result.supportEmail,
          businessPhone: result.business_phone ?? result.businessPhone,
          address: result.address,
          instagramUrl: result.instagram_url ?? result.instagramUrl,
          facebookUrl: result.facebook_url ?? result.facebookUrl,
          whatsappUrl: result.whatsapp_url ?? result.whatsappUrl,
          telegramUrl: result.telegram_url ?? result.telegramUrl ?? '',
          tiktokUrl: result.tiktok_url ?? result.tiktokUrl ?? '',
          youtubeUrl: result.youtube_url ?? result.youtubeUrl ?? '',
        });
      })
      .catch(() => {});
  }, [token]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (token) {
        await apiFetch('/admin/settings', { method: 'PUT', body: JSON.stringify(settings) }, token);
      }
      modal.alert('Settings saved successfully!', 'Success');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#2B2B2B]">Settings</h1>
          <p className="text-[14px] text-[#7A7A7A] mt-1">Manage global website configuration and brand details.</p>
        </div>
        <button onClick={handleSave} className="flex items-center gap-2 bg-[#E6C97A] text-[#5a4a1e] px-6 py-2.5 rounded-xl font-medium text-[13px] hover:bg-[#D5B86A] transition-colors shadow-sm cursor-pointer">
          <Save size={16} /> {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* General Info */}
        <div className="bg-white p-6 rounded-2xl border border-[#EADFD8] shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-[#EADFD8]">
            <Info size={18} className="text-[#E6C97A]" />
            <h3 className="text-[15px] font-bold text-[#2B2B2B]">Website Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold text-[#7A7A7A] uppercase tracking-wider">Store Name</label>
              <input type="text" value={settings.storeName} onChange={(e) => setSettings((s) => ({ ...s, storeName: e.target.value }))} className="w-full bg-[#F8F5F2] border border-[#EADFD8] rounded-xl py-2.5 px-4 text-[14px] text-[#2B2B2B] focus:outline-none focus:ring-2 focus:ring-[#E6C97A]/50 transition-shadow" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold text-[#7A7A7A] uppercase tracking-wider">Tagline</label>
              <input type="text" value={settings.tagline} onChange={(e) => setSettings((s) => ({ ...s, tagline: e.target.value }))} className="w-full bg-[#F8F5F2] border border-[#EADFD8] rounded-xl py-2.5 px-4 text-[14px] text-[#2B2B2B] focus:outline-none focus:ring-2 focus:ring-[#E6C97A]/50 transition-shadow" />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[12px] font-bold text-[#7A7A7A] uppercase tracking-wider">Footer Description</label>
              <textarea rows={3} value={settings.footerDescription} onChange={(e) => setSettings((s) => ({ ...s, footerDescription: e.target.value }))} className="w-full resize-none bg-[#F8F5F2] border border-[#EADFD8] rounded-xl py-3 px-4 text-[14px] text-[#2B2B2B] focus:outline-none focus:ring-2 focus:ring-[#E6C97A]/50 transition-shadow" />
            </div>
          </div>
        </div>

        {/* Contact Details */}
        <div className="bg-white p-6 rounded-2xl border border-[#EADFD8] shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-[#EADFD8]">
            <Mail size={18} className="text-[#E6C97A]" />
            <h3 className="text-[15px] font-bold text-[#2B2B2B]">Contact Details</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold text-[#7A7A7A] uppercase tracking-wider">Support Email</label>
              <input type="email" value={settings.supportEmail} onChange={(e) => setSettings((s) => ({ ...s, supportEmail: e.target.value }))} className="w-full bg-[#F8F5F2] border border-[#EADFD8] rounded-xl py-2.5 px-4 text-[14px] text-[#2B2B2B] focus:outline-none focus:ring-2 focus:ring-[#E6C97A]/50 transition-shadow" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold text-[#7A7A7A] uppercase tracking-wider">Business Phone</label>
              <input type="tel" value={settings.businessPhone} onChange={(e) => setSettings((s) => ({ ...s, businessPhone: e.target.value }))} className="w-full bg-[#F8F5F2] border border-[#EADFD8] rounded-xl py-2.5 px-4 text-[14px] text-[#2B2B2B] focus:outline-none focus:ring-2 focus:ring-[#E6C97A]/50 transition-shadow" />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[12px] font-bold text-[#7A7A7A] uppercase tracking-wider">Physical Address</label>
              <input type="text" value={settings.address} onChange={(e) => setSettings((s) => ({ ...s, address: e.target.value }))} className="w-full bg-[#F8F5F2] border border-[#EADFD8] rounded-xl py-2.5 px-4 text-[14px] text-[#2B2B2B] focus:outline-none focus:ring-2 focus:ring-[#E6C97A]/50 transition-shadow" />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white p-6 rounded-2xl border border-[#EADFD8] shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-[#EADFD8]">
            <LinkIcon size={18} className="text-[#E6C97A]" />
            <h3 className="text-[15px] font-bold text-[#2B2B2B]">Social Media Profiles</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold text-[#7A7A7A] uppercase tracking-wider">Instagram URL</label>
              <input type="url" value={settings.instagramUrl} onChange={(e) => setSettings((s) => ({ ...s, instagramUrl: e.target.value }))} className="w-full bg-[#F8F5F2] border border-[#EADFD8] rounded-xl py-2.5 px-4 text-[14px] text-[#2B2B2B] focus:outline-none focus:ring-2 focus:ring-[#E6C97A]/50 transition-shadow" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold text-[#7A7A7A] uppercase tracking-wider">Facebook URL</label>
              <input type="url" value={settings.facebookUrl} onChange={(e) => setSettings((s) => ({ ...s, facebookUrl: e.target.value }))} className="w-full bg-[#F8F5F2] border border-[#EADFD8] rounded-xl py-2.5 px-4 text-[14px] text-[#2B2B2B] focus:outline-none focus:ring-2 focus:ring-[#E6C97A]/50 transition-shadow" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold text-[#7A7A7A] uppercase tracking-wider">WhatsApp Business Link</label>
              <input type="url" value={settings.whatsappUrl} onChange={(e) => setSettings((s) => ({ ...s, whatsappUrl: e.target.value }))} className="w-full bg-[#F8F5F2] border border-[#EADFD8] rounded-xl py-2.5 px-4 text-[14px] text-[#2B2B2B] focus:outline-none focus:ring-2 focus:ring-[#E6C97A]/50 transition-shadow" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold text-[#7A7A7A] uppercase tracking-wider">Telegram Link</label>
              <input type="text" value={settings.telegramUrl} onChange={(e) => setSettings((s) => ({ ...s, telegramUrl: e.target.value }))} className="w-full bg-[#F8F5F2] border border-[#EADFD8] rounded-xl py-2.5 px-4 text-[14px] text-[#2B2B2B] focus:outline-none focus:ring-2 focus:ring-[#E6C97A]/50 transition-shadow" placeholder="https://t.me/your_username" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold text-[#7A7A7A] uppercase tracking-wider">TikTok URL</label>
              <input type="url" value={settings.tiktokUrl} onChange={(e) => setSettings((s) => ({ ...s, tiktokUrl: e.target.value }))} className="w-full bg-[#F8F5F2] border border-[#EADFD8] rounded-xl py-2.5 px-4 text-[14px] text-[#2B2B2B] focus:outline-none focus:ring-2 focus:ring-[#E6C97A]/50 transition-shadow" placeholder="https://tiktok.com/@..." />
            </div>
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold text-[#7A7A7A] uppercase tracking-wider">YouTube URL</label>
              <input type="url" value={settings.youtubeUrl} onChange={(e) => setSettings((s) => ({ ...s, youtubeUrl: e.target.value }))} className="w-full bg-[#F8F5F2] border border-[#EADFD8] rounded-xl py-2.5 px-4 text-[14px] text-[#2B2B2B] focus:outline-none focus:ring-2 focus:ring-[#E6C97A]/50 transition-shadow" placeholder="https://youtube.com/@..." />
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}
