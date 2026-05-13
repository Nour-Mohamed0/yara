import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db/client';

export async function GET(_request: NextRequest) {
  try {
    const db = getDB();
    const row = await db.prepare('SELECT * FROM settings LIMIT 1').first<Record<string, unknown>>();

    if (!row) {
      return NextResponse.json({
        success: true,
        data: {
          id: 'default',
          site_title: 'English Teacher Portfolio',
          site_description: 'Professional English teaching platform',
          site_url: '',
          contact_email: '',
          phone: '',
          hero_title: '',
          hero_subtitle: '',
          hero_image_url: '',
        },
      });
    }

    return NextResponse.json({ success: true, data: row });
  } catch (error) {
    console.error('Settings API error:', error);
    return NextResponse.json(
      {
        success: true,
        data: {
          id: 'default',
          site_title: 'English Teacher Portfolio',
          site_description: 'Professional English teaching platform',
          site_url: '',
          contact_email: '',
        },
      },
      { status: 200 }
    );
  }
}
