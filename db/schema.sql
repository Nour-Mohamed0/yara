-- Users table for admin authentication
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Site-wide settings
CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY,
  site_title TEXT DEFAULT 'English Teacher Portfolio',
  site_description TEXT,
  site_url TEXT,
  contact_email TEXT,
  phone TEXT,
  language_default TEXT DEFAULT 'en',
  timezone TEXT DEFAULT 'UTC',
  theme_primary_color TEXT DEFAULT '#3b82f6',
  theme_secondary_color TEXT DEFAULT '#10b981',
  hero_image_url TEXT,
  hero_title TEXT,
  hero_subtitle TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- YouTube playlists
CREATE TABLE IF NOT EXISTS youtube_playlists (
  id TEXT PRIMARY KEY,
  playlist_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  section_name TEXT NOT NULL,
  video_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  order_index INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- YouTube videos (cached from API)
CREATE TABLE IF NOT EXISTS youtube_videos (
  id TEXT PRIMARY KEY,
  video_id TEXT UNIQUE NOT NULL,
  playlist_id TEXT,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  duration TEXT,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  order_index INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (playlist_id) REFERENCES youtube_playlists(id)
);

-- SEO settings per page
CREATE TABLE IF NOT EXISTS seo_settings (
  id TEXT PRIMARY KEY,
  page_slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  keywords TEXT,
  og_image TEXT,
  og_title TEXT,
  og_description TEXT,
  canonical_url TEXT,
  seo_index BOOLEAN DEFAULT TRUE,
  seo_follow BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Blog posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  author_id TEXT NOT NULL,
  status TEXT DEFAULT 'draft',
  views INTEGER DEFAULT 0,
  published_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id)
);

-- Blog categories/tags
CREATE TABLE IF NOT EXISTS blog_tags (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL,
  tag TEXT NOT NULL,
  FOREIGN KEY (post_id) REFERENCES blog_posts(id)
);

-- Courses
CREATE TABLE IF NOT EXISTS courses (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT,
  level TEXT,
  featured_image TEXT,
  duration_hours REAL,
  price REAL DEFAULT 0,
  status TEXT DEFAULT 'active',
  order_index INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Course modules/lessons
CREATE TABLE IF NOT EXISTS course_lessons (
  id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  order_index INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- Gallery images
CREATE TABLE IF NOT EXISTS gallery_images (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  r2_url TEXT NOT NULL,
  r2_key TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT,
  order_index INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Hero sliders for home page
CREATE TABLE IF NOT EXISTS hero_sliders (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT,
  cta_text TEXT,
  cta_link TEXT,
  active BOOLEAN DEFAULT TRUE,
  order_index INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id TEXT PRIMARY KEY,
  author_name TEXT NOT NULL,
  author_role TEXT,
  content TEXT NOT NULL,
  rating INTEGER,
  author_image TEXT,
  active BOOLEAN DEFAULT TRUE,
  order_index INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- FAQ
CREATE TABLE IF NOT EXISTS faq (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  order_index INTEGER,
  active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Social links
CREATE TABLE IF NOT EXISTS social_links (
  id TEXT PRIMARY KEY,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT,
  display_order INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- YouTube content cache
CREATE TABLE IF NOT EXISTS youtube_content (
  id TEXT PRIMARY KEY,
  video_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  duration INTEGER,
  view_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  category TEXT,
  cached_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Dynamic content overrides for translation keys
CREATE TABLE IF NOT EXISTS site_content (
  key TEXT PRIMARY KEY,
  en_value TEXT,
  ar_value TEXT,
  group_name TEXT DEFAULT 'general',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Dynamic navigation and footer links
CREATE TABLE IF NOT EXISTS navigation_links (
  id TEXT PRIMARY KEY,
  group_name TEXT NOT NULL, -- 'navbar', 'learning', 'company', 'social'
  label_en TEXT NOT NULL,
  label_ar TEXT NOT NULL,
  href TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT 1,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery_images(category);
CREATE INDEX IF NOT EXISTS idx_youtube_featured ON youtube_content(is_featured);
CREATE INDEX IF NOT EXISTS idx_seo_page_slug ON seo_settings(page_slug);
