'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type HomeSliceVariant = 'tr-bl' | 'tl-br';

interface HomeSliceSectionProps {
  id?: string;
  variant: HomeSliceVariant;
  tone?: 'default' | 'deep';
  className?: string;
  children: React.ReactNode;
}

/**
 * Home section wrapper with:
 * - Scroll-triggered assembly from left or right (alternating per variant)
 * - Geometric diagonal accents via CSS clip-path
 * - Decorative triangles and diamonds
 */
export function HomeSliceSection({ id, variant, tone = 'default', className, children }: HomeSliceSectionProps) {
  const reduce = useReducedMotion();

  const radii =
    variant === 'tr-bl'
      ? 'rounded-tl-xl rounded-br-xl rounded-tr-[clamp(1.25rem,7vw,4rem)] rounded-bl-[clamp(1.25rem,7vw,4rem)] sm:rounded-tr-[clamp(2rem,9vw,5rem)] sm:rounded-bl-[clamp(2rem,9vw,5rem)]'
      : 'rounded-tr-xl rounded-bl-xl rounded-tl-[clamp(1.25rem,7vw,4rem)] rounded-br-[clamp(1.25rem,7vw,4rem)] sm:rounded-tl-[clamp(2rem,9vw,5rem)] sm:rounded-br-[clamp(2rem,9vw,5rem)]';

  const shellBg =
    tone === 'deep'
      ? 'bg-gradient-to-br from-muted/50 via-card/80 to-background dark:from-muted/20 dark:via-card/60 dark:to-background'
      : 'bg-gradient-to-br from-card/90 via-background to-muted/30 dark:from-card/70 dark:via-background dark:to-muted/10';

  /* Assembly direction and rotation based on variant */
  const assemblyX = variant === 'tr-bl' ? -70 : 70;
  const assemblyRotateY = variant === 'tr-bl' ? -5 : 5;

  return (
    <motion.section
      id={id}
      className={cn('perspective-deep relative scroll-mt-24 px-2 sm:px-3 md:px-4 lg:px-6', className)}
      initial={reduce ? false : { opacity: 0, x: assemblyX, rotateY: assemblyRotateY, scale: 0.95 }}
      whileInView={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.08, margin: '0px 0px -6% 0px' }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className={cn(
          'relative mx-auto max-w-7xl overflow-hidden border border-primary/8 shadow-[0_16px_60px_-24px] shadow-primary/8 ring-1 ring-inset ring-white/5 dark:shadow-primary/12',
          radii,
          shellBg
        )}
      >
        {/* ── Geometric diagonal accents ── */}

        {/* Primary triangle */}
        <div
          className={cn(
            'pointer-events-none absolute inset-0',
            variant === 'tr-bl' ? 'opacity-[0.05] dark:opacity-[0.08]' : 'opacity-[0.04] dark:opacity-[0.07]'
          )}
          aria-hidden
        >
          <div
            className="absolute inset-0 bg-gradient-to-br from-primary via-primary/40 to-transparent"
            style={{
              clipPath: variant === 'tr-bl' ? 'polygon(55% 0, 100% 0, 100% 65%)' : 'polygon(0 35%, 0 100%, 45% 100%)',
            }}
          />
        </div>

        {/* Secondary triangle — opposite corner */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.035] dark:opacity-[0.06]" aria-hidden>
          <div
            className="absolute inset-0 bg-gradient-to-tl from-secondary via-accent/25 to-transparent"
            style={{
              clipPath: variant === 'tr-bl' ? 'polygon(0 55%, 0 100%, 30% 100%)' : 'polygon(70% 0, 100% 0, 100% 45%)',
            }}
          />
        </div>

        {/* Diagonal line */}
        <div
          className="pointer-events-none absolute inset-0 hidden opacity-[0.05] md:block dark:opacity-[0.08]"
          aria-hidden
          style={{
            background:
              variant === 'tr-bl'
                ? 'linear-gradient(155deg, transparent 46.5%, var(--primary) 47%, var(--primary) 47.2%, transparent 47.7%)'
                : 'linear-gradient(25deg, transparent 46.5%, var(--secondary) 47%, var(--secondary) 47.2%, transparent 47.7%)',
          }}
        />

        {/* Glow */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.18] dark:opacity-[0.25]" aria-hidden>
          <div
            className={cn(
              'absolute h-[120%] w-[60%] -translate-y-1/4 blur-3xl',
              variant === 'tr-bl'
                ? '-right-1/4 top-0 rotate-[10deg] bg-gradient-to-br from-primary/18 via-transparent to-secondary/12'
                : '-left-1/4 top-0 -rotate-[10deg] bg-gradient-to-bl from-secondary/18 via-transparent to-primary/12'
            )}
          />
        </div>

        {/* Tiny decorative shapes */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div
            className={cn('absolute h-5 w-5 border border-primary/8 sm:h-7 sm:w-7',
              variant === 'tr-bl' ? 'right-[8%] top-[12%]' : 'left-[8%] bottom-[12%]'
            )}
            style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
          />
          <div
            className={cn('absolute h-3 w-3 bg-secondary/8 sm:h-5 sm:w-5',
              variant === 'tr-bl' ? 'bottom-[18%] left-[6%]' : 'right-[6%] top-[18%]'
            )}
            style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
          />
        </div>

        <div className="relative z-10 px-3 py-8 sm:px-5 sm:py-12 md:px-8 md:py-16 lg:px-10 lg:py-20">{children}</div>
      </div>
    </motion.section>
  );
}
