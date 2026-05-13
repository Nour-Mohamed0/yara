import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth/session';
import { getDB } from '@/lib/db/client';
import { getUserById, updateUser } from '@/lib/db/users';

export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserById(session.userId);
    if (!user) {
      // 401 (not 404): avoids looking like a missing route; usually stale JWT after DB re-seed
      return NextResponse.json(
        { error: 'SESSION_STALE', message: 'User no longer exists. Please sign in again.' },
        { status: 401 }
      );
    }

    let hero_image_url: string | null = null;
    try {
      const db = getDB();
      const row = await db
        .prepare('SELECT hero_image_url FROM settings LIMIT 1')
        .first<{ hero_image_url: string | null }>();
      hero_image_url = row?.hero_image_url ?? null;
    } catch {
      /* DB unavailable */
    }

    return NextResponse.json({
      full_name: user.full_name ?? '',
      bio: user.bio ?? '',
      avatar_url: user.avatar_url ?? '',
      hero_image_url,
    });
  } catch (error) {
    console.error('Profile GET error:', error);
    return NextResponse.json({ error: 'Failed to load profile' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as Record<string, unknown>;

    const full_name =
      typeof body.full_name === 'string'
        ? body.full_name
        : typeof body.fullName === 'string'
          ? body.fullName
          : '';

    const bio = typeof body.bio === 'string' ? body.bio : '';

    let heroImageUrl: string | null | undefined;
    if ('hero_image_url' in body) {
      heroImageUrl = body.hero_image_url as string | null;
    } else if ('heroImageUrl' in body) {
      heroImageUrl = body.heroImageUrl as string | null;
    } else {
      heroImageUrl = undefined;
    }

    const userUpdates: { full_name: string; bio: string; avatar_url?: string | null } = {
      full_name,
      bio,
    };

    if (heroImageUrl !== undefined) {
      userUpdates.avatar_url = heroImageUrl;
    }

    const existing = await getUserById(session.userId);
    if (!existing) {
      return NextResponse.json(
        { error: 'SESSION_STALE', message: 'User no longer exists. Please sign in again.' },
        { status: 401 }
      );
    }

    let updated: Awaited<ReturnType<typeof updateUser>>;
    try {
      updated = await updateUser(session.userId, userUpdates);
    } catch (e) {
      console.error('Profile PATCH updateUser error:', e);
      return NextResponse.json(
        { error: 'UPDATE_FAILED', message: e instanceof Error ? e.message : 'Database error' },
        { status: 500 }
      );
    }

    if (!updated) {
      return NextResponse.json(
        { error: 'SESSION_STALE', message: 'User no longer exists. Please sign in again.' },
        { status: 401 }
      );
    }

    if (heroImageUrl !== undefined) {
      try {
        const db = getDB();
        const settingsRow = await db.prepare('SELECT id FROM settings LIMIT 1').first<{ id: string }>();
        if (settingsRow) {
          await db
            .prepare(
              `UPDATE settings SET hero_image_url = ?, updated_at = datetime('now') WHERE id = ?`
            )
            .bind(heroImageUrl, settingsRow.id)
            .run();
        }
      } catch (e) {
        console.error('Failed to sync hero_image_url to settings:', e);
      }
    }

    return NextResponse.json({
      success: true,
      profile: {
        full_name: updated.full_name ?? '',
        bio: updated.bio ?? '',
        avatar_url: updated.avatar_url ?? '',
      },
    });
  } catch (error) {
    console.error('Profile PATCH error:', error);
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 });
  }
}
