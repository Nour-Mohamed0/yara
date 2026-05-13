import { Metadata } from 'next';
import nextDynamic from 'next/dynamic';
import { Hero } from '@/components/sections/hero';
import { HomeSectionSkeleton } from '@/components/home-section-skeleton';
import { getDB } from '@/lib/db/client';

const CoursesShowcase = nextDynamic(
  () => import('@/components/sections/courses-showcase').then((m) => m.CoursesShowcase),
  { loading: () => <HomeSectionSkeleton /> }
);

const VideosSection = nextDynamic(
  () => import('@/components/sections/videos-section').then((m) => m.VideosSection),
  { loading: () => <HomeSectionSkeleton /> }
);

const Testimonials = nextDynamic(
  () => import('@/components/sections/testimonials').then((m) => m.Testimonials),
  { loading: () => <HomeSectionSkeleton /> }
);

const CTA = nextDynamic(() => import('@/components/sections/cta').then((m) => m.CTA), {
  loading: () => <HomeSectionSkeleton />,
});

export const dynamic = 'force-dynamic';

const defaultMetadata: Metadata = {
  title: 'English Teacher Portfolio - Master English Online',
  description:
    'Professional English teaching platform with interactive courses, video lessons, and expert guidance. Transform your English skills today!',
  keywords: ['English courses', 'English teacher', 'Learn English online', 'Grammar', 'Speaking'],
  openGraph: {
    title: 'English Teacher Portfolio',
    description: 'Master English with our comprehensive online courses and lessons',
    type: 'website',
  },
};

export async function generateMetadata(): Promise<Metadata> {
  try {
    const db = getDB();
    const row = await db
      .prepare('SELECT site_title, site_description FROM settings LIMIT 1')
      .first<{ site_title?: string; site_description?: string }>();
    if (row?.site_title) {
      const desc = row.site_description || (typeof defaultMetadata.description === 'string' ? defaultMetadata.description : '');
      return {
        ...defaultMetadata,
        title: row.site_title,
        description: desc,
        openGraph: {
          title: row.site_title,
          description: desc,
          type: 'website',
        },
      };
    }
  } catch {
    /* build or DB unavailable */
  }
  return defaultMetadata;
}

type HomeCourse = { id: string; slug: string; title: string; description: string };
type HomeTestimonial = {
  id: string;
  author_name: string;
  author_role: string | null;
  content: string;
  rating: number | null;
};

async function loadHomeContent(): Promise<{
  settings: Record<string, string | null | undefined> | null;
  courses: HomeCourse[];
  testimonials: HomeTestimonial[];
}> {
  try {
    const db = getDB();
    const settings = (await db.prepare('SELECT * FROM settings LIMIT 1').first()) as Record<
      string,
      string | null | undefined
    > | null;

    const coursesResult = await db
      .prepare(
        `SELECT id, slug, title, description FROM courses WHERE status = 'active' ORDER BY COALESCE(order_index, 999999), created_at DESC LIMIT 8`
      )
      .all();
    const courses = (coursesResult.results || []) as HomeCourse[];

    const testimonialsResult = await db
      .prepare(
        `SELECT id, author_name, author_role, content, rating FROM testimonials
         WHERE active IS NULL OR active = 1 OR CAST(active AS INTEGER) = 1
         ORDER BY COALESCE(order_index, 999999), created_at DESC LIMIT 12`
      )
      .all();
    const testimonials = (testimonialsResult.results || []) as HomeTestimonial[];

    return { settings, courses, testimonials };
  } catch {
    return { settings: null, courses: [], testimonials: [] };
  }
}

export default async function Home() {
  const { settings, courses, testimonials } = await loadHomeContent();

  const heroTitle =
    settings?.hero_title?.trim() ||
    settings?.site_title?.trim() ||
    'Transform Your English Skills';
  const heroSubtitle =
    settings?.hero_subtitle?.trim() ||
    settings?.site_description?.trim() ||
    'Master English through engaging courses, interactive lessons, and personalized guidance.';

  return (
    <main className="space-y-3 overflow-x-hidden pb-6 sm:space-y-4 md:space-y-6 md:pb-12">
      <Hero title={heroTitle} subtitle={heroSubtitle} imageUrl={settings?.hero_image_url || undefined} />

      <CoursesShowcase dbCourses={courses} />

      <VideosSection />

      <Testimonials dbItems={testimonials} />

      <CTA />
    </main>
  );
}
