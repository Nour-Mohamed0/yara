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

        if (type === 'site_content') {
            const result = await db.prepare('SELECT * FROM site_content').all();
            return NextResponse.json(result.results || []);
        }

        if (type === 'gallery') {
            const result = await db.prepare('SELECT * FROM gallery ORDER BY created_at DESC').all();
            return NextResponse.json(result.results || []);
        }

        if (type === 'navigation_links') {
            const result = await db.prepare('SELECT * FROM navigation_links ORDER BY group_name, order_index').all();
            return NextResponse.json(result.results || []);
        }

        // Standard types
        if (type === 'settings') {
            const result = await db.prepare('SELECT * FROM settings LIMIT 1').first();
            return NextResponse.json(result || {});
        }

        if (type === 'courses') {
            const result = await db.prepare('SELECT * FROM courses ORDER BY created_at DESC').all();
            return NextResponse.json(result.results || []);
        }

        return NextResponse.json({ error: 'Unknown type' }, { status: 400 });
    } catch (error) {
        console.error('[CMS API] error:', error);
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

        if (type === 'settings') {
            const { site_title, site_description, contact_email, hero_title, hero_subtitle, favicon_url } = data;

            // Try to add the column if it doesn't exist (safety)
            try {
                await db.prepare("ALTER TABLE settings ADD COLUMN favicon_url TEXT").run();
            } catch (e) {
                // Column already exists or error
            }

            await db
                .prepare(`
          UPDATE settings SET 
            site_title = ?, 
            site_description = ?, 
            contact_email = ?,
            hero_title = ?,
            hero_subtitle = ?,
            favicon_url = ?,
            updated_at = datetime('now')
          WHERE id = (SELECT id FROM settings LIMIT 1)
        `)
                .bind(
                    site_title ?? '',
                    site_description ?? '',
                    contact_email ?? '',
                    hero_title ?? '',
                    hero_subtitle ?? '',
                    favicon_url ?? null
                )
                .run();
            return NextResponse.json({ success: true });
        }

        if (type === 'gallery_image') {
            const id = data.id || 'gal_' + Date.now();
            await db
                .prepare(`
          INSERT INTO gallery (id, title, description, r2_url, r2_key, category, created_at)
          VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
        `)
                .bind(id, data.title, data.description || '', data.r2_url, data.r2_key || '', data.category || '')
                .run();
            return NextResponse.json({ success: true, id });
        }

        if (type === 'delete_gallery_image') {
            const { id } = data;
            await db.prepare('DELETE FROM gallery WHERE id = ?').run(id);
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Unknown type' }, { status: 400 });
    } catch (error) {
        console.error('[CMS API] error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
