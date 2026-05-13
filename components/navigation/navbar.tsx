'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useEffect, useState, useCallback } from 'react';
import { Moon, Sun, Menu, X, ChevronRight, BookOpen, User, GraduationCap, Newspaper, ImageIcon, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import { useLanguage } from '@/components/language-provider';
import { cn } from '@/lib/utils';
import { Globe } from 'lucide-react';

const navItems = [
  { href: '/', key: 'home' as const, icon: BookOpen },
  { href: '/about', key: 'about' as const, icon: User },
  { href: '/courses', key: 'courses' as const, icon: GraduationCap },
  { href: '/blog', key: 'blog' as const, icon: Newspaper },
  { href: '/gallery', key: 'gallery' as const, icon: ImageIcon },
  { href: '/contact', key: 'contact' as const, icon: Phone },
] as const;

export function Navbar() {
  const t = useTranslation();
  const pathname = usePathname();
  const { language, setLanguage } = useLanguage();
  const [dynamicNavItems, setDynamicNavItems] = useState(navItems.map(item => ({ ...item, label: t(item.key) })));

  useEffect(() => {
    async function fetchNav() {
      try {
        const response = await fetch('/api/cms?type=navigation_links');
        if (response.ok) {
          const data = await response.json();
          const filtered = data.filter((l: any) => l.group_name === 'navbar');
          if (filtered.length > 0) {
            setDynamicNavItems(filtered.map((l: any) => ({
              href: l.href,
              label: language === 'ar' ? l.label_ar : l.label_en,
              icon: navItems.find((i: any) => i.href === l.href)?.icon || Globe
            })));
          }
        }
      } catch (e) {
        console.error('Failed to fetch nav links', e);
      }
    }
    fetchNav();
  }, [language, t]);
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close sidebar on route change
  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  }, [resolvedTheme, setTheme]);

  return (
    <>
      {/* ─── Top bar ─── */}
      <nav
        className={cn(
          'sticky top-0 z-50 border-b transition-all duration-500',
          scrolled
            ? 'border-border/40 bg-background/75 shadow-lg shadow-primary/5 backdrop-blur-2xl'
            : 'border-transparent bg-background/30 backdrop-blur-md'
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between gap-2 sm:h-16">
            {/* Logo */}
            <Link href="/" className="group flex shrink-0 items-center gap-2.5">
              <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-primary to-cyan-600 text-xs font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-primary/35 sm:h-10 sm:w-10 sm:text-sm">
                EP
                {/* Shimmer effect on logo */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full transition-transform duration-700 group-hover:translate-x-full" />
              </div>
              <span className="text-sm font-bold tracking-tight text-foreground sm:text-base">{t('navBrand')}</span>
            </Link>

            {/* Desktop links */}
            <div className="hidden items-center gap-0.5 md:flex lg:gap-1">
              {dynamicNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'relative rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-300 lg:px-4',
                      isActive
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 h-0.5 w-4/5 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-cyan-400" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              {/* Language toggle */}
              <div className="flex items-center rounded-full border border-border/40 bg-muted/20 p-0.5">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={cn(
                    'h-7 rounded-full px-2 text-[10px] font-semibold transition-all duration-200 sm:h-8 sm:px-2.5 sm:text-xs',
                    language === 'en'
                      ? 'bg-primary/15 text-primary shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {t('langShortEn')}
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('ar')}
                  className={cn(
                    'h-7 rounded-full px-2 text-[10px] font-semibold transition-all duration-200 sm:h-8 sm:px-2.5 sm:text-xs',
                    language === 'ar'
                      ? 'bg-primary/15 text-primary shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {t('langShortAr')}
                </button>
              </div>

              {/* Theme */}
              {mounted && (
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-300 hover:bg-muted/40 sm:h-9 sm:w-9"
                  aria-label={resolvedTheme === 'dark' ? t('themeLight') : t('themeDark')}
                >
                  {resolvedTheme === 'dark' ? (
                    <Sun className="h-4 w-4 text-amber-400" />
                  ) : (
                    <Moon className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              )}

              {/* Hamburger */}
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-xl transition-colors hover:bg-muted/30 md:hidden"
                aria-label={t('menuOpen')}
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ─── Mobile Sidebar Overlay ─── */}
      <div
        className={cn(
          'fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm transition-opacity duration-400 md:hidden',
          sidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={() => setSidebarOpen(false)}
      />

      {/* ─── Modern Sidebar Panel with Circular Reveal ─── */}
      <aside
        className={cn(
          'fixed right-0 top-0 z-[101] flex h-full w-[280px] flex-col border-l border-border/30 bg-background/95 backdrop-blur-3xl transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden sm:w-[320px]',
          sidebarOpen
            ? '[clip-path:circle(150%_at_100%_0)] opacity-100'
            : '[clip-path:circle(0%_at_100%_0)] opacity-0 pointer-events-none'
        )}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between border-b border-border/30 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-cyan-600 text-xs font-bold text-primary-foreground shadow-md">
              EP
            </div>
            <span className="text-sm font-bold">{t('navBrand')}</span>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/30 transition-colors hover:bg-muted/50"
            aria-label={t('menuClose')}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Diagonal accent behind nav items */}
        <div
          className="pointer-events-none absolute left-0 top-[60px] h-full w-full opacity-[0.04] dark:opacity-[0.08]"
          aria-hidden
        >
          <div
            className="absolute inset-0 bg-gradient-to-br from-primary via-transparent to-secondary"
            style={{ clipPath: 'polygon(0 0, 100% 20%, 100% 100%, 0 80%)' }}
          />
        </div>

        {/* Nav links */}
        <div className="relative flex-1 overflow-y-auto px-4 py-5">
          <div className="space-y-1">
            {dynamicNavItems.map((item, index) => {
              const Icon = item.icon || Globe;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-500',
                    isActive
                      ? 'bg-gradient-to-r from-primary/15 to-primary/5 text-primary shadow-sm'
                      : 'text-muted-foreground hover:bg-muted/30 hover:text-foreground'
                  )}
                  style={{
                    transitionDelay: sidebarOpen ? `${index * 60 + 100}ms` : '0ms',
                    transform: sidebarOpen ? 'translateY(0) rotateX(0)' : 'translateY(20px) rotateX(-20deg)',
                    opacity: sidebarOpen ? 1 : 0,
                  }}
                >
                  <div
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
                      isActive ? 'bg-primary/15' : 'bg-muted/30 group-hover:bg-muted/50'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="flex-1">{item.label}</span>
                  <ChevronRight
                    className={cn(
                      'h-3.5 w-3.5 transition-all duration-200',
                      isActive ? 'text-primary opacity-100' : 'opacity-0 group-hover:opacity-50'
                    )}
                  />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-border/30 px-5 py-4 space-y-3">
          {/* Language toggle */}
          <div className="flex items-center gap-2">
            <span className="flex-1 text-xs text-muted-foreground">Language</span>
            <div className="flex rounded-lg border border-border/40 bg-muted/20 p-0.5">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={cn(
                  'rounded-md px-3 py-1.5 text-xs font-semibold transition-all',
                  language === 'en' ? 'bg-primary/15 text-primary' : 'text-muted-foreground'
                )}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('ar')}
                className={cn(
                  'rounded-md px-3 py-1.5 text-xs font-semibold transition-all',
                  language === 'ar' ? 'bg-primary/15 text-primary' : 'text-muted-foreground'
                )}
              >
                AR
              </button>
            </div>
          </div>

          {/* Theme toggle */}
          {mounted && (
            <button
              type="button"
              onClick={toggleTheme}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted/30 hover:text-foreground"
            >
              {resolvedTheme === 'dark' ? (
                <>
                  <Sun className="h-4 w-4 text-amber-400" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
