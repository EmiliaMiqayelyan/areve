'use client';

import { useEffect, useState } from 'react';
import { Shield, Mail, KeyRound, Lock } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { useAdminStore } from '@/lib/adminStore';
import { toast } from '@/lib/uiStore';
import AdminSaveButton from '@/components/admin/AdminSaveButton';

function translateSecurityError(message: string): string {
  const map: Record<string, string> = {
    'Current password is incorrect': 'Ներկայիս գաղտնաբառը սխալ է',
    'Email is already in use': 'Այս email-ը արդեն օգտագործվում է',
    'Nothing to update': 'Փոխեք email-ը կամ գաղտնաբառը',
    'Provide a new email and/or new password': 'Մուտքագրեք նոր email կամ նոր գաղտնաբառ',
    'Passwords do not match': 'Գաղտնաբառերը չեն համընկնում',
    'Admin not found': 'Admin հաշիվը չի գտնվել',
    'Unauthorized': 'Նորից մուտք գործեք',
    'Invalid or expired token': 'Նորից մուտք գործեք',
    'Missing admin token': 'Նորից մուտք գործեք',
    'Request failed': 'Սերվերի սխալ — backend-ը restart արեք',
    'Validation failed': 'Ստուգեք մուտքագրված տվյալները',
  };
  return map[message] ?? message;
}

type AdminAccount = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export default function AdminSecurityPage() {
  const { token, adminEmail, updateAdminCredentials } = useAdminStore();
  const [account, setAccount] = useState<AdminAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (!token) return;
    void apiFetch<AdminAccount>('/admin/account', {}, token)
      .then((data) => {
        setAccount(data);
        setNewEmail(data.email);
      })
      .catch(() => setError('Չհաջողվեց բեռնել հաշվի տվյալները։ Backend-ը restart արեք։'))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    if (adminEmail) setNewEmail(adminEmail);
  }, [adminEmail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const emailChanged = Boolean(account && newEmail.trim() !== account.email);
    const passwordChanged = newPassword.trim().length > 0;

    if (!currentPassword.trim()) {
      setError('Մուտքագրեք ներկայիս գաղտնաբառը');
      return;
    }

    if (!emailChanged && !passwordChanged) {
      setError('Փոխեք email-ը կամ գաղտնաբառը');
      return;
    }

    if (passwordChanged) {
      if (newPassword.length < 6) {
        setError('Նոր գաղտնաբառը պետք է լինի առնվազն 6 նիշ');
        return;
      }
      if (newPassword !== confirmPassword) {
        setError('Գաղտնաբառերը չեն համընկնում');
        return;
      }
    }

    try {
      setSaving(true);
      await updateAdminCredentials({
        currentPassword,
        ...(emailChanged ? { newEmail: newEmail.trim() } : {}),
        ...(passwordChanged ? { newPassword, confirmPassword } : {}),
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      if (account) {
        setAccount({ ...account, email: newEmail.trim() });
      }
      toast.success('Հաշվի տվյալները հաջողությամբ թարմացվեցին');
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(translateSecurityError(message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div>
        <h1 className="text-2xl font-serif font-bold text-[#2B2B2B]">Security</h1>
        <p className="text-[14px] text-[#7A7A7A] mt-1">
          Փոխեք admin panel մուտք գործելու email-ը և գաղտնաբառը
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 text-[13px]">{error}</div>
        )}

        <div className="bg-white p-6 rounded-2xl border border-[#EADFD8] shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-[#EADFD8]">
            <Shield size={18} className="text-[#E6C97A]" />
            <h3 className="text-[15px] font-bold text-[#2B2B2B]">Հաշվի անվտանգություն</h3>
          </div>

          {loading ? (
            <p className="text-[14px] text-[#AFAFAF]">Բեռնվում է...</p>
          ) : (
            <>
              <div className="rounded-xl bg-[#F8F5F2] border border-[#EADFD8] px-4 py-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#AFAFAF]">Ներկայիս email</p>
                <p className="text-[14px] font-medium text-[#2B2B2B] mt-1">{account?.email ?? '—'}</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-[#7A7A7A] uppercase tracking-wider flex items-center gap-2">
                  <Lock size={14} /> Ներկայիս գաղտնաբառ *
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full bg-[#F8F5F2] border border-[#EADFD8] rounded-xl py-2.5 px-4 text-[14px] text-[#2B2B2B] focus:outline-none focus:ring-2 focus:ring-[#E6C97A]/50 transition-shadow"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-[#7A7A7A] uppercase tracking-wider flex items-center gap-2">
                  <Mail size={14} /> Նոր email
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  autoComplete="email"
                  className="w-full bg-[#F8F5F2] border border-[#EADFD8] rounded-xl py-2.5 px-4 text-[14px] text-[#2B2B2B] focus:outline-none focus:ring-2 focus:ring-[#E6C97A]/50 transition-shadow"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-[#7A7A7A] uppercase tracking-wider flex items-center gap-2">
                    <KeyRound size={14} /> Նոր գաղտնաբառ
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                    placeholder="առնվազն 6 նիշ"
                    className="w-full bg-[#F8F5F2] border border-[#EADFD8] rounded-xl py-2.5 px-4 text-[14px] text-[#2B2B2B] focus:outline-none focus:ring-2 focus:ring-[#E6C97A]/50 transition-shadow"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-[#7A7A7A] uppercase tracking-wider">
                    Կրկնել գաղտնաբառը
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    className="w-full bg-[#F8F5F2] border border-[#EADFD8] rounded-xl py-2.5 px-4 text-[14px] text-[#2B2B2B] focus:outline-none focus:ring-2 focus:ring-[#E6C97A]/50 transition-shadow"
                  />
                </div>
              </div>

              <p className="text-[12px] text-[#AFAFAF]">
                Գաղտնաբառը փոխելու համար պետք է լրացնել ներկայիս գաղտնաբառը։ Email-ը և գաղտնաբառը կարող եք փոխել միասին կամ առանձին։
              </p>
            </>
          )}
        </div>

        <div className="flex justify-end">
          <AdminSaveButton loading={saving} loadingLabel="Պահպանվում է..." compact className="font-medium px-6" disabled={loading || !account}>
            Պահպանել
          </AdminSaveButton>
        </div>
      </form>
    </div>
  );
}
