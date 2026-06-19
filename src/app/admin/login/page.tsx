'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminStore } from '@/lib/adminStore';
import { Lock } from 'lucide-react';
import { useTranslation } from '@/i18n/I18nProvider';

export default function AdminLogin() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('admin@areve.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { loginWithApi } = useAdminStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginWithApi(email, password);
      router.push('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('adminLogin.loginFailed'));
    }
  };

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-[0_8px_40px_rgba(180,156,140,0.15)] text-center">
        <div className="mx-auto w-16 h-16 bg-beige/50 text-ink rounded-full flex items-center justify-center mb-6">
          <Lock size={28} />
        </div>
        <h3 className=" font-serif text-ink mb-2">{t('adminLogin.title')}</h3>
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
          <button type="submit" className="btn-primary w-full justify-center">
            {t('adminLogin.logIn')}
          </button>
        </form>
      </div>
    </div>
  );
}
