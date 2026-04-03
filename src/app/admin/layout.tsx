'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Package, ShoppingCart, Tags, 
  MessageSquare, Image as ImageIcon, HelpCircle, 
  Users, Settings, Search, Bell, LogOut 
} from 'lucide-react';
import { useAdminStore } from '@/lib/adminStore';

import { ToastContainer } from '@/components/ui/Toast';
import { AppModal } from '@/components/ui/AppModal';

const links = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/categories', label: 'Categories', icon: Tags },
  { href: '/admin/reviews', label: 'Reviews', icon: MessageSquare },
  { href: '/admin/gallery', label: 'Gallery', icon: ImageIcon },
  { href: '/admin/faq', label: 'FAQ', icon: HelpCircle },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, logout, hydrateFromApi } = useAdminStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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

  return (
    <div className="fixed inset-0 z-50 flex bg-[#F8F5F2] text-[#2B2B2B] font-sans">
      <ToastContainer />
      <AppModal />
      <aside className="w-60 bg-white border-r border-[#EADFD8] flex flex-col h-full shrink-0 shadow-[4px_0_24px_rgba(180,156,140,0.05)]">
        <div className="h-14 flex items-center px-6 border-b border-[#EADFD8]">
          <Link href="/" className="flex items-center gap-2 text-ink no-underline">
            <span className="text-lg">☀️</span>
            <span className="font-serif text-lg font-bold tracking-wide text-[#2B2B2B]">AREVÉ</span>
            <span className="ml-2 text-[9px] font-bold tracking-wider text-[#AFAFAF] uppercase bg-[#F8F5F2] px-2 py-0.5 rounded-full">Admin</span>
          </Link>
        </div>

        <div className="flex-1 py-4 px-4 overflow-y-auto space-y-0.5 custom-scrollbar">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/admin');
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-[#E6C97A]/15 text-[#5a4a1e] font-medium shadow-[0_2px_8px_rgba(230,201,122,0.2)]' 
                    : 'text-[#7A7A7A] hover:bg-[#F8F5F2] hover:text-[#2B2B2B]'
                }`}
              >
                <Icon size={17} className={isActive ? 'text-[#E6C97A]' : 'opacity-70'} />
                <span className="text-[13px]">{link.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-[#EADFD8]">
          <button
            onClick={() => {
              logout();
              router.push('/admin/login');
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-[#7A7A7A] hover:bg-[#E8CFCB]/20 hover:text-[#6b3e3a] transition-colors"
          >
            <LogOut size={17} />
            <span className="text-[13px] font-medium">Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 h-full">
        <header className="h-14 bg-white border-b border-[#EADFD8] flex items-center justify-between px-6 shrink-0 shadow-[0_4px_24px_rgba(180,156,140,0.03)] z-10">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#AFAFAF]" size={15} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full bg-[#F8F5F2] border-none rounded-full py-1.5 pl-9 pr-4 text-[12px] text-[#2B2B2B] placeholder-[#AFAFAF] focus:outline-none focus:ring-2 focus:ring-[#E6C97A]/30 transition-shadow"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="relative text-[#7A7A7A] hover:text-[#2B2B2B] transition-colors">
              <Bell size={18} />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#E6C97A] rounded-full border-2 border-white"></span>
            </button>
            <div className="h-5 w-px bg-[#EADFD8]"></div>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-[12px] font-medium text-[#2B2B2B] group-hover:text-[#E6C97A] transition-colors">Admin User</p>
                <p className="text-[10px] text-[#AFAFAF]">Store Manager</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#EADFD8] border-2 border-white shadow-sm overflow-hidden flex items-center justify-center text-sm">
                 ☀️
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar relative">
          {children}
        </div>
      </main>
    </div>
  );
}
