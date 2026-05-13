import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db/client';

export async function GET(_request: NextRequest) {
  try {
    const db = getDB();
    const result = await db
      .prepare(
        `SELECT id, title, description, thumbnail_url, video_count, section_name
         FROM youtube_playlists
         WHERE is_active IS NULL OR is_active = 1 OR CAST(is_active AS INTEGER) = 1
         ORDER BY COALESCE(order_index, 999999), created_at ASC`
      )
      .all();
    const rows = (result.results || []) as Array<{
      id: string;
      title: string;
      description: string;
      thumbnail_url: string;
      video_count: number;
      section_name: string;
    }>;
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching playlists:', error);
    return NextResponse.json([]);
  }
}
