'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAdminStore } from '@/lib/adminStore';
import { useTranslation } from '@/i18n/I18nProvider';
import AdminSaveButton from '@/components/admin/AdminSaveButton';
import areveMark from '../../icon.png';

export default function AdminLogin() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('admin@areve.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const router = useRouter();
  const { loginWithApi } = useAdminStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoggingIn(true);
      setError('');
      await loginWithApi(email, password);
      router.push('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('adminLogin.loginFailed'));
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <div className="admin-shell min-h-screen bg-ivory flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-[0_8px_40px_rgba(180,156,140,0.15)] text-center">
        <div className="mx-auto mb-6 flex justify-center">
          <Image src={areveMark} alt="AREVÉ" width={72} height={72} className="h-16 w-16 object-contain" priority />
        </div>
        <h3 className="font-serif mb-2">{t('adminLogin.title')}</h3>
        <p className="text-subtle font-sans text-sm mb-6">{t('adminLogin.subtitle')}</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="email"
              className="field text-center font-sans mb-3"
              placeholder="admin@areve.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="field text-center font-sans tracking-widest"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
          </div>
          {error && <p className="text-[#c97a7a] text-sm font-sans">{error}</p>}
          <AdminSaveButton loading={loggingIn} showIcon={false} className="btn-primary w-full font-medium">
            {t('adminLogin.logIn')}
          </AdminSaveButton>
        </form>
      </div>
    </div>
  );
}
