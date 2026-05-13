'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { BookOpen, Users, Zap, Award, LucideIcon, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { HomeSliceSection } from '@/components/sections/home-slice-section';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';

const fallbackCourses: {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}[] = [
    {
      icon: BookOpen,
      title: 'Grammar Mastery',
      description: 'Master English grammar from basics to advanced levels with interactive exercises.',
      color: 'text-primary',
    },
    {
      icon: Users,
      title: 'Speaking Skills',
      description: 'Improve your pronunciation and fluency in English through guided practice.',
      color: 'text-secondary',
    },
    {
      icon: Zap,
      title: 'Writing Excellence',
      description: 'Learn to write clearly and effectively for professional and academic success.',
      color: 'text-accent',
    },
    {
      icon: Award,
      title: 'Exam Preparation',
      description: 'Comprehensive preparation for IELTS, TOEFL, and other international exams.',
      color: 'text-primary',
    },
  ];

export type ShowcaseCourse = { id: string; slug: string; title: string; description: string };

export function CoursesShowcase({ dbCourses }: { dbCourses?: ShowcaseCourse[] }) {
  const t = useTranslation();
  const reduce = useReducedMotion();
  const useDb = dbCourses && dbCourses.length > 0;
  const courses = useDb ? dbCourses : fallbackCourses;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: reduce ? 0 : 0.08, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }
    },
  };

  return (
    <HomeSliceSection id="courses" variant="tr-bl" tone="default">
      <div className="relative mb-12">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="glass-card mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 ring-1 ring-primary/20">
            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">{t('coursesKicker')}</span>
          </div>
          <h2 className="heading-shimmer mb-4 text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
            <span className="text-foreground">{t('coursesTitleA')} </span>
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t('coursesTitleB')}
            </span>
          </h2>
          <p className="text-pretty text-base text-muted-foreground/80 max-w-2xl mx-auto">{t('coursesDesc')}</p>
        </motion.div>
      </div>

      {/* --- Course Cards Grid --- */}
      <motion.div
        className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {courses.map((course, index) => {
          const isDb = useDb && 'slug' in course;
          const c = isDb ? (course as ShowcaseCourse) : null;
          const s = !isDb ? (course as (typeof fallbackCourses)[number]) : null;
          const Icon = s?.icon || BookOpen;
          const iconColor = s?.color || 'text-primary';

          return (
            <motion.div
              key={c?.id || s?.title || index}
              variants={itemVariants}
              className="group h-full"
            >
              <div className="glass-card relative flex h-full flex-col overflow-hidden rounded-[2rem] p-8 border-white/5 dark:border-white/5 transition-all duration-500 hover:border-primary/30">
                {/* Background Accent */}
                <div className="absolute top-0 right-0 h-32 w-32 bg-primary/5 blur-3xl -mr-16 -mt-16 group-hover:bg-primary/20 transition-all duration-500" />

                {/* Icon Container */}
                <div className="relative mb-6">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-primary/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <Icon className={cn('h-6 w-6', iconColor)} />
                  </div>
                  {/* Floating Number */}
                  <span className="absolute -top-2 -right-2 text-[40px] font-black text-foreground/[0.03] select-none pointer-events-none">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <h3 className="text-xl font-black text-foreground mb-3 group-hover:text-primary transition-colors">
                  {c?.title || s?.title}
                </h3>

                <p className="text-sm leading-relaxed text-muted-foreground/80 flex-grow mb-8 group-hover:text-foreground/90 transition-colors">
                  {c?.description || s?.description}
                </p>

                <Button
                  variant="outline"
                  className="mt-auto w-full h-12 rounded-xl border-border/50 font-bold group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-500"
                  asChild
                >
                  <Link href={c ? `/courses/${c.slug}` : '/courses'}>
                    {t('coursesLearnMore')}
                    <ArrowRight className="ml-2 h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </Button>

                {/* Bottom Neon Line */}
                <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-primary to-secondary group-hover:w-full transition-all duration-700" />
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* CTA Button */}
      <motion.div
        className="mt-16 flex justify-center"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
      >
        <Button
          size="lg"
          className="h-14 px-10 rounded-2xl bg-foreground text-background font-black shadow-2xl hover:scale-105 active:scale-95 transition-all group"
          asChild
        >
          <Link href="/courses">
            {t('coursesExploreAll')}
            <Sparkles className="ml-2 h-5 w-5 text-primary group-hover:animate-spin" />
          </Link>
        </Button>
      </motion.div>
    </HomeSliceSection>
  );
}
