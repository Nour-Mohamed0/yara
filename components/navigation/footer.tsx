'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { useLanguage } from '@/components/language-provider';
import type { TranslationKey } from '@/lib/translations';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

const learningLinks: { href: string; key: TranslationKey }[] = [
  { href: '/courses', key: 'courses' },
  { href: '/blog', key: 'blog' },
  { href: '/gallery', key: 'gallery' },
];

const companyLinks: { href: string; key: TranslationKey }[] = [
  { href: '/about', key: 'about' },
  { href: '/contact', key: 'contact' },
  { href: '/privacy', key: 'privacy' },
];

const socialLinks: { href: string; key: TranslationKey }[] = [
  { href: '#', key: 'socialTwitter' },
  { href: '#', key: 'socialLinkedin' },
  { href: '#', key: 'socialInstagram' },
];

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors duration-200 hover:text-primary"
    >
      {children}
      <ArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </Link>
  );
}

export function Footer() {
  const t = useTranslation();
  const { language } = useLanguage();
  const currentYear = new Date().getFullYear();
  const [links, setLinks] = useState<{
    learning: { href: string; label: string }[];
    company: { href: string; label: string }[];
    social: { href: string; label: string }[];
  }>({
    learning: learningLinks.map(l => ({ href: l.href, label: t(l.key) })),
    company: companyLinks.map(l => ({ href: l.href, label: t(l.key) })),
    social: socialLinks.map(l => ({ href: l.href, label: t(l.key) })),
  });

  useEffect(() => {
    async function fetchLinks() {
      try {
        const response = await fetch('/api/cms?type=navigation_links');
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            const formatted = {
              learning: data.filter((l: any) => l.group_name === 'learning').map((l: any) => ({ href: l.href, label: language === 'ar' ? l.label_ar : l.label_en })),
              company: data.filter((l: any) => l.group_name === 'company').map((l: any) => ({ href: l.href, label: language === 'ar' ? l.label_ar : l.label_en })),
              social: data.filter((l: any) => l.group_name === 'social').map((l: any) => ({ href: l.href, label: language === 'ar' ? l.label_ar : l.label_en })),
            };
            setLinks(prev => ({
              learning: formatted.learning.length > 0 ? formatted.learning : prev.learning,
              company: formatted.company.length > 0 ? formatted.company : prev.company,
              social: formatted.social.length > 0 ? formatted.social : prev.social,
            }));
          }
        }
      } catch (e) {
        console.error('Failed to fetch footer links', e);
      }
    }
    fetchLinks();
  }, [language, t]);

  return (
    <footer className="relative border-t border-border/40 bg-gradient-to-b from-card/60 to-background/95 backdrop-blur-xl">
      {/* Subtle top glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/30 to-transparent" aria-hidden />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="mb-8 grid grid-cols-2 gap-8 sm:mb-10 sm:gap-10 lg:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 space-y-3 sm:col-span-1 lg:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-cyan-600 text-xs font-bold text-primary-foreground shadow-md shadow-primary/25 sm:h-9 sm:w-9 sm:text-sm">
                EP
              </div>
              <span className="text-sm font-bold text-foreground sm:text-base">{t('navBrand')}</span>
            </div>
            <p className="max-w-xs text-xs leading-relaxed text-muted-foreground sm:text-sm">{t('footerTagline')}</p>
          </div>

          {/* Learning links */}
          <div>
            <h3 className="mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-xs font-semibold uppercase tracking-wider text-transparent sm:mb-4 sm:text-sm">
              {t('footerLearning')}
            </h3>
            <ul className="space-y-1.5 sm:space-y-2">
              {links.learning.map((link) => (
                <li key={link.href}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h3 className="mb-3 bg-gradient-to-r from-secondary to-accent bg-clip-text text-xs font-semibold uppercase tracking-wider text-transparent sm:mb-4 sm:text-sm">
              {t('footerCompany')}
            </h3>
            <ul className="space-y-1.5 sm:space-y-2">
              {links.company.map((link) => (
                <li key={link.href}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground sm:mb-4 sm:text-sm">
              {t('footerContact')}
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {[
                { icon: Mail, label: t('contactEmailLabel') },
                { icon: Phone, label: t('contactPhoneLabel') },
                { icon: MapPin, label: t('contactLocationLabel') },
              ].map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 sm:h-7 sm:w-7">
                    <Icon className="h-3 w-3 text-primary sm:h-3.5 sm:w-3.5" />
                  </div>
                  <span className="truncate">{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-border/30 pt-6 sm:flex-row sm:gap-4 sm:pt-8">
          <p className="text-center text-[10px] text-muted-foreground sm:text-start sm:text-xs">
            &copy; {currentYear} {t('navBrand')}. {t('footerRights')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {links.social.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs text-muted-foreground transition-colors duration-200 hover:text-primary sm:text-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
