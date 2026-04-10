'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, Menu, X } from 'lucide-react';
import { useCartStore, useWishlistStore } from '@/lib/store';
import CartDrawer from '../CartDrawer';
import areve from "../../../public/areve.png"
import Image from "next/image";
import { useSiteSettings } from '@/context/SiteSettingsContext';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const pathname = usePathname();
  const { settings } = useSiteSettings();
  const navLinks = settings.siteContent.nav;
  const { count, toggleCart } = useCartStore();
  const { items: wishlist } = useWishlistStore();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  if (pathname.startsWith('/admin')) return null;

  return (
    <>
      <motion.header
        initial={{ y: -64 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          background: (mounted && scrolled) ? 'rgba(248,245,242,0.95)' : 'rgba(248,245,242,0.80)',
          backdropFilter: 'blur(12px)',
          borderBottom: (mounted && scrolled) ? '1px solid #EADFD8' : '1px solid transparent',
          transition: 'background 0.3s, border-color 0.3s',
        }}
      >
        <div className="mx-auto flex h-[68px] items-center justify-between px-4 sm:px-6 lg:max-w-[1280px]">

          <Link href="/" className="flex items-center gap-2 no-underline sm:gap-2.5">
           <Image src={areve} alt="areve" width="90" height="90" />
          </Link>

          <nav className="hidden gap-8 items-center lg:flex">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  fontWeight: 500,
                  letterSpacing: '1.2px',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  color: pathname === link.href ? '#E6C97A' : '#7A7A7A',
                  position: 'relative',
                  paddingBottom: 2,
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => { if (pathname !== link.href) (e.target as HTMLElement).style.color = '#2B2B2B'; }}
                onMouseLeave={e => { if (pathname !== link.href) (e.target as HTMLElement).style.color = '#7A7A7A'; }}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.span
                    layoutId="nav-underline"
                    style={{ position: 'absolute', bottom: -2, left: 0, right: 0, height: 2, background: '#E6C97A', borderRadius: 1 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/products" className="hidden sm:flex relative text-subtle" style={{ color: '#7A7A7A' }}>
              <Heart size={20} strokeWidth={1.6} />
              {mounted && wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose text-[9px] font-bold text-[#6b3e3a]">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <button onClick={toggleCart} className="group relative border-none bg-none p-1 cursor-pointer text-subtle" style={{ color: '#7A7A7A' }}>
              <ShoppingBag size={20} strokeWidth={1.6} />
              {mounted && count() > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-[#5a4a1e]">
                  {count()}
                </span>
              )}
            </button>

            <button
              className="lg:hidden border-none bg-none p-1 cursor-pointer text-ink flex items-center justify-center"
              onClick={() => setMobileOpen(v => !v)}
            >
              {mobileOpen ? <X size={22} strokeWidth={1.6} /> : <Menu size={22} strokeWidth={1.6} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ background: '#F8F5F2', borderTop: '1px solid #EADFD8', overflow: 'hidden' }}
            >
              <nav style={{ padding: '16px 24px 24px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {navLinks.map((link, i) => (
                  <motion.div key={link.href} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                    <Link
                      href={link.href}
                      style={{
                        display: 'block',
                        padding: '12px 16px',
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 14,
                        fontWeight: 500,
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                        textDecoration: 'none',
                        color: pathname === link.href ? '#E6C97A' : '#2B2B2B',
                        borderRadius: 10,
                        background: pathname === link.href ? '#E6C97A15' : 'transparent',
                        transition: 'background 0.2s',
                      }}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <CartDrawer />
    </>
  );
}
