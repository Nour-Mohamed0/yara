'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { HomeSliceSection } from '@/components/sections/home-slice-section';
import { useTranslation } from '@/hooks/use-translation';
import { Sparkles, ArrowRight, Zap } from 'lucide-react';

export function CTA() {
  const t = useTranslation();
  const reduce = useReducedMotion();

  return (
    <HomeSliceSection id="cta" variant="tl-br" tone="default">
      <div className="relative mx-auto max-w-6xl">
        {/* Main Glass Card Container */}
        <motion.div
          className="relative overflow-hidden rounded-[3rem] p-8 sm:p-16 md:p-24 glass-card border-white/10 shadow-[0_40px_100px_-30px_rgba(var(--primary-rgb),0.3)] group"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Animated Background Accents */}
          <div className="absolute top-0 right-0 h-96 w-96 bg-primary/20 blur-[120px] -mr-48 -mt-48 group-hover:bg-primary/30 transition-all duration-1000" />
          <div className="absolute bottom-0 left-0 h-96 w-96 bg-secondary/20 blur-[120px] -ml-48 -mb-48 group-hover:bg-secondary/30 transition-all duration-1000" />

          <div className="relative z-10 text-center max-w-4xl mx-auto">
            {/* Kicker */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border-white/5 bg-white/5 mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Zap className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-[0.25em] text-primary">Start Your Journey</span>
            </motion.div>

            {/* Heading */}
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-foreground leading-[1.1] tracking-tight mb-8">
              {t('ctaTitleA')}{' '}
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] bg-clip-text text-transparent animate-shimmer-text">
                {t('ctaTitleB')}
              </span>
            </h2>

            {/* Description */}
            <p className="text-lg sm:text-xl text-muted-foreground/80 mb-12 max-w-2xl mx-auto leading-relaxed">
              {t('ctaDesc')}
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button
                size="lg"
                className="h-16 px-10 rounded-2xl bg-foreground text-background font-black text-lg shadow-2xl hover:scale-105 active:scale-95 transition-all group w-full sm:w-auto"
                asChild
              >
                <Link href="/courses">
                  {t('ctaButtonPrimary')}
                  <div className="ml-3 h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="h-16 px-10 rounded-2xl border-2 border-primary/20 bg-transparent font-black text-lg hover:bg-primary/5 hover:border-primary/40 transition-all w-full sm:w-auto group"
                asChild
              >
                <Link href="/videos">
                  {t('ctaButtonSecondary')}
                  <Sparkles className="ml-2 h-5 w-5 text-secondary group-hover:rotate-12 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Bottom Gloss Line */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        </motion.div>
      </div>
    </HomeSliceSection>
  );
}
