'use client';

import { LazyMotion, domAnimation, m, useReducedMotion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Sparkles, ArrowRight, GraduationCap, BookOpen, Globe } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface HeroProps {
  imageUrl?: string;
  title?: string;
  subtitle?: string;
}

export function Hero({ imageUrl, title, subtitle }: HeroProps) {
  const t = useTranslation();
  const rm = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Mouse Parallax (Lighter implementation)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { damping: 30, stiffness: 120 });
  const smoothY = useSpring(mouseY, { damping: 30, stiffness: 120 });

  const textX = useTransform(smoothX, [-500, 500], [8, -8]);
  const textY = useTransform(smoothY, [-500, 500], [5, -5]);
  const imgX = useTransform(smoothX, [-500, 500], [-12, 12]);
  const imgY = useTransform(smoothY, [-500, 500], [-8, 8]);

  useEffect(() => {
    if (window.innerWidth < 1024) return; // Disable on touch/small screens
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const stats = [
    { number: t('heroStat1Number'), label: t('heroStat1Label'), icon: GraduationCap, color: 'text-primary' },
    { number: t('heroStat2Number'), label: t('heroStat2Label'), icon: BookOpen, color: 'text-secondary' },
    { number: t('heroStat3Number'), label: t('heroStat3Label'), icon: Globe, color: 'text-accent' },
  ];

  if (!mounted) return null;

  return (
    <section className="perspective-deep relative isolate min-h-[85vh] flex items-center overflow-hidden bg-background">
      {/* --- Performance Background (Optimized) --- */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-background overflow-hidden" aria-hidden>
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[100px] animate-gpu opacity-50 dark:opacity-30" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[100px] animate-gpu opacity-50 dark:opacity-30" />

        {/* Animated Neon Rings (CSS only for performance) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-primary/5 rounded-full animate-loop-rotate opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] border border-secondary/5 rounded-full animate-loop-rotate opacity-10 [animation-direction:reverse]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <LazyMotion features={domAnimation}>
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">

            {/* --- Text Content --- */}
            <m.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ x: textX, y: textY }}
              className="relative z-10 text-center lg:text-start"
            >
              <div className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-2 mb-6 animate-float-soft ring-1 ring-primary/20">
                <div className="bg-primary/20 p-1 rounded-full">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-primary">{t('heroBadge')}</span>
              </div>

              <h1 className="text-[2.5rem] sm:text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight mb-6">
                <span className="block text-foreground mb-1">{title?.split(' ')[0] || 'Unleash'}</span>
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent heading-shimmer pb-2">
                  {title?.split(' ').slice(1).join(' ') || 'Your English Potential'}
                </span>
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground/80 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
                {subtitle || 'Elevate your communication with professional, customized English training designed for impact and clarity.'}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start mb-12">
                <Button size="lg" className="h-14 px-8 rounded-2xl bg-primary text-primary-foreground font-bold shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:scale-105 active:scale-95 transition-all group" asChild>
                  <Link href="/courses">
                    {t('heroExploreCourses')}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 rounded-2xl border-border/50 font-bold backdrop-blur-md hover:bg-muted/5 transition-all" asChild>
                  <Link href="/contact">{t('heroGetInTouch')}</Link>
                </Button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3">
                {stats.map((stat, i) => (
                  <div key={i} className="glass-card group p-3 sm:p-4 rounded-2xl border-white/5 dark:border-white/5 hover:border-primary/20 transition-all duration-500">
                    <div className="flex flex-col sm:flex-row items-center gap-2 mb-1 lg:justify-start justify-center">
                      <div className={cn("p-1.5 rounded-lg bg-current/10", stat.color)}>
                        <stat.icon className="h-4 w-4" />
                      </div>
                      <span className="text-lg sm:text-2xl font-black text-foreground">{stat.number}</span>
                    </div>
                    <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </m.div>

            {/* --- Hero Image --- */}
            <m.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              style={{ x: imgX, y: imgY }}
              className="relative flex justify-center lg:justify-end"
            >
              <div className="relative group perspective-deep">
                {/* Neon Aura */}
                <div className="absolute -inset-8 bg-gradient-to-tr from-primary/30 to-secondary/30 blur-3xl opacity-50 mix-blend-screen group-hover:opacity-75 transition-opacity" />

                {/* Main Frame */}
                <div
                  className="relative z-10 w-[280px] sm:w-[380px] md:w-[440px] aspect-[4/5] rounded-[2.5rem] overflow-hidden border-2 border-white/10 shadow-2xl animate-gpu"
                  style={{ borderRadius: '3rem 8rem 3rem 3rem' }}
                >
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt="Hero Image"
                      fill
                      priority
                      quality={95}
                      sizes="(max-width: 640px) 280px, (max-width: 1024px) 380px, 440px"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full bg-muted/20 flex items-center justify-center">
                      <Sparkles className="h-20 w-20 text-muted-foreground/20 animate-pulse" />
                    </div>
                  )}

                  {/* Glass Overlay with info */}
                  <div className="absolute bottom-6 left-6 right-6 p-4 glass-card rounded-2xl border-white/10 group-hover:translate-y-[-8px] transition-transform duration-500">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center ring-2 ring-primary/40">
                        <GraduationCap className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase text-foreground">Verified Teacher</p>
                        <p className="text-[10px] text-muted-foreground">Certified English Professional</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Geometric Floating Elements (CSS only) */}
                <div className="absolute -top-6 -right-6 h-20 w-20 bg-primary/20 blur-xl animate-float-soft" />
                <div className="absolute -bottom-10 -left-10 h-32 w-32 bg-secondary/10 blur-2xl animate-float-soft [animation-delay:2s]" />
              </div>
            </m.div>

          </div>
        </LazyMotion>
      </div>

      {/* Decorative Bottom Transition */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-20" />
    </section>
  );
}
