'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Star, Quote, Sparkles } from 'lucide-react';
import { HomeSliceSection } from '@/components/sections/home-slice-section';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';

const fallbackTestimonials = [
  {
    name: 'Ahmed Mohamed',
    role: 'Student',
    text: 'The courses are incredibly well structured. I went from struggling with grammar to writing with confidence!',
    rating: 5,
  },
  {
    name: 'Fatima Hassan',
    role: 'Working Professional',
    text: 'Perfect for busy professionals like me. The lessons are concise and immediately applicable.',
    rating: 5,
  },
  {
    name: 'Mohammed Ali',
    role: 'College Student',
    text: 'The speaking practice sessions with detailed feedback really helped me improve my pronunciation.',
    rating: 5,
  },
  {
    name: 'Layla Samir',
    role: 'Exam Candidate',
    text: 'I passed my IELTS exam with a score of 8.0 thanks to the comprehensive exam preparation course!',
    rating: 5,
  },
];

export type DbTestimonial = {
  id: string;
  author_name: string;
  author_role: string | null;
  content: string;
  rating: number | null;
};

export function Testimonials({ dbItems }: { dbItems?: DbTestimonial[] }) {
  const t = useTranslation();
  const reduce = useReducedMotion();

  const items =
    dbItems && dbItems.length > 0
      ? dbItems.map((row) => ({
        key: row.id,
        name: row.author_name,
        role: row.author_role || t('studentRoleDefault'),
        text: row.content,
        rating: Math.min(5, Math.max(1, Number(row.rating) || 5)),
      }))
      : fallbackTestimonials.map((row, i) => ({
        key: `${row.name}-${i}`,
        name: row.name,
        role: row.role,
        text: row.text,
        rating: row.rating,
      }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: reduce ? 0 : 0.1 },
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
    <HomeSliceSection id="testimonials" variant="tr-bl" tone="deep">
      {/* --- Header --- */}
      <div className="relative mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="glass-card mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 border-white/5 ring-1 ring-accent/20">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-accent">{t('testimonialsKicker')}</span>
          </div>
          <h2 className="heading-shimmer mb-4 text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
            <span className="text-foreground">{t('testimonialsTitleA')} </span>
            <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              {t('testimonialsTitleB')}
            </span>
          </h2>
        </motion.div>
      </div>

      {/* --- Cards Grid --- */}
      <motion.div
        className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {items.map((testimonial, index) => (
          <motion.div
            key={testimonial.key}
            variants={itemVariants}
            className="group"
          >
            <div className="glass-card relative h-full flex flex-col p-8 rounded-[2rem] border-white/5 transition-all duration-500 hover:border-accent/30 hover:shadow-2xl hover:shadow-accent/10">
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="h-10 w-10 text-accent rotate-180" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < (testimonial.rating || 5) ? "fill-accent text-accent" : "text-muted-foreground/30"
                    )}
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-sm leading-relaxed text-muted-foreground/90 italic mb-8 flex-grow">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              {/* Footer */}
              <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center font-black text-accent text-lg border border-accent/20">
                  {testimonial.name[0]}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground leading-none mb-1">{testimonial.name}</h4>
                  <span className="text-[11px] text-accent uppercase font-black tracking-widest">{testimonial.role}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* --- Featured Quote --- */}
      <motion.div
        className="mt-20 mx-auto max-w-4xl text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="glass-card p-10 sm:p-16 rounded-[3rem] border-white/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent opacity-50" />
          <Quote className="h-12 w-12 text-accent/20 mx-auto mb-8 animate-bounce" />
          <p className="text-xl sm:text-2xl md:text-3xl font-black text-foreground leading-tight tracking-tight relative mb-6">
            &ldquo;{t('testimonialsQuote')}&rdquo;
          </p>
          <div className="h-1 w-20 bg-gradient-to-r from-accent to-transparent mx-auto rounded-full mb-6" />
          <p className="text-sm font-black uppercase tracking-[0.3em] text-accent relative">
            {t('testimonialsMission')}
          </p>
        </div>
      </motion.div>
    </HomeSliceSection>
  );
}
