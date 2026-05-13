import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db/client';

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function GET(request: NextRequest) {
  try {
    const db = getDB();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (!type) {
      return NextResponse.json({ error: 'Type parameter required' }, { status: 400 });
    }

    if (type === 'settings') {
      const result = await db.prepare('SELECT * FROM settings LIMIT 1').first();
      return NextResponse.json(result || {});
    }

    if (type === 'courses') {
      const result = await db.prepare('SELECT * FROM courses ORDER BY created_at DESC').all();
      return NextResponse.json(result.results || []);
    }

    if (type === 'blog') {
      const result = await db.prepare('SELECT * FROM blog_posts ORDER BY created_at DESC').all();
      return NextResponse.json(result.results || []);
    }

    if (type === 'gallery') {
      const result = await db
        .prepare('SELECT * FROM gallery_images ORDER BY created_at DESC')
        .all();
      return NextResponse.json(result.results || []);
    }

    if (type === 'testimonials') {
      const result = await db.prepare('SELECT * FROM testimonials ORDER BY created_at DESC').all();
      return NextResponse.json(result.results || []);
    }

    if (type === 'youtube') {
      const result = await db.prepare('SELECT * FROM youtube_playlists ORDER BY order_index').all();
      return NextResponse.json(result.results || []);
    }

    if (type === 'contact-messages') {
      try {
        const result = await db.prepare('SELECT * FROM contact_messages ORDER BY created_at DESC').all();
        return NextResponse.json(result.results || []);
      } catch {
        return NextResponse.json([]);
      }
    }

    if (type === 'site_content') {
      const result = await db.prepare('SELECT * FROM site_content').all();
      return NextResponse.json(result.results || []);
    }

    if (type === 'navigation_links') {
      const result = await db.prepare('SELECT * FROM navigation_links ORDER BY group_name, order_index').all();
      return NextResponse.json(result.results || []);
    }

    return NextResponse.json({ error: 'Unknown type' }, { status: 400 });
  } catch (error) {
    console.error('[v0] API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;
    const db = getDB();

    if (!type || !data) {
      return NextResponse.json({ error: 'Type and data required' }, { status: 400 });
    }

    if (type === 'settings') {
      const existing = await db.prepare('SELECT id FROM settings LIMIT 1').first<{ id: string }>();
      const id = (data.id as string) || existing?.id || 'settings_default';
      await db
        .prepare(`
        INSERT INTO settings (id, site_title, site_description, hero_title, hero_subtitle, contact_email, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
        ON CONFLICT(id) DO UPDATE SET
          site_title = excluded.site_title,
          site_description = excluded.site_description,
          hero_title = excluded.hero_title,
          hero_subtitle = excluded.hero_subtitle,
          contact_email = excluded.contact_email,
          updated_at = datetime('now')
      `)
        .bind(
          id,
          data.site_title ?? '',
          data.site_description ?? '',
          data.hero_title ?? '',
          data.hero_subtitle ?? '',
          data.contact_email ?? ''
        )
        .run();
      return NextResponse.json({ success: true });
    }

    if (type === 'course') {
      const id = data.id || 'course_' + Date.now();
      const slug = data.slug || slugify(data.title || 'course');
      await db
        .prepare(`
        INSERT INTO courses (id, slug, title, description, content, level, featured_image, price, status, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
        ON CONFLICT(id) DO UPDATE SET
          slug = excluded.slug,
          title = excluded.title,
          description = excluded.description,
          content = excluded.content,
          level = excluded.level,
          featured_image = excluded.featured_image,
          price = excluded.price,
          status = excluded.status,
          updated_at = datetime('now')
      `)
        .bind(
          id,
          slug,
          data.title ?? '',
          data.description ?? '',
          data.content ?? data.description ?? '',
          data.level || 'Intermediate',
          data.featured_image ?? data.image_url ?? null,
          Number(data.price) || 0,
          data.status || 'active'
        )
        .run();
      return NextResponse.json({ success: true, id });
    }

    if (type === 'blog') {
      const id = data.id || 'post_' + Date.now();
      const slug = data.slug || slugify(data.title || 'post');
      const defaultAuthor = await db.prepare('SELECT id FROM users ORDER BY created_at ASC LIMIT 1').first<{
        id: string;
      }>();
      const authorId = data.author_id || defaultAuthor?.id;
      if (!authorId) {
        return NextResponse.json(
          { error: 'No author user in database; create an admin user first.' },
          { status: 400 }
        );
      }
      const status = data.status || 'published';
      const publishedAtValue = status === 'published' ? new Date().toISOString() : null;

      await db
        .prepare(`
        INSERT INTO blog_posts (id, slug, title, content, excerpt, featured_image, author_id, status, published_at, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        ON CONFLICT(id) DO UPDATE SET
          slug = excluded.slug,
          title = excluded.title,
          content = excluded.content,
          excerpt = excluded.excerpt,
          featured_image = excluded.featured_image,
          author_id = excluded.author_id,
          status = excluded.status,
          published_at = CASE
            WHEN excluded.status = 'published' THEN COALESCE(published_at, excluded.published_at)
            ELSE published_at
          END,
          updated_at = datetime('now')
      `)
        .bind(
          id,
          slug,
          data.title ?? '',
          data.content ?? '',
          data.excerpt ?? '',
          data.featured_image ?? null,
          authorId,
          status,
          publishedAtValue
        )
        .run();
      return NextResponse.json({ success: true, id });
    }

    if (type === 'testimonial') {
      const id = data.id || 'testimonial_' + Date.now();
      await db
        .prepare(`
        INSERT INTO testimonials (id, author_name, author_role, content, rating, active, order_index, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, 1, ?, datetime('now'), datetime('now'))
        ON CONFLICT(id) DO UPDATE SET
          author_name = excluded.author_name,
          author_role = excluded.author_role,
          content = excluded.content,
          rating = excluded.rating,
          order_index = excluded.order_index,
          updated_at = datetime('now')
      `)
        .bind(
          id,
          data.author_name ?? '',
          data.author_role ?? null,
          data.content ?? '',
          Number(data.rating) > 0 ? Number(data.rating) : 5,
          data.order_index != null ? Number(data.order_index) : null
        )
        .run();
      return NextResponse.json({ success: true, id });
    }

    if (type === 'youtube_playlist') {
      const id = data.id || 'ytpl_' + Date.now();
      await db
        .prepare(`
        INSERT INTO youtube_playlists (id, playlist_id, title, description, thumbnail_url, section_name, video_count, is_active, order_index, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, datetime('now'), datetime('now'))
        ON CONFLICT(id) DO UPDATE SET
          playlist_id = excluded.playlist_id,
          title = excluded.title,
          description = excluded.description,
          thumbnail_url = excluded.thumbnail_url,
          section_name = excluded.section_name,
          video_count = excluded.video_count,
          order_index = excluded.order_index,
          updated_at = datetime('now')
      `)
        .bind(
          id,
          data.playlist_id ?? '',
          data.title ?? '',
          data.description ?? null,
          data.thumbnail_url ?? null,
          data.section_name ?? 'General',
          Number(data.video_count) >= 0 ? Number(data.video_count) : 0,
          data.order_index != null ? Number(data.order_index) : 0
        )
        .run();
      return NextResponse.json({ success: true, id });
    }

    if (type === 'gallery_image') {
      const id = data.id || 'gallery_' + Date.now();
      const r2Url = data.r2_url ?? data.url ?? '';
      const r2Key = data.r2_key ?? data.key ?? r2Url;
      if (!r2Url || !r2Key) {
        return NextResponse.json({ error: 'r2_url and r2_key (or url/key) are required' }, { status: 400 });
      }
      await db
        .prepare(`
        INSERT INTO gallery_images (id, title, description, r2_url, r2_key, thumbnail_url, category, order_index, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        ON CONFLICT(id) DO UPDATE SET
          title = excluded.title,
          description = excluded.description,
          r2_url = excluded.r2_url,
          r2_key = excluded.r2_key,
          thumbnail_url = excluded.thumbnail_url,
          category = excluded.category,
          order_index = excluded.order_index,
          updated_at = datetime('now')
      `)
        .bind(
          id,
          data.title ?? 'Image',
          data.description ?? null,
          r2Url,
          r2Key,
          data.thumbnail_url ?? null,
          data.category ?? null,
          data.order_index != null ? Number(data.order_index) : null
        )
        .run();
      return NextResponse.json({ success: true, id });
    }

    if (type === 'site_content') {
      const { key, en_value, ar_value, group_name } = data;
      if (!key) return NextResponse.json({ error: 'Key required' }, { status: 400 });
      await db
        .prepare(`
        INSERT INTO site_content (key, en_value, ar_value, group_name, updated_at)
        VALUES (?, ?, ?, ?, datetime('now'))
        ON CONFLICT(key) DO UPDATE SET
          en_value = excluded.en_value,
          ar_value = excluded.ar_value,
          group_name = excluded.group_name,
          updated_at = datetime('now')
      `)
        .bind(key, en_value ?? '', ar_value ?? '', group_name ?? 'general')
        .run();
      return NextResponse.json({ success: true });
    }

    if (type === 'navigation_link') {
      const id = data.id || 'link_' + Date.now();
      await db
        .prepare(`
        INSERT INTO navigation_links (id, group_name, label_en, label_ar, href, order_index, is_active, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
        ON CONFLICT(id) DO UPDATE SET
          group_name = excluded.group_name,
          label_en = excluded.label_en,
          label_ar = excluded.label_ar,
          href = excluded.href,
          order_index = excluded.order_index,
          is_active = excluded.is_active,
          updated_at = datetime('now')
      `)
        .bind(
          id,
          data.group_name ?? 'navbar',
          data.label_en ?? '',
          data.label_ar ?? '',
          data.href ?? '#',
          Number(data.order_index) || 0,
          data.is_active ? 1 : 0
        )
        .run();
      return NextResponse.json({ success: true, id });
    }

    return NextResponse.json({ error: 'Unknown type' }, { status: 400 });
  } catch (error) {
    console.error('[v0] API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
