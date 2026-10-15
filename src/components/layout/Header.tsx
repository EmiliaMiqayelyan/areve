'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { ChevronDown, Heart, Menu, Search, ShoppingBag } from 'lucide-react';
import { useCartStore, useWishlistStore } from '@/lib/store';
import CartDrawer from '../CartDrawer';
import WishlistPopover from '../WishlistPopover';
import SearchPanel from './SearchPanel';
import MobileMenu from './MobileMenu';
import areve from '../../../public/areve.png';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { useTranslation } from '@/i18n/I18nProvider';
import { useCatalogCategories } from '@/lib/useCatalog';
import type { Locale } from '@/i18n/types';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [catMenuSuppressed, setCatMenuSuppressed] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const pathname = usePathname();
  const { settings } = useSiteSettings();
  const { t, locale, setLocale, locales, localeLabels } = useTranslation();
  const { categories } = useCatalogCategories();
  const navLinks = settings.siteContent.nav.filter((link) => String(link.href) !== '/reviews');
  const announcement = settings.siteContent.announcement;

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
    const fn = () => setScrolled(window.scrollY > 8);
    fn();
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setMobileOpen(false); setSearchOpen(false); }, [pathname]);
  useEffect(() => { closeWishlistPanel(); }, [pathname, closeWishlistPanel]);

  if (pathname.startsWith('/admin')) return null;

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

  const closeCatMenu = () => {
    setCatMenuSuppressed(true);
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  };

  const cartCount = mounted ? count() : 0;
  const wishCount = mounted ? wishlist.length : 0;

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-secondary focus:px-4 focus:py-2 focus:text-background"
      >
        {locale === 'hy' ? 'Անցնել բովանդակությանը' : 'Skip to content'}
      </a>

      <div className="bg-secondary text-accent">
        <div className="wrap flex h-9 items-center justify-center gap-3 text-[11px] tracking-[0.12em] sm:text-[11.5px]">
          {announcement.map((item, i) => (
            <span key={item} className={`items-center gap-3 ${i > 1 ? 'hidden md:inline-flex' : 'inline-flex'}`}>
              {i > 0 && <span aria-hidden className="h-1 w-1 rounded-full bg-primary" />}
              <span className="whitespace-nowrap">{item}</span>
            </span>
          ))}
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300 ${
          scrolled || searchOpen
            ? 'border-border bg-background/95 shadow-[0_1px_0_rgba(21,18,15,0.02)] backdrop-blur-md'
            : 'border-transparent bg-background'
        }`}
      >
        <div className="wrap grid h-[var(--header-h)] grid-cols-[1fr_auto_1fr] items-center gap-4">
          {/* Left: mobile controls / desktop navigation */}
          <div className="flex items-center gap-1 lg:gap-0">
            <button
              type="button"
              className="icon-btn -ml-2 lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label={t('header.menu')}
              aria-expanded={mobileOpen}
            >
              <Menu size={22} strokeWidth={1.4} />
            </button>
            <button
              type="button"
              className="icon-btn lg:hidden"
              onClick={() => setSearchOpen((v) => !v)}
              aria-label={t('header.search')}
              aria-expanded={searchOpen}
            >
              <Search size={20} strokeWidth={1.4} />
            </button>

            <nav aria-label="Main" className="hidden items-center gap-7 lg:flex xl:gap-9">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                const isShop = link.href === '/products';
                return (
                  <div
                    key={`${link.href}-${locale}`}
                    className={isShop ? 'group relative' : undefined}
                    onMouseLeave={isShop ? () => setCatMenuSuppressed(false) : undefined}
                  >
                    <Link
                      href={link.href}
                      aria-current={active ? 'page' : undefined}
                      className={`relative inline-flex items-center gap-1 py-2 text-[14px] no-underline transition-colors after:absolute after:inset-x-0 after:bottom-0.5 after:h-px after:origin-left after:bg-primary after:transition-transform after:duration-300 ${
                        active
                          ? 'text-text after:scale-x-100'
                          : 'text-text/75 after:scale-x-0 hover:text-text hover:after:scale-x-100'
                      }`}
                    >
                      {link.label}
                      {isShop && categories.length > 0 && (
                        <ChevronDown size={13} strokeWidth={1.6} className={`transition-transform duration-300 ${catMenuSuppressed ? '' : 'group-hover:rotate-180'}`} />
                      )}
                    </Link>

                    {isShop && categories.length > 0 && (
                      <div
                        className={`invisible absolute left-[-24px] top-full z-50 pt-3 opacity-0 transition-all duration-200 ${
                          catMenuSuppressed
                            ? ''
                            : 'group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100'
                        }`}
                      >
                        <div className="w-[300px] border border-border bg-background p-2 shadow-[0_18px_40px_-20px_rgba(21,18,15,0.25)]">
                          <ul className="py-1">
                            {categories.map((cat) => (
                              <li key={cat.id}>
                                <Link
                                  href={`/products?category=${encodeURIComponent(cat.id)}`}
                                  onClick={closeCatMenu}
                                  className="flex items-center justify-between gap-4 px-4 py-2.5 text-[14px] text-text no-underline transition-colors hover:bg-surface"
                                >
                                  <span>{cat.label}</span>
                                  <span className="text-[12px] tabular-nums text-muted">{cat.count}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                          <Link
                            href="/products"
                            onClick={closeCatMenu}
                            className="mt-1 flex items-center justify-between border-t border-border px-4 py-3 text-[12px] font-medium uppercase tracking-[0.12em] text-primary-deep no-underline hover:text-text"
                          >
                            {t('header.allProducts')}
                            <span aria-hidden>→</span>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Center: logo */}
          <Link href="/" className="flex items-center justify-center no-underline" aria-label="AREVÉ Collections">
            <Image
              src={areve}
              alt="AREVÉ Collections"
              className="h-9 w-auto sm:h-10 lg:h-12"
              priority
              unoptimized
            />
          </Link>

          {/* Right: actions */}
          <div className="flex items-center justify-end gap-0.5 sm:gap-1">
            <button
              type="button"
              className="icon-btn hidden lg:inline-flex"
              onClick={() => setSearchOpen((v) => !v)}
              aria-label={t('header.search')}
              aria-expanded={searchOpen}
            >
              <Search size={19} strokeWidth={1.4} />
            </button>

            <div className="mx-2 hidden items-center text-[12px] tracking-[0.08em] lg:flex" role="group" aria-label={t('header.language')}>
              {locales.map((code, i) => (
                <span key={code} className="flex items-center">
                  {i > 0 && <span aria-hidden className="mx-1.5 h-3 w-px bg-border" />}
                  <button
                    type="button"
                    onClick={() => setLocale(code as Locale)}
                    aria-pressed={locale === code}
                    className={`cursor-pointer border-none bg-transparent px-0.5 py-1 transition-colors ${
                      locale === code ? 'font-medium text-text' : 'text-muted hover:text-text'
                    }`}
                  >
                    {localeLabels[code as Locale]}
                  </button>
                </span>
              ))}
            </div>

            <button
              ref={wishlistButtonRef}
              type="button"
              onClick={handleToggleWishlist}
              className="icon-btn"
              aria-expanded={wishlistOpen}
              aria-haspopup="dialog"
              aria-label={`${t('header.wishlist')}${wishCount ? ` (${wishCount})` : ''}`}
            >
              <Heart
                size={20}
                strokeWidth={1.4}
                className={wishlistOpen ? 'text-primary' : undefined}
                fill={wishlistOpen ? 'currentColor' : 'none'}
              />
              {wishCount > 0 && <span className="count-badge">{wishCount}</span>}
            </button>

            <button
              type="button"
              onClick={handleToggleCart}
              className="icon-btn -mr-2"
              aria-label={`${t('header.cart')}${cartCount ? ` (${cartCount})` : ''}`}
            >
              <ShoppingBag size={20} strokeWidth={1.4} />
              {cartCount > 0 && <span className="count-badge">{cartCount}</span>}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {searchOpen && <SearchPanel onClose={() => setSearchOpen(false)} />}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <MobileMenu
            navLinks={navLinks}
            isActive={isActive}
            onClose={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <CartDrawer />
      <WishlistPopover anchorRef={wishlistButtonRef} />
    </>
  );
}
