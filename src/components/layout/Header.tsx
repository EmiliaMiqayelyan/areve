'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, Menu, X } from 'lucide-react';
import { useCartStore, useWishlistStore } from '@/lib/store';
import CartDrawer from '../CartDrawer';
import WishlistPopover from '../WishlistPopover';
import areve from "../../../public/areve.png"
import Image from "next/image";
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { useTranslation } from '@/i18n/I18nProvider';
import type { Locale } from '@/i18n/types';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { setIntroDone(true); }, []);
  const pathname = usePathname();
  const { settings } = useSiteSettings();
  const { locale, setLocale, locales, localeLabels } = useTranslation();
  const navLinks = settings.siteContent.nav;
  const wishlistButtonRef = useRef<HTMLButtonElement>(null);
  const { count, toggleCart, isOpen: cartOpen } = useCartStore();
  const { items: wishlist, toggleWishlistPanel, closeWishlistPanel, isOpen: wishlistOpen } =
    useWishlistStore();

  const handleToggleWishlist = () => {
    if (cartOpen) toggleCart();
    toggleWishlistPanel();
  };

  const handleToggleCart = () => {
    if (wishlistOpen) closeWishlistPanel();
    toggleCart();
  };

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);
  useEffect(() => { closeWishlistPanel(); }, [pathname, closeWishlistPanel]);

  if (pathname.startsWith('/admin')) return null;

  return (
    <>
      <motion.header
        initial={introDone ? false : { y: -64 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: (mounted && scrolled) ? 'rgba(248,245,242,0.95)' : 'rgba(248,245,242,0.80)',
          backdropFilter: 'blur(12px)',
          borderBottom: (mounted && scrolled) ? '1px solid #EADFD8' : '1px solid transparent',
          transition: 'background 0.3s, border-color 0.3s',
        }}
      >
        <div className="mx-auto flex h-[68px] min-h-[68px] max-h-[68px] items-center justify-between gap-3 px-4 sm:px-6 lg:max-w-[1280px]">

          <Link href="/" className="flex shrink-0 items-center no-underline">
            <Image src={areve} alt="areve" width={120} height={48} className="h-10 w-auto sm:h-11" priority />
          </Link>

          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-3 xl:gap-5 lg:flex px-2">
            {navLinks.map(link => (
              <Link
                key={`${link.href}-${locale}`}
                href={link.href}
                className="whitespace-nowrap shrink-0"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: locale === 'hy' ? 11 : 12,
                  fontWeight: 500,
                  letterSpacing: locale === 'hy' ? '0.6px' : '1px',
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
                  <span
                    style={{ position: 'absolute', bottom: -2, left: 0, right: 0, height: 2, background: '#E6C97A', borderRadius: 1 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2.5 sm:gap-3 self-center">
            <div className="hidden sm:flex h-8 items-center gap-0.5 rounded-full bg-white/80 p-0.5 border border-[#EADFD8]">
              {locales.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLocale(code as Locale)}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide border-none cursor-pointer transition-colors ${
                    locale === code ? 'bg-gold text-[#5a4a1e]' : 'bg-transparent text-[#AFAFAF] hover:text-[#2B2B2B]'
                  }`}
                >
                  {localeLabels[code as Locale]}
                </button>
              ))}
            </div>
            <div className="relative hidden sm:block">
              <button
                ref={wishlistButtonRef}
                type="button"
                onClick={handleToggleWishlist}
                className="relative border-none bg-none p-1 cursor-pointer text-subtle"
                style={{ color: wishlistOpen ? '#E6C97A' : '#7A7A7A' }}
                aria-expanded={wishlistOpen}
                aria-haspopup="true"
              >
                <Heart size={20} strokeWidth={1.6} fill={wishlistOpen ? '#E6C97A25' : 'none'} />
                {mounted && wishlist.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose text-[9px] font-bold text-[#6b3e3a]">
                    {wishlist.length}
                  </span>
                )}
              </button>
            </div>

            <button onClick={handleToggleCart} className="group relative border-none bg-none p-1 cursor-pointer text-subtle" style={{ color: '#7A7A7A' }}>
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
                <div className="flex sm:hidden items-center gap-1 rounded-full bg-white/80 p-0.5 border border-[#EADFD8] w-fit mb-2">
                  {locales.map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => setLocale(code as Locale)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide border-none cursor-pointer transition-colors ${
                        locale === code ? 'bg-gold text-[#5a4a1e]' : 'bg-transparent text-[#AFAFAF]'
                      }`}
                    >
                      {localeLabels[code as Locale]}
                    </button>
                  ))}
                </div>
                {navLinks.map((link, i) => (
                  <motion.div key={link.href} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                    <Link
                      href={link.href}
                      style={{
                        display: 'block',
                        padding: '12px 16px',
                        fontFamily: 'var(--font-sans)',
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
      <WishlistPopover anchorRef={wishlistButtonRef} />
    </>
  );
}
