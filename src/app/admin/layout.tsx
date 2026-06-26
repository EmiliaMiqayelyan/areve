'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Package, ShoppingCart, Tags,
  MessageSquare, Image as ImageIcon, HelpCircle,
  Users, Settings, Search, Bell, LogOut, FileText, Menu, X
} from 'lucide-react';
import { useAdminStore } from '@/lib/adminStore';
import { useTranslation } from '@/i18n/I18nProvider';

import { ToastContainer } from '@/components/ui/Toast';
import { AppModal } from '@/components/ui/AppModal';

const links = [
  { href: '/admin', labelKey: 'admin.nav.dashboard', icon: LayoutDashboard },
  { href: '/admin/products', labelKey: 'admin.nav.products', icon: Package },
  { href: '/admin/orders', labelKey: 'admin.nav.orders', icon: ShoppingCart },
  { href: '/admin/categories', labelKey: 'admin.nav.categories', icon: Tags },
  { href: '/admin/reviews', labelKey: 'admin.nav.reviews', icon: MessageSquare },
  { href: '/admin/gallery', labelKey: 'admin.nav.gallery', icon: ImageIcon },
  { href: '/admin/faq', labelKey: 'admin.nav.faq', icon: HelpCircle },
  { href: '/admin/users', labelKey: 'admin.nav.users', icon: Users },
  { href: '/admin/site-content', labelKey: 'admin.nav.siteContent', icon: FileText },
  { href: '/admin/settings', labelKey: 'admin.nav.settings', icon: Settings },
] as const;

function SidebarNav({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="flex-1 py-4 px-4 overflow-y-auto space-y-0.5 custom-scrollbar">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive =
          pathname === link.href ||
          (pathname.startsWith(link.href) && link.href !== '/admin');
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 no-underline ${
              isActive
                ? 'bg-[#E6C97A]/15 text-[#5a4a1e] font-medium shadow-[0_2px_8px_rgba(230,201,122,0.2)]'
                : 'text-[#7A7A7A] hover:bg-[#F8F5F2] hover:text-[#2B2B2B]'
            }`}
          >
            <Icon size={17} className={isActive ? 'text-[#E6C97A]' : 'opacity-70'} />
            <span className="text-[13px]">{t(link.labelKey)}</span>
          </Link>
        );
      })}
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();
  const { isAuthenticated, logout, hydrateFromApi } = useAdminStore();
  const [isClient, setIsClient] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!sidebarOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sidebarOpen]);

  useEffect(() => {
    if (isClient && !isAuthenticated && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [isClient, isAuthenticated, pathname, router]);

  useEffect(() => {
    if (isClient && isAuthenticated && pathname !== '/admin/login') {
      void hydrateFromApi();
    }
  }, [isClient, isAuthenticated, pathname, hydrateFromApi]);

  if (!isClient) return null;

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!isAuthenticated) return null;

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="fixed inset-0 z-50 flex bg-[#F8F5F2] text-[#2B2B2B] font-sans">
      <ToastContainer />
      <AppModal />

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-[#2B2B2B]/40 backdrop-blur-[2px] lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar — drawer on mobile, fixed on desktop */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(280px,88vw)] flex-col bg-white border-r border-[#EADFD8] shadow-[4px_0_24px_rgba(180,156,140,0.12)] transition-transform duration-300 ease-out lg:static lg:z-auto lg:w-60 lg:shrink-0 lg:translate-x-0 lg:shadow-[4px_0_24px_rgba(180,156,140,0.05)] ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-14 flex items-center justify-between px-4 border-b border-[#EADFD8] sm:px-6">
          <Link href="/" className="flex items-center gap-2 text-ink no-underline min-w-0">
            <span className="text-lg shrink-0">☀️</span>
            <span className="font-serif text-lg font-bold tracking-wide text-[#2B2B2B] truncate">AREVÉ</span>
            <span className="hidden sm:inline ml-1 text-[9px] font-bold tracking-wider text-[#AFAFAF] uppercase bg-[#F8F5F2] px-2 py-0.5 rounded-full shrink-0">
              {t('admin.badge')}
            </span>
          </Link>
          <button
            type="button"
            onClick={closeSidebar}
            className="lg:hidden p-2 rounded-lg text-[#7A7A7A] hover:bg-[#F8F5F2]"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <SidebarNav pathname={pathname} onNavigate={closeSidebar} />

        <div className="p-4 border-t border-[#EADFD8]">
          <button
            onClick={() => {
              logout();
              router.push('/admin/login');
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-[#7A7A7A] hover:bg-[#E8CFCB]/20 hover:text-[#6b3e3a] transition-colors border-none bg-transparent cursor-pointer"
          >
            <LogOut size={17} />
            <span className="text-[13px] font-medium">{t('admin.logout')}</span>
          </button>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col h-full w-full">
        <header className="h-14 bg-white border-b border-[#EADFD8] flex items-center justify-between gap-3 px-4 sm:px-6 shrink-0 shadow-[0_4px_24px_rgba(180,156,140,0.03)] z-10">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-1 rounded-lg text-[#7A7A7A] hover:bg-[#F8F5F2] shrink-0"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
            <div className="relative hidden md:block flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#AFAFAF]" size={15} />
              <input
                type="text"
                placeholder={t('admin.search')}
                className="w-full bg-[#F8F5F2] border-none rounded-full py-1.5 pl-9 pr-4 text-[12px] text-[#2B2B2B] placeholder-[#AFAFAF] focus:outline-none focus:ring-2 focus:ring-[#E6C97A]/30 transition-shadow"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <button
              type="button"
              className="md:hidden p-2 rounded-lg text-[#7A7A7A] hover:bg-[#F8F5F2]"
              aria-label={t('admin.search')}
            >
              <Search size={18} />
            </button>
            <button type="button" className="relative p-2 rounded-lg text-[#7A7A7A] hover:text-[#2B2B2B] hover:bg-[#F8F5F2] transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E6C97A] rounded-full border-2 border-white" />
            </button>
            <div className="flex items-center gap-2 sm:gap-3 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-[12px] font-medium text-[#2B2B2B] group-hover:text-[#E6C97A] transition-colors">Admin User</p>
                <p className="text-[10px] text-[#AFAFAF]">Store Manager</p>
              </div>
              <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-sm shrink-0">
                ☀️
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 custom-scrollbar relative">
          {children}
        </div>
      </main>
    </div>
  );
}
